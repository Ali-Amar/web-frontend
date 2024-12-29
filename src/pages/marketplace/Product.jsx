import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Button, 
  Spinner, 
  Alert,
  Badge,
  Rating,
  Tabs,
  TextInput,
  Avatar,
  Progress,
  Breadcrumb
} from 'flowbite-react';
import { 
  HiShoppingCart,
  HiHeart,
  HiShare,
  HiLocationMarker,
  HiChatAlt,
  HiCash,
  HiTruck,
  HiShieldCheck,
  HiHome,
  HiUserGroup,
  HiClock,
  HiCurrencyRupee,
  HiThumbUp
} from 'react-icons/hi';

import { formatPrice } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/product/${productId}` } });
      return;
    }
    // Add to cart logic
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/product/${productId}` } });
      return;
    }
    // Buy now logic
  };

  const handleContactSeller = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/product/${productId}` } });
      return;
    }
    setShowChatModal(true);
  };

  if (loading) {
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

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb>
          <Breadcrumb.Item href="/" icon={HiHome}>
            {language === 'ur' ? 'ہوم' : 'Home'}
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/marketplace">
            {language === 'ur' ? 'مارکیٹ پلیس' : 'Marketplace'}
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {language === 'ur' ? product?.nameUrdu : product?.name}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-white">
              <img
                src={product.images[selectedImage]}
                alt={language === 'ur' ? product.nameUrdu : product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index 
                      ? 'border-purple-500' 
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="space-y-6">
              {/* Category & Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge color="purple">
                  {language === 'ur' ? product.category.nameUrdu : product.category.name}
                </Badge>
                {product.isFeatured && (
                  <Badge color="warning">
                    {language === 'ur' ? 'نمایاں مصنوعات' : 'Featured'}
                  </Badge>
                )}
                {product.isHandmade && (
                  <Badge color="success">
                    {language === 'ur' ? 'ہاتھ سے بنا' : 'Handmade'}
                  </Badge>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {language === 'ur' ? product.nameUrdu : product.name}
                </h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                  {product.discountedPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.discountedPrice)}
                      </span>
                      <Badge color="failure">
                        {Math.round((product.discountedPrice - product.price) / product.discountedPrice * 100)}% OFF
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4">
                <Rating>
                  <Rating.Star value={product.rating} />
                  <p className="ml-2 text-sm font-medium text-gray-500">
                    {product.rating} out of 5
                  </p>
                </Rating>
                <span className="text-sm text-gray-500">
                  ({product.reviews.length} {language === 'ur' ? 'جائزے' : 'reviews'})
                </span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    icon: HiUserGroup,
                    value: product.totalSold,
                    label: language === 'ur' ? 'فروخت شدہ' : 'Sold'
                  },
                  {
                    icon: HiThumbUp,
                    value: `${product.satisfactionRate}%`,
                    label: language === 'ur' ? 'اطمینان شرح' : 'Satisfaction'
                  },
                  {
                    icon: HiClock,
                    value: product.deliveryTime,
                    label: language === 'ur' ? 'ڈیلیوری' : 'Delivery'
                  }
                ].map((stat, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <stat.icon className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                    <div className="font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quantity Selection */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  {language === 'ur' ? 'تعداد' : 'Quantity'}:
                </label>
                <div className="flex items-center">
                  <Button
                    color="gray"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <TextInput
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 mx-2 text-center"
                  />
                  <Button
                    color="gray"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  gradientDuoTone="purpleToBlue"
                  className="flex-1"
                  onClick={handleBuyNow}
                >
                  {language === 'ur' ? 'ابھی خریدیں' : 'Buy Now'}
                </Button>
                <Button
                  color="gray"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <HiShoppingCart className="w-5 h-5 mr-2" />
                  {language === 'ur' ? 'کارٹ میں شامل کریں' : 'Add to Cart'}
                </Button>
              </div>

              {/* Seller Info */}
              <div className="border-t dark:border-gray-700 pt-6">
                <Link 
                  to={`/shop/${product.seller.id}`}
                  className="flex items-center gap-4 mb-4"
                >
                  <Avatar
                    img={product.seller.avatar}
                    alt={product.seller.businessName}
                    size="lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {language === 'ur' 
                        ? product.seller.businessNameUrdu 
                        : product.seller.businessName}
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <HiLocationMarker className="w-4 h-4" />
                        {language === 'ur' 
                          ? product.seller.locationUrdu 
                          : product.seller.location}
                      </div>
                    </div>
                  </div>
                </Link>
                <Button
                  outline
                  gradientDuoTone="purpleToBlue"
                  className="w-full"
                  onClick={handleContactSeller}
                >
                  <HiChatAlt className="w-5 h-5 mr-2" />
                  {language === 'ur' ? 'فروخت کنندہ سے رابطہ کریں' : 'Contact Seller'}
                </Button>
              </div>

              {/* Purchase Protection */}
              <div className="border-t dark:border-gray-700 pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <HiShieldCheck className="w-6 h-6 text-green-500" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {language === 'ur' ? 'خریداری کا تحفظ' : 'Purchase Protection'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {language === 'ur' 
                        ? 'محفوظ ادائیگی اور واپسی کی ضمانت'
                        : 'Secure payment and return guarantee'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HiTruck className="w-6 h-6 text-blue-500" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {language === 'ur' ? 'ڈیلیوری کی معلومات' : 'Delivery Information'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {product.deliveryTime} {language === 'ur' ? 'میں ڈیلیوری' : 'delivery time'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs.Group style="underline">
            {/* Description Tab */}
            <Tabs.Item title={language === 'ur' ? 'تفصیل' : 'Description'}>
              <div className="prose dark:prose-invert max-w-none">
                {/* Artisan's Story */}
                <div className="mb-8">
                  <h3>{language === 'ur' ? 'کاریگر کی کہانی' : "Artisan's Story"}</h3>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400">
                      {language === 'ur' ? product.artisanStoryUrdu : product.artisanStory}
                    </p>
                  </div>
                </div>

                {/* Craftsmanship Details */}
                <div className="mb-8">
                  <h3>{language === 'ur' ? 'کاریگری کی تفصیلات' : 'Craftsmanship Details'}</h3>
                  <ul className="space-y-4">
                    <li>
                      <strong>{language === 'ur' ? 'روایتی تکنیک:' : 'Traditional Technique:'}</strong> {' '}
                      {language === 'ur' ? product.techniqueUrdu : product.technique}
                    </li>
                    <li>
                      <strong>{language === 'ur' ? 'استعمال شدہ مواد:' : 'Materials Used:'}</strong> {' '}
                      {language === 'ur' ? product.materialsUrdu : product.materials}
                    </li>
                    <li>
                      <strong>{language === 'ur' ? 'بنانے کا وقت:' : 'Creation Time:'}</strong> {' '}
                      {language === 'ur' ? product.creationTimeUrdu : product.creationTime}
                    </li>
                  </ul>
                </div>

                {/* Product Description */}
                <div>
                  <h3>{language === 'ur' ? 'مصنوعات کی تفصیل' : 'Product Description'}</h3>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                    {language === 'ur' ? product.descriptionUrdu : product.description}
                  </p>
                </div>
              </div>
            </Tabs.Item>

            {/* Specifications Tab */}
            <Tabs.Item title={language === 'ur' ? 'خصوصیات' : 'Specifications'}>
              <div className="grid md:grid-cols-2 gap-8">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b dark:border-gray-700 py-3">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {language === 'ur' ? value.keyUrdu : key}:
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === 'ur' ? value.valueUrdu : value.value}
                    </span>
                  </div>
                ))}
              </div>
            </Tabs.Item>

            {/* Reviews Tab */}
            <Tabs.Item title={language === 'ur' ? 'جائزے' : 'Reviews'}>
              {/* Reviews Summary */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.rating}
                  </div>
                  <Rating size="lg">
                    <Rating.Star value={product.rating} />
                  </Rating>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    {product.reviews.length} {language === 'ur' ? 'جائزے' : 'reviews'}
                  </p>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = product.reviews.filter(r => Math.floor(r.rating) === stars).length;
                    const percentage = (count / product.reviews.length) * 100;
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

              {/* Individual Reviews */}
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b dark:border-gray-700 pb-6">
                    <div className="flex items-center justify-between mb-2">
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
                    <p className="text-gray-600 dark:text-gray-400">
                      {language === 'ur' ? review.commentUrdu : review.comment}
                    </p>
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
                  </div>
                ))}
              </div>

              {/* Write Review Button */}
              {currentUser && (
                <div className="mt-8">
                  <Button
                    gradientDuoTone="purpleToBlue"
                    onClick={() => {/* Handle review modal */}}
                  >
                    {language === 'ur' ? 'جائزہ لکھیں' : 'Write a Review'}
                  </Button>
                </div>
              )}
            </Tabs.Item>
          </Tabs.Group>
        </div>

        {/* Similar Products */}
        {product.similarProducts?.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {language === 'ur' ? 'اسی جیسی مصنوعات' : 'Similar Products'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.similarProducts.map((similarProduct) => (
                <Link
                  key={similarProduct.id}
                  to={`/product/${similarProduct.id}`}
                  className="group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={similarProduct.image}
                      alt={language === 'ur' ? similarProduct.nameUrdu : similarProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600">
                      {language === 'ur' ? similarProduct.nameUrdu : similarProduct.name}
                    </h3>
                    <p className="text-gray-500">
                      {formatPrice(similarProduct.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Chat Modal */}
      <Modal
        show={showChatModal}
        onClose={() => setShowChatModal(false)}
        title={language === 'ur' ? 'فروخت کنندہ سے رابطہ کریں' : 'Contact Seller'}
      >
        <div className="space-y-4">
          <TextInput
            label={language === 'ur' ? 'پیغام' : 'Message'}
            placeholder={
              language === 'ur' 
                ? 'فروخت کنندہ کو پیغام لکھیں...' 
                : 'Write your message to the seller...'
            }
            multiline
            rows={4}
          />
          <Button
            gradientDuoTone="purpleToBlue"
            className="w-full"
            onClick={() => {
              // Handle send message
              setShowChatModal(false);
            }}
          >
            {language === 'ur' ? 'پیغام بھیجیں' : 'Send Message'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Product;