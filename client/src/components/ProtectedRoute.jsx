import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem('access_token'); // Verifica si el token está almacenado
  return accessToken ? children : <Navigate to="/" />; // Redirige a "/" si no hay token
};

export default ProtectedRoute;