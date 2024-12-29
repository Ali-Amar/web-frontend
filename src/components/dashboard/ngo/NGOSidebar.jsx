import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  HiHome,
  HiTemplate,
  HiUserGroup,
  HiDocumentReport,
  HiCurrencyDollar,
  HiChat,
  HiChartPie,
  HiCog,
  HiQuestionMarkCircle
} from 'react-icons/hi';
import { Badge } from 'flowbite-react';

const NGOSidebar = ({ isOpen }) => {
  const location = useLocation();
  const { currentUser } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  const navigationItems = [
    {
      name: language === 'ur' ? 'ڈیش بورڈ' : 'Dashboard',
      icon: HiHome,
      path: 'ngo/dashboard',
      badge: null
    },
    {
      name: language === 'ur' ? 'پروگرام' : 'Programs',
      icon: HiTemplate,
      path: '/dashboard/programs',
      badge: {
        text: '4',
        color: 'success'
      }
    },
    {
      name: language === 'ur' ? 'شرکاء' : 'Participants',
      icon: HiUserGroup,
      path: '/dashboard/participants',
      badge: null
    },
    {
      name: language === 'ur' ? 'رپورٹس' : 'Reports',
      icon: HiDocumentReport,
      path: '/dashboard/reports',
      badge: {
        text: 'New',
        color: 'info'
      }
    },
    {
      name: language === 'ur' ? 'فنڈز' : 'Funding',
      icon: HiCurrencyDollar,
      path: '/dashboard/funding',
      badge: null
    },
    {
      name: language === 'ur' ? 'پیغامات' : 'Messages',
      icon: HiChat,
      path: '/dashboard/messages',
      badge: {
        text: '2',
        color: 'warning'
      }
    },
    {
      name: language === 'ur' ? 'اثرات' : 'Impact',
      icon: HiChartPie,
      path: '/dashboard/impact',
      badge: null
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`h-full flex flex-col bg-white dark:bg-gray-800 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* NGO Profile Summary */}
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center mb-4">
          <img
            src={currentUser?.avatar || '/public/empty.jpg'}
            alt="NGO Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {currentUser?.organizationName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentUser?.region || 'Regional NGO'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">127</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {language === 'ur' ? 'شرکاء' : 'Participants'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">8</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {language === 'ur' ? 'پروگرام' : 'Programs'}
            </p>
          </div>
        </div>
      </div>

      {/* Active Programs Summary */}
      <div className="px-6 py-4 border-b dark:border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {language === 'ur' ? 'فعال پروگرام' : 'Active Programs'}
          </span>
          <Badge color="success">4 Active</Badge>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
        </div>
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

export default NGOSidebar;