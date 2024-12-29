import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Sidebar, Badge } from 'flowbite-react';
import {
  HiHome,
  HiShoppingBag,
  HiChartBar,
  HiUserGroup,
  HiAcademicCap,
  HiChatAlt,
  HiDocumentText,
  HiLocationMarker,
  HiCog,
  HiCurrencyRupee,
  HiClipboardList,
  HiLightningBolt,
  HiCalendar,
  HiBookOpen,
  HiQuestionMarkCircle
} from 'react-icons/hi';

const DashSidebar = () => {
  const location = useLocation();
  const { currentUser } = useSelector(state => state.user);
  const { language } = useSelector(state => state.language) || 'en';
  console.log(language)
  // Define navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        name: language === 'ur' ? 'ڈیش بورڈ' : 'Dashboard',
        nameUrdu: 'ڈیش بورڈ',
        icon: HiHome,
        path: '/dashboard',
        roles: ['seller', 'mentor', 'ngo', 'buyer']
      }
    ];

    // Seller-specific items
    const sellerItems = [
      {
        name: language === 'ur' ? 'مصنوعات' : 'Products',
        nameUrdu: 'مصنوعات',
        icon: HiShoppingBag,
        path: '/dashboard/products',
        badge: { text: 'New', color: 'info' }
      },
      {
        name: language === 'ur' ? 'آرڈرز' : 'Orders',
        nameUrdu: 'آرڈرز',
        icon: HiClipboardList,
        path: '/dashboard/orders',
        badge: { text: '3', color: 'warning' }
      },
      {
        name: language === 'ur' ? 'فروخت' : 'Sales',
        nameUrdu: 'فروخت',
        icon: HiCurrencyRupee,
        path: '/dashboard/sales'
      },
      {
        name: language === 'ur' ? 'تجزیات' : 'Analytics',
        nameUrdu: 'تجزیات',
        icon: HiChartBar,
        path: '/dashboard/analytics'
      }
    ];

    // Mentor-specific items
    const mentorItems = [
      {
        name: language === 'ur' ? 'طالب علم' : 'Students',
        nameUrdu: 'طالب علم',
        icon: HiUserGroup,
        path: '/dashboard/students'
      },
      {
        name: language === 'ur' ? 'سیشنز' : 'Sessions',
        nameUrdu: 'سیشنز',
        icon: HiCalendar,
        path: '/dashboard/sessions',
        badge: { text: '2', color: 'success' }
      },
      {
        name: language === 'ur' ? 'وسائل' : 'Resources',
        nameUrdu: 'وسائل',
        icon: HiBookOpen,
        path: '/dashboard/resources'
      }
    ];

    // NGO-specific items
    const ngoItems = [
      {
        name: language === 'ur' ? 'پروگرامز' : 'Programs',
        nameUrdu: 'پروگرامز',
        icon: HiLightningBolt,
        path: '/dashboard/programs'
      },
      {
        name: language === 'ur' ? 'شرکاء' : 'Participants',
        nameUrdu: 'شرکاء',
        icon: HiUserGroup,
        path: '/dashboard/participants'
      },
      {
        name: language === 'ur' ? 'مقامات' : 'Locations',
        nameUrdu: 'مقامات',
        icon: HiLocationMarker,
        path: '/dashboard/locations'
      }
    ];

    // Common items for all roles
    const commonItems = [
      {
        name: language === 'ur' ? 'پیغامات' : 'Messages',
        nameUrdu: 'پیغامات',
        icon: HiChatAlt,
        path: '/dashboard/messages',
        badge: { text: '5', color: 'info' },
        roles: ['seller', 'mentor', 'ngo', 'buyer']
      },
      {
        name: language === 'ur' ? 'تربیت' : 'Training',
        nameUrdu: 'تربیت',
        icon: HiAcademicCap,
        path: '/dashboard/training',
        roles: ['seller', 'buyer']
      },
      {
        name: language === 'ur' ? 'ترتیبات' : 'Settings',
        nameUrdu: 'ترتیبات',
        icon: HiCog,
        path: '/dashboard/settings',
        roles: ['seller', 'mentor', 'ngo', 'buyer']
      }
    ];

    // Combine items based on user role
    switch (currentUser?.role) {
      case 'seller':
        return [...baseItems, ...sellerItems, ...commonItems];
      case 'mentor':
        return [...baseItems, ...mentorItems, ...commonItems];
      case 'ngo':
        return [...baseItems, ...ngoItems, ...commonItems];
      default:
        return [...baseItems, ...commonItems];
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="h-full py-3">
      {/* User Profile Summary */}
      <div className="px-3 mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.fullName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {currentUser?.fullName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {language === 'ur' ? getRoleInUrdu(currentUser?.role) : currentUser?.role}
            </p>
          </div>
        </div>

        {currentUser?.role === 'seller' && (
          <div className="mt-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between mb-1">
              <span>{language === 'ur' ? 'پروفائل مکمل' : 'Profile Completion'}</span>
              <span>85%</span>
            </div>
            <Progress
              progress={85}
              size="sm"
              color="purple"
            />
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {getNavigationItems().map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${isActive(item.path)
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
            >
              <div className="flex items-center">
                <item.icon className={`w-5 h-5 mr-3 ${isActive(item.path)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400'
                  }`} />
                <span className="text-sm">
                  {language === 'ur' ? item.nameUrdu : item.name}
                </span>
              </div>
              {item.badge && (
                <Badge color={item.badge.color} size="sm">
                  {item.badge.text}
                </Badge>
              )}
            </Link>
          ))}
        </Sidebar.ItemGroup>
      </Sidebar.Items>

      {/* Help Section */}
      <div className="px-3 mt-6 pt-6 border-t dark:border-gray-700">
        <Link
          to="/help"
          className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <HiQuestionMarkCircle className="w-5 h-5 mr-3" />
          <span>{language === 'ur' ? 'مدد و معاونت' : 'Help & Support'}</span>
        </Link>
      </div>
    </div>
  );
};

// Helper function to get role name in Urdu
const getRoleInUrdu = (role) => {
  const roleMap = {
    seller: 'فروخت کنندہ',
    mentor: 'رہنما',
    ngo: 'این جی او',
    buyer: 'خریدار'
  };
  return roleMap[role] || role;
};

export default DashSidebar;