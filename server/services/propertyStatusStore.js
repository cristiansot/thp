import fs from 'fs';
import path from 'path';

const DATA_DIR = './data';
const FILE_PATH = path.join(DATA_DIR, 'propertyStatus.json');

export const loadPreviousStatuses = () => {
  try {
    // Crear carpeta si no existe
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR);
    }

    // Si el archivo no existe, crear uno vacío
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify({}));
    }

    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('⚠️ Error leyendo archivo de estados, partimos desde cero:', error.message);
    return {};
  }
};

export const saveCurrentStatuses = (properties) => {
  const statusMap = {};
  properties.forEach((prop) => {
    statusMap[prop.id] = prop.status;
  });

  fs.writeFileSync(FILE_PATH, JSON.stringify(statusMap, null, 2));
};
