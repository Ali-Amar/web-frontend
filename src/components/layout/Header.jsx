import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Avatar, Tooltip, Dropdown } from "flowbite-react";
import {
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaGlobe,
  FaShoppingBag,
  FaBell
} from "react-icons/fa";
import {
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineCog,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineChat
} from "react-icons/hi";
import { toggleTheme } from "../../features/theme/themeSlice";
import { signOut } from "../../features/auth/authSlice";
import { setLanguage } from "../../features/languageSlice";

const Header = ({ onToggleSidebar }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language } = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const location = useLocation();

  const handleSignOut = async () => {
    try {
      dispatch(signOut());
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleLanguageChange = (lang) => {
    dispatch(setLanguage(lang));
  };

  const userMenuItems = [
    {
      icon: HiOutlineUserCircle,
      label: language === 'ur' ? 'پروفائل' : 'Profile',
      onClick: () => navigate('/dashboard?tab=profile')
    },
    {
      icon: HiOutlineCog,
      label: language === 'ur' ? 'ترتیبات' : 'Settings',
      onClick: () => navigate('/settings')
    },
    {
      icon: HiOutlineLogout,
      label: language === 'ur' ? 'لاگ آؤٹ' : 'Sign Out',
      onClick: handleSignOut
    }
  ];

  const notificationButton = (
    <Button color="gray" pill size="sm" className="relative">
      <FaBell className="h-5 w-5" />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
        3
      </span>
    </Button>
  );

  const cartButton = (
    <Button color="gray" pill size="sm" className="relative">
      <FaShoppingBag className="h-5 w-5" />
      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
        2
      </span>
    </Button>
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <Button
              color="gray"
              pill
              size="sm"
              className="md:hidden mr-2"
              onClick={() => {
                onToggleSidebar();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </Button>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="WE Market"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                WE Market
              </span>
            </Link>
          </div>

          {/* Center Section - Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
          {currentUser?.role === 'seller' ? (
              <>
                <Link to="/seller" className="nav-link">
                  {language === 'ur' ? 'ڈیش بورڈ' : 'Dashboard'}
                </Link>
                <Link to="/seller/products" className="nav-link">
                  {language === 'ur' ? 'پروڈکٹس' : 'Products'}
                </Link>
                <Link to="/marketplace" className="nav-link">
                  {language === 'ur' ? 'مارکیٹ پلیس' : 'Marketplace'}
                </Link>
                <Link to="/training" className="nav-link">
                  {language === 'ur' ? 'تربیت' : 'Training'}
                </Link>
                <Link to="/mentorship" className="nav-link">
                  {language === 'ur' ? 'مینٹرشپ' : 'Mentorship'}
                </Link>
                <Link to="/about" className="nav-link">
                  {language === 'ur' ? 'ہمارے بارے میں' : 'About Us'}
                </Link>
              </>
            ) : (
              <>
                <Link to="/marketplace" className="nav-link">
                  {language === 'ur' ? 'مارکیٹ پلیس' : 'Marketplace'}
                </Link>
                <Link to="/training" className="nav-link">
                  {language === 'ur' ? 'تربیت' : 'Training'}
                </Link>
                <Link to="/mentorship" className="nav-link">
                  {language === 'ur' ? 'مینٹرشپ' : 'Mentorship'}
                </Link>
              </>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              color="gray"
              pill
              size="sm"
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>

            {/* Language Toggle */}
            <Dropdown
              label={<FaGlobe />}
              dismissOnClick={true}
              color="gray"
            >
              <Dropdown.Item onClick={() => handleLanguageChange('en')}>
                English
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleLanguageChange('ur')}>
                اردو
              </Dropdown.Item>
            </Dropdown>

            {/* Notifications */}
            {currentUser && (
              <>
                {/* <Tooltip content="Notifications">
                  {notificationButton}
                </Tooltip> */}

                {currentUser.role === 'buyer' && (
                  <Tooltip content="Shopping Cart">
                    <Link to='/cart'>{cartButton}</Link>
                  </Tooltip>
                )}
              </>
            )}

            {/* User Menu */}
            {currentUser ? (
              <Dropdown
                label={
                  <Avatar
                    img={currentUser.avatar}
                    rounded
                    size="sm"
                    alt={currentUser.username}
                  />
                }
                arrowIcon={false}
                inline
              >
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {currentUser.username}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {currentUser.role}
                  </p>
                </div>
                <Dropdown.Divider />
                {userMenuItems.map((item, index) => (
                  <Dropdown.Item
                    key={index}
                    icon={item.icon}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button color="gray" size="sm">
                    {language === 'ur' ? 'لاگ ان' : 'Login'}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button gradientDuoTone="purpleToBlue" size="sm">
                    {language === 'ur' ? 'سائن اپ' : 'Sign Up'}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`
        md:hidden 
        transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'} 
        overflow-hidden
      `}>
        <nav className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
          {currentUser?.role === 'seller' ? (
            <>
              <Link to="/dashboard" className="mobile-nav-link">
                Dashboard
              </Link>
              <Link to="/products" className="mobile-nav-link">
                Products
              </Link>
            </>
          ) : (
            <>
              <Link to="/marketplace" className="mobile-nav-link">
                Marketplace
              </Link>
              <Link to="/training" className="mobile-nav-link">
                Training
              </Link>
              <Link to="/mentorship" className="mobile-nav-link">
                Mentorship
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;