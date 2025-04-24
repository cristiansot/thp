import fs from 'fs';
import path from 'path';

// Ruta del archivo
const filePath = path.join(process.cwd(), './data/propertyStatus.json');

// Asegura que el directorio y el archivo existan
const ensurePropertyStatusFile = () => {
  const dirPath = path.dirname(filePath);

  // Crear el directorio si no existe
  if (!fs.existsSync(dirPath)) {
    console.log('📁 Directorio de datos no existe. Creando directorio...');
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Crear el archivo si no existe
  if (!fs.existsSync(filePath)) {
    console.log('📁 Archivo propertyStatus.json no existe. Creando archivo vacío...');
    fs.writeFileSync(filePath, JSON.stringify({}), 'utf-8');
  }
};

export const readPropertyStatus = () => {
  try {
    ensurePropertyStatusFile(); // Aseguramos que el archivo y directorio existan
    const data = fs.readFileSync(filePath, 'utf-8');

    // Si el archivo está vacío, inicializamos con objeto vacío
    if (!data || data.trim() === '') {
      console.warn('⚠️ Archivo vacío, inicializando como objeto vacío.');
      writePropertyStatus({});
      return {};
    }

    // Intentamos parsear el archivo
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error al leer archivo de estados:', error.message);

    // Si hay un error de parseo, lo sobrescribimos con un objeto vacío
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
    ensurePropertyStatusFile(); // Verificamos que el archivo y directorio existan
    fs.writeFileSync(filePath, JSON.stringify(statusData, null, 2), 'utf-8');
    console.log('✅ Estado actualizado correctamente en el archivo.');
  } catch (error) {
    console.error('❌ Error al guardar archivo de estados:', error);
  }
};
