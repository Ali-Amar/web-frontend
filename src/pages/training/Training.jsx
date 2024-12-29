import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Button, 
  Tabs, 
  Card 
} from 'flowbite-react';
import { 
  HiAcademicCap,
  HiBookOpen,
  HiChartBar,
  HiClock,
  HiUserGroup,
  HiLightningBolt
} from 'react-icons/hi';

import CourseList from '../../components/training/CourseList';
import ResourceLibrary from '../../components/training/ResourceLibrary';
import ProgressTracking from '../../components/dashboard/progress/ProgressTracking';

const Training = () => {
  const { currentUser } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  // Statistics cards data
  const stats = [
    {
      icon: HiAcademicCap,
      title: language === 'ur' ? 'کل کورسز' : 'Total Courses',
      titleUrdu: 'کل کورسز',
      value: '50+',
      color: 'blue'
    },
    {
      icon: HiUserGroup,
      title: language === 'ur' ? 'طالب علم' : 'Active Learners',
      titleUrdu: 'طالب علم',
      value: '1000+',
      color: 'green'
    },
    {
      icon: HiLightningBolt,
      title: language === 'ur' ? 'مکمل کورسز' : 'Completed Courses',
      titleUrdu: 'مکمل کورسز',
      value: enrolledCourses ? enrolledCourses.length : 0,
      color: 'purple'
    }
  ];

  // Fetch courses and user progress
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch courses
        const response = await fetch('/api/courses');
        const data = await response.json();
        setCourses(data.courses);

        // If user is logged in, fetch their enrolled courses and progress
        if (currentUser) {
          const progressResponse = await fetch('/api/progress', {
            headers: {
              'Authorization': `Bearer ${currentUser.token}`
            }
          });
          const progressData = await progressResponse.json();
          setEnrolledCourses(progressData.enrolledCourses);
          setUserProgress(progressData.progress);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleEnroll = async (courseId) => {
    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ courseId })
      });

      if (response.ok) {
        setEnrolledCourses(prev => [...prev, courseId]);
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              {language === 'ur' 
                ? 'اپنی مہارتیں بڑھائیں'
                : 'Grow Your Skills'}
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {language === 'ur'
                ? 'مفت آن لائن کورسز اور وسائل کے ساتھ اپنا کاروبار بڑھائیں'
                : 'Enhance your business with free online courses and resources'}
            </p>
            {!currentUser && (
              <Button
                gradientDuoTone="pinkToOrange"
                size="xl"
                href="/signup"
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
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <div className="flex flex-col items-center">
                <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/20 mb-4`}>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'ur' ? stat.titleUrdu : stat.title}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs
          style="underline"
          onActiveTabChange={index => {
            const tabs = ['courses', 'resources', 'progress'];
            setActiveTab(tabs[index]);
          }}
        >
          <Tabs.Item
            active={activeTab === 'courses'}
            title={language === 'ur' ? 'کورسز' : 'Courses'}
            icon={HiAcademicCap}
          >
            <CourseList
              courses={courses}
              enrolledCourses={enrolledCourses}
              userProgress={userProgress}
              isLoading={isLoading}
              onEnroll={handleEnroll}
              hasMore={true}
              onLoadMore={() => {}}
            />
          </Tabs.Item>

          <Tabs.Item
            active={activeTab === 'resources'}
            title={language === 'ur' ? 'وسائل' : 'Resources'}
            icon={HiBookOpen}
          >
            <ResourceLibrary
              onDownload={(resourceId) => {}}
              isLoading={isLoading}
              resources={[]}
            />
          </Tabs.Item>

          {currentUser && (
            <Tabs.Item
              active={activeTab === 'progress'}
              title={language === 'ur' ? 'پیش رفت' : 'Progress'}
              icon={HiChartBar}
            >
              <ProgressTracking
                userProgress={userProgress}
                enrolledCourses={enrolledCourses}
                completedCourses={[]}
                timeSpent={{}}
              />
            </Tabs.Item>
          )}
        </Tabs>
      </div>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {language === 'ur' ? 'خصوصیات' : 'Key Features'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: HiAcademicCap,
                title: language === 'ur' ? 'مفت کورسز' : 'Free Courses',
                description: language === 'ur' 
                  ? 'تمام کورسز مکمل طور پر مفت ہیں'
                  : 'All courses are completely free'
              },
              {
                icon: HiUserGroup,
                title: language === 'ur' ? 'ماہر اساتذہ' : 'Expert Instructors',
                description: language === 'ur'
                  ? 'تجربہ کار اساتذہ سے سیکھیں'
                  : 'Learn from experienced instructors'
              },
              {
                icon: HiBookOpen,
                title: language === 'ur' ? 'عملی سیکھنا' : 'Practical Learning',
                description: language === 'ur'
                  ? 'حقیقی دنیا کے مسائل کو حل کرنے کی مہارت حاصل کریں'
                  : 'Gain skills to solve real-world problems'
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center">
                <div className="flex flex-col items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!currentUser && (
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'ur' 
                ? 'آج ہی اپنا سفر شروع کریں'
                : 'Start Your Learning Journey Today'}
            </h2>
            <p className="text-xl mb-8">
              {language === 'ur'
                ? 'مفت رجسٹر کریں اور سیکھنا شروع کریں'
                : 'Register for free and start learning'}
            </p>
            <Button
              size="xl"
              href="/signup"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              {language === 'ur' ? 'مفت رجسٹر کریں' : 'Register Free'}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Training;