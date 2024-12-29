import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Label, TextInput, Textarea, Button } from 'flowbite-react';

const MentorshipRequest = ({ mentor, onSubmit, onCancel }) => {
  const {language} = useSelector(state => state.language) || 'en';
  const [formData, setFormData] = useState({
    message: '',
    sessionType: mentor.sessionTypes[0]?.id || '',
    proposedDate: '',
    proposedTime: ''
  });

  const handleChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make API call to submit mentorship request
      const response = await fetch(`http://localhost:8080/api/mentorship-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mentor: mentor._id,
          ...formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit mentorship request');
      }

      // Handle successful submission
      onSubmit();
    } catch (error) {
      console.error('Error submitting mentorship request:', error);
      // Handle error scenario
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="message">
          {language === 'ur' ? 'پیغام' : 'Message'}
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          required
          value={formData.message}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="sessionType">
          {language === 'ur' ? 'سیشن کی قسم' : 'Session Type'}
        </Label>
        <select
          id="sessionType"
          name="sessionType"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          required
          value={formData.sessionType}
          onChange={handleChange}
        >
          {mentor.sessionTypes.map(type => (
            <option key={type.id} value={type.id}>
              {language === 'ur' ? type.titleUrdu : type.title} - {type.duration} {language === 'ur' ? 'منٹ' : 'minutes'}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="proposedDate">
            {language === 'ur' ? 'تجویز کردہ تاریخ' : 'Proposed Date'}
          </Label>
          <TextInput
            id="proposedDate"
            name="proposedDate"
            type="date"
            required
            value={formData.proposedDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="proposedTime">
            {language === 'ur' ? 'تجویز کردہ وقت' : 'Proposed Time'}
          </Label>
          <TextInput
            id="proposedTime"
            name="proposedTime"
            type="time"
            required
            value={formData.proposedTime}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button color="gray" onClick={onCancel}>
          {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
        </Button>
        <Button type="submit" gradientDuoTone="purpleToBlue">
          {language === 'ur' ? 'درخواست بھیجیں' : 'Send Request'}
        </Button>
      </div>
    </form>
  );
};

export default MentorshipRequest;