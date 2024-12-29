import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaWhatsapp
} from 'react-icons/fa';
import { Button } from 'flowbite-react';

const Footer = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { language } = useSelector((state) => state.language) || 'en';

  const translations = {
    en: {
      about: {
        title: 'About WE Market',
        description: 'Empowering women entrepreneurs in rural Pakistan through digital marketplace, skill development, and mentorship opportunities.'
      },
      quickLinks: {
        title: 'Quick Links',
        marketplace: 'Marketplace',
        training: 'Training Programs',
        mentorship: 'Mentorship',
        about: 'About Us'
      },
      support: {
        title: 'Support',
        help: 'Help Center',
        faq: 'FAQs',
        contact: 'Contact Us',
        safety: 'Safety Tips'
      },
      resources: {
        title: 'Resources',
        blog: 'Success Stories',
        guides: 'Business Guides',
        workshops: 'Online Workshops',
        funding: 'Funding Options'
      },
      newsletter: {
        title: 'Stay Connected',
        description: 'Subscribe to receive updates about opportunities and success stories',
        placeholder: 'Enter your email',
        button: 'Subscribe',
        success: 'Thank you for subscribing!'
      }
    },
    ur: {
      about: {
        title: 'ہمارے بارے میں',
        description: 'پاکستان کی دیہی خواتین کاروباری خواتین کو ڈیجیٹل مارکیٹ پلیس، مہارت کی ترقی، اور رہنمائی کے مواقع کے ذریعے بااختیار بنانا۔'
      },
      quickLinks: {
        title: 'فوری روابط',
        marketplace: 'مارکیٹ پلیس',
        training: 'تربیتی پروگرام',
        mentorship: 'مینٹرشپ',
        about: 'ہمارے بارے میں'
      },
      support: {
        title: 'معاونت',
        help: 'مدد سنٹر',
        faq: 'عام سوالات',
        contact: 'رابطہ کریں',
        safety: 'حفاظتی تجاویز'
      },
      resources: {
        title: 'وسائل',
        blog: 'کامیابی کی کہانیاں',
        guides: 'کاروباری گائیڈز',
        workshops: 'آن لائن ورکشاپس',
        funding: 'فنڈنگ کے مواقع'
      },
      newsletter: {
        title: 'رابطے میں رہیں',
        description: 'مواقع اور کامیابی کی کہانیوں کے بارے میں اپڈیٹس حاصل کرنے کے لیے سبسکرائب کریں',
        placeholder: 'ای میل درج کریں',
        button: 'سبسکرائب کریں',
        success: 'سبسکرائب کرنے کا شکریہ!'
      }
    }
  };

  const t = translations[language];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About Section */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t.about.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {t.about.description}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="social-link">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="social-link">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="social-link">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="social-link">
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-heading">{t.quickLinks.title}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/marketplace" className="footer-link">
                  {t.quickLinks.marketplace}
                </Link>
              </li>
              <li>
                <Link to="/training" className="footer-link">
                  {t.quickLinks.training}
                </Link>
              </li>
              <li>
                <Link to="/mentorship" className="footer-link">
                  {t.quickLinks.mentorship}
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  {t.quickLinks.about}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="footer-heading">{t.support.title}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/Support" className="footer-link">
                  {t.support.help}
                </Link>
              </li>
              <li>
                <Link to="/Support" className="footer-link">
                  {t.support.faq}
                </Link>
              </li>
              <li>
                <Link to="/Support" className="footer-link">
                  {t.support.contact}
                </Link>
              </li>
              <li>
                <Link to="/Support" className="footer-link">
                  {t.support.safety}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="footer-heading">{t.newsletter.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {t.newsletter.description}
            </p>
            <form className="space-y-2">
              <div>
                <input
                  type="email"
                  placeholder={t.newsletter.placeholder}
                  className="w-full px-4 py-2 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                type="submit"
                gradientDuoTone="purpleToBlue"
                className="w-full"
              >
                {t.newsletter.button}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} WE Market. All rights reserved.
            </div>

            {/* Additional Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/privacy" className="footer-link">
                Privacy Policy
              </Link>
              <Link to="/terms" className="footer-link">
                Terms of Service
              </Link>
              <Link to="/accessibility" className="footer-link">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;