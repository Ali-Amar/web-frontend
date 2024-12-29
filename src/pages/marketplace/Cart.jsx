import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Alert,
  Badge,
  TextInput
} from 'flowbite-react';
import {
  HiShoppingBag,
  HiTrash,
  HiPlus,
  HiMinus,
  HiArrowLeft,
  HiOutlineShoppingCart
} from 'react-icons/hi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Cart = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { language } = useSelector((state) => state.language) || 'en';
  
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCartFromLocalStorage();
  }, []);

  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      setLoading(false);
    } catch (err) {
      setError(language === 'ur' ? 'کارٹ لوڈ کرنے میں مسئلہ' : 'Error loading cart');
      setLoading(false);
    }
  };

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = cart.find(item => item._id === productId);
    if (!product) return;

    // Ensure quantity is within valid range
    const quantity = Math.max(1, Math.min(product.stock, newQuantity));

    const updatedCart = cart.map(item =>
      item._id === productId ? { ...item, quantity } : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item._id !== productId);
    updateCart(updatedCart);
  };

  // Cart calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 1000 ? 0 : 150; // Free shipping over Rs. 1000
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <div className="text-center py-8">
            <HiOutlineShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {language === 'ur' ? 'آپ کی ٹوکری خالی ہے' : 'Your cart is empty'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {language === 'ur' 
                ? 'مارکیٹ پلیس پر واپس جائیں اور دستکاری مصنوعات دریافت کریں'
                : 'Return to the marketplace and discover artisanal products'}
            </p>
            <Button
              as={Link}
              to="/marketplace"
              gradientDuoTone="purpleToBlue"
            >
              <HiShoppingBag className="w-5 h-5 mr-2" />
              {language === 'ur' ? 'مارکیٹ پلیس' : 'Browse Marketplace'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {language === 'ur' ? 'شاپنگ کارٹ' : 'Shopping Cart'}
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  ({cart.length} {language === 'ur' ? 'اشیاء' : 'items'})
                </span>
              </h2>
              <Button
                as={Link}
                to="/marketplace"
                color="gray"
                size="sm"
              >
                <HiArrowLeft className="w-4 h-4 mr-2" />
                {language === 'ur' ? 'خریداری جاری رکھیں' : 'Continue Shopping'}
              </Button>
            </div>

            <div className="divide-y dark:divide-gray-700">
              {cart.map((item) => (
                <div key={item._id} className="py-4">
                  <div className="flex items-center">
                    {/* Product Image */}
                    <img
                      src={item.images[0]}
                      alt={language === 'ur' ? item.nameUrdu : item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />

                    {/* Product Details */}
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {language === 'ur' ? item.nameUrdu : item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'ur' ? item.sellerNameUrdu : item.sellerName}
                      </p>
                      <div className="mt-1">
                        <Badge color={item.stock > 5 ? 'success' : 'warning'}>
                          {item.stock} {language === 'ur' ? 'دستیاب' : 'in stock'}
                        </Badge>
                      </div>
                    </div>

                    {/* Price and Quantity */}
                    <div className="text-right ml-4">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                      <div className="flex items-center justify-end mt-2">
                        <Button
                          size="xs"
                          color="gray"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <HiMinus className="w-4 h-4" />
                        </Button>
                        <TextInput
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                          className="w-16 mx-2 text-center"
                          min="1"
                          max={item.stock}
                        />
                        <Button
                          size="xs"
                          color="gray"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <HiPlus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      color="failure"
                      size="sm"
                      className="ml-4"
                      onClick={() => removeItem(item._id)}
                    >
                      <HiTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'ur' ? 'آرڈر کا خلاصہ' : 'Order Summary'}
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{language === 'ur' ? 'ذیلی کل' : 'Subtotal'}</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{language === 'ur' ? 'شپنگ' : 'Shipping'}</span>
                {shippingCost === 0 ? (
                  <Badge color="success">
                    {language === 'ur' ? 'مفت' : 'Free'}
                  </Badge>
                ) : (
                  <span>Rs. {shippingCost.toLocaleString()}</span>
                )}
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white pt-3 border-t dark:border-gray-700">
                <span>{language === 'ur' ? 'کل رقم' : 'Total'}</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <Button
              gradientDuoTone="purpleToBlue"
              className="w-full mt-6"
              onClick={handleCheckout}
            >
              {language === 'ur' ? 'چیک آؤٹ' : 'Proceed to Checkout'}
            </Button>

            {/* Shipping Notice */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p className="flex items-center">
                {language === 'ur'
                  ? 'Rs. 1,000 سے زیادہ کی خریداری پر مفت شپنگ'
                  : 'Free shipping on orders above Rs. 1,000'}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {error && (
        <Alert color="failure" className="mt-4">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default Cart;