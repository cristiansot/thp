import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), './data/propertyStatus.json');

const ensurePropertyStatusFile = () => {
  if (!fs.existsSync(filePath)) {
    console.log('📁 Archivo propertyStatus.json no existe. Creando archivo vacío...');
    fs.writeFileSync(filePath, JSON.stringify({}), 'utf-8');
  }
};

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

export const writePropertyStatus = (statusData) => {
  try {
    ensurePropertyStatusFile(); // <-- Por si acaso
    fs.writeFileSync(filePath, JSON.stringify(statusData, null, 2), 'utf-8');
  } catch (error) {
    console.error('❌ Error al guardar archivo de estados:', error);
  }
};
