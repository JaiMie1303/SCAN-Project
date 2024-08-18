import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthStore from '../stores/AuthStore';

const ProtectedComponent = ({element}) => {
  return AuthStore.token ? element : <Navigate to="/login" replace />;
};

export default ProtectedComponent;