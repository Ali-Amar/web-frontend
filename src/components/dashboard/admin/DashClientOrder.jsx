import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Table,
  Button,
  Card,
  TextInput,
  Select,
  Badge,
  Modal,
  Alert,
  Progress,
  Avatar
} from 'flowbite-react';
import {
  HiSearch,
  HiFilter,
  HiCheck,
  HiX,
  HiExclamation,
  HiEye,
  HiClock,
  HiTruck,
  HiCurrencyRupee,
  HiLocationMarker
} from 'react-icons/hi';

const DashClientOrder = () => {
  const { language } = useSelector((state) => state.language) || 'en';
  const { accessToken } = useSelector((state) => state.user);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    paymentStatus: '',
    dateRange: ''
  });

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(
          `http://localhost:8080/api/admin/orders?${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        if (!response.ok) throw new Error('Failed to fetch orders');

        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filters, accessToken]);

  // Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/orders/${orderId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!response.ok) throw new Error('Failed to update order status');

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'warning',
      processing: 'info',
      shipped: 'purple',
      delivered: 'success',
      cancelled: 'failure'
    };

    const statusTranslations = {
      pending: { en: 'Pending', ur: 'زیر التواء' },
      processing: { en: 'Processing', ur: 'پراسیسنگ' },
      shipped: { en: 'Shipped', ur: 'بھیج دیا گیا' },
      delivered: { en: 'Delivered', ur: 'پہنچا دیا گیا' },
      cancelled: { en: 'Cancelled', ur: 'منسوخ' }
    };

    return (
      <Badge color={statusColors[status]}>
        {language === 'ur' ? statusTranslations[status]?.ur : statusTranslations[status]?.en}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusColors = {
      paid: 'success',
      pending: 'warning',
      failed: 'failure'
    };

    const statusTranslations = {
      paid: { en: 'Paid', ur: 'ادا شدہ' },
      pending: { en: 'Pending', ur: 'زیر التواء' },
      failed: { en: 'Failed', ur: 'ناکام' }
    };

    return (
      <Badge color={statusColors[status]}>
        {language === 'ur' ? statusTranslations[status]?.ur : statusTranslations[status]?.en}
      </Badge>
    );
  };

  // Calculate order progress percentage
  const getOrderProgress = (status) => {
    const stages = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = stages.indexOf(status);
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / stages.length) * 100;
  };

  return (
    <div className="p-4">
      <Card>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {language === 'ur' ? 'آرڈرز' : 'Orders'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'ur' 
                ? 'تمام کلائنٹ آرڈرز کا انتظام کریں'
                : 'Manage all client orders'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <TextInput
            icon={HiSearch}
            placeholder={language === 'ur' ? 'آرڈر آئی ڈی تلاش کریں...' : 'Search Order ID...'}
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <Select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">
              {language === 'ur' ? 'تمام حالات' : 'All Status'}
            </option>
            <option value="pending">
              {language === 'ur' ? 'زیر التواء' : 'Pending'}
            </option>
            <option value="processing">
              {language === 'ur' ? 'پراسیسنگ' : 'Processing'}
            </option>
            <option value="shipped">
              {language === 'ur' ? 'بھیج دیا گیا' : 'Shipped'}
            </option>
            <option value="delivered">
              {language === 'ur' ? 'پہنچا دیا گیا' : 'Delivered'}
            </option>
          </Select>
          <Select
            value={filters.paymentStatus}
            onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
          >
            <option value="">
              {language === 'ur' ? 'تمام ادائیگی حالات' : 'All Payment Status'}
            </option>
            <option value="paid">
              {language === 'ur' ? 'ادا شدہ' : 'Paid'}
            </option>
            <option value="pending">
              {language === 'ur' ? 'زیر التواء' : 'Pending'}
            </option>
            <option value="failed">
              {language === 'ur' ? 'ناکام' : 'Failed'}
            </option>
          </Select>
          <Select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
          >
            <option value="">
              {language === 'ur' ? 'تمام تاریخیں' : 'All Dates'}
            </option>
            <option value="today">
              {language === 'ur' ? 'آج' : 'Today'}
            </option>
            <option value="week">
              {language === 'ur' ? 'اس ہفتے' : 'This Week'}
            </option>
            <option value="month">
              {language === 'ur' ? 'اس مہینے' : 'This Month'}
            </option>
          </Select>
        </div>

        {error && (
          <Alert color="failure" icon={HiExclamation} className="mb-4">
            {error}
          </Alert>
        )}

        {/* Orders Table */}
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>
              {language === 'ur' ? 'آرڈر آئی ڈی' : 'Order ID'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'صارف' : 'Customer'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'اشیاء' : 'Items'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'کل رقم' : 'Total'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'ادائیگی' : 'Payment'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'حالت' : 'Status'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'اقدامات' : 'Actions'}
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {orders.map((order) => (
              <Table.Row key={order._id}>
                <Table.Cell>
                  <span className="font-mono text-sm">
                    #{order._id.slice(-6)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      img={order.user.avatar}
                      alt={order.user.name}
                      size="sm"
                      rounded
                    />
                    <div>
                      <p className="font-medium">{order.user.name}</p>
                      <p className="text-sm text-gray-500">{order.user.email}</p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Badge color="gray">
                    {order.items.length} {language === 'ur' ? 'اشیاء' : 'items'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center">
                    <HiCurrencyRupee className="w-4 h-4 mr-1" />
                    {order.total.toLocaleString()}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {getPaymentStatusBadge(order.paymentStatus)}
                </Table.Cell>
                <Table.Cell>
                  {getStatusBadge(order.status)}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color="gray"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetailsModal(true);
                      }}
                    >
                      <HiEye className="w-4 h-4" />
                    </Button>
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        color="success"
                        onClick={() => handleStatusUpdate(order._id, 'processing')}
                      >
                        <HiCheck className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>

      {/* Order Details Modal */}
      <Modal
        show={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        size="xl"
      >
        <Modal.Header>
          {language === 'ur' ? 'آرڈر کی تفصیلات' : 'Order Details'}
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">
                    {language === 'ur' ? 'آرڈر کی پیش رفت' : 'Order Progress'}
                  </span>
                  <span>{Math.round(getOrderProgress(selectedOrder.status))}%</span>
                </div>
                <Progress
                  progress={getOrderProgress(selectedOrder.status)}
                  size="lg"
                  color="blue"
                />
              </div>

              {/* Customer Details */}
              <div>
                <h4 className="font-medium mb-2">
                  {language === 'ur' ? 'صارف کی تفصیلات' : 'Customer Details'}
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {language === 'ur' ? 'نام' : 'Name'}
                    </p>
                    <p className="font-medium">{selectedOrder.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {language === 'ur' ? 'ای میل' : 'Email'}
                    </p>
                    <p className="font-medium">{selectedOrder.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {language === 'ur' ? 'فون نمبر' : 'Phone'}
                    </p>
                    <p className="font-medium">{selectedOrder.user.phone}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Details */}
              <div>
                <h4 className="font-medium mb-2">
                  {language === 'ur' ? 'ترسیل کی تفصیلات' : 'Shipping Details'}
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <HiLocationMarker className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedOrder.shipping.address}</p>
                      <p className="text-sm text-gray-500">{selectedOrder.shipping.city}, {selectedOrder.shipping.postalCode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium mb-2">
                  {language === 'ur' ? 'آرڈر کی اشیاء' : 'Order Items'}
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium">{item.name}</h5>
                        <p className="text-sm text-gray-500">
                          {language === 'ur' ? 'مقدار' : 'Quantity'}: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          Rs. {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <h4 className="font-medium mb-2">
                  {language === 'ur' ? 'ادائیگی کا خلاصہ' : 'Payment Summary'}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      {language === 'ur' ? 'ذیلی کل رقم' : 'Subtotal'}
                    </span>
                    <span>Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      {language === 'ur' ? 'ترسیل کے اخراجات' : 'Shipping Fee'}
                    </span>
                    <span>Rs. {selectedOrder.shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2 border-t">
                    <span>{language === 'ur' ? 'کل رقم' : 'Total'}</span>
                    <span>Rs. {selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedOrder && selectedOrder.status === 'pending' && (
            <Button
              gradientDuoTone="purpleToBlue"
              onClick={() => handleStatusUpdate(selectedOrder._id, 'processing')}
            >
              <HiCheck className="w-5 h-5 mr-2" />
              {language === 'ur' ? 'آرڈر منظور کریں' : 'Approve Order'}
            </Button>
          )}
          <Button
            color="gray"
            onClick={() => setShowDetailsModal(false)}
          >
            {language === 'ur' ? 'بند کریں' : 'Close'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DashClientOrder;