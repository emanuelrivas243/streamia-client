import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home';
import About from '../pages/about';
import Login from '../pages/login';
import Register from '../pages/register';
import HomeMovies from '../pages/home-movies';
import RecoverPassword from '../pages/recoverPassword';
import ProtectedRoutes from './protectedRoutes';
import ProtectedRoute from '../components/ProtectedRoute';

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
      <Route path="/home-movies" element={<HomeMovies />} />

      
      {/* Protected Routes */}
      <Route path="/edit-profile" element={
        <ProtectedRoute>
          <ProtectedRoutes />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRouters;
