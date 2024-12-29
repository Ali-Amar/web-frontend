import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card } from 'flowbite-react';
import {
  HiShoppingBag,
  HiAcademicCap,
  HiUserGroup,
  HiLightningBolt,
  HiGlobe,
  HiCurrencyRupee
} from 'react-icons/hi';

const Home = () => {
  const { currentUser } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  // Features section data
  const features = [
    {
      icon: HiShoppingBag,
      title: 'Digital Marketplace',
      titleUrdu: 'ڈیجیٹل مارکیٹ پلیس',
      description: 'Sell your products online and reach customers across Pakistan',
      descriptionUrdu: 'آن لائن اپنی مصنوعات فروخت کریں اور پورے پاکستان میں گاہکوں تک پہنچیں',
      link: '/marketplace'
    },
    {
      icon: HiAcademicCap,
      title: 'Skill Development',
      titleUrdu: 'مہارت کی ترقی',
      description: 'Access free training courses and learning resources',
      descriptionUrdu: 'مفت تربیتی کورسز اور تعلیمی وسائل تک رسائی حاصل کریں',
      link: '/training'
    },
    {
      icon: HiUserGroup,
      title: 'Mentorship',
      titleUrdu: 'مینٹرشپ',
      description: 'Connect with experienced mentors for guidance',
      descriptionUrdu: 'رہنمائی کے لیے تجربہ کار مینٹرز سے رابطہ کریں',
      link: '/mentorship'
    }
  ];

  // Success metrics
  const metrics = [
    {
      value: '5000+',
      label: 'Women Entrepreneurs',
      labelUrdu: 'خواتین کاروباری'
    },
    {
      value: '200+',
      label: 'Business Mentors',
      labelUrdu: 'کاروباری مینٹرز'
    },
    {
      value: '50+',
      label: 'Training Courses',
      labelUrdu: 'تربیتی کورسز'
    },
    {
      value: '30+',
      label: 'Partner NGOs',
      labelUrdu: 'پارٹنر این جی اوز'
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                {language === 'ur' 
                  ? 'پاکستان کی دیہی خواتین کے لیے آن لائن کاروباری پلیٹ فارم'
                  : 'Empowering Rural Women Entrepreneurs of Pakistan'}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {language === 'ur'
                  ? 'ہم خواتین کو ڈیجیٹل مارکیٹ پلیس، تربیت، اور مینٹرشپ کے ذریعے کامیاب کاروبار بنانے میں مدد کرتے ہیں'
                  : 'We help women build successful businesses through digital marketplace, training, and mentorship'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  as={Link}
                  to="/signup"
                  gradientDuoTone="purpleToBlue"
                  size="xl"
                >
                  {language === 'ur' ? 'ابھی شروع کریں' : 'Get Started'}
                </Button>
                <Button
                  as={Link}
                  to="/about"
                  color="gray"
                  size="xl"
                >
                  {language === 'ur' ? 'مزید جانیں' : 'Learn More'}
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="/logo.png" 
                alt="Rural women entrepreneurs" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'ur' ? 'ہماری خدمات' : 'Our Features'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {language === 'ur' 
                ? 'آپ کے کاروبار کی کامیابی کے لیے جامع حل'
                : 'Comprehensive solutions for your business success'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <feature.icon className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {language === 'ur' ? feature.titleUrdu : feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {language === 'ur' ? feature.descriptionUrdu : feature.description}
                  </p>
                  <Button
                    as={Link}
                    to={feature.link}
                    gradientDuoTone="purpleToBlue"
                    size="sm"
                  >
                    {language === 'ur' ? 'مزید معلومات' : 'Learn More'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-purple-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'ur' ? 'کامیابی کی کہانیاں' : 'Success Stories'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {language === 'ur'
                ? 'دیکھیں کہ ہمارے پلیٹ فارم نے کیسے خواتین کی مدد کی'
                : 'See how our platform has helped women succeed'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {metric.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {language === 'ur' ? metric.labelUrdu : metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            {language === 'ur'
              ? 'آج ہی اپنا کاروبار شروع کریں'
              : 'Start Your Business Journey Today'}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {language === 'ur'
              ? 'مفت اکاؤنٹ بنائیں اور ہماری خدمات سے فائدہ اٹھائیں'
              : 'Create a free account and take advantage of our services'}
          </p>
          <Button
            as={Link}
            to="/signup"
            size="xl"
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            {language === 'ur' ? 'ابھی رجسٹر کریں' : 'Register Now'}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;