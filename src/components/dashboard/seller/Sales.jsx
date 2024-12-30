import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  Button,
  Select,
  Spinner,
  Alert
} from 'flowbite-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  HiCurrencyRupee,
  HiShoppingBag,
  HiUserGroup,
  HiTrendingUp,
  HiCalendar
} from 'react-icons/hi';

const Sales = () => {
  const { currentUser, accessToken } = useSelector(state => state.user);
  const { language } = useSelector(state => state.language) || 'en';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [productPerformance, setProductPerformance] = useState([]);
  const [customerLocations, setCustomerLocations] = useState([]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#808080'];

  useEffect(() => {
    fetchSalesAnalytics();
  }, [timeRange]);

  const fetchSalesAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/seller/sales?timeRange=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setStats(data.stats);
      setSalesData(data.salesData);
      setProductPerformance(data.productPerformance);
      setCustomerLocations(data.customerLocations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `Rs. ${value.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="failure">
        {error}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Filter */}
      <div className="flex justify-end">
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="w-48"
        >
          <option value="week">
            {language === 'ur' ? 'ہفتہ' : 'Last Week'}
          </option>
          <option value="month">
            {language === 'ur' ? 'مہینہ' : 'Last Month'}
          </option>
          <option value="year">
            {language === 'ur' ? 'سال' : 'Last Year'}
          </option>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: language === 'ur' ? 'کل آمدنی' : 'Total Revenue',
            value: formatCurrency(stats.totalRevenue),
            icon: HiCurrencyRupee,
            color: 'blue',
            change: '+12%'
          },
          {
            title: language === 'ur' ? 'کل آرڈرز' : 'Total Orders',
            value: stats.totalOrders,
            icon: HiShoppingBag,
            color: 'green',
            change: '+8%'
          },
          {
            title: language === 'ur' ? 'کل گاہک' : 'Total Customers',
            value: stats.totalCustomers,
            icon: HiUserGroup,
            color: 'purple',
            change: '+15%'
          },
          {
            title: language === 'ur' ? 'اوسط آرڈر ویلیو' : 'Average Order Value',
            value: formatCurrency(stats.averageOrderValue),
            icon: HiTrendingUp,
            color: 'yellow',
            change: '+5%'
          }
        ].map((metric, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  {metric.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </h3>
              </div>
              <div className={`p-3 rounded-full bg-${metric.color}-100 dark:bg-${metric.color}-900/20`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Sales Trend */}
      <Card>
        <h3 className="text-xl font-semibold mb-4">
          {language === 'ur' ? 'فروخت کا رجحان' : 'Sales Trend'}
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                name={language === 'ur' ? 'فروخت' : 'Sales'}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#82ca9d"
                name={language === 'ur' ? 'آرڈرز' : 'Orders'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Product Performance */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold mb-4">
            {language === 'ur' ? 'مصنوعات کی کارکردگی' : 'Product Performance'}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="sales" 
                  fill="#8884d8"
                  name={language === 'ur' ? 'فروخت' : 'Sales'}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#82ca9d"
                  name={language === 'ur' ? 'آمدنی' : 'Revenue'}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Customer Locations */}
        <Card>
          <h3 className="text-xl font-semibold mb-4">
            {language === 'ur' ? 'گاہکوں کے مقامات' : 'Customer Locations'}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerLocations}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey={language === 'ur' ? 'nameUrdu' : 'name'}
                >
                  {customerLocations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Sales;