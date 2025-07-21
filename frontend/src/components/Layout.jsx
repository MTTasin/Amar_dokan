// components/Layout.jsx


import React from 'react';

// We will create these components in the next steps
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const Layout = ({ children }) => {
  return (
    <div className="bg-background-light text-text-primary font-inter">
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
