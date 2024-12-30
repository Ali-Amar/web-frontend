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
  Avatar
} from 'flowbite-react';
import {
  HiSearch,
  HiAdjustments,
  HiEye,
  HiMail,
  HiLocationMarker,
  HiPhone,
  HiClock
} from 'react-icons/hi';

const Orders = () => {
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
      const response = await fetch('/api/seller/orders?' + new URLSearchParams(filters));
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/seller/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
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

  return (
    <div className="p-4">
      <Card>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ur' ? 'آرڈرز' : 'Orders'}
          </h2>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <TextInput
                icon={HiSearch}
                placeholder={language === 'ur' ? 'آرڈر نمبر یا گاہک کا نام تلاش کریں...' : 'Search order ID or customer name...'}
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
        ) : (
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>{language === 'ur' ? 'آرڈر نمبر' : 'Order ID'}</Table.HeadCell>
              <Table.HeadCell>{language === 'ur' ? 'تاریخ' : 'Date'}</Table.HeadCell>
              <Table.HeadCell>{language === 'ur' ? 'گاہک' : 'Customer'}</Table.HeadCell>
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
                    <div className="flex items-center gap-2">
                      <Avatar size="sm" img={order.customer.avatar} />
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-sm text-gray-500">{order.customer.email}</p>
                      </div>
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
                      <Button
                        size="sm"
                        color="gray"
                        onClick={() => {
                          window.location.href = `mailto:${order.customer.email}`;
                        }}
                      >
                        <HiMail className="h-4 w-4" />
                      </Button>
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
                {/* Order Status */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {language === 'ur' ? 'آرڈر نمبر' : 'Order'} #{selectedOrder._id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                    className="w-40"
                  >
                    {orderStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {language === 'ur' ? status.labelUrdu : status.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">
                      {language === 'ur' ? 'گاہک کی معلومات' : 'Customer Information'}
                    </h4>
                    <p className="flex items-center gap-2">
                      <HiPhone className="w-4 h-4 text-gray-400" />
                      {selectedOrder.customer.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <HiMail className="w-4 h-4 text-gray-400" />
                      {selectedOrder.customer.email}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">
                      {language === 'ur' ? 'شپنگ کا پتہ' : 'Shipping Address'}
                    </h4>
                    <p className="flex items-center gap-2">
                      <HiLocationMarker className="w-4 h-4 text-gray-400" />
                      {selectedOrder.shippingAddress}
                    </p>
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
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="flex justify-end gap-2">
                <Button
                  color="gray"
                  onClick={() => setShowOrderModal(false)}
                >
                  {language === 'ur' ? 'بند کریں' : 'Close'}
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = `mailto:${selectedOrder.customer.email}`;
                  }}
                >
                  {language === 'ur' ? 'گاہک سے رابطہ کریں' : 'Contact Customer'}
                </Button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Orders;