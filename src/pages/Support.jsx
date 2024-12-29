import React from 'react';
import { Link } from 'react-router-dom';
import { HiQuestionMarkCircle, HiInformationCircle, HiPhone, HiShieldCheck } from 'react-icons/hi';
import { useSelector } from 'react-redux';

const Support = () => {
  const { language } = useSelector((state) => state.language) || 'en';

  const translations = {
    en: {
      helpCenter: {
        title: 'Help Center',
        description: 'Visit our Help Center for answers to common questions and step-by-step guides.',
        button: 'Visit Help Center'
      },
      faqs: {
        title: 'FAQs',
        description: 'Check our Frequently Asked Questions for quick answers to common queries.',
        button: 'View FAQs'
      },
      contactUs: {
        title: 'Contact Us',
        description: 'Get in touch with our support team for any questions or concerns.',
        button: 'Contact Us'
      },
      safetyTips: {
        title: 'Safety Tips',
        description: 'Review our safety tips to protect yourself and your transactions.',
        button: 'View Safety Tips'
      }
    },
    ur: {
      helpCenter: {
        title: 'مدد سنٹر',
        description: 'عام سوالات اور مرحلہ وار گائیڈز کے لیے ہمارے مدد سنٹر میں آؤ۔',
        button: 'مدد سنٹر پر جائیں'
      },
      faqs: {
        title: 'عام سوالات',
        description: 'عام سوالات کے لیے تیز جوابات حاصل کریں۔',
        button: 'عام سوالات دیکھیں'
      },
      contactUs: {
        title: 'ہم سے رابطہ کریں',
        description: 'کسی بھی سوال یا چیٹ کے لیے ہمارے سپورٹ ٹیم سے رابطہ کریں۔',
        button: 'ہم سے رابطہ کریں'
      },
      safetyTips: {
        title: 'حفاظتی تجاویز',
        description: 'اپنے آپ اور اپنی ٹرانزیکشنز کی حفاظت کے لیے ہمارے حفاظتی تجاویز دیکھیں۔',
        button: 'حفاظتی تجاویز دیکھیں'
      }
    }
  };

  const t = translations[language];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t.helpCenter.title}</h1>

      <div className="space-y-8">
        {/* Help Center */}
        <div id="help-center">
          <h2 className="text-2xl font-bold mb-4">{t.helpCenter.title}</h2>
          <p className="text-gray-700 dark:text-gray-400 mb-4">{t.helpCenter.description}</p>
          <Link
            to="/help"
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            <HiQuestionMarkCircle className="w-5 h-5 mr-2" />
            {t.helpCenter.button}
          </Link>
        </div>

        {/* FAQs */}
        <div id="faqs">
          <h2 className="text-2xl font-bold mb-4">{t.faqs.title}</h2>
          <p className="text-gray-700 dark:text-gray-400 mb-4">{t.faqs.description}</p>
          <Link
            to="/faqs"
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            <HiInformationCircle className="w-5 h-5 mr-2" />
            {t.faqs.button}
          </Link>
        </div>

        {/* Contact Us */}
        <div id="contact-us">
          <h2 className="text-2xl font-bold mb-4">{t.contactUs.title}</h2>
          <p className="text-gray-700 dark:text-gray-400 mb-4">{t.contactUs.description}</p>
          <Link
            to="/contact"
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            <HiPhone className="w-5 h-5 mr-2" />
            {t.contactUs.button}
          </Link>
        </div>

        {/* Safety Tips */}
        <div id="safety-tips">
          <h2 className="text-2xl font-bold mb-4">{t.safetyTips.title}</h2>
          <p className="text-gray-700 dark:text-gray-400 mb-4">{t.safetyTips.description}</p>
          <Link
            to="/safety-tips"
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            <HiShieldCheck className="w-5 h-5 mr-2" />
            {t.safetyTips.button}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Support;