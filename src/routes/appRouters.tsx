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
import HomePage from '../pages/homePage'; 
import EditProfile from '../pages/editProfile';
import Favorites from '../pages/favorites';
import MovieDetailPage from '../pages/MovieDetailPage';
import Manual from '../pages/manual';

/**
 * Public application routes configuration
 * @returns JSX element containing all public routes
 */
const AppRouters: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
       <Route path="/homePage" element={<HomePage />} /> 
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/sitemap" element={<Sitemap />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recover-password" element={<RecoverPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/home-movies" element={<HomeMovies />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/movie/:id" element={<MovieDetailPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/movies" element={<HomeMovies />} />
      <Route path="/manual" element={<Manual />} />
      
    </Routes>
  );
};

export default AppRouters;
