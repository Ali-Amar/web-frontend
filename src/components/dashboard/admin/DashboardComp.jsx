import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  Progress,
  Table,
  Button,
  Badge
} from 'flowbite-react';
import { Link } from 'react-router-dom';
import { 
  HiShoppingBag,
  HiUserGroup,
  HiAcademicCap,
  HiChatAlt,
  HiChartBar,
  HiLightningBolt,
  HiLocationMarker
} from 'react-icons/hi';

const DashboardComp = () => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const { language } = useSelector((state) => state.language) || 'en';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeMentorships: 0,
    completedTrainings: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard statistics
        const statsResponse = await fetch("http://localhost:8080/api/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const statsData = await statsResponse.json();
        
        if (statsResponse.ok) {
          setStats(statsData.data);
        }

        // Fetch recent activities
        const activitiesResponse = await fetch("http://localhost:8080/api/dashboard/activities", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const activitiesData = await activitiesResponse.json();
        
        if (activitiesResponse.ok) {
          setRecentActivities(activitiesData.data);
        }

        // Fetch upcoming events
        const eventsResponse = await fetch("http://localhost:8080/api/dashboard/events", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const eventsData = await eventsResponse.json();
        
        if (eventsResponse.ok) {
          setUpcomingEvents(eventsData.data);
        }

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && accessToken) {
      fetchDashboardData();
    }
  }, [currentUser, accessToken]);

  const getStatCards = () => {
    const baseStats = [
      {
        icon: HiShoppingBag,
        title: language === 'ur' ? 'کل مصنوعات' : 'Total Products',
        value: stats.totalProducts,
        color: 'blue'
      },
      {
        icon: HiUserGroup,
        title: language === 'ur' ? 'فعال رہنمائی' : 'Active Mentorships',
        value: stats.activeMentorships,
        color: 'purple'
      },
      {
        icon: HiAcademicCap,
        title: language === 'ur' ? 'مکمل تربیت' : 'Completed Trainings',
        value: stats.completedTrainings,
        color: 'green'
      }
    ];

    // Add role-specific stats
    if (currentUser?.role === 'seller') {
      baseStats.push({
        icon: HiChartBar,
        title: language === 'ur' ? 'کل آمدنی' : 'Total Revenue',
        value: `Rs. ${stats.totalRevenue?.toLocaleString()}`,
        color: 'yellow'
      });
    }

    if (currentUser?.role === 'mentor') {
      baseStats.push({
        icon: HiLightningBolt,
        title: language === 'ur' ? 'فعال طالب علم' : 'Active Students',
        value: stats.activeStudents,
        color: 'red'
      });
    }

    return baseStats;
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'ur' 
            ? `خوش آمدید، ${currentUser?.fullName}`
            : `Welcome back, ${currentUser?.fullName}`}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'ur'
            ? 'اپنے کاروبار کی پیش رفت دیکھیں'
            : 'Here is an overview of your business progress'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {getStatCards().map((stat, index) => (
          <Card key={index}>
            <div className="flex items-center">
              <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/20 mr-4`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activities & Upcoming Events */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'ur' ? 'حالیہ سرگرمیاں' : 'Recent Activities'}
            </h2>
            <Link 
              to="/dashboard/activities"
              className="text-sm text-blue-600 hover:underline"
            >
              {language === 'ur' ? 'سب دیکھیں' : 'View All'}
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className={`p-2 rounded-full bg-${activity.color}-100 dark:bg-${activity.color}-900/20`}>
                  <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
                </div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {language === 'ur' ? activity.titleUrdu : activity.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'ur' ? 'آنے والے ایونٹس' : 'Upcoming Events'}
            </h2>
            <Link 
              to="/community/events"
              className="text-sm text-blue-600 hover:underline"
            >
              {language === 'ur' ? 'سب دیکھیں' : 'View All'}
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div 
                key={index}
                className="flex flex-col gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {language === 'ur' ? event.titleUrdu : event.title}
                  </h3>
                  <Badge color={event.type === 'training' ? 'purple' : 'blue'}>
                    {language === 'ur' ? event.typeUrdu : event.type}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <HiLocationMarker className="w-4 h-4 mr-1" />
                  {language === 'ur' ? event.locationUrdu : event.location}
                </div>
                <div className="text-xs text-gray-500">
                  {event.date} • {event.time}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {language === 'ur' ? 'فوری اقدامات' : 'Quick Actions'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: HiShoppingBag,
              label: language === 'ur' ? 'مصنوعات شامل کریں' : 'Add Product',
              link: '/dashboard/products/add',
              color: 'blue'
            },
            {
              icon: HiChatAlt,
              label: language === 'ur' ? 'رہنما سے رابطہ کریں' : 'Contact Mentor',
              link: '/mentorship',
              color: 'purple'
            },
            {
              icon: HiAcademicCap,
              label: language === 'ur' ? 'تربیت شروع کریں' : 'Start Training',
              link: '/training',
              color: 'green'
            },
            {
              icon: HiUserGroup,
              label: language === 'ur' ? 'کمیونٹی میں شامل ہوں' : 'Join Community',
              link: '/community',
              color: 'pink'
            }
          ].map((action, index) => (
            <Link 
              key={index}
              to={action.link}
              className={`flex flex-col items-center p-4 rounded-lg bg-${action.color}-50 dark:bg-${action.color}-900/20 hover:bg-${action.color}-100 dark:hover:bg-${action.color}-900/30 transition-colors`}
            >
              <action.icon className={`w-6 h-6 text-${action.color}-600 mb-2`} />
              <span className="text-sm text-center text-gray-900 dark:text-white">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardComp;