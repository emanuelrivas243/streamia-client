import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home';
import About from '../pages/about';
import Contact from '../pages/contact';
import Sitemap from '../pages/sitemap';
import Login from '../pages/login';
import Register from '../pages/register';
import HomeMovies from '../pages/home-movies';
import RecoverPassword from '../pages/recoverPassword';
import ResetPassword from '../pages/resetPassword';
import ProtectedRoutes from './protectedRoutes';
import ProtectedRoute from '../components/ProtectedRoute';
import EditProfile from '../pages/editProfile';
import Favorites from '../pages/favorites';

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
      <Route path="/contact" element={<Contact />} />
      <Route path="/sitemap" element={<Sitemap />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recover-password" element={<RecoverPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/home-movies" element={<HomeMovies />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/favorites" element={<Favorites />} />

      
      
    </Routes>
  );
};

export default AppRouters;
