// SignupForm.jsx
import React, { useState } from "react";
import { TextInput, Select, Button, Alert } from 'flowbite-react';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { useNavigate } from "react-router-dom";

const SignupForm = ({ language = 'en' }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'buyer',
    phoneNumber: '',
    location: '',
    businessName: '',
    businessType: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.success === false) {
        setError(data.message || "Registration failed");
        return;
      }
      
      navigate("/login");
    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert color="failure" icon={HiOutlineInformationCircle}>
          {error}
        </Alert>
      )}

      {/* Role Selection */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {language === 'ur' ? 'کردار' : 'I want to'}
        </label>
        <Select 
          id="role" 
          value={formData.role} 
          onChange={handleChange}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900"
        >
          <option value="buyer">
            {language === 'ur' ? 'خریدار' : 'Buy Products'}
          </option>
          <option value="seller">
            {language === 'ur' ? 'فروخت کنندہ' : 'Sell My Products'}
          </option>
        </Select>
      </div>

      {/* Basic Information */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {language === 'ur' ? 'پورا نام' : 'Full Name'}
        </label>
        <TextInput
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          required
          placeholder={language === 'ur' ? 'پورا نام درج کریں' : 'Enter full name'}
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {language === 'ur' ? 'صارف نام' : 'Username'}
        </label>
        <TextInput
          id="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder={language === 'ur' ? 'صارف نام درج کریں' : 'Enter username'}
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {language === 'ur' ? 'فون نمبر' : 'Phone Number'}
        </label>
        <TextInput
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          placeholder={language === 'ur' ? 'فون نمبر درج کریں' : 'Enter phone number'}
        />
      </div>

      {/* Conditional Fields for Sellers */}
      {formData.role === 'seller' && (
        <>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {language === 'ur' ? 'کاروبار کا نام' : 'Business Name'}
            </label>
            <TextInput
              id="businessName"
              type="text"
              value={formData.businessName}
              onChange={handleChange}
              required
              placeholder={language === 'ur' ? 'کاروبار کا نام درج کریں' : 'Enter business name'}
            />
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
              className="bg-gray-50 border border-gray-300 text-gray-900"
            >
              <option value="">{language === 'ur' ? 'کاروبار کی قسم منتخب کریں' : 'Select Business Type'}</option>
              <option value="handicrafts">{language === 'ur' ? 'دستکاری' : 'Handicrafts'}</option>
              <option value="textiles">{language === 'ur' ? 'کپڑے' : 'Textiles'}</option>
              <option value="food">{language === 'ur' ? 'کھانا' : 'Food Products'}</option>
              <option value="other">{language === 'ur' ? 'دیگر' : 'Other'}</option>
            </Select>
          </div>
        </>
      )}

      {/* Location */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {language === 'ur' ? 'مقام' : 'Location'}
        </label>
        <TextInput
          id="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          required
          placeholder={language === 'ur' ? 'مقام درج کریں' : 'Enter location'}
        />
      </div>

      {/* Account Information */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {language === 'ur' ? 'ای میل' : 'Email'}
        </label>
        <TextInput
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder={language === 'ur' ? 'ای میل درج کریں' : 'Enter email'}
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {language === 'ur' ? 'پاس ورڈ' : 'Password'}
        </label>
        <TextInput
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder={language === 'ur' ? 'پاس ورڈ درج کریں' : 'Enter password'}
        />
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-center">
        <input
          id="terms"
          type="checkbox"
          required
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-3 block text-sm text-gray-700 dark:text-gray-200">
          {language === 'ur' 
            ? 'میں شرائط و ضوابط سے متفق ہوں' 
            : 'I accept the Terms and Conditions'}
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        gradientDuoTone="purpleToBlue"
        className="w-full"
        disabled={loading}
      >
        {loading 
          ? (language === 'ur' ? 'رجسٹر ہو رہا ہے...' : 'Registering...') 
          : (language === 'ur' ? 'رجسٹر کریں' : 'Register')}
      </Button>
    </form>
  );
};

export default SignupForm;