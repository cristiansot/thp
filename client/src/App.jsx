import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';  // Asegúrate de tener esta línea
import ProtectedRoute from './components/ProtectedRoute';
import { useLocation } from 'react-router-dom';

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);  // Añadí un estado de carga

  const accessToken = localStorage.getItem('access_token');
  const APPLICATION_ID = import.meta.env.VITE_ML_CLIENT_ID;

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  // Callback page to handle redirect from Mercado Libre OAuth
  function CallbackPage() {
    const query = useQuery();
    const code = query.get('code');  // Aquí obtienes el 'code' de la URL
  
    useEffect(() => {
      if (code) {
        // Realizar la solicitud al backend para intercambiar el código por el access token
        axios
          .post('/api/callback', { code })
          .then((response) => {
            const { access_token } = response.data;
            localStorage.setItem('access_token', access_token);  // Guarda el token en localStorage
            window.location.href = '/';  // Redirige a la página principal después de obtener el token
          })
          .catch((error) => {
            console.error('Error al obtener el token:', error);
            setError('Error al obtener el token de acceso');
          });
      }
    }, [code]);

    return (
      <div>
        <h2>Autenticación de Mercado Libre</h2>
        {error && <p>{error}</p>}
      </div>
    );
  }

  // Fetch user and items
  const fetchData = async () => {
    if (!accessToken) {
      console.error('No access token found');
      setError('No se ha encontrado el token de acceso');
      setLoading(false);
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
      setLoading(false);  // Cuando se termina de cargar, se cambia el estado de carga
    } catch (error) {
      console.error('Error al obtener los datos:', error.response?.data || error.message);
      setError('Error al obtener los datos.');
      setLoading(false);  // En caso de error también cambiamos el estado de carga
    }
  };

  // Login handler (Redirige a la página de login de Mercado Libre)
  const handleLogin = () => {
    const loginUrl = `https://auth.mercadolibre.com/authorization?response_type=code&client_id=${APPLICATION_ID}&redirect_uri=${import.meta.env.VITE_ML_REDIRECT_URI}`;
    console.log("URL de Login:", loginUrl);  // Imprime la URL para verificar que sea correcta
    window.location.href = loginUrl;
  };

  // Redirigir a la página de inicio de sesión si no hay token
  useEffect(() => {
    if (accessToken) {
      fetchData();  // Llamamos a fetchData solo si el token existe
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
              <p>No hay datos del usuario.</p>
            )}

            <h2>Publicaciones Activas</h2>
            {error && <p className="error">{error}</p>}
            {loading ? (
              <p>Cargando...</p>  // Agregué un mensaje de carga
            ) : (
              userItems.length > 0 ? (
                <ul>
                  {userItems.map((item) => (
                    <li key={item.id}>{item.title}</li>
                  ))}
                </ul>
              ) : (
                <p>No se encontraron publicaciones.</p>
              )
            )}
          </>
        )}

        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/profile" element={<ProtectedRoute><h1>Profile Page</h1></ProtectedRoute>} />
          <Route path="/callback" element={<CallbackPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
