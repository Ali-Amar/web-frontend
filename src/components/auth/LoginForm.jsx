import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextInput, Button, Alert } from 'flowbite-react';
import { signInStart, signInSuccess, signInFailure } from '../../features/auth/authSlice';
import OAuth from '../../utils/OAuth';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ language = 'en' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate(); 
  
  const { loading, error } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }

      const { user, accessToken } = data;
      dispatch(signInSuccess({ user, accessToken }));
      navigate('/')
    } catch (error) {
      console.log(error) 
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="w-full">
      {/* OAuth Button */}
      <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg p-3 text-gray-700 hover:bg-gray-50 transition mb-4">
        <OAuth />
      </button>

      <div className="flex items-center my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm">
          {language === 'ur' ? 'یا' : 'OR'}
        </span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert color="failure">
            {error.message || "Something went wrong!"}
          </Alert>
        )}

        <div>
          <TextInput
            id="email"
            type="email"
            placeholder={language === 'ur' ? 'ای میل' : 'Email'}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <TextInput
            id="password"
            type="password"
            placeholder={language === 'ur' ? 'پاس ورڈ' : 'Password'}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 text-gray-600">
              {language === 'ur' ? 'مجھے یاد رکھیں' : 'Remember me'}
            </label>
          </div>
          <a href="#" className="text-blue-600 hover:underline">
            {language === 'ur' ? 'پاس ورڈ بھول گئے؟' : 'Forgot Password?'}
          </a>
        </div>

        <Button
          type="submit"
          className="w-full"
          gradientDuoTone="purpleToBlue"
          disabled={loading}
        >
          {loading 
            ? (language === 'ur' ? 'لاگ ان ہو رہا ہے...' : 'Signing in...') 
            : (language === 'ur' ? 'لاگ ان کریں' : 'Sign in')}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;