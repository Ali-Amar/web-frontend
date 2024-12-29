import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Card,
  Avatar,
  Badge,
  Button,
  Progress,
  Tabs,
  Rating,
  Timeline,
  Modal
} from 'flowbite-react';
import {
  HiAcademicCap,
  HiUserGroup,
  HiClock,
  HiLocationMarker,
  HiGlobe,
  HiCalendar,
  HiChat,
  HiStar,
  HiBriefcase,
  HiLightBulb,
  HiDocumentText
} from 'react-icons/hi';
import MentorshipRequest from './MentorshipRequest';

const MentorProfile = () => {
  const { mentorId } = useParams();
  const {language} = useSelector(state => state.language) || 'en';
  const { currentUser } = useSelector(state => state.user);

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/mentors/${mentorId}`);
        if (!response.ok) throw new Error('Failed to fetch mentor profile');
        const data = await response.json();
        setMentor(data.mentor);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorProfile();
  }, [mentorId]);

  const calculateAvailability = (schedule) => {
    const availableSlots = schedule.filter(slot => slot.available).length;
    return Math.round((availableSlots / schedule.length) * 100);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error || !mentor) {
    return <div className="text-center text-red-500 p-4">{error || 'Mentor not found'}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Profile Header */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <Avatar
              size="xl"
              img={mentor.avatar}
              alt={mentor.name}
              className="w-40 h-40 mx-auto"
            />
          </div>
          <div className="md:w-3/4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? mentor.nameUrdu : mentor.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {language === 'ur' ? mentor.titleUrdu : mentor.title}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  gradientDuoTone="purpleToBlue"
                  onClick={() => setShowRequestModal(true)}
                >
                  <HiChat className="w-5 h-5 mr-2" />
                  {language === 'ur' ? 'رہنمائی کی درخواست' : 'Request Mentorship'}
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 my-6">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <HiAcademicCap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900 dark:text-white">
                  {mentor.experience}+ {language === 'ur' ? 'سال' : 'Years'}
                </div>
                <div className="text-sm text-gray-500">
                  {language === 'ur' ? 'تجربہ' : 'Experience'}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <HiUserGroup className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900 dark:text-white">
                  {mentor.totalMentees}+
                </div>
                <div className="text-sm text-gray-500">
                  {language === 'ur' ? 'طالب علم' : 'Mentees'}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <HiStar className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="font-semibold text-gray-900 dark:text-white">
                  {mentor.rating}
                </div>
                <div className="text-sm text-gray-500">
                  {language === 'ur' ? 'درجہ بندی' : 'Rating'}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <HiCalendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900 dark:text-white">
                  {calculateAvailability(mentor.schedule)}%
                </div>
                <div className="text-sm text-gray-500">
                  {language === 'ur' ? 'دستیابی' : 'Availability'}
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="flex flex-wrap gap-2 mb-4">
              {mentor.specializations.map((specialization, index) => (
                <Badge key={index} color="purple" className="text-sm">
                  {language === 'ur' ? mentor.specializationsUrdu[index] : specialization}
                </Badge>
              ))}
            </div>

            {/* Location & Languages */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <HiLocationMarker className="w-4 h-4 mr-1" />
                <span>{language === 'ur' ? mentor.locationUrdu : mentor.location}</span>
              </div>
              <div className="flex items-center">
                <HiGlobe className="w-4 h-4 mr-1" />
                <span>{mentor.languages.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Content */}
      <Tabs.Group
        aria-label="Mentor profile tabs"
        style="underline"
        onActiveTabChange={tab => setActiveTab(tab)}
      >
        <Tabs.Item
          active={activeTab === 'overview'}
          icon={HiUserGroup}
          title={language === 'ur' ? 'جائزہ' : 'Overview'}
        >
          <Card>
            <div className="space-y-6">
              {/* Bio */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === 'ur' ? 'تعارف' : 'About'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'ur' ? mentor.bioUrdu : mentor.bio}
                </p>
              </div>

              {/* Areas of Expertise */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === 'ur' ? 'مہارت کے شعبے' : 'Areas of Expertise'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {mentor.expertise.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <HiLightBulb className="w-5 h-5 text-purple-600" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {language === 'ur' ? mentor.expertiseUrdu[index].title : item.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {language === 'ur' ? mentor.expertiseUrdu[index].description : item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {language === 'ur' ? 'پیشہ ورانہ تجربہ' : 'Professional Experience'}
                </h3>
                <Timeline>
                  {mentor.experience_timeline.map((exp, index) => (
                    <Timeline.Item key={index}>
                      <Timeline.Point icon={HiBriefcase} />
                      <Timeline.Content>
                        <Timeline.Time>
                          {exp.duration}
                        </Timeline.Time>
                        <Timeline.Title>
                          {language === 'ur' ? exp.titleUrdu : exp.title}
                        </Timeline.Title>
                        <Timeline.Body>
                          {language === 'ur' ? exp.descriptionUrdu : exp.description}
                        </Timeline.Body>
                      </Timeline.Content>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            </div>
          </Card>
        </Tabs.Item>

        <Tabs.Item
          active={activeTab === 'reviews'}
          icon={HiStar}
          title={language === 'ur' ? 'جائزے' : 'Reviews'}
        >
          <Card>
            <div className="space-y-6">
              {/* Rating Overview */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {mentor.rating}
                  </div>
                  <Rating>
                    <Rating.Star value={mentor.rating} />
                  </Rating>
                  <div className="text-sm text-gray-500">
                    {mentor.reviews.length} {language === 'ur' ? 'جائزے' : 'reviews'}
                  </div>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500 w-8">{stars}</span>
                      <Progress
                        progress={
                          (mentor.reviews.filter(r => Math.round(r.rating) === stars).length /
                            mentor.reviews.length) *
                          100
                        }
                        size="sm"
                        color={stars > 3 ? 'success' : stars > 2 ? 'warning' : 'failure'}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-4">
                {mentor.reviews.map((review, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar img={review.user.avatar} alt={review.user.name} size="sm" rounded />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {review.user.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Rating>
                        <Rating.Star value={review.rating} />
                      </Rating>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Tabs.Item>

        <Tabs.Item
          active={activeTab === 'sessions'}
          icon={HiCalendar}
          title={language === 'ur' ? 'سیشنز' : 'Sessions'}
        >
          <Card>
            {/* Session Types */}
            <div className="grid md:grid-cols-2 gap-6">
              {mentor.sessionTypes.map((session, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:border-purple-500 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {language === 'ur' ? session.titleUrdu : session.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {session.duration} {language === 'ur' ? 'منٹ' : 'minutes'}
                      </p>
                    </div>
                    <Badge color="purple">
                      Rs. {session.price}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {language === 'ur' ? session.descriptionUrdu : session.description}
                  </p>
                  <Button
                    gradientDuoTone="purpleToBlue"
                    onClick={() => setShowRequestModal(true)}
                    fullWidth
                  >
                    {language === 'ur' ? 'بک کریں' : 'Book Session'}
                  </Button>
                </div>
              ))}
            </div>

            {/* Availability Calendar */}
            <div className="mt-6">
              <h3 className="font-semibold mb-4">
                {language === 'ur' ? 'دستیاب اوقات' : 'Available Time Slots'}
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {mentor.schedule.map((slot, index) => (
                  <div
                    key={index}
                    className={`p-2 text-center rounded ${
                      slot.available
                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 cursor-pointer hover:bg-purple-100'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    }`}
                  >
                    <div className="text-sm font-medium">
                      {new Date(slot.date).toLocaleDateString(undefined, { weekday: 'short' })}
                    </div>
                    <div className="text-xs">
                      {slot.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Tabs.Item>

        <Tabs.Item
          active={activeTab === 'resources'}
          icon={HiDocumentText}
          title={language === 'ur' ? 'وسائل' : 'Resources'}
        >
          <Card>
            <div className="grid md:grid-cols-2 gap-6">
              {mentor.resources.map((resource, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <HiDocumentText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {language === 'ur' ? resource.titleUrdu : resource.title}
                      </h4>
                      <p className="text-sm text-gray-500 mb-3">
                        {language === 'ur' ? resource.descriptionUrdu : resource.description}
                      </p>
                      <a
                        href={resource.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" color="gray">
                          {language === 'ur' ? 'ڈاؤن لوڈ' : 'Download'}
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Tabs.Item>
      </Tabs.Group>

      {/* Mentorship Request Modal */}
      {currentUser && (
        <Modal
          show={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          size="lg"
        >
          <Modal.Header>
            {language === 'ur' ? 'رہنمائی کی درخواست' : 'Request Mentorship'}
          </Modal.Header>
          <Modal.Body>
            <MentorshipRequest
              mentor={mentor}
              onSubmit={() => setShowRequestModal(false)}
              onCancel={() => setShowRequestModal(false)}
            />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default MentorProfile;