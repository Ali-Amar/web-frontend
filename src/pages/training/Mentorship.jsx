import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Alert,
  Card,
  Progress
} from 'flowbite-react';
import { 
  HiAcademicCap,
  HiUserGroup,
  HiLightningBolt,
  HiChatAlt
} from 'react-icons/hi';

import MentorList from '../../components/mentorship/MentorList';
import MentorshipRequest from '../../components/mentorship/MentorshipRequest';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Mentorship = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [stats, setStats] = useState({
    totalMentors: 0,
    activeMentorships: 0,
    successfulMentorships: 0
  });

  // Fetch mentorship stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/mentorship/stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching mentorship stats:', err);
      }
    };

    fetchStats();
    setLoading(false);
  }, []);

  // Handle mentorship request
  const handleRequestMentorship = (mentor) => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/mentorship' } });
      return;
    }
    setSelectedMentor(mentor);
    setShowRequestModal(true);
  };

  // Handle request submission
  const handleSubmitRequest = async (requestData) => {
    try {
      const response = await fetch('/api/mentorship/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      setShowRequestModal(false);
      // Show success message or redirect to dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              {language === 'ur' 
                ? 'ماہر رہنماؤں سے جڑیں'
                : 'Connect with Expert Mentors'}
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {language === 'ur'
                ? 'اپنے کاروبار کی ترقی کے لیے تجربہ کار رہنماؤں سے رہنمائی حاصل کریں'
                : 'Get guidance from experienced mentors to grow your business'}
            </p>
            {!currentUser && (
              <Button
                gradientDuoTone="pinkToOrange"
                size="xl"
                onClick={() => navigate('/signup')}
              >
                {language === 'ur' ? 'ابھی شروع کریں' : 'Get Started'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: HiAcademicCap,
              value: stats.totalMentors,
              label: language === 'ur' ? 'ماہر رہنما' : 'Expert Mentors',
              color: 'blue'
            },
            {
              icon: HiUserGroup,
              value: stats.activeMentorships,
              label: language === 'ur' ? 'فعال رہنمائی' : 'Active Mentorships',
              color: 'green'
            },
            {
              icon: HiLightningBolt,
              value: stats.successfulMentorships,
              label: language === 'ur' ? 'کامیاب کہانیاں' : 'Success Stories',
              color: 'purple'
            }
          ].map((stat, index) => (
            <Card key={index} className="text-center">
              <div className="flex flex-col items-center">
                <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/20 mb-4`}>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {language === 'ur' ? 'یہ کیسے کام کرتا ہے' : 'How It Works'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: HiUserGroup,
                title: language === 'ur' ? 'رہنما تلاش کریں' : 'Find a Mentor',
                titleUrdu: 'رہنما تلاش کریں',
                description: language === 'ur'
                  ? 'اپنی ضروریات کے مطابق موزوں رہنما تلاش کریں'
                  : 'Find the right mentor based on your needs',
                descriptionUrdu: 'اپنی ضروریات کے مطابق موزوں رہنما تلاش کریں'
              },
              {
                icon: HiChatAlt,
                title: language === 'ur' ? 'رابطہ کریں' : 'Connect',
                titleUrdu: 'رابطہ کریں',
                description: language === 'ur'
                  ? 'رہنما سے رابطہ کریں اور اپنے مقاصد بتائیں'
                  : 'Connect with your mentor and share your goals',
                descriptionUrdu: 'رہنما سے رابطہ کریں اور اپنے مقاصد بتائیں'
              },
              {
                icon: HiLightningBolt,
                title: language === 'ur' ? 'ترقی کریں' : 'Grow',
                titleUrdu: 'ترقی کریں',
                description: language === 'ur'
                  ? 'ماہرانہ رہنمائی سے اپنے کاروبار کو بڑھائیں'
                  : 'Grow your business with expert guidance',
                descriptionUrdu: 'ماہرانہ رہنمائی سے اپنے کاروبار کو بڑھائیں'
              }
            ].map((step, index) => (
              <Card key={index} className="text-center">
                <div className="flex flex-col items-center">
                  <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
                    <step.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {language === 'ur' ? step.titleUrdu : step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {language === 'ur' ? step.descriptionUrdu : step.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'ur' ? 'ہمارے ماہر رہنما' : 'Our Expert Mentors'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {language === 'ur'
                ? 'متنوع شعبوں کے تجربہ کار رہنما آپ کی مدد کے لیے موجود ہیں'
                : 'Experienced mentors from diverse fields ready to help you succeed'}
            </p>
          </div>

          <MentorList
            onRequestMentorship={handleRequestMentorship}
            onViewProfile={(mentorId) => navigate(`/mentor/${mentorId}`)}
          />
        </div>
      </section>

      {/* Mentorship Request Modal */}
      {showRequestModal && selectedMentor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative w-full max-w-2xl mx-4">
            <MentorshipRequest
              mentor={selectedMentor}
              onSubmit={handleSubmitRequest}
              onCancel={() => setShowRequestModal(false)}
            />
          </div>
        </div>
      )}

      {/* FAQs Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {language === 'ur' ? 'عام سوالات' : 'Frequently Asked Questions'}
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'How long is a typical mentorship session?',
                questionUrdu: 'ایک عام رہنمائی سیشن کتنا لمبا ہوتا ہے؟',
                answer: 'Mentorship sessions typically last 30-60 minutes, depending on the mentor and topic.',
                answerUrdu: 'رہنمائی سیشن عام طور پر 30-60 منٹ تک چلتا ہے، رہنما اور موضوع کے مطابق۔'
              },
              {
                question: 'Is mentorship free?',
                questionUrdu: 'کیا رہنمائی مفت ہے؟',
                answer: 'Yes, our mentorship program is completely free for rural women entrepreneurs.',
                answerUrdu: 'جی ہاں، ہمارا رہنمائی پروگرام دیہی خواتین کاروباری افراد کے لیے بالکل مفت ہے۔'
              },
              {
                question: 'How do I choose the right mentor?',
                questionUrdu: 'میں درست رہنما کا انتخاب کیسے کروں؟',
                answer: 'Look for mentors with experience in your field and read their profiles and reviews.',
                answerUrdu: 'اپنے شعبے میں تجربہ رکھنے والے رہنماؤں کو تلاش کریں اور ان کے پروفائل اور جائزے پڑھیں۔'
              }
            ].map((faq, index) => (
              <Card key={index}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? faq.questionUrdu : faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'ur' ? faq.answerUrdu : faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'ur' 
              ? 'آج ہی اپنی کامیابی کا سفر شروع کریں'
              : 'Start Your Success Journey Today'}
          </h2>
          <p className="text-xl mb-8 text-white/90">
            {language === 'ur'
              ? 'ماہر رہنماؤں کی مدد سے اپنے خوابوں کو حقیقت بنائیں'
              : 'Turn your dreams into reality with expert mentorship'}
          </p>
          <Button
            size="xl"
            className="bg-white text-purple-600 hover:bg-gray-100"
            onClick={() => navigate(currentUser ? '/dashboard' : '/signup')}
          >
            {language === 'ur' 
              ? 'رہنمائی حاصل کریں' 
              : 'Get Mentorship'}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Mentorship;