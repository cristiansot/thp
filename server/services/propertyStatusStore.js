// /services/propertyStatusStore.js
import fs from 'fs';
const FILE_PATH = './data/propertyStatus.json';

export const loadPreviousStatuses = () => {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('No hay archivo previo de estados, partimos desde cero.');
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
