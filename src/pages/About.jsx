import React from 'react';
import { useSelector } from 'react-redux';

const About = () => {
  const { language } = useSelector(state => state.language) || 'en';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        {language === 'ur' ? 'ہمارے بارے میں' : 'About Us'}
      </h1>
      {language === 'ur' ? (
        <>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            آن لائن کاروباری پلیٹ فارم
              میں خوش آمدید، ایک بااختیار پلیٹ فارم جو پاکستانی دیہی خواتین کاروباری افراد کو فروغ دینے کے لیے تیار کیا گیا ہے۔ ہمارا مشن مواقع اور صلاحیتوں کے درمیان خلا کو پاٹنا ہے، خواتین کو ڈیجیٹل معیشت میں کامیابی حاصل کرنے کے قابل بنانا ہے۔
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
          آن لائن کاروباری پلیٹ فارم
          میں، ہم ایک جامع حل فراہم کرتے ہیں جو صرف ای کامرس سے کہیں زیادہ ہے۔ یہاں، خواتین نہ صرف مصنوعات خرید و فروخت کر سکتی ہیں بلکہ قیمتی تربیت تک رسائی حاصل کر سکتی ہیں، آن لائن کورسز میں حصہ لے سکتی ہیں، اور اپنی مہارتوں کو بہتر بنانے کے لیے رہنمائی حاصل کر سکتی ہیں۔ ہم ایک معاون کمیونٹی کو فروغ دینے پر یقین رکھتے ہیں جہاں کاروباری افراد جڑ سکتے ہیں، بڑھ سکتے ہیں، اور کامیاب ہو سکتے ہیں۔
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            ہم نے اضافی وسائل اور مدد فراہم کرنے کے لیے این جی اوز کے ساتھ بھی شراکت داری کی ہے، اس بات کو یقینی بناتے ہوئے کہ ہر عورت کے پاس اپنے خیالات کو حقیقت میں بدلنے کے لیے درکار آلات اور رہنمائی موجود ہے۔ مل کر، ہم ایک ایسا مستقبل تعمیر کر رہے ہیں جہاں دیہی خواتین کو مساوی مواقع تک رسائی حاصل ہو اور اپنی شرائط پر معیشت میں حصہ ڈالنے کی صلاحیت ہو۔
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            بااختیاری اور جدت کے اس سفر میں ہمارے ساتھ شامل ہوں۔ مل کر، ہم فرق پیدا کر سکتے ہیں!
          </p>
        </>
      ) : (
        <>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Welcome to Rural Women Entrepreneurship Platform, an empowering platform designed to uplift rural Pakistani women entrepreneurs. Our mission is to bridge the gap between opportunity and potential, enabling women to thrive in the digital economy.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            At Rural Women Entrepreneurship Platform, we provide a holistic solution that goes beyond just e-commerce. Here, women can not only sell and buy products but also access valuable training, participate in online courses, and receive mentorship to enhance their skills. We believe in fostering a supportive community where entrepreneurs can connect, grow, and succeed.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We've also partnered with NGOs to provide additional resources and support, ensuring that every woman has the tools and guidance needed to turn her ideas into reality. Together, we're building a future where rural women have equal access to opportunities and the ability to contribute to the economy on their terms.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Join us on this journey of empowerment and innovation. Together, we can make a difference!
          </p>
        </>
      )}
    </div>
  );
};

export default About;