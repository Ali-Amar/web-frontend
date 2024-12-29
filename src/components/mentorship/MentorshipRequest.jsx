import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Button,
  Card,
  Label,
  TextInput,
  Textarea,
  Select,
  Alert,
  Progress
} from 'flowbite-react';
import { 
  HiCalendar,
  HiClock,
  HiVideoCamera,
  HiChat,
  HiDocumentText,
  HiExclamation
} from 'react-icons/hi';

const MentorshipRequest = ({
  mentor,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {language} = useSelector(state => state.language) || 'en';
  const { currentUser } = useSelector(state => state.user);
  
  const [formData, setFormData] = useState({
    goals: '',
    goalsUrdu: '',
    preferredSchedule: 'morning',
    communicationMode: 'video',
    additionalNotes: '',
    additionalNotesUrdu: ''
  });
  
  const [error, setError] = useState(null);

  // Time slot options
  const scheduleOptions = [
    { value: 'morning', label: 'Morning (9 AM - 12 PM)', labelUrdu: 'صبح (9 بجے - 12 بجے)' },
    { value: 'afternoon', label: 'Afternoon (12 PM - 4 PM)', labelUrdu: 'دوپہر (12 بجے - 4 بجے)' },
    { value: 'evening', label: 'Evening (4 PM - 8 PM)', labelUrdu: 'شام (4 بجے - 8 بجے)' }
  ];

  // Communication mode options
  const communicationOptions = [
    { value: 'video', icon: HiVideoCamera, label: 'Video Call', labelUrdu: 'ویڈیو کال' },
    { value: 'chat', icon: HiChat, label: 'Chat', labelUrdu: 'چیٹ' },
    { value: 'both', icon: HiDocumentText, label: 'Both', labelUrdu: 'دونوں' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.goals || (language === 'ur' && !formData.goalsUrdu)) {
      setError(language === 'ur' ? 'براہ کرم اپنے مقاصد درج کریں' : 'Please enter your goals');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        mentorId: mentor.id,
        userId: currentUser.id
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      {/* Request Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {language === 'ur' 
              ? 'رہنمائی کی درخواست' 
              : 'Mentorship Request'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {language === 'ur'
              ? `${mentor.nameUrdu} کو رہنمائی کی درخواست`
              : `Request mentorship from ${mentor.name}`}
          </p>
        </div>
        {mentor.availability?.status === 'available' && (
          <Badge color="success">
            {language === 'ur' ? 'دستیاب' : 'Available'}
          </Badge>
        )}
      </div>

      {error && (
        <Alert color="failure" icon={HiExclamation} className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Goals */}
        <div>
          <Label 
            htmlFor="goals"
            value={language === 'ur' ? 'مقاصد اور توقعات' : 'Goals and Expectations'}
            className="mb-2"
          />
          <Textarea
            id="goals"
            name={language === 'ur' ? 'goalsUrdu' : 'goals'}
            value={language === 'ur' ? formData.goalsUrdu : formData.goals}
            onChange={handleChange}
            placeholder={
              language === 'ur'
                ? 'آپ اس رہنمائی سے کیا حاصل کرنا چاہتے ہیں...'
                : 'What do you want to achieve from this mentorship...'
            }
            rows={4}
            required
          />
        </div>

        {/* Preferred Schedule */}
        <div>
          <Label
            htmlFor="preferredSchedule"
            value={language === 'ur' ? 'ترجیحی شیڈول' : 'Preferred Schedule'}
            className="mb-2"
          />
          <Select
            id="preferredSchedule"
            name="preferredSchedule"
            value={formData.preferredSchedule}
            onChange={handleChange}
            required
          >
            {scheduleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {language === 'ur' ? option.labelUrdu : option.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Communication Mode */}
        <div>
          <Label
            value={language === 'ur' ? 'رابطے کا طریقہ' : 'Communication Mode'}
            className="mb-2"
          />
          <div className="grid grid-cols-3 gap-4">
            {communicationOptions.map(option => (
              <div
                key={option.value}
                className={`
                  flex flex-col items-center p-4 rounded-lg cursor-pointer
                  ${formData.communicationMode === option.value
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500'
                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                onClick={() => handleChange({
                  target: { name: 'communicationMode', value: option.value }
                })}
              >
                <option.icon className="w-6 h-6 mb-2 text-blue-600" />
                <span className="text-sm text-center">
                  {language === 'ur' ? option.labelUrdu : option.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <Label
            htmlFor="additionalNotes"
            value={language === 'ur' ? 'اضافی نوٹس' : 'Additional Notes'}
            className="mb-2"
          />
          <Textarea
            id="additionalNotes"
            name={language === 'ur' ? 'additionalNotesUrdu' : 'additionalNotes'}
            value={language === 'ur' ? formData.additionalNotesUrdu : formData.additionalNotes}
            onChange={handleChange}
            placeholder={
              language === 'ur'
                ? 'کوئی اضافی معلومات یا سوالات...'
                : 'Any additional information or questions...'
            }
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              language === 'ur' ? 'درخواست بھیج رہا ہے...' : 'Sending Request...'
            ) : (
              language === 'ur' ? 'درخواست بھیجیں' : 'Send Request'
            )}
          </Button>
          <Button
            color="gray"
            onClick={onCancel}
            disabled={isLoading}
          >
            {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MentorshipRequest;