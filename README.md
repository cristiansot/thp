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
    ├── server/                         # Backend del proyecto
    │   └── scraping/                   # Módulo de scraping
    │   │   ├── index.js                # Archivo de entrada para ejecutar el scraping
    │   │   └── scraper.js              # Lógica principal de scraping
    │   ├── .env                        # Dependencias y scripts del cliente
    │   └── package.json                # Dependencias y scripts del servidor
    ├── client/                         # Frontend del proyecto (React + Vite)
    │   ├── public/                     # Archivos públicos accesibles directamente
    │   │   └── vite.svg                # Logo de Vite (default)
    │   ├── src/                        # Código fuente del cliente
    │   │   ├── assets/                 # Recursos como estilos y scripts reutilizables
    │   │   │   ├── css/
    │   │   │   │   └── NavBar.css      # Estilos del componente NavBar
    │   │   │   ├── img/                # Recursos gráficos y relacionados
    │   │   │   │   ├── icons           # SVGs usados como íconos en JSX 
    │   │   │   │   ├── carousel        
    │   │   │   │   └── properties      # Rutas o imports de imágenes de propiedades en formato jpg
    │   │   │   └── js/
    │   │   │       └── NavBar.js       # Lógica o funcionalidad del NavBar
    │   │   ├── components/             # Componentes reutilizables de React
    │   │   │   ├── PropertyCard.jsx 
    │   │   │   └── NavBar.jsx          # Código jsx del °Navbar
    │   │   ├── App.jsx                 # Componente principal de la aplicación
    │   │   └── main.jsx                # Punto de entrada para React
    │   ├── package.json                # Dependencias y scripts del cliente
    │   └── properties.json             # URLs o datos de entrada para el scraping
    ├── .gitignore                      # Archivos/Carpetas a ignorar por Git
    └── README.md                       # Documentación del proyecto

```