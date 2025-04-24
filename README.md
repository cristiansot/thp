# THP web site 2.0 

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://git@github.com:cristiansot/thp.git
cd thp
```

### 2. Instalar dependencias del servidor (scraping)

```bash
cd server
npm install
```

### 3. Instalar dependencias del cliente (React)

```bash
cd client
npm install
```

### Ejecutar proyecto

Ejecutar el scraping (modo manual)

```bash
cd server
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
    │   ├── routes/
    │   │   ├── auth.js 
    │   │   └── products.js       # Endpoint para obtener productos
    │   ├── services/
    │   │   ├── mail.js 
    │   │   └── authManager.js  
    │   ├── oauth/
    │   │   ├── login.js 
    │   │   ├── tokenStorage.js 
    │   │   ├── tokens.json
    │   │   └── callback.js 
    │   ├── .env
    │   ├── index.js                # Entry point del servidor
    │   └── package.json
    ├── client/
    │   ├── public/
    │   ├── src/
    │   │   ├── assets/
    │   │   │   ├── css
    │   │   │   └── img
    │   │   │       ├── carousel
    │   │   │       └── icons
    │   │   ├── components/
    │   │   │   ├── Carousel.jsx
    │   │   │   ├── ContainerCard.jsx
    │   │   │   ├── Navbar.jsx
    │   │   │   └── PropertyCard.jsx
    │   │   ├── App.jsx
    │   │   └── main.jsx
    │   ├── index.html
    │   ├── package.json
    │   └── viteconfig.js
    ├── .env
    ├── vite.config.js
    ├── .gitignore                      # Archivos/Carpetas a ignorar por Git
    └── README.md                       # Documentación del proyecto
```