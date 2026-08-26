import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AtsCheckerSideIcon from '../components/common/AtsCheckerSideIcon';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/30 dark:bg-gray-950/10 relative">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <AtsCheckerSideIcon />
      <Footer />
    </div>
  );
};

export default MainLayout;
