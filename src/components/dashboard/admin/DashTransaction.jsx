import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Table,
  Button,
  Card,
  Badge,
  Alert,
  Spinner,
  Progress
} from 'flowbite-react';
import {
  HiCurrencyRupee,
  HiOutlineDocumentText,
  HiOutlineRefresh,
  HiOutlinePrinter,
  HiChevronRight
} from 'react-icons/hi';

const DashTransaction = () => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const { language } = useSelector((state) => state.language) || 'en';
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    fetchOrders();
  }, [accessToken]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/order/getAllOrders", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.data);
        // Calculate stats
        const total = data.data.reduce((sum, order) => sum + order.total, 0);
        const pending = data.data.filter(order => order.delivery_status === 'pending').length;
        const completed = data.data.filter(order => order.delivery_status === 'completed').length;
        
        setStats({
          totalOrders: data.data.length,
          totalRevenue: total,
          pendingOrders: pending,
          completedOrders: completed
        });
      }
    } catch (error) {
      setError(language === 'ur' 
        ? 'آرڈرز کی معلومات حاصل کرنے میں مسئلہ'
        : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Stats Cards Component
  const StatsCard = ({ title, value, icon: Icon }) => (
    <Card className="flex-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{value}</h3>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="failure" className="mb-4">
        {error}
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title={language === 'ur' ? 'کل آرڈرز' : 'Total Orders'}
          value={stats.totalOrders}
          icon={HiOutlineDocumentText}
        />
        <StatsCard
          title={language === 'ur' ? 'کل آمدنی' : 'Total Revenue'}
          value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
          icon={HiCurrencyRupee}
        />
        <StatsCard
          title={language === 'ur' ? 'زیر التواء آرڈرز' : 'Pending Orders'}
          value={stats.pendingOrders}
          icon={HiOutlineRefresh}
        />
        <StatsCard
          title={language === 'ur' ? 'مکمل آرڈرز' : 'Completed Orders'}
          value={stats.completedOrders}
          icon={HiOutlinePrinter}
        />
      </div>

      {/* Orders List */}
      <Card>
        <div className="relative overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>{language === 'ur' ? 'آرڈر نمبر' : 'Order ID'}</Table.HeadCell>
              <Table.HeadCell>{language === 'ur' ? 'صارف' : 'Customer'}</Table.HeadCell>
              <Table.HeadCell>{language === 'ur' ? 'رقم' : 'Amount'}</Table.HeadCell>
              <Table.HeadCell>{language === 'ur' ? 'حالت' : 'Status'}</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {orders.map((order) => (
                <Table.Row key={order._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{order._id}</Table.Cell>
                  <Table.Cell>
                    <div>
                      <p className="font-medium">{order.shipping.name}</p>
                      <p className="text-sm text-gray-500">{order.shipping.email}</p>
                    </div>
                  </Table.Cell>
                  <Table.Cell>Rs. {order.total.toLocaleString()}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={
                        order.delivery_status === 'completed' ? 'success' :
                        order.delivery_status === 'processing' ? 'warning' : 
                        'info'
                      }
                    >
                      {order.delivery_status}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default DashTransaction;