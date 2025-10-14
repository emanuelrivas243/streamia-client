/**
 * Root application component for STREAMIA client.
 *
 * Composes the top-level providers and layout for the app.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import Layout from './layaout/layout';
import AppRouters from './routes/appRouters';

/**
 * Main App component with routing and authentication context
 * @returns JSX element containing the application structure
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<Layout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
