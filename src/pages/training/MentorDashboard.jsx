import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  Button,
  Progress,
  Avatar,
  Badge,
  Table
} from 'flowbite-react';
import {
  HiUserGroup,
  HiCalendar,
  HiClock,
  HiChartBar,
  HiStar,
  HiChatAlt,
  HiVideoCamera,
  HiAcademicCap,
  HiClipboardList,
  HiCurrencyRupee
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

const MentorDashboard = () => {
  const language = useSelector(state => state.language) || 'en';
  const { currentUser } = useSelector(state => state.user);

  const [stats, setStats] = useState({
    activeMentees: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    averageRating: 0,
    earnings: 0,
    menteeProgress: []
  });

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/mentor/dashboard', {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
        const data = await response.json();
        setStats(data.stats);
        setUpcomingAppointments(data.appointments);
        setRecentActivities(data.activities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser.token]);

  const StatCard = ({ icon: Icon, label, value, change }) => (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {language === 'ur' ? label.ur : label.en}
          </p>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <Icon className="w-6 h-6 text-purple-600" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-4">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'ur' 
            ? `خوش آمدید، ${currentUser.name}`
            : `Welcome back, ${currentUser.name}`}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'ur'
            ? 'اپنے مینٹی کی پیش رفت دیکھیں اور آنے والے سیشنز کا نظم کریں'
            : 'Track your mentee progress and manage upcoming sessions'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={HiUserGroup}
          label={{ en: 'Active Mentees', ur: 'فعال طلباء' }}
          value={stats.activeMentees}
          change={12}
        />
        <StatCard
          icon={HiCalendar}
          label={{ en: 'Completed Sessions', ur: 'مکمل سیشنز' }}
          value={stats.completedSessions}
        />
        <StatCard
          icon={HiStar}
          label={{ en: 'Average Rating', ur: 'اوسط درجہ بندی' }}
          value={stats.averageRating.toFixed(1)}
        />
        <StatCard
          icon={HiCurrencyRupee}
          label={{ en: 'Total Earnings', ur: 'کل آمدنی' }}
          value={`Rs. ${stats.earnings.toLocaleString()}`}
          change={8}
        />
      </div>

      {/* Upcoming Sessions */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'ur' ? 'آنے والے سیشنز' : 'Upcoming Sessions'}
            </h2>
            <Link
              to="/mentor/sessions"
              className="text-sm text-purple-600 hover:underline"
            >
              {language === 'ur' ? 'سب دیکھیں' : 'View All'}
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    img={appointment.mentee.avatar}
                    alt={appointment.mentee.name}
                    rounded
                    size="md"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {appointment.mentee.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(appointment.dateTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">
                    <HiVideoCamera className="w-4 h-4 mr-2" />
                    {language === 'ur' ? 'شروع کریں' : 'Start'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Mentee Progress */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === 'ur' ? 'طالب علم کی پیش رفت' : 'Mentee Progress'}
            </h2>
          </div>
          <div className="space-y-4">
            {stats.menteeProgress.map((mentee, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar
                      img={mentee.avatar}
                      alt={mentee.name}
                      rounded
                      size="sm"
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {mentee.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {mentee.progress}%
                  </span>
                </div>
                <Progress
                  progress={mentee.progress}
                  size="sm"
                  color="purple"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {language === 'ur' ? 'حالیہ سرگرمیاں' : 'Recent Activities'}
          </h2>
        </div>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>
              {language === 'ur' ? 'سرگرمی' : 'Activity'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'طالب علم' : 'Mentee'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'تاریخ' : 'Date'}
            </Table.HeadCell>
            <Table.HeadCell>
              {language === 'ur' ? 'حالت' : 'Status'}
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {recentActivities.map((activity, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    {activity.type === 'session' && <HiVideoCamera className="w-5 h-5 text-blue-500" />}
                    {activity.type === 'message' && <HiChatAlt className="w-5 h-5 text-green-500" />}
                    {activity.type === 'assignment' && <HiClipboardList className="w-5 h-5 text-purple-500" />}
                    <span>{language === 'ur' ? activity.titleUrdu : activity.title}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Avatar
                      img={activity.mentee.avatar}
                      alt={activity.mentee.name}
                      rounded
                      size="sm"
                    />
                    <span>{activity.mentee.name}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {new Date(activity.date).toLocaleString()}
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    color={
                      activity.status === 'completed' ? 'success' :
                      activity.status === 'pending' ? 'warning' :
                      'info'
                    }
                  >
                    {activity.status}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
};

export default MentorDashboard;