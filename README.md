# THP web site 2.0 

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://git@github.com:cristiansot/thp.git
cd thp
```

### 2. Instalar dependencias del servidor (scraping)

cd server/scraping
npm install

### 3. Instalar dependencias del cliente (React)

cd ../../client
npm install

### Ejecutar proyecto

Ejecutar el scraping (modo manual)

cd server/scraping
node index.js


### Ejecutar el frontend

cd client
npm run dev

## Estructura del sitio

```bash
    /thp
    ├── server/
    │   ├── scraping/
    │   │   ├── index.js         
    │   │   ├── scraper.js              # Función principal que hace el scraping
    │   │   └── properties.json         # URLs de las propiedades a scrapear
    ├── client/
    │   ├── public/                     # Archivos públicos
    │   │   └── vite.svg
    │   ├── src/                        # Código fuente
    │   │   ├── assets/
    │   │   ├── components/             # Componentes reutilizables
    │   │   │   └── PropertyCard.jsx    # Componente para mostrar propiedad
    │   │   ├── img/
    │   │   ├── App.jsx                 # Componente principal
    │   │   └── main.jsx                # Punto de entrada de ReactDOM
    ├── .gitignore
    └── README.md                       # Documentación del proyecto

```