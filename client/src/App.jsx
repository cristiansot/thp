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
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
      console.log('Access Token:', accessToken);
      localStorage.setItem('access_token', accessToken);
    }

    fetchUserData();
  }, []);

  const handleLogin = () => {
    const isDev = import.meta.env.MODE === 'development';
    const loginUrl = isDev
      ? import.meta.env.VITE_ML_LOGIN_DEV
      : import.meta.env.VITE_ML_LOGIN_PROD;

    window.location.href = loginUrl;
  };

  const fetchUserData = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No access token found');
      return;
    }

    try {
      const response = await axios.get('https://api.mercadolibre.com/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('User Data:', response.data);
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message);
    }
  };

  return (
    <Router>
      <div>
        <button onClick={handleLogin}>Login with Mercado Libre</button>
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <h1>Profile Page</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;