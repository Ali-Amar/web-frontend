import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Spinner,
  Card,
  TextInput,
  Alert
} from 'flowbite-react';
import {
  HiPlus,
  HiSearch,
  HiUserGroup,
  HiCurrencyRupee,
  HiGlobe,
  HiStar,
  HiQuestionMarkCircle
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

import CategoryFilter from '../../components/marketplace/CategoryFilter';
import ProductGrid from '../../components/marketplace/ProductGrid';

const Marketplace = () => {
  const { currentUser } = useSelector(state => state.user);
  const { language } = useSelector(state => state.language) || 'en';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    priceRange: [0, 10000],
    rating: 0,
    location: '',
    availability: false,
    shipping: [],
    certifications: [],
    sortBy: 'popularity'
  });

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch products
        const productsResponse = await fetch('http://localhost:8080/api/products?' + new URLSearchParams(filters), {
          credentials: 'include'
        });
        const productsData = await productsResponse.json();
        setProducts(productsData.products);

        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:8080/api/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories);
      } catch (error) {
        setError('Failed to load marketplace data');
        console.error('Error fetching marketplace data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  // Success metrics data
  const metrics = [
    {
      icon: HiUserGroup,
      value: '1000+',
      label: language === 'ur' ? 'خواتین کاریگر' : 'Women Artisans',
      labelUrdu: 'خواتین کاریگر'
    },
    {
      icon: HiCurrencyRupee,
      value: '₨10M+',
      label: language === 'ur' ? 'مجموعی فروخت' : 'Total Sales',
      labelUrdu: 'مجموعی فروخت'
    },
    {
      icon: HiGlobe,
      value: '30+',
      label: language === 'ur' ? 'علاقے' : 'Regions',
      labelUrdu: 'علاقے'
    }
  ];

  // Featured categories data
  const featuredCategories = [
    {
      name: 'Handicrafts',
      nameUrdu: 'دستکاری',
      image: '/handicrafts.jpg',
      count: 150
    },
    {
      name: 'Textiles',
      nameUrdu: 'کپڑے',
      image: '/textiles.jpg',
      count: 200
    },
    {
      name: 'Jewelry',
      nameUrdu: 'زیورات',
      image: '/jewelry.jpg',
      count: 120
    },
    {
      name: 'Food Products',
      nameUrdu: 'کھانے کی اشیاء',
      image: '/food.jpg',
      count: 180
    }
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleAddToCart = async (product) => {
    // Cart functionality
  };

  const handleAddToWishlist = async (product) => {
    // Wishlist functionality
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert color="failure">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              {language === 'ur'
                ? 'پاکستانی خواتین کی دستکاری'
                : 'Pakistani Women Artisans Marketplace'}
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {language === 'ur'
                ? 'دیہی خواتین کی بنائی ہوئی منفرد مصنوعات دریافت کریں'
                : 'Discover unique handcrafted products by rural women artisans'}
            </p>
            {currentUser?.role === 'seller' && (
              <Button
                as={Link}
                to="/seller/products"
                gradientDuoTone="pinkToOrange"
                size="xl"
              >
                <HiPlus className="w-5 h-5 mr-2" />
                {language === 'ur' ? 'نئی مصنوعات شامل کریں' : 'Add New Product'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Success Metrics Section */}
      <div className="container mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="text-center">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
                  <metric.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {metric.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'ur' ? metric.labelUrdu : metric.label}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <CategoryFilter
              categories={categories}
              initialFilters={filters}
              onFilterChange={handleFilterChange}
              onReset={() => setFilters({})}
              isLoading={isLoading}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                color="gray"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                {language === 'ur' ? 'فلٹرز' : 'Filters'}
              </Button>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mb-4">
                <CategoryFilter
                  categories={categories}
                  initialFilters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={() => setFilters({})}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid
              products={products}
              isLoading={isLoading}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <section className="bg-white dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {language === 'ur' ? 'نمایاں اقسام' : 'Featured Categories'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category, index) => (
              <Link
                key={index}
                to={`/marketplace?category=${category.name}`}
                className="relative rounded-lg overflow-hidden group cursor-pointer"
              >
                <div className="aspect-square">
                  <img
                    src={category.image}
                    alt={language === 'ur' ? category.nameUrdu : category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {language === 'ur' ? category.nameUrdu : category.name}
                      </h3>
                      <p className="text-white/90">
                        {category.count} {language === 'ur' ? 'مصنوعات' : 'Products'}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'ur'
                ? 'کیا آپ کو مدد کی ضرورت ہے؟'
                : 'Need Help Getting Started?'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {language === 'ur'
                ? 'ہماری رہنما ٹیم آپ کی مدد کے لیے موجود ہے'
                : 'Our support team is here to help you succeed'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                gradientDuoTone="purpleToBlue"
                size="lg"
              >
                <HiQuestionMarkCircle className="w-5 h-5 mr-2" />
                {language === 'ur' ? 'رہنمائی حاصل کریں' : 'Get Guidance'}
              </Button>
              <Button
                color="gray"
                size="lg"
              >
                <HiStar className="w-5 h-5 mr-2" />
                {language === 'ur' ? 'کامیابی کی کہانیاں' : 'Success Stories'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Join as Seller CTA */}
      {!currentUser?.role === 'seller' && (
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'ur'
                ? 'کیا آپ اپنی مصنوعات فروخت کرنا چاہتی ہیں؟'
                : 'Want to Sell Your Products?'}
            </h2>
            <p className="text-xl mb-8">
              {language === 'ur'
                ? 'ہمارے پلیٹ فارم پر بطور فروخت کنندہ شامل ہوں'
                : 'Join our platform as a seller and reach customers across Pakistan'}
            </p>
            <Button
              as={Link}
              to="/signup?role=seller"
              gradientDuoTone="pinkToOrange"
              size="xl"
            >
              {language === 'ur' ? 'بطور فروخت کنندہ شامل ہوں' : 'Join as Seller'}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Marketplace;