import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Card, 
  Avatar, 
  Badge, 
  Button,
  Rating,
  Progress 
} from 'flowbite-react';
import { 
  HiAcademicCap,
  HiClock,
  HiLocationMarker,
  HiTranslate,
  HiUserGroup,
  HiCalendar
} from 'react-icons/hi';

const MentorCard = ({ 
  mentor,
  onRequestMentorship,
  onViewProfile,
  showDetailedStats = false,
  className = ''
}) => {
  const {language} = useSelector(state => state.language) || 'en';

  const {
    id,
    name,
    nameUrdu,
    avatar,
    title,
    titleUrdu,
    expertise,
    expertiseUrdu,
    location,
    locationUrdu,
    languages,
    rating,
    totalMentees,
    experience,
    experienceUrdu,
    availability,
    specializations,
    specializationsUrdu,
    bio,
    bioUrdu,
    achievements,
    achievementsUrdu,
    sessionStats
  } = mentor;

  // Calculate availability percentage
  const availabilityPercentage = Math.round(
    (availability.availableSlots / availability.totalSlots) * 100
  );

  return (
    <Card 
      className={`hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <div className="flex flex-col h-full">
        {/* Mentor Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar and Status */}
          <div className="relative">
            <Avatar
              img={avatar}
              alt={language === 'ur' ? nameUrdu : name}
              size="lg"
              className="ring-2 ring-purple-500"
            />
            {availability.status === 'available' && (
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {language === 'ur' ? nameUrdu : name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {language === 'ur' ? titleUrdu : title}
            </p>
          </div>

          {/* Rating */}
          <div className="text-right">
            <Rating>
              <Rating.Star value={rating} />
              <span className="ml-1 text-sm font-bold text-gray-900 dark:text-white">
                {rating}
              </span>
            </Rating>
            <p className="text-xs text-gray-500 mt-1">
              {totalMentees} {language === 'ur' ? 'طالب علم' : 'mentees'}
            </p>
          </div>
        </div>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {specializations.map((specialization, index) => (
            <Badge
              key={index}
              color="purple"
              className="text-sm"
            >
              {language === 'ur' 
                ? specializationsUrdu[index] 
                : specialization}
            </Badge>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            {
              icon: HiAcademicCap,
              value: experience,
              valueUrdu: experienceUrdu,
              label: language === 'ur' ? 'تجربہ' : 'Experience'
            },
            {
              icon: HiUserGroup,
              value: totalMentees,
              label: language === 'ur' ? 'طلباء' : 'Mentees'
            },
            {
              icon: HiCalendar,
              value: `${sessionStats.completedSessions}+`,
              label: language === 'ur' ? 'سیشنز' : 'Sessions'
            },
            {
              icon: HiTranslate,
              value: languages.join(', '),
              label: language === 'ur' ? 'زبانیں' : 'Languages'
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <stat.icon className="w-5 h-5 text-purple-600 mb-1" />
              <div className="font-semibold text-gray-900 dark:text-white">
                {language === 'ur' && stat.valueUrdu 
                  ? stat.valueUrdu 
                  : stat.value}
              </div>
              <div className="text-xs text-gray-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bio */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {language === 'ur' ? bioUrdu : bio}
        </p>

        {/* Detailed Stats (Optional) */}
        {showDetailedStats && (
          <div className="space-y-3 mb-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  {language === 'ur' ? 'دستیابی' : 'Availability'}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {availabilityPercentage}%
                </span>
              </div>
              <Progress
                progress={availabilityPercentage}
                size="sm"
                color={availabilityPercentage > 50 ? 'green' : 'yellow'}
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  {language === 'ur' ? 'اطمینان کی شرح' : 'Satisfaction Rate'}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {sessionStats.satisfactionRate}%
                </span>
              </div>
              <Progress
                progress={sessionStats.satisfactionRate}
                size="sm"
                color="purple"
              />
            </div>
          </div>
        )}

        {/* Location and Availability */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <HiLocationMarker className="w-4 h-4" />
            <span>{language === 'ur' ? locationUrdu : location}</span>
          </div>
          <div className="flex items-center gap-1">
            <HiClock className="w-4 h-4" />
            <span>
              {availability.nextAvailable} {language === 'ur' ? 'میں دستیاب' : 'available'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <Button
            gradientDuoTone="purpleToBlue"
            className="flex-1"
            onClick={() => onRequestMentorship(id)}
          >
            {language === 'ur' ? 'رہنمائی کی درخواست' : 'Request Mentorship'}
          </Button>
          <Button
            color="gray"
            onClick={() => onViewProfile(id)}
          >
            {language === 'ur' ? 'پروفائل' : 'Profile'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MentorCard;