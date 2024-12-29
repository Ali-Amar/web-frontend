import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  HiHome,
  HiAcademicCap,
  HiCalendar,
  HiUserGroup,
  HiBookOpen,
  HiChat,
  HiChartBar,
  HiCog,
  HiQuestionMarkCircle
} from 'react-icons/hi';
import { Badge } from 'flowbite-react';

const MentorSidebar = ({ isOpen }) => {
  const location = useLocation();
  const { currentUser } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  const navigationItems = [
    {
      name: language === 'ur' ? 'ڈیش بورڈ' : 'Dashboard',
      icon: HiHome,
      path: '/mentor/dashboard',
      badge: null
    },
    {
      name: language === 'ur' ? 'سیشنز' : 'Sessions',
      icon: HiCalendar,
      path: '/dashboard/sessions',
      badge: {
        text: '2',
        color: 'warning',
      }
    },
    {
      name: language === 'ur' ? 'طالب علم' : 'Students',
      icon: HiUserGroup,
      path: '/dashboard/students',
      badge: null
    },
    {
      name: language === 'ur' ? 'وسائل' : 'Resources',
      icon: HiBookOpen,
      path: '/dashboard/resources',
      badge: null
    },
    {
      name: language === 'ur' ? 'پیغامات' : 'Messages',
      icon: HiChat,
      path: '/dashboard/messages',
      badge: {
        text: '3',
        color: 'info'
      }
    },
    {
      name: language === 'ur' ? 'تجزیات' : 'Analytics',
      icon: HiChartBar,
      path: '/dashboard/analytics',
      badge: null
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`h-full flex flex-col bg-white dark:bg-gray-800 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Mentor Profile Summary */}
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center mb-4">
          <img
            src={currentUser?.avatar || '/public/empty.jpg'}
            alt="Mentor Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {currentUser?.fullName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentUser?.expertise || 'Business Mentor'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">18</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {language === 'ur' ? 'طلباء' : 'Students'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">45</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {language === 'ur' ? 'سیشنز' : 'Sessions'}
            </p>
          </div>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="px-6 py-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {language === 'ur' ? 'دستیابی' : 'Availability'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
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

export default MentorSidebar;