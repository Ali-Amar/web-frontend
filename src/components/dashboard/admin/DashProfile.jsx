import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  TextInput,
  Button,
  Alert,
  Avatar,
  Progress,
  Select
} from 'flowbite-react';
import {
  HiUser,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiOfficeBuilding,
  HiPencil,
  HiCheck,
  HiExclamation
} from 'react-icons/hi';
import {
  updateStart,
  updateSuccess,
  updateFailure
} from '../../../features/auth/authSlice';

const DashProfile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error, accessToken } = useSelector((state) => state.user);
  const { language } = useSelector((state) => state.language)
  
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
    locationUrdu: currentUser?.locationUrdu || '',
    businessName: currentUser?.businessName || '',
    businessNameUrdu: currentUser?.businessNameUrdu || '',
    businessType: currentUser?.businessType || '',
    bio: currentUser?.bio || '',
    bioUrdu: currentUser?.bioUrdu || ''
  });

  const [updateSuccess, setUpdateSuccess] = useState(false);

  const businessTypes = [
    { value: 'handicrafts', label: 'Handicrafts', labelUrdu: 'دستکاری' },
    { value: 'textiles', label: 'Textiles', labelUrdu: 'کپڑے' },
    { value: 'food', label: 'Food Products', labelUrdu: 'کھانے کی اشیاء' },
    { value: 'agriculture', label: 'Agriculture', labelUrdu: 'زراعت' }
  ];

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
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
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      const { user } = data.data;
      dispatch(updateSuccess({ user, accessToken }));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateFailure(error.message));
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
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      const { user } = data.data;
      dispatch(updateSuccess({ user, accessToken }));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar
              img={currentUser?.avatar}
              size="xl"
              rounded
              className="w-24 h-24 cursor-pointer"
              onClick={() => document.getElementById('avatar-input').click()}
            />
            <Button
              size="xs"
              color="gray"
              className="absolute bottom-0 right-0 rounded-full"
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
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {language === 'ur' ? 'پروفائل' : 'Profile'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'ur' 
                ? 'اپنی پروفائل کی معلومات کو اپ ڈیٹ کریں'
                : 'Update your profile information'}
            </p>
          </div>
        </div>

        {/* Status Messages */}
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

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'صارف نام' : 'Username'}
              </label>
              <TextInput
                id="username"
                icon={HiUser}
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'پورا نام' : 'Full Name'}
              </label>
              <TextInput
                id="fullName"
                icon={HiUser}
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'ای میل' : 'Email'}
              </label>
              <TextInput
                id="email"
                type="email"
                icon={HiMail}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'فون نمبر' : 'Phone Number'}
              </label>
              <TextInput
                id="phone"
                icon={HiPhone}
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'مقام (انگریزی)' : 'Location (English)'}
              </label>
              <TextInput
                id="location"
                icon={HiLocationMarker}
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'مقام (اردو)' : 'Location (Urdu)'}
              </label>
              <TextInput
                id="locationUrdu"
                icon={HiLocationMarker}
                value={formData.locationUrdu}
                onChange={handleChange}
                required
                dir="rtl"
              />
            </div>
          </div>

          {/* Business Information (for sellers) */}
          {currentUser?.role === 'seller' && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {language === 'ur' ? 'کاروبار کا نام (انگریزی)' : 'Business Name (English)'}
                  </label>
                  <TextInput
                    id="businessName"
                    icon={HiOfficeBuilding}
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {language === 'ur' ? 'کاروبار کا نام (اردو)' : 'Business Name (Urdu)'}
                  </label>
                  <TextInput
                    id="businessNameUrdu"
                    icon={HiOfficeBuilding}
                    value={formData.businessNameUrdu}
                    onChange={handleChange}
                    required
                    dir="rtl"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {language === 'ur' ? 'کاروبار کی قسم' : 'Business Type'}
                </label>
                <Select
                  id="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    {language === 'ur' ? 'کاروبار کی قسم منتخب کریں' : 'Select Business Type'}
                  </option>
                  {businessTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {language === 'ur' ? type.labelUrdu : type.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {language === 'ur' ? 'تعارف (انگریزی)' : 'Bio (English)'}
                  </label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {language === 'ur' ? 'تعارف (اردو)' : 'Bio (Urdu)'}
                  </label>
                  <textarea
                    id="bioUrdu"
                    value={formData.bioUrdu}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                    dir="rtl"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-r-transparent" />
                  {language === 'ur' ? 'اپ ڈیٹ ہو رہا ہے...' : 'Updating...'}
                </div>
              ) : (
                <>
                  <HiCheck className="w-5 h-5 mr-2" />
                  {language === 'ur' ? 'پروفائل اپ ڈیٹ کریں' : 'Update Profile'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default DashProfile;