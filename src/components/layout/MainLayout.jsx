import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

// Import role-specific sidebars
import SellerSidebar from '../dashboard/seller/SellerSidebar';

const MainLayout = ({ children }) => {
  const { currentUser } = useSelector(state => state.user);
  const { theme } = useSelector(state => state.theme);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to determine if the current route should show sidebar
  const shouldShowSidebar = () => {
    const sidebarRoutes = ['/dashboard', '/marketplace', '/training', '/mentorship'];
    return sidebarRoutes.some(route => location.pathname.startsWith(route));
  };

  // Function to render the appropriate sidebar based on user role
  const renderSidebar = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case 'seller':
        return <SellerSidebar isOpen={isSidebarOpen} />;
      case 'buyer':
        return <Sidebar isOpen={isSidebarOpen} />;
      default:
        return null;
    }
  };

  // Function to get role-specific welcome message and description
  const getWelcomeContent = () => {
    if (!currentUser) return null;

    const content = {
      seller: {
        title: 'Seller Dashboard',
        description: 'Manage your products, track orders, and grow your business'
      },
      buyer: {
        title: 'Welcome to WE Market',
        description: 'Discover unique products and connect with rural artisans'
      }
    };

    return content[currentUser.role] || null;
  };

  // Routes where we don't want to show header/footer
  const isFullscreenRoute = ['/login', '/signup'].includes(location.pathname);

  if (isFullscreenRoute) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    );
  }

  const welcomeContent = getWelcomeContent();

  return (
    <div className={`min-h-screen flex flex-col ${theme}`}>
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-1 pt-16">
        {shouldShowSidebar() && (
          <aside className={`
            fixed md:static
            inset-y-0 left-0
            transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
            transition-transform duration-300 ease-in-out
            w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700
            z-30 md:z-0
          `}>
            {renderSidebar()}
          </aside>
        )}

        <main className={`
          flex-1
          bg-gray-50 dark:bg-gray-900
          transition-all duration-300
        `}>
          <div className="container mx-auto px-4 py-8">
            {welcomeContent && location.pathname === '/dashboard' && (
              <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {welcomeContent.title}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {welcomeContent.description}
                </p>
              </div>
            )}

            {/* Breadcrumb */}
            <nav className="mb-6">
              {/* Add breadcrumb implementation here */}
            </nav>

            {/* Main content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              {children}
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;