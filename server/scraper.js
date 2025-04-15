import axios from 'axios';
import * as cheerio from 'cheerio';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Configurar variables de entorno
dotenv.config();

// Set para almacenar links de propiedades ya notificadas
const notifiedPausedLinks = new Set();

// Verificar variables de entorno al iniciar
console.log('Configuración SMTP:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  to: process.env.EMAIL_TO
});

const readPropertiesFile = async () => {
  try {
    const propertiesUrl = process.env.PROPERTIES_JSON_URL || 'http://localhost:5173/properties.json';
    console.log(`Obteniendo propiedades desde: ${propertiesUrl}`);
    
    const response = await axios.get(propertiesUrl);
    
    if (!response.data?.properties) {
      throw new Error('Formato inválido: falta propiedad "properties"');
    }

    const validProperties = response.data.properties.filter(prop => {
      if (!prop.link) {
        console.warn('⚠️ Propiedad sin link:', prop.title || 'Sin título');
        return false;
      }
      return true;
    });

    console.log(`✅ Se encontraron ${validProperties.length} propiedades válidas`);
    return { properties: validProperties };
  } catch (err) {
    console.error('❌ Error al leer properties.json:', err);
    throw err;
  }
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.titan.email',
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error de conexión SMTP:', error);
  } else {
    console.log('✔ Servidor SMTP listo para enviar correos');
  }
});

const sendEmail = async (propertyDetails) => {
  try {
    console.log(`Preparando email para propiedad pausada: ${propertyDetails.title}`);
    
    const mailOptions = {
      from: `"Monitor THP" <${process.env.EMAIL_FROM || 'web@thp.cl'}>`,
      to: process.env.EMAIL_TO || 'csoto@thp.cl',
      subject: `🚨 PUBLICACIÓN PAUSADA: ${propertyDetails.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d9534f;">Publicación Pausada Detectada</h2>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
            <p><strong>Título:</strong> ${propertyDetails.title}</p>
            <p><strong>Precio:</strong> ${propertyDetails.price}</p>
            <p><strong>URL:</strong> <a href="${propertyDetails.link}">Ver publicación</a></p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #6c757d;">
            Detectado el ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Correo enviado correctamente:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error al enviar correo:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export const scrapeData = async () => {
  try {
    const { properties } = await readPropertiesFile();
    const results = [];
    const pausedProperties = [];

    for (const property of properties) {
      const { link, title: defaultTitle, price: defaultPrice, size, bedrooms, bathrooms, img } = property;

      try {
        const { data } = await axios.get(link, {
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          timeout: 15000
        });

        const $ = cheerio.load(data);
        const isPaused = $('div.ui-pdp-disabled, div.ui-pdp-message--warning, div.ui-vip-shipping-message').length > 0;

        if (isPaused) {
          if (!notifiedPausedLinks.has(link)) {
            console.log(`🔴 Propiedad pausada detectada y NO notificada aún: ${defaultTitle}`);
            pausedProperties.push({
              title: defaultTitle,
              link,
              detectedAt: new Date().toISOString()
            });

            notifiedPausedLinks.add(link);
          } else {
            console.log(`ℹ️ Propiedad pausada ya fue notificada: ${defaultTitle}`);
          }
          continue;
        }

        results.push({
          title: $('h1.ui-pdp-title').text().trim() || defaultTitle,
          price: $('.andes-money-amount__fraction').first().text().trim() || defaultPrice,
          size,
          bedrooms,
          bathrooms,
          img,
          link,
          status: 'active',
          lastChecked: new Date().toISOString()
        });

      } catch (error) {
        console.error(`Error procesando ${link}:`, error.message);
      }
      
      await new Promise(res => setTimeout(res, 1000));
    }

    if (pausedProperties.length > 0) {
      await sendPausedPropertiesEmail(pausedProperties);
    }

    return results;
  } catch (error) {
    console.error('Error en scrapeData:', error);
    throw error;
  }
};

const sendPausedPropertiesEmail = async (pausedProperties) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: `🚨 ${pausedProperties.length} Propiedades Pausadas Detectadas`,
    html: `
      <h2>Resumen de Propiedades Pausadas</h2>
      <ul>
        ${pausedProperties.map(prop => `
          <li>
            <strong>${prop.title}</strong><br>
            <a href="${prop.link}">${prop.link}</a><br>
            Detectada: ${new Date(prop.detectedAt).toLocaleString()}
          </li>
        `).join('')}
      </ul>
    `
  };

  await transporter.sendMail(mailOptions);
};
