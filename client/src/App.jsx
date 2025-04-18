import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';  // Asegúrate de tener esta línea
import ProtectedRoute from './components/ProtectedRoute';
import { useLocation } from 'react-router-dom';

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem('access_token');
  const APPLICATION_ID = import.meta.env.VITE_ML_CLIENT_ID;

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  function CallbackPage() {
    const query = useQuery();
    const code = query.get('code');  // Aquí obtienes el 'code' de la URL
  
    useEffect(() => {
      if (code) {
        // Aquí puedes hacer la solicitud al backend para obtener el ACCESS_TOKEN
        console.log("Código de autorización: ", code);
      }
    }, [code]);

    return null;  // Si no vas a renderizar nada en esta página, devolvemos null
  }

  // Función para obtener los datos del usuario y sus publicaciones
  const fetchData = async () => {
    if (!accessToken) {
      console.error('No se encontró el token de acceso');
      setError('No se ha encontrado el token de acceso');
      return;
    }

    try {
      // Obtener datos del usuario autenticado
      const userResponse = await axios.get('https://api.mercadolibre.com/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setUserInfo(userResponse.data);
      const USER_ID = userResponse.data.id;

      // Obtener publicaciones del usuario desde tu backend
      const itemsResponse = await axios.get(`/api/items/${USER_ID}`);
      const itemIds = itemsResponse.data.results || [];
      setUserItems(itemIds);
    } catch (error) {
      console.error('Error al obtener los datos:', error.response?.data || error.message);
      setError('Error al obtener los datos.');
    }
  };

  // Handler de login (Redirige a la página de login de Mercado Libre)
  const handleLogin = () => {
    const loginUrl = `https://auth.mercadolibre.com/authorization?response_type=code&client_id=${APPLICATION_ID}&redirect_uri=${import.meta.env.VITE_ML_REDIRECT_URI}`;
    window.location.href = loginUrl;
  };

  // Redirigir a la página de inicio de sesión si no hay token
  useEffect(() => {
    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  return (
    <Router>
      <div>
        {!accessToken ? (
          <button onClick={handleLogin}>Login con Mercado Libre</button>
        ) : (
          <>
            <h2>Usuario Autenticado</h2>
            {userInfo ? (
              <ul>
                <li><strong>Nombre:</strong> {userInfo.nickname}</li>
                <li><strong>ID:</strong> {userInfo.id}</li>
                <li><strong>Email:</strong> {userInfo.email}</li>
              </ul>
            ) : (
              <p>No se han encontrado datos del usuario.</p>
            )}

            {/* Mostramos el código de autorización si está disponible */}
            <div>
              <h1>Autenticación Completa</h1>
              {code ? (
                <p>Código de Autorización: {code}</p>
              ) : (
                <p>No se ha recibido el código de autorización</p>
              )}
            </div>

            <h2>Publicaciones Activas</h2>
            {error && <p className="error">{error}</p>}
            {userItems.length > 0 ? (
              <ul>
                {userItems.map((item) => (
                  <li key={item.id}>{item.title}</li>
                ))}
              </ul>
            ) : (
              <p>No se encontraron publicaciones.</p>
            )}
          </>
        )}

        <Routes>
          <Route path="/" element={<h1>Página de Inicio</h1>} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <h1>Página de Perfil</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
