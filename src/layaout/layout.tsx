/**
 * Application layout component.
 *
 * Wraps page content with navigation, footer and renders global toasts.
 */
import React, { useEffect } from 'react';
import NavBar from './navBar';
import Footer from './footer';
import AppRouters from '../routes/appRouters';
import './layout.scss';
import { useAuth } from '../context/authContext';

/**
 * Main layout component that wraps all pages with navbar and footer
 * @returns JSX element containing the layout structure
 */
const Layout: React.FC = () => {
  const { successMessage, setSuccessMessage, error } = useAuth();

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(t);
  }, [successMessage, setSuccessMessage]);

  useEffect(() => {
    if (!error) return;
    // We don't clear the error here; assume components call clearError when appropriate
  }, [error]);

  return (
    <div className="layout">
      <NavBar />
      <main className="layout__main">
        <AppRouters />
      </main>
      <Footer />
      {successMessage && (
        <div className="global-toast-wrapper">
          <output className="global-toast global-toast--success" aria-live="polite">
            {successMessage}
          </output>
        </div>
      )}

      {error && (
        <div className="global-toast-wrapper">
          <output className="global-toast global-toast--error" aria-live="assertive">
            {error}
          </output>
        </div>
      )}
    </div>
  );
};

export default Layout;
