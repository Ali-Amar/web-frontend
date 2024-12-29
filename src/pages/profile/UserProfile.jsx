import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Button,
  Avatar,
  Alert,
  Progress,
  Badge
} from 'flowbite-react';
import {
  HiUser,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiCake,
  HiPencil,
  HiCheck,
  HiExclamation,
  HiShoppingBag,
  HiAcademicCap,
  HiUserGroup
} from 'react-icons/hi';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { updateStart, updateSuccess, updateFailure } from '../../features/auth/authSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error, accessToken } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [profileStats, setProfileStats] = useState({
    totalOrders: 0,
    completedCourses: 0,
    mentorshipSessions: 0
  });

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
    locationUrdu: currentUser?.locationUrdu || '',
    birthday: currentUser?.birthday || '',
    bio: currentUser?.bio || '',
    bioUrdu: currentUser?.bioUrdu || ''
  });

  useEffect(() => {
    fetchUserStats();
  }, [currentUser]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/users/stats',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      const data = await response.json();
      if (response.ok) {
        setProfileStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      dispatch(updateStart());
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(
        'http://localhost:8080/api/users/avatar',
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: formData
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch(updateSuccess({ user: data.user, accessToken }));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      dispatch(updateFailure(err.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const response = await fetch(
        'http://localhost:8080/api/users/update-account',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      dispatch(updateSuccess({ user: data.user, accessToken }));
      setUpdateSuccess(true);
      setIsEditing(false);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      dispatch(updateFailure(err.message));
    }
  };

  const calculateProfileCompletion = () => {
    const fields = Object.values(formData);
    const completedFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div>
          <Card>
            <div className="text-center">
              <div className="relative inline-block">
                <Avatar
                  img={currentUser?.avatar}
                  size="xl"
                  rounded
                  className="w-32 h-32 mb-4"
                />
                <Button
                  size="xs"
                  color="gray"
                  className="absolute bottom-4 right-0 rounded-full"
                  onClick={() => document.getElementById('avatar-input').click()}
                >
                  <HiPencil className="w-3 h-3" />
                </Button>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentUser?.fullName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentUser?.role === 'seller' 
                  ? (language === 'ur' ? 'فروخت کنندہ' : 'Seller')
                  : currentUser?.role}
              </p>

              {/* Profile Completion */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'ur' ? 'پروفائل مکمل' : 'Profile Completion'}
                  </span>
                  <span>{calculateProfileCompletion()}%</span>
                </div>
                <Progress
                  progress={calculateProfileCompletion()}
                  color="purple"
                  size="sm"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profileStats.totalOrders}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'ur' ? 'آرڈرز' : 'Orders'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profileStats.completedCourses}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'ur' ? 'کورسز' : 'Courses'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profileStats.mentorshipSessions}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'ur' ? 'سیشنز' : 'Sessions'}
                </div>
              </div>
            </div>
          </Card>

          {/* Activity Overview */}
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'ur' ? 'حالیہ سرگرمی' : 'Recent Activity'}
            </h3>
            <div className="space-y-4">
              {[
                {
                  icon: HiShoppingBag,
                  text: language === 'ur' ? 'نیا آرڈر دیا' : 'Placed a new order',
                  time: '2 hours ago',
                  color: 'blue'
                },
                {
                  icon: HiAcademicCap,
                  text: language === 'ur' ? 'کورس مکمل کیا' : 'Completed a course',
                  time: '3 days ago',
                  color: 'green'
                },
                {
                  icon: HiUserGroup,
                  text: language === 'ur' ? 'رہنمائی سیشن' : 'Mentorship session',
                  time: '1 week ago',
                  color: 'purple'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center">
                  <div className={`p-2 rounded-lg bg-${activity.color}-100 dark:bg-${activity.color}-900/20 mr-3`}>
                    <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white">
                      {activity.text}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {language === 'ur' ? 'پروفائل کی تفصیلات' : 'Profile Details'}
              </h2>
              <Button
                color={isEditing ? 'gray' : 'purple'}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing 
                  ? (language === 'ur' ? 'منسوخ کریں' : 'Cancel')
                  : (language === 'ur' ? 'ترمیم کریں' : 'Edit')}
              </Button>
            </div>

            {error && (
              <Alert color="failure" icon={HiExclamation} className="mb-4">
                {error}
              </Alert>
            )}
            {updateSuccess && (
              <Alert color="success" icon={HiCheck} className="mb-4">
                {language === 'ur' 
                  ? 'پروفائل کامیابی سے اپ ڈیٹ ہو گئی'
                  : 'Profile updated successfully'}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label={language === 'ur' ? 'پورا نام' : 'Full Name'}
                  icon={HiUser}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
                <Input
                  label={language === 'ur' ? 'ای میل' : 'Email'}
                  icon={HiMail}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
                <Input
                  label={language === 'ur' ? 'فون نمبر' : 'Phone'}
                  icon={HiPhone}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <Input
                  label={language === 'ur' ? 'تاریخ پیدائش' : 'Birthday'}
                  icon={HiCake}
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <div className="md:col-span-2">
                  <Input
                    label={language === 'ur' ? 'مقام (انگریزی)' : 'Location (English)'}
                    icon={HiLocationMarker}
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label={language === 'ur' ? 'مقام (اردو)' : 'Location (Urdu)'}
                    icon={HiLocationMarker}
                    name="locationUrdu"
                    value={formData.locationUrdu}
                    onChange={handleChange}
                    disabled={!isEditing}
                    dir="rtl"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label={language === 'ur' ? 'تعارف (انگریزی)' : 'Bio (English)'}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    multiline
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label={language === 'ur' ? 'تعارف (اردو)' : 'Bio (Urdu)'}
                    name="bioUrdu"
                    value={formData.bioUrdu}
                    onChange={handleChange}
                    disabled={!isEditing}
                    multiline
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    gradientDuoTone="purpleToBlue"
                    disabled={loading}
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <HiCheck className="w-5 h-5 mr-2" />
                        {language === 'ur' ? 'محفوظ کریں' : 'Save Changes'}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </Card>

          {/* Achievements/Badges Section */}
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'ur' ? 'کامیابیاں' : 'Achievements'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  title: language === 'ur' ? 'نئے خریدار' : 'New Buyer',
                  description: language === 'ur' ? 'پہلی خریداری مکمل' : 'Completed first purchase',
                  color: 'blue'
                },
                {
                  title: language === 'ur' ? 'سیکھنے والا' : 'Learner',
                  description: language === 'ur' ? 'پہلا کورس مکمل' : 'Completed first course',
                  color: 'green'
                },
                {
                  title: language === 'ur' ? 'فعال رکن' : 'Active Member',
                  description: language === 'ur' ? '30 دن سے زیادہ' : '30+ days active',
                  color: 'purple'
                },
                {
                  title: language === 'ur' ? 'مثالی صارف' : 'Top Rated',
                  description: language === 'ur' ? '5 ستارہ درجہ بندی' : '5-star rating',
                  color: 'yellow'
                }
              ].map((badge, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg bg-${badge.color}-50 dark:bg-${badge.color}-900/20 text-center`}
                >
                  <Badge color={badge.color} size="lg" className="mb-2">
                    {badge.title}
                  </Badge>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;