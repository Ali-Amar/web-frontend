import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  HiHome,
  HiShoppingBag,
  HiChartBar,
  HiCurrencyRupee,
  HiDocumentText,
  HiOutlineUserGroup,
  HiChat,
  HiCog,
  HiQuestionMarkCircle
} from 'react-icons/hi';
import { Badge } from 'flowbite-react';

const SellerSidebar = ({ isOpen }) => {
  const location = useLocation();
  const { currentUser } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  const navigationItems = [
    {
      name: language === 'ur' ? 'ڈیش بورڈ' : 'Dashboard',
      icon: HiHome,
      path: '/seller',
      badge: null
    },
    {
      name: language === 'ur' ? 'پروڈکٹس' : 'Products',
      icon: HiShoppingBag,
      path: '/seller/products',
      badge: null
    },
    {
      name: language === 'ur' ? 'آرڈرز' : 'Orders',
      icon: HiDocumentText,
      path: '/seller/orders',
      badge: {
        text: '3',
        color: 'warning'
      }
    },
    {
      name: language === 'ur' ? 'فروخت' : 'Sales',
      icon: HiCurrencyRupee,
      path: '/seller/sales',
      badge: null
    },
    {
      name: language === 'ur' ? 'صارفین' : 'Customers',
      icon: HiOutlineUserGroup,
      path: '/seller/customers',
      badge: null
    },
    {
      name: language === 'ur' ? 'پیغامات' : 'Messages',
      icon: HiChat,
      path: '/seller/messages',
      badge: {
        text: '2',
        color: 'info'
      }
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`h-full flex flex-col bg-white dark:bg-gray-800 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Seller Profile Summary */}
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center mb-4">
          <img
            src={currentUser?.avatar || '/public/seller-sidebar.jpg'}
            alt="Shop Logo"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {currentUser?.businessName || 'Your Shop'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentUser?.businessType || 'Seller'}
            </p>
          </div>
        </div>
        {/* <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">23</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {language === 'ur' ? 'پروڈکٹس' : 'Products'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">152</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {language === 'ur' ? 'فروخت' : 'Sales'}
            </p>
          </div>
        </div> */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 overflow-y-auto">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`
                  flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-colors
                  ${isActive(item.path)
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <Badge color={item.badge.color} size="sm">
                    {item.badge.text}
                  </Badge>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="space-y-2">
          <Link
            to="/dashboard/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
          >
            <HiCog className="w-5 h-5 mr-3" />
            <span>{language === 'ur' ? 'ترتیبات' : 'Settings'}</span>
          </Link>
          <Link
            to="/help-center"
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
          >
            <HiQuestionMarkCircle className="w-5 h-5 mr-3" />
            <span>{language === 'ur' ? 'مدد' : 'Help Center'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerSidebar;