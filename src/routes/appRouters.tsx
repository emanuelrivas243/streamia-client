import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home';
import About from '../pages/about';
import Login from '../pages/login';
import Register from '../pages/register';
import RecoverPassword from '../pages/recoverPassword';
import ProtectedRoutes from './protectedRoutes';

/**
 * Public application routes configuration
 * @returns JSX element containing all public routes
 */
const AppRouters: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recover-password" element={<RecoverPassword />} />
      
      {/* Protected Routes */}
      <Route path="/edit-profile" element={<ProtectedRoutes />} />
    </Routes>
  );
};

export default AppRouters;
