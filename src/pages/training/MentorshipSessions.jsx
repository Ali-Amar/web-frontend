import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  Button,
  Avatar,
  Badge,
  Modal,
  TextInput,
  Textarea,
  Select,
  Alert,
  Tabs,
  Progress
} from 'flowbite-react';
import {
  HiVideoCamera,
  HiCalendar,
  HiClock,
  HiDocumentText,
  HiExclamation,
  HiCheck,
  HiX,
  HiChat,
  HiPencil,
  HiClipboardList,
  HiLightningBolt,
  HiArrowRight,
  HiUserCircle
} from 'react-icons/hi';

const MentorshipSessions = () => {
  const {language} = useSelector(state => state.language) || 'en';
  const { currentUser } = useSelector(state => state.user);

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [successMessage, setSuccessMessage] = useState('');

  const [feedbackForm, setFeedbackForm] = useState({
    rating: '',
    progress: '0',
    strengths: '',
    improvements: '',
    nextSteps: '',
    notes: ''
  });

  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    averageRating: 0,
    totalMentees: 0
  });

  // Fetch sessions data
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'http://localhost:8080/api/mentor/sessions',
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`
            }
          }
        );
        
        if (!response.ok) throw new Error('Failed to fetch sessions');
        
        const data = await response.json();
        setSessions(data.sessions);
        setStats(data.stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.token) {
      fetchSessions();
    }
  }, [currentUser?.token]);

  // Update session status
  const handleStatusUpdate = async (sessionId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/mentor/sessions/${sessionId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!response.ok) throw new Error('Failed to update session status');

      setSessions(prevSessions =>
        prevSessions.map(session =>
          session._id === sessionId ? { ...session, status: newStatus } : session
        )
      );

      setSuccessMessage(
        language === 'ur'
          ? 'سیشن کی حیثیت کامیابی سے اپ ڈیٹ ہو گئی'
          : 'Session status updated successfully'
      );
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Submit session feedback
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/api/mentor/sessions/${selectedSession._id}/feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}`
          },
          body: JSON.stringify(feedbackForm)
        }
      );

      if (!response.ok) throw new Error('Failed to submit feedback');

      setSessions(prevSessions =>
        prevSessions.map(session =>
          session._id === selectedSession._id
            ? { ...session, feedback: feedbackForm, status: 'completed' }
            : session
        )
      );

      setShowFeedbackModal(false);
      setFeedbackForm({
        rating: '',
        progress: '0',
        strengths: '',
        improvements: '',
        nextSteps: '',
        notes: ''
      });

      setSuccessMessage(
        language === 'ur'
          ? 'فیڈبیک کامیابی سے جمع کر دی گئی'
          : 'Feedback submitted successfully'
      );
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      scheduled: 'info',
      ongoing: 'purple',
      completed: 'success',
      cancelled: 'failure',
      missed: 'warning'
    };

    const statusTranslations = {
      scheduled: { en: 'Scheduled', ur: 'شیڈول شدہ' },
      ongoing: { en: 'Ongoing', ur: 'جاری' },
      completed: { en: 'Completed', ur: 'مکمل' },
      cancelled: { en: 'Cancelled', ur: 'منسوخ' },
      missed: { en: 'Missed', ur: 'غیر حاضر' }
    };

    return (
      <Badge color={statusColors[status]}>
        {language === 'ur' ? statusTranslations[status]?.ur : statusTranslations[status]?.en}
      </Badge>
    );
  };

  const filterSessions = (tab) => {
    switch (tab) {
      case 'upcoming':
        return sessions.filter(session => ['scheduled'].includes(session.status));
      case 'ongoing':
        return sessions.filter(session => ['ongoing'].includes(session.status));
      case 'completed':
        return sessions.filter(session => ['completed'].includes(session.status));
      default:
        return sessions;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-4">
      {error && (
        <Alert color="failure" icon={HiExclamation} className="mb-4" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert color="success" icon={HiCheck} className="mb-4" onDismiss={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === 'ur' ? 'کل سیشنز' : 'Total Sessions'}
              </p>
              <h3 className="text-xl font-bold">{stats.totalSessions}</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <HiClipboardList className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === 'ur' ? 'مکمل شدہ' : 'Completed'}
              </p>
              <h3 className="text-xl font-bold">{stats.completedSessions}</h3>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <HiCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === 'ur' ? 'آنے والے' : 'Upcoming'}
              </p>
              <h3 className="text-xl font-bold">{stats.upcomingSessions}</h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <HiCalendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === 'ur' ? 'اوسط درجہ بندی' : 'Avg Rating'}
              </p>
              <h3 className="text-xl font-bold">{stats.averageRating.toFixed(1)}</h3>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <HiStar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {language === 'ur' ? 'کل طلباء' : 'Total Mentees'}
              </p>
              <h3 className="text-xl font-bold">{stats.totalMentees}</h3>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <HiUserCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <Tabs.Group
        aria-label="Sessions tabs"
        style="underline"
        onActiveTabChange={setActiveTab}
      >
        <Tabs.Item
          active={activeTab === 'upcoming'}
          title={language === 'ur' ? 'آنے والے' : 'Upcoming'}
          icon={HiCalendar}
        >
          <div className="grid gap-4">
            {filterSessions('upcoming').map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                language={language}
                onViewDetails={() => {
                  setSelectedSession(session);
                  setShowSessionModal(true);
                }}
                onStatusUpdate={handleStatusUpdate}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        </Tabs.Item>

        <Tabs.Item
          active={activeTab === 'ongoing'}
          title={language === 'ur' ? 'جاری' : 'Ongoing'}
          icon={HiVideoCamera}
        >
          <div className="grid gap-4">
            {filterSessions('ongoing').map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                language={language}
                onViewDetails={() => {
                  setSelectedSession(session);
                  setShowSessionModal(true);
                }}
                onStatusUpdate={handleStatusUpdate}
                onCompleteFeedback={() => {
                  setSelectedSession(session);
                  setShowFeedbackModal(true);
                }}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        </Tabs.Item>

        <Tabs.Item
          active={activeTab === 'completed'}
          title={language === 'ur' ? 'مکمل شدہ' : 'Completed'}
          icon={HiClipboardList}
        >
          <div className="grid gap-4">
            {filterSessions('completed').map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                language={language}
                onViewDetails={() => {
                  setSelectedSession(session);
                  setShowSessionModal(true);
                }}
                onViewFeedback={() => {
                  setSelectedSession(session);
                  setShowFeedbackModal(true);
                }}
                getStatusBadge={getStatusBadge}
                showFeedback
              />
            ))}
          </div>
        </Tabs.Item>
      </Tabs.Group>

      {/* Session Modal */}
      <Modal
        show={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        size="xl"
      >
        <Modal.Header>
          {language === 'ur' ? 'سیشن کی تفصیلات' : 'Session Details'}
        </Modal.Header>
        <Modal.Body>
          {selectedSession && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar
                  img={selectedSession.mentee.avatar}
                  alt={selectedSession.mentee.name}
                  size="lg"
                  rounded
                />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {selectedSession.mentee.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedSession.topic}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {language === 'ur' ? 'تاریخ' : 'Date'}
                  </p>
                  <p className="font-medium">
                    {new Date(selectedSession.dateTime).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {language === 'ur' ? 'وقت' : 'Time'}
                  </p>
                  <p className="font-medium">
                    {new Date(selectedSession.dateTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {language === 'ur' ? 'نوٹس' : 'Notes'}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedSession.notes}
                </p>
              </div>

              {/* Resources */}
              {selectedSession.resources?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    {language === 'ur' ? 'وسائل' : 'Resources'}
                  </p>
                  <div className="space-y-2">
                    {selectedSession.resources.map((resource, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <HiDocumentText className="w-5 h-5 text-gray-500" />
                          <span>{resource.name}</span>
                        </div>
                        <Button size="xs" color="gray" onClick={() => window.open(resource.url, '_blank')}>
                          <HiArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4">
                {selectedSession.status === 'scheduled' && (
                  <>
                    <Button
                      gradientDuoTone="purpleToBlue"
                      onClick={() => {
                        window.open(selectedSession.meetingLink, '_blank');
                        handleStatusUpdate(selectedSession._id, 'ongoing');
                      }}
                    >
                      <HiVideoCamera className="w-5 h-5 mr-2" />
                      {language === 'ur' ? 'سیشن شروع کریں' : 'Start Session'}
                    </Button>
                    <Button
                      color="gray"
                      onClick={() => handleStatusUpdate(selectedSession._id, 'cancelled')}
                    >
                      {language === 'ur' ? 'منسوخ کریں' : 'Cancel Session'}
                    </Button>
                  </>
                )}
                {selectedSession.status === 'ongoing' && (
                  <Button
                    gradientDuoTone="purpleToBlue"
                    onClick={() => {
                      setShowFeedbackModal(true);
                      setShowSessionModal(false);
                    }}
                    fullWidth
                  >
                    <HiCheck className="w-5 h-5 mr-2" />
                    {language === 'ur' ? 'سیشن مکمل کریں' : 'Complete Session'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        show={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        size="xl"
      >
        <Modal.Header>
          {selectedSession?.feedback 
            ? (language === 'ur' ? 'سیشن فیڈبیک' : 'Session Feedback')
            : (language === 'ur' ? 'فیڈبیک شامل کریں' : 'Add Feedback')}
        </Modal.Header>
        <Modal.Body>
          {selectedSession && (
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              {/* Progress Rating */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {language === 'ur' ? 'پیش رفت کی شرح' : 'Progress Rating'}
                </label>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {language === 'ur' ? 'پیش رفت' : 'Progress'}
                    </span>
                    <span>{feedbackForm.progress}%</span>
                  </div>
                  <Progress
                    progress={parseInt(feedbackForm.progress)}
                    size="lg"
                    color="purple"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={feedbackForm.progress}
                    onChange={(e) => setFeedbackForm(prev => ({
                      ...prev,
                      progress: e.target.value
                    }))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Strengths and Areas for Improvement */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {language === 'ur' ? 'مضبوط نکات' : 'Strengths'}
                  </label>
                  <Textarea
                    rows={4}
                    value={feedbackForm.strengths}
                    onChange={(e) => setFeedbackForm(prev => ({
                      ...prev,
                      strengths: e.target.value
                    }))}
                    placeholder={
                      language === 'ur' 
                        ? 'طالب علم کے مضبوط نکات درج کریں...'
                        : 'Enter mentee\'s strengths...'
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {language === 'ur' ? 'بہتری کے شعبے' : 'Areas for Improvement'}
                  </label>
                  <Textarea
                    rows={4}
                    value={feedbackForm.improvements}
                    onChange={(e) => setFeedbackForm(prev => ({
                      ...prev,
                      improvements: e.target.value
                    }))}
                    placeholder={
                      language === 'ur'
                        ? 'بہتری کے شعبے درج کریں...'
                        : 'Enter areas that need improvement...'
                    }
                    required
                  />
                </div>
              </div>

              {/* Next Steps */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {language === 'ur' ? 'اگلے اقدامات' : 'Next Steps'}
                </label>
                <Textarea
                  rows={3}
                  value={feedbackForm.nextSteps}
                  onChange={(e) => setFeedbackForm(prev => ({
                    ...prev,
                    nextSteps: e.target.value
                  }))}
                  placeholder={
                    language === 'ur'
                      ? 'اگلے سیشن کے لیے اقدامات...'
                      : 'Action items for next session...'
                  }
                  required
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {language === 'ur' ? 'اضافی نوٹس' : 'Additional Notes'}
                </label>
                <Textarea
                  rows={3}
                  value={feedbackForm.notes}
                  onChange={(e) => setFeedbackForm(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  placeholder={
                    language === 'ur'
                      ? 'کوئی اضافی نوٹس...'
                      : 'Any additional notes or observations...'
                  }
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <Button
                  color="gray"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
                </Button>
                {!selectedSession.feedback && (
                  <Button
                    type="submit"
                    gradientDuoTone="purpleToBlue"
                  >
                    <HiCheck className="w-5 h-5 mr-2" />
                    {language === 'ur' ? 'فیڈبیک جمع کریں' : 'Submit Feedback'}
                  </Button>
                )}
              </div>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

// SessionCard Component
const SessionCard = ({
  session,
  language,
  onViewDetails,
  onStatusUpdate,
  onCompleteFeedback,
  onViewFeedback,
  getStatusBadge,
  showFeedback
}) => (
  <Card>
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="flex items-start gap-4">
        <Avatar
          img={session.mentee.avatar}
          alt={session.mentee.name}
          size="lg"
          rounded
        />
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {session.mentee.name}
          </h3>
          <p className="text-sm text-gray-500">
            {session.topic}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center text-sm text-gray-500">
              <HiCalendar className="w-4 h-4 mr-1" />
              {new Date(session.dateTime).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <HiClock className="w-4 h-4 mr-1" />
              {new Date(session.dateTime).toLocaleTimeString()}
            </div>
            {getStatusBadge(session.status)}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          color="gray"
          onClick={onViewDetails}
        >
          {language === 'ur' ? 'تفصیلات' : 'Details'}
        </Button>
        {session.status === 'ongoing' && (
          <Button
            size="sm"
            gradientDuoTone="purpleToBlue"
            onClick={onCompleteFeedback}
          >
            <HiCheck className="w-4 h-4 mr-2" />
            {language === 'ur' ? 'مکمل کریں' : 'Complete'}
          </Button>
        )}
        {showFeedback && session.feedback && (
          <Button
            size="sm"
            color="gray"
            onClick={onViewFeedback}
          >
            <HiPencil className="w-4 h-4 mr-2" />
            {language === 'ur' ? 'فیڈبیک' : 'Feedback'}
          </Button>
        )}
      </div>
    </div>
  </Card>
);

export default MentorshipSessions;