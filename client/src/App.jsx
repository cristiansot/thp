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
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [authenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          import.meta.env.MODE === 'development'
            ? 'http://localhost:3001/ml/user'
            : 'https://thp-backend-16jj.onrender.com/ml/user'
        );
        setUser(res.data);
        setAuthenticating(false);
      } catch (err) {
        console.log('No autenticado, redirigiendo a login...');
        const loginUrl =
          import.meta.env.MODE === 'development'
            ? import.meta.env.VITE_ML_LOGIN_DEV
            : import.meta.env.VITE_ML_LOGIN_PROD;

        window.location.href = loginUrl;
      }
    };

    fetchUser();
  }, []);

  if (authenticating) {
    return <p>Verificando sesión...</p>;
  }

  return (
    <div>
      <h1>Bienvenido {user?.nickname || 'usuario'} 👋</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

export default App;
