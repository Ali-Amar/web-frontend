import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Table,
  Button,
  Badge,
  TextInput,
  Select,
  Card,
  Modal,
  Progress
} from 'flowbite-react';
import {
  HiSearch,
  HiEye,
  HiChat,
  HiDownload,
  HiOutlineReceiptRefund
} from 'react-icons/hi';

const BuyerOrders = () => {
  const { currentUser } = useSelector(state => state.user);
  const { language } = useSelector(state => state.language) || 'en';
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateRange: 'all'
  });

  // Order statuses with translations
  const orderStatuses = [
    { value: 'pending', label: 'Pending', labelUrdu: 'زیر التواء', color: 'warning' },
    { value: 'processing', label: 'Processing', labelUrdu: 'پراسیسنگ', color: 'purple' },
    { value: 'shipped', label: 'Shipped', labelUrdu: 'بھیج دیا گیا', color: 'blue' },
    { value: 'delivered', label: 'Delivered', labelUrdu: 'پہنچا دیا گیا', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', labelUrdu: 'منسوخ', color: 'failure' }
  ];

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/buyer/orders?' + new URLSearchParams(filters));
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusInfo = orderStatuses.find(s => s.value === status);
    return (
      <Badge color={statusInfo?.color || 'gray'}>
        {language === 'ur' ? statusInfo?.labelUrdu : statusInfo?.label}
      </Badge>
    );
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/invoice`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  return (
    <div className="p-4">
      <Card>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ur' ? 'میرے آرڈرز' : 'My Orders'}
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <TextInput
                icon={HiSearch}
                placeholder={language === 'ur' ? 'آرڈر نمبر تلاش کریں...' : 'Search order ID...'}
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <Select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">{language === 'ur' ? 'تمام حالات' : 'All Statuses'}</option>
              {orderStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {language === 'ur' ? status.labelUrdu : status.label}
                </option>
              ))}
            </Select>
            <Select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            >
              <option value="all">{language === 'ur' ? 'تمام' : 'All Time'}</option>
              <option value="today">{language === 'ur' ? 'آج' : 'Today'}</option>
              <option value="week">{language === 'ur' ? 'اس ہفتے' : 'This Week'}</option>
              <option value="month">{language === 'ur' ? 'اس مہینے' : 'This Month'}</option>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {language === 'ur' ? 'کوئی آرڈر نہیں ملا' : 'No Orders Found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'ur' 
                ? 'آپ نے ابھی تک کوئی آرڈر نہیں دیا'
                : 'You haven\'t placed any orders yet'}
            </p>
            <Button
              gradientDuoTone="purpleToBlue"
              className="mt-4"
              href="/marketplace"
            >
              {language === 'ur' ? 'مارکیٹ پلیس پر جائیں' : 'Browse Marketplace'}
            </Button>
          </div>
        ) : (
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>{language === 'ur' ? 'آرڈر نمبر' : 'Order ID'}</Table.HeadCell>
              <Table.HeadCell>{language === 'ur' ? 'تاریخ' : 'Date'}</Table.HeadCell>
              <Table.HeadCell>{language === 'ur' ? 'دکان' : 'Shop'}</Table.HeadCell>
              <Table.HeadCell>{language === 'ur' ? 'رقم' : 'Amount'}</Table.HeadCell>
              <Table.HeadCell>{language === 'ur' ? 'حالت' : 'Status'}</Table.HeadCell>
              <Table.HeadCell>{language === 'ur' ? 'ایکشن' : 'Actions'}</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {orders.map((order) => (
                <Table.Row key={order._id}>
                  <Table.Cell className="font-medium">#{order._id}</Table.Cell>
                  <Table.Cell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <div>
                      <p className="font-medium">{order.shop.name}</p>
                      <p className="text-sm text-gray-500">{order.shop.location}</p>
                    </div>
                  </Table.Cell>
                  <Table.Cell>Rs. {order.total.toLocaleString()}</Table.Cell>
                  <Table.Cell>{getStatusBadge(order.status)}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                      >
                        <HiEye className="h-4 w-4" />
                      </Button>
                      {order.status === 'delivered' && (
                        <Button
                          size="sm"
                          color="gray"
                          onClick={() => handleDownloadInvoice(order._id)}
                        >
                          <HiDownload className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Card>

      {/* Order Details Modal */}
      <Modal
        show={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        size="xl"
      >
        {selectedOrder && (
          <>
            <Modal.Header>
              {language === 'ur' ? 'آرڈر کی تفصیلات' : 'Order Details'}
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                {/* Order Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {language === 'ur' ? 'آرڈر نمبر' : 'Order'} #{selectedOrder._id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                {/* Order Progress */}
                <div className="space-y-2">
                  <Progress
                    progress={
                      selectedOrder.status === 'delivered' ? 100 :
                      selectedOrder.status === 'shipped' ? 75 :
                      selectedOrder.status === 'processing' ? 50 :
                      selectedOrder.status === 'pending' ? 25 : 0
                    }
                    size="lg"
                    color="purple"
                  />
                  <div className="grid grid-cols-4 text-center text-sm">
                    <div className={selectedOrder.status !== 'cancelled' ? 'text-purple-600' : ''}>
                      {language === 'ur' ? 'آرڈر دیا گیا' : 'Ordered'}
                    </div>
                    <div className={selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'text-purple-600' : ''}>
                      {language === 'ur' ? 'پروسیسنگ' : 'Processing'}
                    </div>
                    <div className={selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'text-purple-600' : ''}>
                      {language === 'ur' ? 'بھیج دیا گیا' : 'Shipped'}
                    </div>
                    <div className={selectedOrder.status === 'delivered' ? 'text-purple-600' : ''}>
                      {language === 'ur' ? 'پہنچا دیا گیا' : 'Delivered'}
                    </div>
                  </div>
                </div>

                {/* Shop Details */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">
                    {language === 'ur' ? 'دکان کی معلومات' : 'Shop Information'}
                  </h4>
                  <div className="space-y-1">
                    <p>{selectedOrder.shop.name}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.shop.location}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => {
                        window.location.href = `mailto:${selectedOrder.shop.email}`;
                      }}>
                        <HiChat className="h-4 w-4 mr-2" />
                        {language === 'ur' ? 'دکاندار سے رابطہ کریں' : 'Contact Seller'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-4">
                    {language === 'ur' ? 'آرڈر کی اشیاء' : 'Order Items'}
                  </h4>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item._id} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium">{item.name}</h5>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                          </p>
                        </div>
                        <p className="font-medium">
                          Rs. {(item.quantity * item.price).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{language === 'ur' ? 'سب ٹوٹل' : 'Subtotal'}</span>
                      <span>Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ur' ? 'شپنگ' : 'Shipping'}</span>
                      <span>Rs. {selectedOrder.shippingCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>{language === 'ur' ? 'کل رقم' : 'Total'}</span>
                      <span>Rs. {selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">
                    {language === 'ur' ? 'شپنگ کا پتہ' : 'Shipping Address'}
                  </h4>
                  <p>{selectedOrder.shippingAddress}</p>
                  {selectedOrder.trackingNumber && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">
                        {language === 'ur' ? 'ٹریکنگ نمبر' : 'Tracking Number'}:
                      </span>
                      <span className="ml-2 font-medium">{selectedOrder.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="flex justify-between w-full">
                <div>
                  {selectedOrder.status === 'delivered' && (
                    <Button
                      color="gray"
                      onClick={() => handleDownloadInvoice(selectedOrder._id)}
                    >
                      <HiDownload className="w-4 h-4 mr-2" />
                      {language === 'ur' ? 'رسید ڈاؤن لوڈ کریں' : 'Download Invoice'}
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  {selectedOrder.status === 'delivered' && (
                    <Button
                      color="gray"
                      onClick={() => {/* Handle return/refund request */}}
                    >
                      <HiOutlineReceiptRefund className="w-4 h-4 mr-2" />
                      {language === 'ur' ? 'واپسی کی درخواست' : 'Request Return'}
                    </Button>
                  )}
                  <Button
                    color="gray"
                    onClick={() => setShowOrderModal(false)}
                  >
                    {language === 'ur' ? 'بند کریں' : 'Close'}
                  </Button>
                </div>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default BuyerOrders;