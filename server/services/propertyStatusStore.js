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
    ensurePropertyStatusFile(); // <-- Asegura que el archivo exista
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error al leer archivo de estados:', error);
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
