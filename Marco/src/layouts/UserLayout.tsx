// src/layouts/UserLayout.tsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default UserLayout;
