# THP web site 2.0 

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://git@github.com:cristiansot/thp.git
cd thp
```

### 2. Instalar dependencias del servidor (scraping)

```bash
cd server/scraping
npm install
```

### 3. Instalar dependencias del cliente (React)

```bash
cd ../../client
npm install
```

### Ejecutar proyecto

Ejecutar el scraping (modo manual)

```bash
cd server/scraping
node index.js
```

### Ejecutar el frontend

```bash
cd client
npm run dev
```

## Estructura del sitio

```bash
    /thp
    ├── server/
    │   └── scraping/
    │   │   ├── index.js               # Entrada del scraping
    │   │   ├── scraper.js             # Función principal de scraping
    │   │   └── properties.json        # URLs de propiedades
    │   └── package.json    
    ├── client/
    │   ├── public/
    │   │   └── vite.svg
    │   ├── src/
    │   │   ├── assets/
    │   │   ├── components/
    │   │   │   └── PropertyCard.jsx   # Componente de propiedad
    │   │   ├── img/
    │   │   ├── App.jsx                # Componente principal
    │   │   └── main.jsx               # Entrada de React
    │   │
    │   └── package.json
    ├── .gitignore
    └── README.md
```