import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Badge, 
  Button, 
  Progress, 
  Tabs,
  Rating,
  Card,
  Avatar,
  Alert
} from 'flowbite-react';
import { 
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiStar,
  HiShoppingBag,
  HiChatAlt,
  HiHeart,
  HiUserGroup,
  HiClock,
  HiGlobe,
  // HiCertificate,
  HiTrendingUp
} from 'react-icons/hi';

import ProductGrid from '../../components/marketplace/ProductGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ShopProfile = () => {
  const { shopId } = useParams();
  const {language} = useSelector(state => state.language) || 'en';
  const { currentUser } = useSelector(state => state.user);
  
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    averageRating: 0,
    satisfactionRate: 0
  });

  useEffect(() => {
    const fetchShopData = async () => {
      setIsLoading(true);
      try {
        // Fetch shop details
        const shopResponse = await fetch(`/api/shops/${shopId}`);
        const shopData = await shopResponse.json();
        setShopData(shopData);

        // Fetch shop products
        const productsResponse = await fetch(`/api/shops/${shopId}/products`);
        const productsData = await productsResponse.json();
        setProducts(productsData.products);

        // Fetch shop statistics
        const statsResponse = await fetch(`/api/shops/${shopId}/stats`);
        const statsData = await statsResponse.json();
        setStats(statsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopData();
  }, [shopId]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert color="failure">
          {error}
        </Alert>
      </div>
    );
  }

  if (!shopData) return null;

  const achievements = [
    {
      icon: HiStar,
      title: language === 'ur' ? 'درجہ بندی' : 'Shop Rating',
      value: `${stats.averageRating}/5`,
      color: 'yellow'
    },
    {
      icon: HiShoppingBag,
      title: language === 'ur' ? 'کل فروخت' : 'Total Sales',
      value: stats.totalSales,
      color: 'green'
    },
    {
      icon: HiUserGroup,
      title: language === 'ur' ? 'مطمئن گاہک' : 'Satisfied Customers',
      value: `${stats.satisfactionRate}%`,
      color: 'blue'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Shop Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Shop Basic Info */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              <div className="relative">
                <img
                  src={shopData.logo}
                  alt={shopData.businessName}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white"
                />
                {shopData.isVerified && (
                  <Badge 
                    color="success" 
                    className="absolute -bottom-2 right-0"
                  >
                    {language === 'ur' ? 'تصدیق شدہ' : 'Verified'}
                  </Badge>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold">
                    {language === 'ur' ? shopData.businessNameUrdu : shopData.businessName}
                  </h1>
                  {shopData.certifications?.map((cert, index) => (
                    <Badge key={index} color="purple">
                      {language === 'ur' ? cert.nameUrdu : cert.name}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-6 text-white/90 mb-4">
                  <div className="flex items-center gap-2">
                    <HiLocationMarker className="w-5 h-5" />
                    <span>
                      {language === 'ur' ? shopData.locationUrdu : shopData.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiClock className="w-5 h-5" />
                    <span>
                      {language === 'ur' ? 'شامل ہوئے' : 'Member since'}{' '}
                      {new Date(shopData.joinedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiGlobe className="w-5 h-5" />
                    <span>
                      {language === 'ur' ? shopData.regionUrdu : shopData.region}
                    </span>
                  </div>
                </div>

                <p className="text-lg text-white/90">
                  {language === 'ur' ? shopData.bioUrdu : shopData.bio}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className="bg-white/10 rounded-lg p-4 text-center"
                >
                  <achievement.icon className={`w-8 h-8 mx-auto mb-2 text-${achievement.color}-400`} />
                  <div className="text-2xl font-bold mb-1">
                    {achievement.value}
                  </div>
                  <div className="text-sm text-white/80">
                    {achievement.title}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <Button
                gradientDuoTone="purpleToBlue"
                size="lg"
                onClick={() => {/* Handle message */}}
              >
                <HiChatAlt className="w-5 h-5 mr-2" />
                {language === 'ur' ? 'پیغام بھیجیں' : 'Send Message'}
              </Button>
              <Button
                color="gray"
                size="lg"
                onClick={() => {/* Handle follow */}}
              >
                <HiHeart className="w-5 h-5 mr-2" />
                {language === 'ur' ? 'فالو کریں' : 'Follow Shop'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs.Group
          style="underline"
          onActiveTabChange={index => {
            const tabs = ['products', 'about', 'reviews'];
            setActiveTab(tabs[index]);
          }}
        >
          {/* Products Tab */}
          <Tabs.Item 
            title={language === 'ur' ? 'مصنوعات' : 'Products'}
            icon={HiShoppingBag}
          >
            {/* Product Categories */}
            <div className="flex flex-wrap gap-4 mb-8">
              {shopData.categories?.map((category, index) => (
                <Badge
                  key={index}
                  color="gray"
                  className="cursor-pointer"
                  onClick={() => {/* Handle category filter */}}
                >
                  {language === 'ur' ? category.nameUrdu : category.name}
                  <span className="ml-2 text-xs">
                    ({category.productCount})
                  </span>
                </Badge>
              ))}
            </div>

            {/* Products Grid */}
            <ProductGrid
              products={products}
              isLoading={isLoading}
              onAddToCart={() => {}}
              onAddToWishlist={() => {}}
            />
          </Tabs.Item>

          {/* About Tab */}
          <Tabs.Item 
            title={language === 'ur' ? 'ہمارے بارے میں' : 'About'}
            icon={HiUserGroup}
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Artisan Story */}
              <Card>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {language === 'ur' ? 'ہماری کہانی' : 'Our Story'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {language === 'ur' ? shopData.storyUrdu : shopData.story}
                </p>
                
                {/* Craftsmanship */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {language === 'ur' ? 'کاریگری' : 'Craftsmanship'}
                  </h4>
                  <ul className="space-y-2">
                    {shopData.crafts?.map((craft, index) => (
                      <li 
                        key={index}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                      >
                        <HiTrendingUp className="w-5 h-5 text-purple-500" />
                        {language === 'ur' ? craft.nameUrdu : craft.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              {/* Shop Info */}
              <div className="space-y-6">
                {/* Contact Information */}
                <Card>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {language === 'ur' ? 'رابطہ کی معلومات' : 'Contact Information'}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <HiPhone className="w-5 h-5 text-gray-400" />
                      <span>{shopData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <HiMail className="w-5 h-5 text-gray-400" />
                      <span>{shopData.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <HiLocationMarker className="w-5 h-5 text-gray-400" />
                      <span>
                        {language === 'ur' 
                          ? shopData.fullAddressUrdu 
                          : shopData.fullAddress}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Business Hours */}
                <Card>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {language === 'ur' ? 'کاروباری اوقات' : 'Business Hours'}
                  </h3>
                  <div className="space-y-2">
                    {shopData.businessHours?.map((schedule, index) => (
                      <div 
                        key={index}
                        className="flex justify-between text-gray-600 dark:text-gray-400"
                      >
                        <span>
                          {language === 'ur' 
                            ? schedule.dayUrdu 
                            : schedule.day}
                        </span>
                        <span>
                          {language === 'ur' 
                            ? schedule.hoursUrdu 
                            : schedule.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Achievements */}
                <Card>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {language === 'ur' ? 'کامیابیاں' : 'Achievements'}
                  </h3>
                  <div className="space-y-4">
                    {shopData.achievements?.map((achievement, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3"
                      >
                        <HiTrendingUp className="w-5 h-5 text-purple-500" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {language === 'ur' 
                              ? achievement.titleUrdu 
                              : achievement.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {language === 'ur' 
                              ? achievement.descriptionUrdu 
                              : achievement.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </Tabs.Item>

          {/* Reviews Tab */}
          <Tabs.Item 
            title={language === 'ur' ? 'جائزے' : 'Reviews'}
            icon={HiStar}
          >
            <div className="space-y-8">
              {/* Reviews Summary */}
              <Card>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                      {stats.averageRating}
                    </div>
                    <Rating size="lg">
                      <Rating.Star value={stats.averageRating} />
                    </Rating>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      {shopData.reviews?.length} {language === 'ur' ? 'جائزے' : 'reviews'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = shopData.reviews?.filter(r => Math.floor(r.rating) === stars).length || 0;
                      const percentage = shopData.reviews?.length 
                        ? (count / shopData.reviews.length) * 100 
                        : 0;
                      return (
                        <div key={stars} className="flex items-center">
                          <span className="w-12 text-sm text-gray-600 dark:text-gray-400">
                            {stars} {language === 'ur' ? 'ستارے' : 'star'}
                          </span>
                          <div className="flex-1 mx-4">
                            <Progress
                              progress={percentage}
                              color="yellow"
                              size="sm"
                            />
                          </div>
                          <span className="w-12 text-sm text-right text-gray-600 dark:text-gray-400">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>

              {/* Review List */}
              <div className="space-y-6">
                {shopData.reviews?.map((review) => (
                  <Card key={review.id}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar
                          img={review.user.avatar}
                          alt={review.user.name}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {review.user.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Rating>
                        <Rating.Star value={review.rating} />
                      </Rating>
                    </div>

                    {/* Review Content */}
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        {language === 'ur' ? review.commentUrdu : review.comment}
                      </p>

                      {/* Review Images */}
                      {review.images?.length > 0 && (
                        <div className="flex gap-2 mt-4">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}

                      {/* Seller Response */}
                      {review.sellerResponse && (
                        <div className="mt-4 pl-4 border-l-4 border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {language === 'ur' ? 'فروخت کنندہ کا جواب' : 'Seller Response'}:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {language === 'ur' 
                              ? review.sellerResponse.commentUrdu 
                              : review.sellerResponse.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Load More Button */}
              {shopData.reviews?.length > 0 && (
                <div className="text-center">
                  <Button
                    gradientDuoTone="purpleToBlue"
                    onClick={() => {/* Handle load more */}}
                  >
                    {language === 'ur' ? 'مزید جائزے دیکھیں' : 'Load More Reviews'}
                  </Button>
                </div>
              )}
            </div>
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
};

export default ShopProfile;