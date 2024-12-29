import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Card, 
  Progress, 
  Badge,
  Timeline,
  Button 
} from 'flowbite-react';
import { 
  HiCheckCircle,
  HiAcademicCap,
  HiChartBar,
  HiCalendar,
  HiClock,
  HiBadgeCheck,
  HiLightningBolt
} from 'react-icons/hi';

const ProgressTracking = ({ 
  userProgress,
  enrolledCourses,
  completedCourses,
  achievements,
  learningPath,
  timeSpent
}) => {
  const {language} = useSelector(state => state.language) || 'en';

  const calculateOverallProgress = () => {
    if (!enrolledCourses?.length) return 0;
    return Math.round((completedCourses?.length / enrolledCourses?.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {language === 'ur' ? 'مجموعی پیش رفت' : 'Overall Progress'}
          </h2>
          <Badge color="purple" size="lg">
            {calculateOverallProgress()}%
          </Badge>
        </div>

        <Progress
          progress={calculateOverallProgress()}
          size="lg"
          color="purple"
          labelProgress
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <HiAcademicCap className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {enrolledCourses?.length || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {language === 'ur' ? 'مجموعی کورسز' : 'Total Courses'}
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <HiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {completedCourses?.length || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {language === 'ur' ? 'مکمل کورسز' : 'Completed'}
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <HiClock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {timeSpent?.total || '0h'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {language === 'ur' ? 'کل وقت' : 'Time Spent'}
            </div>
          </div>
        </div>
      </Card>

      {/* Active Courses Progress */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {language === 'ur' ? 'فعال کورسز' : 'Active Courses'}
        </h3>
        <div className="space-y-4">
          {enrolledCourses?.map(course => {
            const progress = userProgress[course.id] || 0;
            return (
              <div key={course.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <course.icon className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">
                      {language === 'ur' ? course.titleUrdu : course.title}
                    </span>
                  </div>
                  <Badge color={progress === 100 ? 'success' : 'purple'}>
                    {progress}%
                  </Badge>
                </div>
                <Progress
                  progress={progress}
                  size="sm"
                  color={progress === 100 ? 'success' : 'purple'}
                />
                {/* Last Activity */}
                <div className="text-sm text-gray-500 flex items-center">
                  <HiClock className="w-4 h-4 mr-1" />
                  {language === 'ur' ? 'آخری سرگرمی:' : 'Last Activity:'} 
                  {course.lastActivity}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Learning Path */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {language === 'ur' ? 'سیکھنے کا راستہ' : 'Learning Path'}
        </h3>
        <Timeline>
          {learningPath?.map((step, index) => (
            <Timeline.Item key={index}>
              <Timeline.Point 
                icon={step.completed ? HiCheckCircle : HiClock}
                className={step.completed ? 'text-green-500' : 'text-gray-500'}
              />
              <Timeline.Content>
                <Timeline.Title className={
                  step.completed ? 'text-green-500' : 'text-gray-900 dark:text-white'
                }>
                  {language === 'ur' ? step.titleUrdu : step.title}
                </Timeline.Title>
                <Timeline.Body>
                  {language === 'ur' ? step.descriptionUrdu : step.description}
                </Timeline.Body>
                {step.nextAction && (
                  <Button
                    size="xs"
                    gradientDuoTone="purpleToBlue"
                    className="mt-2"
                    onClick={step.nextAction}
                  >
                    {language === 'ur' ? 'جاری رکھیں' : 'Continue'}
                  </Button>
                )}
              </Timeline.Content>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      {/* Achievements */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {language === 'ur' ? 'کامیابیاں' : 'Achievements'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements?.map((achievement, index) => (
            <div 
              key={index}
              className={`text-center p-4 rounded-lg ${
                achievement.unlocked 
                  ? 'bg-purple-50 dark:bg-purple-900/20' 
                  : 'bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <div className="flex justify-center mb-2">
                {achievement.unlocked ? (
                  <HiBadgeCheck className="w-8 h-8 text-purple-600" />
                ) : (
                  <HiLightningBolt className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <h4 className={`font-medium ${
                achievement.unlocked 
                  ? 'text-purple-600 dark:text-purple-400' 
                  : 'text-gray-500'
              }`}>
                {language === 'ur' ? achievement.titleUrdu : achievement.title}
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'ur' ? achievement.descriptionUrdu : achievement.description}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly Activity */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {language === 'ur' ? 'ہفتہ وار سرگرمی' : 'Weekly Activity'}
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {timeSpent?.weekly?.map((day, index) => (
            <div key={index} className="text-center">
              <div 
                className={`h-20 rounded-lg ${
                  day.hours > 0 
                    ? 'bg-purple-100 dark:bg-purple-900/20' 
                    : 'bg-gray-50 dark:bg-gray-800'
                }`}
                style={{
                  opacity: day.hours ? 0.3 + (day.hours / 4) * 0.7 : 0.3
                }}
              />
              <div className="text-xs mt-1 text-gray-500">
                {day.label}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProgressTracking;