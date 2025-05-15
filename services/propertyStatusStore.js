import fs from 'fs';
import path from 'path';

// Ruta absoluta al archivo de estado
const dataDir = path.join(process.cwd(), './server/data');
const filePath = path.join(dataDir, 'propertyStatus.json');

// Asegurarse de que el directorio y archivo existen
const ensurePropertyStatusFile = () => {
  if (!fs.existsSync(dataDir)) {
    console.log('📁 El directorio "data" no existe. Creando directorio...');
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    console.log('📁 Archivo propertyStatus.json no existe. Creando archivo vacío...');
    // Si el archivo no existe, lo creamos vacío
    fs.writeFileSync(filePath, JSON.stringify({}, null, 2), 'utf-8');
  }
};

// Función para leer el archivo de estados
export const readPropertyStatus = () => {
  try {
    ensurePropertyStatusFile();  // Asegura que el archivo y directorio existan
    const data = fs.readFileSync(filePath, 'utf-8');

    // Si el archivo está vacío, lo inicializamos como un objeto vacío
    if (!data || data.trim() === '') {
      console.warn('⚠️ El archivo está vacío, inicializando como objeto vacío.');
      writePropertyStatus({});
      return {};
    }

    // Si los datos no son válidos JSON, lo sobrescribimos con un objeto vacío
    try {
      return JSON.parse(data);
    } catch (jsonError) {
      console.warn('⚠️ JSON inválido en el archivo, sobrescribiendo archivo con objeto vacío.');
      writePropertyStatus({});
      return {};
    }
  } catch (error) {
    console.error('❌ Error al leer archivo de estados:', error.message);

    // Si hay algún error de lectura o de archivo, retornamos un objeto vacío
    return {};
  }
};

// Función para escribir en el archivo de estados (sobrescribiendo el contenido)
export const writePropertyStatus = (statusData) => {
  try {
    ensurePropertyStatusFile();  // Asegurarse de que el archivo y directorio existan
    fs.writeFileSync(filePath, JSON.stringify(statusData, null, 2), 'utf-8');
    console.log('📄 Archivo propertyStatus.json actualizado con éxito.');
  } catch (error) {
    console.error('❌ Error al guardar archivo de estados:', error);
  }
};
