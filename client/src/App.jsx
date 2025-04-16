// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import ContainerCard from './components/ContainerCards';
// import NavBar from './components/NavBar'; 
// import Carousel from './components/Carousel';
// import './app.css';

// function App() {
//   const [properties, setProperties] = useState([]);

//   const backendUrl = 'http://localhost:3001';

//   useEffect(() => {
//     axios.get(`${backendUrl}/api/properties`)
//      .then(res => {
//         console.log(res.data);
//         setProperties(res.data);
//       })
//       .catch(err => console.error('Error fetching properties:', err));
//   }, []);

//   return (
//     <>
//       <NavBar />
//       <Carousel />
//       <ContainerCard properties={properties} />
//     </>
//   );
// }  

// export default App;

// client/src/pages/App.jsx
import React from 'react';
import axios from 'axios';

function App() {
  const handleLogin = async () => {
    const isDev = import.meta.env.MODE === 'development'; // Verifica si estás en modo de desarrollo
    const loginUrl = isDev
      ? import.meta.env.VITE_ML_LOGIN_DEV  // URL de login para desarrollo
      : import.meta.env.VITE_ML_LOGIN_PROD;    // URL de login para producción

    try {
      // Enviar solicitud al backend para iniciar el flujo de OAuth
      const response = await axios.get(loginUrl);
      
      // Si la respuesta es exitosa, el backend ya habrá redirigido al usuario
      console.log('Redirigiendo a Mercado Libre...');
    } catch (error) {
      console.error('Error al iniciar sesión en Mercado Libre:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Mercado Libre</button>
    </div>
  );
}

export default App;
