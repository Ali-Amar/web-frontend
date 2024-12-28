// SignUp.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import SignupForm from "../components/auth/SignupForm";

const SignUp = () => {
  const [language, setLanguage] = useState('en');

  return (
    <div className="font-sans text-gray-800 dark:text-gray-100 bg-white flex items-center mx-auto px-4 py-32 dark:bg-gray-900 justify-center">
      <div className="max-w-4xl grid md:grid-cols-3 items-center shadow-md rounded-xl overflow-hidden">
        {/* Left Information Panel */}
        <div className="max-md:order-1 flex flex-col justify-center space-y-8 max-md:mt-16 min-h-full bg-gradient-to-r from-gray-900 to-gray-700 lg:px-8 px-4 py-8">
          <div>
            <h4 className="text-white text-lg font-semibold">
              {language === 'ur' ? 'ہماری کمیونٹی میں شامل ہوں' : 'Join Our Community'}
            </h4>
            <p className="text-[13px] text-white mt-2">
              {language === 'ur' 
                ? 'اپنے کاروباری سفر کی شروعات کے لیے اپنا اکاؤنٹ بنائیں' 
                : 'Create your account to start your entrepreneurial journey'}
            </p>
          </div>
          
          <div>
            <h4 className="text-white text-lg font-semibold">
              {language === 'ur' ? 'آسان اور محفوظ' : 'Simple & Secure'}
            </h4>
            <p className="text-[13px] text-white mt-2">
              {language === 'ur'
                ? 'مکمل سیکیورٹی کے ساتھ آسان رجسٹریشن کا عمل'
                : 'Easy registration process with complete security'}
            </p>
          </div>

          {/* Language Toggle */}
          <div className="flex space-x-4">
            <button 
              onClick={() => setLanguage('ur')}
              className={`px-4 py-2 rounded transition-colors ${
                language === 'ur' 
                  ? 'bg-white text-gray-900' 
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              اردو
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded transition-colors ${
                language === 'en' 
                  ? 'bg-white text-gray-900' 
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:col-span-2 w-full py-6 px-6 sm:px-16">
          <div className="mb-6">
            <h3 className="text-2xl font-bold">
              {language === 'ur' ? 'اکاؤنٹ بنائیں' : 'Create an account'}
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              {language === 'ur' 
                ? 'اپنا کاروبار آن لائن شروع کرنے کے لیے رجسٹر کریں' 
                : 'Register to start your online business journey'}
            </p>
          </div>

          <SignupForm language={language} />

          <div className="mt-6 text-center text-gray-600">
            {language === 'ur' ? 'پہلے سے اکاؤنٹ ہے؟' : 'Already have an account?'}{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              {language === 'ur' ? 'لاگ ان کریں' : 'Login here'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;