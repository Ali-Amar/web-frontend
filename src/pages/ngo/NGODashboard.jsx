import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  Progress,
  Table,
  Button,
  Badge,
  Avatar
} from 'flowbite-react';
import { Link } from 'react-router-dom';
import {
  HiUserGroup,
  HiAcademicCap,
  HiLocationMarker,
  HiCurrencyRupee,
  HiChartBar,
  HiCalendar,
  HiClock,
  HiDocumentReport
} from 'react-icons/hi';

const NGODashboard = () => {
  const { currentUser, accessToken } = useSelector((state) => state.user);
  const { language } = useSelector((state) => state.language) || 'en';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalParticipants: 0,
    activePrograms: 0,
    totalLocations: 0,
    totalFunding: 0,
    completedTrainings: 0,
    impactMetrics: {
      businessesLaunched: 0,
      averageIncrease: 0,
      skillsImproved: 0
    }
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch NGO statistics
        const statsResponse = await fetch("http://localhost:8080/api/ngo/stats", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const statsData = await statsResponse.json();
        
        if (statsResponse.ok) {
          setStats(statsData.data);
        }

        // Fetch recent activities
        const activitiesResponse = await fetch("http://localhost:8080/api/ngo/activities", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const activitiesData = await activitiesResponse.json();
        
        if (activitiesResponse.ok) {
          setRecentActivities(activitiesData.data);
        }

        // Fetch upcoming events
        const eventsResponse = await fetch("http://localhost:8080/api/ngo/events", {
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

  // Stats Cards Component
  const StatsCard = ({ title, titleUrdu, value, icon: Icon, color }) => (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {language === 'ur' ? titleUrdu : title}
          </p>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div className={`p-3 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'ur' 
            ? `خوش آمدید، ${currentUser?.organizationName || currentUser?.fullName}`
            : `Welcome back, ${currentUser?.organizationName || currentUser?.fullName}`}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'ur'
            ? 'اپنے پروگرامز اور خواتین کارآفرینوں کی پیشرفت کا جائزہ لیں'
            : 'Monitor your programs and women entrepreneurs\' progress'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Participants"
          titleUrdu="کل شرکاء"
          value={stats.totalParticipants}
          icon={HiUserGroup}
          color="blue"
        />
        <StatsCard
          title="Active Programs"
          titleUrdu="فعال پروگرامز"
          value={stats.activePrograms}
          icon={HiAcademicCap}
          color="purple"
        />
        <StatsCard
          title="Locations Covered"
          titleUrdu="مقامات"
          value={stats.totalLocations}
          icon={HiLocationMarker}
          color="green"
        />
        <StatsCard
          title="Total Funding"
          titleUrdu="کل فنڈنگ"
          value={`Rs. ${stats.totalFunding?.toLocaleString()}`}
          icon={HiCurrencyRupee}
          color="yellow"
        />
      </div>

      {/* Impact Metrics */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {language === 'ur' ? 'اثر کے اعداد و شمار' : 'Impact Metrics'}
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {language === 'ur' ? 'کاروبار شروع کیے' : 'Businesses Launched'}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stats.impactMetrics.businessesLaunched}
              </span>
            </div>
            <Progress progress={75} color="purple" size="lg" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {language === 'ur' ? 'آمدنی میں اضافہ' : 'Income Increase'}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stats.impactMetrics.averageIncrease}%
              </span>
            </div>
            <Progress progress={65} color="green" size="lg" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {language === 'ur' ? 'مہارتوں میں بہتری' : 'Skills Improved'}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stats.impactMetrics.skillsImproved}%
              </span>
            </div>
            <Progress progress={85} color="blue" size="lg" />
          </div>
        </div>
      </Card>

      {/* Recent Activities & Upcoming Events */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'ur' ? 'حالیہ سرگرمیاں' : 'Recent Activities'}
            </h2>
            <Link 
              to="/ngo/activities"
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
              {language === 'ur' ? 'آنے والے پروگرامز' : 'Upcoming Programs'}
            </h2>
            <Link 
              to="/ngo/programs"
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
              icon: HiAcademicCap,
              label: language === 'ur' ? 'نیا پروگرام' : 'New Program',
              link: '/ngo/programs/new',
              color: 'blue'
            },
            {
              icon: HiUserGroup,
              label: language === 'ur' ? 'شرکاء' : 'Participants',
              link: '/ngo/participants',
              color: 'purple'
            },
            {
              icon: HiChartBar,
              label: language === 'ur' ? 'رپورٹس' : 'Reports',
              link: '/ngo/reports',
              color: 'green'
            },
            {
              icon: HiLocationMarker,
              label: language === 'ur' ? 'مقامات' : 'Locations',
              link: '/ngo/locations',
              color: 'yellow'
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

export default NGODashboard;