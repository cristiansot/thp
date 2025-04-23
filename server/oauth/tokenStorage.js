import fs from 'fs';
import path from 'path';

// Usamos import.meta.url para obtener la ruta del directorio actual
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const tokensPath = path.join(__dirname, 'tokens.json'); // Asegúrate de que el archivo sea tokens.json

// Función para cargar los tokens desde tokens.json
const loadTokens = () => {
  try {
    if (fs.existsSync(tokensPath)) {
      const data = fs.readFileSync(tokensPath);
      const parsedTokens = JSON.parse(data);
      console.log('🔹 Tokens cargados desde tokens.json:', parsedTokens); // Console log para depurar
      return parsedTokens;
    }
    console.log('🔹 No se encontraron tokens, retornando null');
    return null;
  } catch (err) {
    console.error("❌ Error al cargar los tokens:", err.message);
    return null;
  }
};

// Función para guardar los tokens en tokens.json
export const saveTokens = (newTokens) => {
  try {
    console.log('🔹 Guardando tokens:', newTokens); // Console log para ver qué tokens se están guardando
    fs.writeFileSync(tokensPath, JSON.stringify(newTokens, null, 2)); // Guardar los tokens con formato
  } catch (err) {
    console.error('❌ Error al guardar los tokens:', err.message);
  }
};

// Cargar tokens al inicio
export const getTokens = () => loadTokens();
