import fs from 'fs';
import path from 'path';

// Ruta absoluta al archivo de estado
const dataDir = path.join(process.cwd(), './server/data');
const filePath = path.join(dataDir, 'propertyStatus.json');

// Asegurarse de que el directorio exista
const ensurePropertyStatusFile = () => {
  if (!fs.existsSync(dataDir)) {
    console.log('📁 El directorio "data" no existe. Creando directorio...');
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    console.log('📁 Archivo propertyStatus.json no existe. Creando archivo vacío...');
    fs.writeFileSync(filePath, JSON.stringify({}), 'utf-8');
  }
};

// Función para leer el archivo de estados
export const readPropertyStatus = () => {
  try {
    ensurePropertyStatusFile();
    const data = fs.readFileSync(filePath, 'utf-8');
  
    // Manejar archivo vacío
    if (!data || data.trim() === '') {
      console.warn('⚠️ Archivo vacío, inicializando como objeto vacío.');
      writePropertyStatus({});
      return {};
    }
  
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error al leer archivo de estados:', error.message);
    
    // Si hay un error de parseo, lo sobrescribimos
    if (error instanceof SyntaxError) {
      console.warn('⚠️ JSON inválido, sobrescribiendo archivo con objeto vacío.');
      writePropertyStatus({});
      return {};
    }
  
    return {};
  }
};

// Función para escribir en el archivo de estados
export const writePropertyStatus = (statusData) => {
  try {
    ensurePropertyStatusFile(); // Asegurarse de que el archivo y directorio existen
    fs.writeFileSync(filePath, JSON.stringify(statusData, null, 2), 'utf-8');
  } catch (error) {
    console.error('❌ Error al guardar archivo de estados:', error);
  }
};
