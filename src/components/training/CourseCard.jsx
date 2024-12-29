import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Badge, 
  Progress, 
  Button,
  Tooltip 
} from 'flowbite-react';
import { 
  HiClock, 
  HiUserGroup, 
  HiTranslate,
  HiDocumentDownload,
  HiPlay,
  HiLockClosed,
  HiWifi,
  HiBookmark
} from 'react-icons/hi';

const CourseCard = ({ 
  course, 
  onEnroll, 
  onBookmark,
  userProgress,
  isEnrolled 
}) => {
  const {language} = useSelector(state => state.language) || 'en';
  const { currentUser } = useSelector(state => state.user);

  const {
    _id,
    title,
    titleUrdu,
    description,
    descriptionUrdu,
    thumbnail,
    duration,
    level,
    category,
    instructor,
    studentsCount,
    lessonsCount,
    hasOfflineAccess,
    isFree,
    languages,
    prerequisites,
    certificateOffered
  } = course;

  const getLevelColor = () => {
    switch(level.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'failure';
      default: return 'info';
    }
  };

  const progress = userProgress?.[_id] || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Course Thumbnail */}
      <div className="relative aspect-video">
        <img
          src={thumbnail}
          alt={language === 'ur' ? titleUrdu : title}
          className="w-full h-full object-cover"
        />
        {/* Overlay for enrolled courses */}
        {isEnrolled && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Button gradientDuoTone="purpleToBlue" size="sm">
              <HiPlay className="w-5 h-5 mr-2" />
              {language === 'ur' ? 'جاری رکھیں' : 'Continue Learning'}
            </Button>
          </div>
        )}
        {/* Level Badge */}
        <Badge
          color={getLevelColor()}
          className="absolute top-2 left-2"
        >
          {level}
        </Badge>
        {/* Bookmark Button */}
        <button
          onClick={() => onBookmark(_id)}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 transition-colors"
        >
          <HiBookmark className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Course Content */}
      <div className="p-4">
        {/* Category & Features */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge color="purple">
            {category}
          </Badge>
          {isFree && (
            <Badge color="success">
              {language === 'ur' ? 'مفت' : 'Free'}
            </Badge>
          )}
          {hasOfflineAccess && (
            <Tooltip content={language === 'ur' ? 'آف لائن دستیاب' : 'Available Offline'}>
              <Badge color="gray">
                <HiWifi className="w-4 h-4" />
              </Badge>
            </Tooltip>
          )}
          {certificateOffered && (
            <Tooltip content={language === 'ur' ? 'سرٹیفکیٹ شامل ہے' : 'Certificate Included'}>
              <Badge color="info">
                <HiDocumentDownload className="w-4 h-4" />
              </Badge>
            </Tooltip>
          )}
        </div>

        {/* Title & Description */}
        <Link to={`/course/${_id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2">
            {language === 'ur' ? titleUrdu : title}
          </h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {language === 'ur' ? descriptionUrdu : description}
        </p>

        {/* Instructor Info */}
        <div className="flex items-center mb-4">
          <img
            src={instructor.avatar}
            alt={instructor.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {instructor.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {instructor.expertise}
            </p>
          </div>
        </div>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <HiClock className="w-4 h-4 mr-1" />
            {duration}
          </div>
          <div className="flex items-center">
            <HiUserGroup className="w-4 h-4 mr-1" />
            {studentsCount}
          </div>
          <div className="flex items-center">
            <HiTranslate className="w-4 h-4 mr-1" />
            {languages.join(', ')}
          </div>
        </div>

        {/* Progress Bar for enrolled courses */}
        {isEnrolled && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                {language === 'ur' ? 'پیش رفت' : 'Progress'}
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {progress}%
              </span>
            </div>
            <Progress
              progress={progress}
              size="sm"
              color="purple"
            />
          </div>
        )}

        {/* Action Button */}
        {!isEnrolled ? (
          <Button
            gradientDuoTone="purpleToBlue"
            className="w-full"
            onClick={() => onEnroll(_id)}
          >
            {!isFree && <HiLockClosed className="w-4 h-4 mr-2" />}
            {language === 'ur' ? 'اندراج کریں' : 'Enroll Now'}
          </Button>
        ) : (
          <Link to={`/course/${_id}/learn`} className="block">
            <Button
              gradientDuoTone="purpleToBlue"
              className="w-full"
            >
              <HiPlay className="w-4 h-4 mr-2" />
              {language === 'ur' ? 'جاری رکھیں' : 'Continue Learning'}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default CourseCard;