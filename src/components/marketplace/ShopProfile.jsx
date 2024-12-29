import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Badge, 
  Button, 
  Progress, 
  Tabs,
  Rating 
} from 'flowbite-react';
import { 
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiStar,
  HiShoppingBag,
  HiChatAlt,
  HiHeart,
  HiUserGroup
} from 'react-icons/hi';
import ProductGrid from './ProductGrid';

const ShopProfile = ({ shopData, products, isLoading }) => {
  const {language} = useSelector(state => state.language) || 'en';
  const [activeTab, setActiveTab] = useState('products');

  const {
    businessName,
    businessNameUrdu,
    businessType,
    description,
    descriptionUrdu,
    location,
    contactInfo,
    rating,
    totalSales,
    totalProducts,
    followers,
    joinedDate,
    certifications,
    avatar
  } = shopData;

  const stats = [
    {
      icon: HiShoppingBag,
      value: totalProducts,
      label: language === 'ur' ? 'پروڈکٹس' : 'Products'
    },
    {
      icon: HiStar,
      value: totalSales,
      label: language === 'ur' ? 'فروخت' : 'Sales'
    },
    {
      icon: HiUserGroup,
      value: followers,
      label: language === 'ur' ? 'فالورز' : 'Followers'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Shop Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Shop Avatar */}
          <div className="relative">
            <img
              src={avatar}
              alt={businessName}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
            />
            {certifications?.length > 0 && (
              <Badge color="success" className="absolute -bottom-2 right-0">
                Verified
              </Badge>
            )}
          </div>

          {/* Shop Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language === 'ur' ? businessNameUrdu : businessName}
              </h1>
              <Badge color="purple">{businessType}</Badge>
              {certifications?.map((cert, index) => (
                <Badge key={index} color="indigo">
                  {cert}
                </Badge>
              ))}
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {language === 'ur' ? descriptionUrdu : description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <HiLocationMarker className="w-5 h-5 mr-1" />
                {location}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Rating>
                  <Rating.Star />
                  <p className="ml-1">{rating} / 5</p>
                </Rating>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <HiChatAlt className="w-5 h-5 mr-1" />
                {language === 'ur' ? 'چیٹ دستیاب' : 'Chat Available'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button gradientDuoTone="purpleToBlue">
              <HiHeart className="w-5 h-5 mr-2" />
              {language === 'ur' ? 'فالو کریں' : 'Follow'}
            </Button>
            <Button color="gray">
              <HiChatAlt className="w-5 h-5 mr-2" />
              {language === 'ur' ? 'پیغام بھیجیں' : 'Message'}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-8 h-8 mx-auto text-purple-600" />
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Shop Content */}
      <Tabs.Group
        style="underline"
        onActiveTabChange={tab => setActiveTab(tab)}
      >
        <Tabs.Item
          active={activeTab === 'products'}
          title={language === 'ur' ? 'پروڈکٹس' : 'Products'}
          icon={HiShoppingBag}
        >
          <ProductGrid
            products={products}
            isLoading={isLoading}
            hasMore={true}
            onLoadMore={() => {}}
          />
        </Tabs.Item>
        
        <Tabs.Item
          active={activeTab === 'about'}
          title={language === 'ur' ? 'ہمارے بارے میں' : 'About'}
          icon={HiUserGroup}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {language === 'ur' ? 'رابطہ کی معلومات' : 'Contact Information'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <HiPhone className="w-5 h-5 mr-3 text-gray-400" />
                  <span>{contactInfo.phone}</span>
                </div>
                <div className="flex items-center">
                  <HiMail className="w-5 h-5 mr-3 text-gray-400" />
                  <span>{contactInfo.email}</span>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {language === 'ur' ? 'کاروباری اوقات' : 'Business Hours'}
              </h3>
              {/* Add business hours component */}
            </div>

            {/* Certifications */}
            {certifications?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  {language === 'ur' ? 'سرٹیفیکیشنز' : 'Certifications'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert, index) => (
                    <Badge key={index} color="indigo">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Member Since */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {language === 'ur' ? 'رکنیت' : 'Member Since'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {new Date(joinedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Tabs.Item>

        <Tabs.Item
          active={activeTab === 'reviews'}
          title={language === 'ur' ? 'جائزے' : 'Reviews'}
          icon={HiStar}
        >
          {/* Add Reviews component */}
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
};

export default ShopProfile;