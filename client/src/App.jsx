import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';
import CategorySearch from './components/CategorySearch';

function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData(); // Llamada a la API del backend para obtener datos del usuario
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/user'); // Tu servidor backend
      setUserData(response.data);
      console.log('User Data:', response.data);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  return (
    <Router>
      <div>
        {userData ? (
          <div>
            <h2>Bienvenido {userData.nickname}</h2>
            <p>ID de usuario: {userData.id}</p>
            <p>Email: {userData.email}</p>
            {/* Aquí puedes mostrar otros datos del usuario */}
          </div>
        ) : (
          <p>Cargando datos...</p>
        )}

        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <h1>Profile Page</h1>
                <Route path="/categories" element={<CategorySearch />} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
