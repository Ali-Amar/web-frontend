import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Button, 
  Progress, 
  Card, 
  Tabs, 
  Alert,
  Accordion,
  Badge,
  Avatar,
  Breadcrumb
} from 'flowbite-react';
import { 
  HiAcademicCap,
  HiClock,
  HiUserGroup,
  HiTranslate,
  HiDocumentText,
  HiLockClosed,
  HiLockOpen,
  HiPlay,
  HiCheck,
  HiOutlineLightBulb,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiHome,
  HiDownload,
  HiChevronRight
} from 'react-icons/hi';

import TrainingVideo from '../../components/training/TrainingVideo';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        // Fetch course details
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) throw new Error('Course not found');
        const data = await response.json();
        setCourse(data);

        // If user is logged in, fetch enrollment status and progress
        if (currentUser) {
          const progressResponse = await fetch(`/api/courses/${courseId}/progress`, {
            headers: {
              'Authorization': `Bearer ${currentUser.token}`
            }
          });
          const progressData = await progressResponse.json();
          setUserProgress(progressData.progress);
          setIsEnrolled(progressData.isEnrolled);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, currentUser]);

  const handleEnroll = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/course/${courseId}` } });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      if (response.ok) {
        setIsEnrolled(true);
        // Start with first lesson
        if (course.curriculum[0]?.lessons[0]) {
          setActiveLesson(course.curriculum[0].lessons[0]);
          setShowVideo(true);
        }
      }
    } catch (error) {
      console.error('Enrollment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async (lessonId) => {
    try {
      await fetch(`/api/courses/${courseId}/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      setUserProgress(prev => ({
        ...prev,
        [lessonId]: 100
      }));

      // Check if course is completed
      const totalLessons = course.curriculum.reduce(
        (acc, module) => acc + module.lessons.length,
        0
      );
      const completedLessons = Object.values({
        ...userProgress,
        [lessonId]: 100
      }).filter(progress => progress === 100).length;

      if (completedLessons === totalLessons) {
        setShowCertificateModal(true);
      }
    } catch (error) {
      console.error('Failed to mark lesson as complete:', error);
    }
  };

  const handleDownloadResource = async (resourceId) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/resources/${resourceId}`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resource-${resourceId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to download resource:', error);
    }
  };

  const calculateProgress = () => {
    if (!course?.curriculum) return 0;
    const totalLessons = course.curriculum.reduce(
      (acc, module) => acc + module.lessons.length,
      0
    );
    const completedLessons = Object.values(userProgress).filter(
      progress => progress === 100
    ).length;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert color="failure">
          {error}
        </Alert>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showVideo && activeLesson ? (
        <TrainingVideo
          lesson={activeLesson}
          onComplete={() => handleLessonComplete(activeLesson.id)}
          onClose={() => setShowVideo(false)}
          onNextLesson={(nextLesson) => setActiveLesson(nextLesson)}
          onSaveNote={(note) => {
            // Handle saving notes
          }}
          onDownloadResource={handleDownloadResource}
        />
      ) : (
        <>
          {/* Breadcrumb Navigation */}
          <div className="container mx-auto px-4 py-4">
            <Breadcrumb>
              <Breadcrumb.Item href="/" icon={HiHome}>
                {language === 'ur' ? 'ہوم' : 'Home'}
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/training">
                {language === 'ur' ? 'تربیت' : 'Training'}
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                {language === 'ur' ? course?.titleUrdu : course?.title}
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          {/* Course Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge color="purple">
                    {language === 'ur' ? course.categoryUrdu : course.category}
                  </Badge>
                  <Badge color={course.level === 'Beginner' ? 'success' : 'warning'}>
                    {language === 'ur' ? course.levelUrdu : course.level}
                  </Badge>
                  {course.certificateOffered && (
                    <Badge color="info">
                      {language === 'ur' ? 'سرٹیفکیٹ' : 'Certificate Available'}
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold mb-4">
                  {language === 'ur' ? course.titleUrdu : course.title}
                </h1>

                <p className="text-lg text-white/90 mb-6">
                  {language === 'ur' ? course.descriptionUrdu : course.description}
                </p>

                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <HiClock className="w-5 h-5" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiUserGroup className="w-5 h-5" />
                    <span>
                      {course.studentsCount} 
                      {language === 'ur' ? ' طالب علم' : ' students'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiTranslate className="w-5 h-5" />
                    <span>{course.languages.join(', ')}</span>
                  </div>
                </div>

                {isEnrolled && (
                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <span>
                        {language === 'ur' ? 'پیش رفت' : 'Your Progress'}
                      </span>
                      <span>{calculateProgress()}%</span>
                    </div>
                    <Progress
                      progress={calculateProgress()}
                      size="lg"
                      color="purple"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Tabs.Group style="underline">
                  {/* Curriculum Tab */}
                  <Tabs.Item 
                    title={language === 'ur' ? 'نصاب' : 'Curriculum'}
                    icon={HiAcademicCap}
                  >
                    <Accordion>
                      {course.curriculum.map((module, moduleIndex) => (
                        <Accordion.Panel key={moduleIndex}>
                          <Accordion.Title>
                            <div className="flex items-center justify-between w-full">
                              <span>
                                {language === 'ur' 
                                  ? module.titleUrdu 
                                  : module.title}
                              </span>
                              <Badge color="gray">
                                {module.lessons.length} {
                                  language === 'ur' ? 'اسباق' : 'lessons'
                                }
                              </Badge>
                            </div>
                          </Accordion.Title>
                          <Accordion.Content>
                            <div className="space-y-4">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <div 
                                  key={lessonIndex}
                                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    {isEnrolled ? (
                                      userProgress[lesson.id] === 100 ? (
                                        <HiCheck className="w-5 h-5 text-green-500" />
                                      ) : (
                                        <HiLockOpen className="w-5 h-5 text-gray-400" />
                                      )
                                    ) : (
                                      <HiLockClosed className="w-5 h-5 text-gray-400" />
                                    )}
                                    <div>
                                      <h4 className="font-medium text-gray-900 dark:text-white">
                                        {language === 'ur' 
                                          ? lesson.titleUrdu 
                                          : lesson.title}
                                      </h4>
                                      <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>{lesson.duration}</span>
                                        {lesson.resources?.length > 0 && (
                                          <span className="flex items-center gap-1">
                                            <HiDownload className="w-4 h-4" />
                                            {lesson.resources.length} {
                                              language === 'ur' ? 'وسائل' : 'resources'
                                            }
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {isEnrolled && (
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        setActiveLesson(lesson);
                                        setShowVideo(true);
                                      }}
                                    >
                                      <HiPlay className="w-4 h-4 mr-2" />
                                      {language === 'ur' ? 'دیکھیں' : 'Watch'}
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </Accordion.Content>
                        </Accordion.Panel>
                      ))}
                    </Accordion>
                  </Tabs.Item>

                  {/* Overview Tab */}
                  <Tabs.Item 
                    title={language === 'ur' ? 'جائزہ' : 'Overview'}
                    icon={HiDocumentText}
                  >
                    <Card>
                      <div className="prose dark:prose-invert max-w-none">
                        <h3>
                          {language === 'ur' ? 'آپ کیا سیکھیں گے' : 'What You Will Learn'}
                        </h3>
                        <ul className="space-y-2">
                          {course.learningOutcomes.map((outcome, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <HiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span>
                                {language === 'ur' ? outcome.urdu : outcome.en}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <h3>
                          {language === 'ur' ? 'ضروریات' : 'Requirements'}
                        </h3>
                        <ul className="space-y-2">
                          {course.requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <HiOutlineLightBulb className="w-5 h-5 text-blue-500 flex-shrink-0" />
                              <span>
                                {language === 'ur' ? req.urdu : req.en}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {course.description_long && (
                          <>
                            <h3>
                              {language === 'ur' ? 'تفصیلی جائزہ' : 'Detailed Description'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {language === 'ur' ? course.description_long_urdu : course.description_long}
                            </p>
                          </>
                        )}

                        {course.targetAudience && (
                          <>
                            <h3>
                              {language === 'ur' ? 'مطلوبہ سامعین' : 'Target Audience'}
                            </h3>
                            <ul className="space-y-2">
                              {course.targetAudience.map((audience, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <HiUserGroup className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                  <span>
                                    {language === 'ur' ? audience.urdu : audience.en}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </Card>
                  </Tabs.Item>

                  {/* Resources Tab */}
                  <Tabs.Item
                    title={language === 'ur' ? 'وسائل' : 'Resources'}
                    icon={HiDownload}
                  >
                    <Card>
                      <div className="space-y-4">
                        {course.resources?.map((resource, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <HiDocumentText className="w-6 h-6 text-gray-400" />
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {language === 'ur' ? resource.titleUrdu : resource.title}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {resource.fileSize}
                                </p>
                              </div>
                            </div>
                            {isEnrolled && (
                              <Button
                                size="sm"
                                onClick={() => handleDownloadResource(resource.id)}
                              >
                                <HiDownload className="w-4 h-4 mr-2" />
                                {language === 'ur' ? 'ڈاؤن لوڈ' : 'Download'}
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Tabs.Item>
                </Tabs.Group>
              </div>

              {/* Sidebar */}
              <div>
                <Card className="sticky top-20">
                  <div className="space-y-6">
                    {/* Instructor Info */}
                    <div className="flex items-center gap-4">
                      <Avatar
                        img={course.instructor.avatar}
                        alt={course.instructor.name}
                        size="lg"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {course.instructor.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {course.instructor.title}
                        </p>
                      </div>
                    </div>

                    <hr className="dark:border-gray-700" />

                    {/* Course Features */}
                    <div className="space-y-4">
                      {[
                        {
                          icon: HiOutlineAcademicCap,
                          label: language === 'ur' ? 'اسباق' : 'Lessons',
                          value: course.curriculum.reduce(
                            (acc, module) => acc + module.lessons.length, 
                            0
                          )
                        },
                        {
                          icon: HiClock,
                          label: language === 'ur' ? 'کل وقت' : 'Total Duration',
                          value: course.duration
                        },
                        {
                          icon: HiOutlineBriefcase,
                          label: language === 'ur' ? 'پروجیکٹس' : 'Projects',
                          value: course.projectsCount
                        }
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <feature.icon className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {feature.label}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {feature.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <hr className="dark:border-gray-700" />

                    {/* Enroll Button */}
                    {!isEnrolled ? (
                      <Button
                        gradientDuoTone="purpleToBlue"
                        className="w-full"
                        size="lg"
                        onClick={handleEnroll}
                        disabled={loading}
                      >
                        {loading 
                          ? (language === 'ur' ? 'داخلہ ہو رہا ہے...' : 'Enrolling...') 
                          : (language === 'ur' ? 'کورس میں داخلہ لیں' : 'Enroll Now')}
                      </Button>
                    ) : (
                      <Button
                        gradientDuoTone="purpleToBlue"
                        className="w-full"
                        size="lg"
                        onClick={() => {
                          if (course.curriculum[0]?.lessons[0]) {
                            setActiveLesson(course.curriculum[0].lessons[0]);
                            setShowVideo(true);
                          }
                        }}
                      >
                        <HiPlay className="w-5 h-5 mr-2" />
                        {language === 'ur' ? 'جاری رکھیں' : 'Continue Learning'}
                      </Button>
                    )}

                    {/* Share Course */}
                    <Button
                      color="gray"
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                      }}
                    >
                      {language === 'ur' ? 'کورس شیئر کریں' : 'Share Course'}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Certificate Modal */}
      <Modal
        show={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        title={language === 'ur' ? 'مبارک ہو!' : 'Congratulations!'}
        size="lg"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'ur' 
              ? 'آپ نے کورس مکمل کر لیا ہے!'
              : 'You have completed the course!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {language === 'ur'
              ? 'آپ اب اپنا سرٹیفکیٹ ڈاؤن لوڈ کر سکتے ہیں'
              : 'You can now download your certificate'}
          </p>
          <Button
            gradientDuoTone="purpleToBlue"
            size="lg"
            onClick={() => {
              // Handle certificate download
            }}
          >
            <HiDownload className="w-5 h-5 mr-2" />
            {language === 'ur' ? 'سرٹیفکیٹ ڈاؤن لوڈ کریں' : 'Download Certificate'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CourseDetails;