
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const LoggedIn = localStorage.getItem('LoggedIn');
  return LoggedIn ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
