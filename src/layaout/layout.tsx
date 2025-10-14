import React from 'react';
import NavBar from './navBar';
import Footer from './footer';
import AppRouters from '../routes/appRouters';
import './layout.scss';

/**
 * Main layout component that wraps all pages with navbar and footer
 * @returns JSX element containing the layout structure
 */
const Layout: React.FC = () => {
  return (
    <div className="layout">
      <NavBar />
      <main className="layout__main">
        <AppRouters />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
