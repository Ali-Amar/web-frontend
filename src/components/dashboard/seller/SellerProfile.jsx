import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  TextInput,
  Button,
  Alert,
  Avatar,
  Select,
  Progress,
  Badge
} from 'flowbite-react';
import { HiPencil, HiLocationMarker, HiPhone, HiMail, HiGlobe } from 'react-icons/hi';
import { updateStart, updateSuccess, updateFailure } from '../../../features/auth/authSlice';

const SellerProfile = () => {
  const { currentUser, loading, error, accessToken } = useSelector((state) => state.user);
  const { language } = useSelector((state) => state.language) || 'en';
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    businessName: '',
    businessNameUrdu: '',
    username: '',
    email: '',
    phone: '',
    location: '',
    locationUrdu: '',
    businessType: '',
    description: '',
    descriptionUrdu: '',
    specialties: [],
    website: '',
    avatar: null,
    certifications: []
  });

  const businessTypes = [
    { value: 'handicrafts', label: 'Handicrafts', labelUrdu: 'دستکاری' },
    { value: 'textiles', label: 'Textiles', labelUrdu: 'کپڑے' },
    { value: 'food', label: 'Food Products', labelUrdu: 'کھانے کی اشیاء' },
    { value: 'agriculture', label: 'Agriculture', labelUrdu: 'زراعت' },
    { value: 'other', label: 'Other', labelUrdu: 'دیگر' }
  ];

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        ...currentUser,
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        dispatch(updateStart());
        const response = await fetch('http://localhost:8080/api/users/avatar', {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });
        
        const data = await response.json();
        if (data.success === false) {
          throw new Error(data.message);
        }
        
        const { user } = data.data;
        dispatch(updateSuccess({ user, accessToken }));
      } catch (err) {
        dispatch(updateFailure(err.message));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const response = await fetch('http://localhost:8080/api/users/update-account', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success === false) {
        throw new Error(data.message);
      }

      const { user } = data.data;
      dispatch(updateSuccess({ user, accessToken }));
    } catch (err) {
      dispatch(updateFailure(err.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div className="relative">
            <Avatar
              size="xl"
              img={currentUser?.avatar}
              alt={currentUser?.businessName}
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {language === 'ur' ? formData.businessNameUrdu : formData.businessName}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.certifications?.map((cert, index) => (
                <Badge key={index} color="success">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'کاروبار کا نام (انگریزی)' : 'Business Name (English)'}
              </label>
              <TextInput
                name="businessName"
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
                name="businessNameUrdu"
                value={formData.businessNameUrdu}
                onChange={handleChange}
                required
                dir="rtl"
              />
            </div>
          </div>

          {/* Business Type */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {language === 'ur' ? 'کاروبار کی قسم' : 'Business Type'}
            </label>
            <Select
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
            >
              {businessTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {language === 'ur' ? type.labelUrdu : type.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'فون نمبر' : 'Phone Number'}
              </label>
              <TextInput
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={HiPhone}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'ای میل' : 'Email'}
              </label>
              <TextInput
                name="email"
                value={formData.email}
                onChange={handleChange}
                icon={HiMail}
                required
                type="email"
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
                name="location"
                value={formData.location}
                onChange={handleChange}
                icon={HiLocationMarker}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'مقام (اردو)' : 'Location (Urdu)'}
              </label>
              <TextInput
                name="locationUrdu"
                value={formData.locationUrdu}
                onChange={handleChange}
                icon={HiLocationMarker}
                required
                dir="rtl"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'تفصیل (انگریزی)' : 'Description (English)'}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ur' ? 'تفصیل (اردو)' : 'Description (Urdu)'}
              </label>
              <textarea
                name="descriptionUrdu"
                value={formData.descriptionUrdu}
                onChange={handleChange}
                rows="4"
                dir="rtl"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>
          </div>

          {/* Website (Optional) */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {language === 'ur' ? 'ویب سائٹ (اختیاری)' : 'Website (Optional)'}
            </label>
            <TextInput
              name="website"
              value={formData.website}
              onChange={handleChange}
              icon={HiGlobe}
              placeholder="https://"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            className="w-full"
            disabled={loading}
          >
            {loading 
              ? (language === 'ur' ? 'اپ ڈیٹ ہو رہا ہے...' : 'Updating...') 
              : (language === 'ur' ? 'پروفائل اپ ڈیٹ کریں' : 'Update Profile')}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SellerProfile;