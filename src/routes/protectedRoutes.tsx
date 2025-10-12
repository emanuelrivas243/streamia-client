import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EditProfile from '../pages/editProfile';

/**
 * Protected routes that require authentication
 * @returns JSX element containing protected routes
 */
const ProtectedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/edit-profile" element={<EditProfile />} />
      {/* Add more protected routes here as needed */}
    </Routes>
  );
};

export default ProtectedRoutes;
