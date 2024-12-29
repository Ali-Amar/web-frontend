import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Alert,
  Progress,
  Modal,
  Textarea
} from 'flowbite-react';
import {
  HiShoppingBag,
  HiCreditCard,
  HiCheck,
  HiExclamation,
  HiShieldCheck,
  HiCash
} from 'react-icons/hi';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PAYMENT_METHODS = [
  { id: 'card', icon: HiCreditCard, label: 'Credit/Debit Card', labelUrdu: 'کریڈٹ/ڈیبٹ کارڈ' },
  { id: 'cod', icon: HiCash, label: 'Cash on Delivery', labelUrdu: 'ادائیگی بذریعہ نقد' }
];

const Checkout = () => {
  const navigate = useNavigate();
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const { language } = useSelector((state) => state.language) || 'en';

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: '',
    postalCode: '',
    notes: ''
  });

  // Payment state (for card payments)
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  // Cart calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 1000 ? 0 : 150;
  const total = subtotal + shippingCost;

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

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping: shippingInfo,
        payment: {
          method: selectedPaymentMethod,
          total: total,
          ...(selectedPaymentMethod === 'card' && { cardDetails: paymentInfo })
        }
      };

      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Clear cart
      localStorage.removeItem('cart');
      setOrderId(data.orderId);
      setShowConfirmation(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (cart.length === 0 && !showConfirmation) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <Progress
          progress={step === 1 ? 50 : 100}
          size="lg"
          color="purple"
        />
        <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{language === 'ur' ? 'شپنگ' : 'Shipping'}</span>
          <span>{language === 'ur' ? 'ادائیگی' : 'Payment'}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            {step === 1 ? (
              <form onSubmit={handleShippingSubmit}>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {language === 'ur' ? 'شپنگ کی معلومات' : 'Shipping Information'}
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label={language === 'ur' ? 'پورا نام' : 'Full Name'}
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo(prev => ({
                      ...prev,
                      fullName: e.target.value
                    }))}
                    required
                  />
                  <Input
                    label={language === 'ur' ? 'ای میل' : 'Email'}
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                    required
                  />
                  <Input
                    label={language === 'ur' ? 'فون نمبر' : 'Phone Number'}
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo(prev => ({
                      ...prev,
                      phone: e.target.value
                    }))}
                    required
                  />
                  <Input
                    label={language === 'ur' ? 'پتہ' : 'Address'}
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo(prev => ({
                      ...prev,
                      address: e.target.value
                    }))}
                    required
                  />
                  <Input
                    label={language === 'ur' ? 'شہر' : 'City'}
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo(prev => ({
                      ...prev,
                      city: e.target.value
                    }))}
                    required
                  />
                  <Input
                    label={language === 'ur' ? 'پوسٹل کوڈ' : 'Postal Code'}
                    value={shippingInfo.postalCode}
                    onChange={(e) => setShippingInfo(prev => ({
                      ...prev,
                      postalCode: e.target.value
                    }))}
                    required
                  />
                </div>

                <div className="mt-4">
                  <Textarea
                    label={language === 'ur' ? 'اضافی نوٹس' : 'Additional Notes'}
                    value={shippingInfo.notes}
                    onChange={(e) => setShippingInfo(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    gradientDuoTone="purpleToBlue"
                  >
                    {language === 'ur' ? 'آگے بڑھیں' : 'Continue to Payment'}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePaymentSubmit}>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {language === 'ur' ? 'ادائیگی کی معلومات' : 'Payment Information'}
                </h2>

                {/* Payment Method Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {PAYMENT_METHODS.map(method => (
                    <div
                      key={method.id}
                      className={`
                        border rounded-lg p-4 cursor-pointer transition-colors
                        ${selectedPaymentMethod === method.id 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                          : 'border-gray-200 dark:border-gray-700'}
                      `}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <div className="flex items-center">
                        <method.icon className="w-6 h-6 text-purple-500 mr-2" />
                        <span className="font-medium">
                          {language === 'ur' ? method.labelUrdu : method.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Payment Form */}
                {selectedPaymentMethod === 'card' && (
                  <div className="space-y-4">
                    <Input
                      label={language === 'ur' ? 'کارڈ نمبر' : 'Card Number'}
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo(prev => ({
                        ...prev,
                        cardNumber: e.target.value
                      }))}
                      required
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        label={language === 'ur' ? 'میعاد ختم' : 'Expiry Date'}
                        placeholder="MM/YY"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo(prev => ({
                          ...prev,
                          expiryDate: e.target.value
                        }))}
                        required
                      />
                      <Input
                        label="CVV"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo(prev => ({
                          ...prev,
                          cvv: e.target.value
                        }))}
                        required
                      />
                      <Input
                        label={language === 'ur' ? 'کارڈ پر نام' : 'Name on Card'}
                        value={paymentInfo.nameOnCard}
                        onChange={(e) => setPaymentInfo(prev => ({
                          ...prev,
                          nameOnCard: e.target.value
                        }))}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <Button
                    color="gray"
                    onClick={() => setStep(1)}
                  >
                    {language === 'ur' ? 'واپس جائیں' : 'Back'}
                  </Button>
                  <Button
                    type="submit"
                    gradientDuoTone="purpleToBlue"
                    disabled={loading}
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      language === 'ur' ? 'آرڈر مکمل کریں' : 'Complete Order'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'ur' ? 'آرڈر کا خلاصہ' : 'Order Summary'}
            </h3>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center">
                  <img
                    src={item.images[0]}
                    alt={language === 'ur' ? item.nameUrdu : item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {language === 'ur' ? item.nameUrdu : item.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}

              <div className="border-t dark:border-gray-700 pt-4 mt-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{language === 'ur' ? 'ذیلی کل' : 'Subtotal'}</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400 mt-2">
                  <span>{language === 'ur' ? 'شپنگ' : 'Shipping'}</span>
                  <span>Rs. {shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white mt-4">
                  <span>{language === 'ur' ? 'کل رقم' : 'Total'}</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Security Notice */}
          <Card className="mt-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <HiShieldCheck className="w-5 h-5 mr-2 text-green-500" />
              <p>
                {language === 'ur'
                  ? 'تمام لین دین محفوظ اور خفیہ ہیں'
                  : 'All transactions are secure and encrypted'}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <Modal
        show={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          navigate('/dashboard/orders');
        }}
      >
        <Modal.Header>
          {language === 'ur' ? 'آرڈر کی تصدیق' : 'Order Confirmation'}
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <HiCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {language === 'ur'
                  ? 'آپ کا آرڈر کامیابی سے جمع کرا دیا گیا ہے'
                  : 'Your order has been placed successfully'}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'ur'
                    ? `آرڈر نمبر: ${orderId}`
                    : `Order ID: ${orderId}`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {language === 'ur'
                    ? 'آپ کو ای میل کے ذریعے تصدیق بھیج دی گئی ہے'
                    : 'A confirmation email has been sent to your email address'}
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            gradientDuoTone="purpleToBlue"
            onClick={() => {
              setShowConfirmation(false);
              navigate('/dashboard/orders');
            }}
          >
            {language === 'ur' ? 'آرڈرز دیکھیں' : 'View Orders'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Alert */}
      {error && (
        <Alert color="failure" className="mt-4">
          <HiExclamation className="w-5 h-5 mr-2" />
          {error}
        </Alert>
      )}
      </div>
    );
  };
  
  export default Checkout;