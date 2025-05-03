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
    │   ├── data/
    │   │   └── propertyStatus.json 
    │   ├── oauth/
    │   │   ├── login.js 
    │   │   ├── tokenStorage.js 
    │   │   ├── tokens.json
    │   │   └── callback.js 
    │   ├── routes/
    │   │   ├── auth.js 
    │   │   └── properties.js           # Endpoint para obtener productos
    │   ├── scraping/
    │   │   ├── priceChecker.js         # Lógica de scraping y comparación 
    │   │   ├── previousPrice.json      # Último precio guardado  
    │   ├── services/
    │   │   ├── mail.js 
    │   │   ├── authManager.js  
    │   │   └── propertyStatusStore.js 
    │   ├── .env
    │   ├── index.js                    # Entry point del servidor
    │   ├── package.json
    │   └── notified.json
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
    │   │   │   ├── Filters.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── MapView.jsx
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── PropertyCard.jsx
    │   │   │   ├── ProtectedRoute.jsx
    │   │   │   └── Whatsapp.jsx
    │   │   ├── App.jsx
    │   │   └── main.jsx
    │   ├── index.html
    │   ├── package.json
    │   ├── viteconfig.js
    │   └── .env
    ├── .gitignore                      # Archivos/Carpetas a ignorar por Git
    └── README.md                       # Documentación del proyecto
```