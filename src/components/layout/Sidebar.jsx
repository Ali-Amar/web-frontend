import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  HiHome,
  HiShoppingBag,
  HiAcademicCap,
  HiUserGroup,
  HiHeart,
  HiBookOpen,
  HiChatAlt2,
  HiCog
} from 'react-icons/hi';

const Sidebar = ({ isOpen }) => {
  const { currentUser } = useSelector(state => state.user);
  const { language } = useSelector(state => state.language);
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      {
        name: language === 'ur' ? 'صفحہ اول' : 'Home',
        icon: HiHome,
        path: '/',
        showFor: ['buyer', 'seller', 'mentor', 'ngo']
      }
    ];

    const buyerItems = [
      {
        name: language === 'ur' ? 'مارکیٹ پلیس' : 'Marketplace',
        icon: HiShoppingBag,
        path: '/marketplace',
        showFor: ['buyer']
      },
      {
        name: language === 'ur' ? 'تربیت' : 'Training',
        icon: HiAcademicCap,
        path: '/training',
        showFor: ['buyer']
      },
      {
        name: language === 'ur' ? 'رہنمائی' : 'Mentorship',
        icon: HiUserGroup,
        path: '/mentorship',
        showFor: ['buyer']
      },
      {
        name: language === 'ur' ? 'میرے آرڈرز' : 'My Orders',
        icon: HiShoppingBag,
        path: '/orders',
        showFor: ['buyer']
      },
      {
        name: language === 'ur' ? 'محفوظ اشیاء' : 'Saved Items',
        icon: HiHeart,
        path: '/saved',
        showFor: ['buyer']
      }
    ];

    const commonItems = [
      {
        name: language === 'ur' ? 'وسائل' : 'Resources',
        icon: HiBookOpen,
        path: '/resources',
        showFor: ['buyer', 'seller', 'mentor']
      },
      {
        name: language === 'ur' ? 'پیغامات' : 'Messages',
        icon: HiChatAlt2,
        path: '/messages',
        showFor: ['buyer', 'seller', 'mentor', 'ngo']
      },
      {
        name: language === 'ur' ? 'ترتیبات' : 'Settings',
        icon: HiCog,
        path: '/settings',
        showFor: ['buyer', 'seller', 'mentor', 'ngo']
      }
    ];

    return [...baseItems, ...buyerItems, ...commonItems]
      .filter(item => item.showFor.includes(currentUser?.role || 'buyer'));
  };

  const navigationItems = getNavigationItems();

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`h-full py-6 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* User Profile Summary */}
      {currentUser && (
        <div className="px-6 mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={language === 'ur' ? 'پروفائل' : 'Profile'}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  {currentUser.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium dark:text-white">
                {currentUser.username}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {language === 'ur' ? currentUser.roleUrdu : currentUser.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="px-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`
                  flex items-center px-4 py-3 text-sm rounded-lg transition-colors
                  ${isActiveLink(item.path)
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                `}
              >
                <item.icon className={`
                  w-5 h-5 mr-3
                  ${isActiveLink(item.path)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-500'
                  }
                `} />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Actions */}
      <div className="mt-6 px-6 py-4 border-t dark:border-gray-700">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
          {language === 'ur' ? 'فوری کاروائیاں' : 'Quick Actions'}
        </h4>
        <div className="space-y-2">
          <Link
            to="/Support"
            className="block text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {language === 'ur' ? 'مدد مرکز' : 'Help Center'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
