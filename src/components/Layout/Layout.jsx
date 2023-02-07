import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <>
      <Navigation />
      <main>
        {children}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
