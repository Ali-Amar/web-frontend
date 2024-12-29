import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Table,
  Button,
  Badge,
  Card,
  TextInput,
  Select,
  Alert,
  Modal,
  Spinner,
  Pagination
} from 'flowbite-react';
import {
  HiSearch,
  HiFilter,
  HiEye,
  HiPhone,
  HiMail,
  HiLocationMarker,
  HiClock,
  HiChat
} from 'react-icons/hi';

const OrderManager = () => {
  const { currentUser, accessToken } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateRange: 'all'
  });

  // Order statuses with translations
  const orderStatuses = [
    { value: 'pending', label: 'Pending', labelUrdu: 'زیر التواء', color: 'warning' },
    { value: 'confirmed', label: 'Confirmed', labelUrdu: 'تصدیق شدہ', color: 'info' },
    { value: 'processing', label: 'Processing', labelUrdu: 'پراسیسنگ', color: 'purple' },
    { value: 'shipped', label: 'Shipped', labelUrdu: 'بھیج دیا گیا', color: 'blue' },
    { value: 'delivered', label: 'Delivered', labelUrdu: 'پہنچا دیا گیا', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', labelUrdu: 'منسوخ', color: 'failure' }
  ];

  useEffect(() => {
    fetchOrders();
  }, [currentPage, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        ...filters
      });
      
      const response = await fetch(
        `http://localhost:8080/api/orders?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      // Update orders list
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));

      // If updating selected order, update it too
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusObj = orderStatuses.find(s => s.value === status);
    return (
      <Badge color={statusObj?.color}>
        {language === 'ur' ? statusObj?.labelUrdu : statusObj?.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
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
            <option value="">
              {language === 'ur' ? 'تمام حالات' : 'All Statuses'}
            </option>
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
      </Card>

      {error && (
        <Alert color="failure">
          {error}
        </Alert>
      )}

      {/* Orders Table */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {language === 'ur' ? 'کوئی آرڈر نہیں ملا' : 'No Orders Found'}
            </h3>
            <p className="text-gray-500">
              {language === 'ur' 
                ? 'مختلف فلٹرز استعمال کر کے دیکھیں'
                : 'Try different filters or check back later'}
            </p>
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
            <Table.Body className="divide-y">
              {orders.map((order) => (
                <Table.Row key={order._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{order._id}</Table.Cell>
                  <Table.Cell>{formatDate(order.createdAt)}</Table.Cell>
                  <Table.Cell>
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-gray-500">{order.customer.email}</p>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    Rs. {order.totalAmount.toLocaleString()}
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
                          setShowOrderModal(true);
                        }}
                      >
                        <HiEye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        color="gray"
                        onClick={() => {
                          window.location.href = `mailto:${order.customer.email}`;
                        }}
                      >
                        <HiMail className="w-4 h-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
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
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <Select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                  >
                    {orderStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {language === 'ur' ? status.labelUrdu : status.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Customer Details */}
                <div>
                  <h4 className="font-medium mb-2">
                    {language === 'ur' ? 'گاہک کی تفصیلات' : 'Customer Details'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <HiUser className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{selectedOrder.customer.name}</p>
                        <p className="text-sm text-gray-500">{selectedOrder.customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiPhone className="w-5 h-5 text-gray-400" />
                      <p>{selectedOrder.customer.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h4 className="font-medium mb-2">
                    {language === 'ur' ? 'ترسیل کا پتہ' : 'Shipping Address'}
                  </h4>
                  <div className="flex items-start gap-2">
                    <HiLocationMarker className="w-5 h-5 text-gray-400 mt-1" />
                    <p className="text-gray-600">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-2">
                    {language === 'ur' ? 'آرڈر کی اشیاء' : 'Order Items'}
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item._id} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              {language === 'ur' ? 'تعداد' : 'Quantity'}: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                          Rs. {(item.price * item.quantity).toLocaleString()}
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
                      <span>Rs. {selectedOrder.totalAmount.toLocaleString()}</span>
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
                  gradientDuoTone="purpleToBlue"
                  onClick={() => {
                    window.location.href = `mailto:${selectedOrder.customer.email}`;
                  }}
                >
                  <HiMail className="w-4 h-4 mr-2" />
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

export default OrderManager;