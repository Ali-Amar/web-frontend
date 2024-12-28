import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  const [language, setLanguage] = useState('en');

  return (
    <div className="py-32 lg:py-44 dark:bg-gray-900">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        {/* Left Side Image Panel */}
        <div
          className="hidden lg:block lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')",
          }}
        ></div>

        {/* Right Side Login Panel */}
        <div className="w-full p-8 lg:w-1/2">
          {/* Language Toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setLanguage('ur')}
              className={`mx-1 px-3 py-1 rounded ${
                language === 'ur' ? 'bg-gray-800 text-white' : 'text-gray-800'
              }`}
            >
              اردو
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`mx-1 px-3 py-1 rounded ${
                language === 'en' ? 'bg-gray-800 text-white' : 'text-gray-800'
              }`}
            >
              English
            </button>
          </div>

          {/* Branding */}
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            {language === 'ur' ? 'خوش آمدید' : 'Welcome Back!'}
          </h2>
          <p className="text-xl text-gray-600 text-center">
            {language === 'ur' ? 'اپنے اکاؤنٹ میں لاگ ان کریں' : 'Login to your account'}
          </p>

          {/* Login Form Component */}
          <div className="mt-4">
            <LoginForm language={language} />
          </div>

          {/* Sign Up Link */}
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4"></span>
            <Link to="/signup" className="text-xs text-gray-500 uppercase hover:underline">
              {language === 'ur' ? 'نیا اکاؤنٹ بنائیں' : 'Create Account'}
            </Link>
            <span className="border-b w-1/5 md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;