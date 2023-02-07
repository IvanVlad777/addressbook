import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthenticationContext';

const PrivateRoute = ({ children }) => {
  const { user } = UserAuth();
  if (!user) {
    return <Navigate to="/"></Navigate>;
  }
  return children;
};

export default PrivateRoute;
