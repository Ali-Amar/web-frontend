import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Button, 
  Card, 
  Badge,
  TextInput,
  Alert,
  Modal,
  Rating
} from 'flowbite-react';
import { 
  HiCalendar,
  HiLocationMarker,
  HiUserGroup,
  HiClock,
  HiVideoCamera,
  HiSearch,
  HiFilter,
  HiPlus,
  HiOfficeBuilding,
  HiMail,
  HiPhone,
  HiGlobe
} from 'react-icons/hi';

import LoadingSpinner from '../../components/common/LoadingSpinner';

const Events = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const {language} = useSelector(state => state.language) || 'en';

  // State for events list and loading
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    date: '',
    mode: '',
    search: ''
  });

  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    titleUrdu: '',
    description: '',
    descriptionUrdu: '',
    type: 'workshop',
    date: '',
    time: '',
    location: '',
    locationUrdu: '',
    mode: 'online',
    maxParticipants: 20,
    meetingLink: '',
    contactEmail: '',
    contactPhone: '',
    image: null,
    prerequisites: '',
    prerequisitesUrdu: ''
  });

  // Event categories
  const eventTypes = [
    { id: 'workshop', label: 'Workshop', labelUrdu: 'ورکشاپ' },
    { id: 'training', label: 'Training', labelUrdu: 'تربیت' },
    { id: 'networking', label: 'Networking', labelUrdu: 'نیٹ ورکنگ' },
    { id: 'exhibition', label: 'Exhibition', labelUrdu: 'نمائش' },
    { id: 'webinar', label: 'Webinar', labelUrdu: 'ویبینار' },
    { id: 'mentoring', label: 'Mentoring Session', labelUrdu: 'مشاورت' }
  ];

  // Event modes
  const eventModes = [
    { id: 'online', label: 'Online', labelUrdu: 'آن لائن' },
    { id: 'inperson', label: 'In Person', labelUrdu: 'حاضری' },
    { id: 'hybrid', label: 'Hybrid', labelUrdu: 'ہائبرڈ' }
  ];

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/events?${queryParams}`, {
        headers: currentUser ? {
          'Authorization': `Bearer ${currentUser.token}`
        } : {}
      });
      
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const data = await response.json();
      setEvents(data.events);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      Object.keys(newEvent).forEach(key => {
        if (newEvent[key] !== null) {
          formData.append(key, newEvent[key]);
        }
      });

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to create event');

      setShowCreateModal(false);
      setNewEvent({
        title: '',
        titleUrdu: '',
        description: '',
        descriptionUrdu: '',
        type: 'workshop',
        date: '',
        time: '',
        location: '',
        locationUrdu: '',
        mode: 'online',
        maxParticipants: 20,
        meetingLink: '',
        contactEmail: '',
        contactPhone: '',
        image: null,
        prerequisites: '',
        prerequisitesUrdu: ''
      });
      
      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (eventId) => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/community/events' } });
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to register for event');

      fetchEvents();
      setShowRegisterModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}/unregister`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      if (!response.ok) throw new Error('Failed to unregister');

      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const EventCard = ({ event }) => {
    const isRegistered = event.participants?.includes(currentUser?.id);
    const isCreator = event.creator.id === currentUser?.id;
    const isFull = event.participants?.length >= event.maxParticipants;
    const isPast = new Date(event.date) < new Date();

    return (
      <Card className="hover:shadow-lg transition-shadow duration-300">
        {/* Event Image */}
        <div className="relative aspect-video mb-4">
          <img
            src={event.image}
            alt={language === 'ur' ? event.titleUrdu : event.title}
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge color={event.mode === 'online' ? 'blue' : 'purple'}>
              {language === 'ur' 
                ? eventModes.find(m => m.id === event.mode)?.labelUrdu
                : eventModes.find(m => m.id === event.mode)?.label}
            </Badge>
            {isPast && (
              <Badge color="gray">
                {language === 'ur' ? 'ختم شدہ' : 'Past Event'}
              </Badge>
            )}
          </div>
        </div>

        {/* Event Info */}
        <div className="space-y-4">
          <div>
            <Badge color="gray" className="mb-2">
              {language === 'ur'
                ? eventTypes.find(t => t.id === event.type)?.labelUrdu
                : eventTypes.find(t => t.id === event.type)?.label}
            </Badge>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {language === 'ur' ? event.titleUrdu : event.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
              {language === 'ur' ? event.descriptionUrdu : event.description}
            </p>
          </div>

          {/* Event Details */}
          <div className="space-y-2">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <HiCalendar className="w-5 h-5 mr-2" />
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              {event.mode === 'online' ? (
                <>
                  <HiVideoCamera className="w-5 h-5 mr-2" />
                  {language === 'ur' ? 'آن لائن' : 'Online Event'}
                </>
              ) : (
                <>
                  <HiLocationMarker className="w-5 h-5 mr-2" />
                  {language === 'ur' ? event.locationUrdu : event.location}
                </>
              )}
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <HiUserGroup className="w-5 h-5 mr-2" />
              {event.participants?.length || 0} / {event.maxParticipants} {
                language === 'ur' ? 'شرکاء' : 'participants'
              }
            </div>
          </div>

          {/* Progress Bar for Registration */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                {language === 'ur' ? 'رجسٹریشن' : 'Registration'}
              </span>
              <span className="font-medium">
                {Math.round((event.participants?.length || 0) / event.maxParticipants * 100)}%
              </span>
            </div>
            <Progress
              progress={(event.participants?.length || 0) / event.maxParticipants * 100}
              size="sm"
              color={isFull ? 'red' : 'blue'}
            />
          </div>

          {/* Event Organizer */}
          <div className="flex items-center gap-3 border-t dark:border-gray-700 pt-4">
            <img
              src={event.creator.avatar}
              alt={event.creator.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {event.creator.name}
              </p>
              <p className="text-xs text-gray-500">
                {language === 'ur' ? 'منتظم' : 'Organizer'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              gradientDuoTone={isRegistered ? 'purpleToBlue' : 'greenToBlue'}
              className="flex-1"
              disabled={isPast || (isFull && !isRegistered)}
              onClick={() => {
                if (isRegistered) {
                  setSelectedEvent(event);
                  setShowDetailModal(true);
                } else if (!isPast) {
                  setSelectedEvent(event);
                  setShowRegisterModal(true);
                }
              }}
            >
              {isRegistered 
                ? (language === 'ur' ? 'تفصیلات دیکھیں' : 'View Details')
                : isPast
                  ? (language === 'ur' ? 'ختم شدہ' : 'Event Ended')
                  : isFull
                    ? (language === 'ur' ? 'مکمل بھرا ہوا' : 'Fully Booked')
                    : (language === 'ur' ? 'رجسٹر کریں' : 'Register')}
            </Button>
            {isRegistered && !isPast && (
              <Button
                color="gray"
                onClick={() => handleUnregister(event.id)}
              >
                {language === 'ur' ? 'رجسٹریشن منسوخ کریں' : 'Unregister'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              {language === 'ur' 
                ? 'کمیونٹی ایونٹس'
                : 'Community Events'}
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {language === 'ur'
                ? 'دوسرے کاروباری خواتین سے ملیں، سیکھیں اور ترقی کریں'
                : 'Meet, learn, and grow with other women entrepreneurs'}
            </p>
            {(currentUser?.role === 'ngo' || currentUser?.role === 'mentor') && (
              <Button
                gradientDuoTone="pinkToOrange"
                size="xl"
                onClick={() => setShowCreateModal(true)}
              >
                <HiPlus className="w-5 h-5 mr-2" />
                {language === 'ur' ? 'نیا ایونٹ بنائیں' : 'Create Event'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 -mt-8">
        <Card className="mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <TextInput
              icon={HiSearch}
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder={language === 'ur' ? 'ایونٹس تلاش کریں...' : 'Search events...'}
            />
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="rounded-lg border-gray-300 dark:border-gray-600"
            >
              <option value="">
                {language === 'ur' ? 'تمام اقسام' : 'All Types'}
              </option>
              {eventTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {language === 'ur' ? type.labelUrdu : type.label}
                </option>
              ))}
            </select>

            <select
              value={filters.mode}
              onChange={(e) => setFilters(prev => ({ ...prev, mode: e.target.value }))}
              className="rounded-lg border-gray-300 dark:border-gray-600"
            >
              <option value="">
                {language === 'ur' ? 'تمام طریقے' : 'All Modes'}
              </option>
              {eventModes.map(mode => (
                <option key={mode.id} value={mode.id}>
                  {language === 'ur' ? mode.labelUrdu : mode.label}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className="rounded-lg border-gray-300 dark:border-gray-600"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </Card>
      </div>

      {/* Events List */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <Alert color="failure">
            {error}
          </Alert>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <HiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {language === 'ur' ? 'کوئی ایونٹ نہیں' : 'No Events Found'}
            </h3>
            <p className="text-gray-500">
              {language === 'ur'
                ? 'مختلف فلٹرز استعمال کر کے دیکھیں'
                : 'Try different filters or check back later'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      <Modal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        size="xl"
      >
        <Modal.Header>
          {language === 'ur' ? 'نیا ایونٹ بنائیں' : 'Create New Event'}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCreateEvent} className="space-y-6">
            {/* Title */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'عنوان (انگریزی)' : 'Title (English)'}
                </label>
                <TextInput
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'عنوان (اردو)' : 'Title (Urdu)'}
                </label>
                <TextInput
                  value={newEvent.titleUrdu}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, titleUrdu: e.target.value }))}
                  required
                  dir="rtl"
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'تفصیل (انگریزی)' : 'Description (English)'}
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'تفصیل (اردو)' : 'Description (Urdu)'}
                </label>
                <textarea
                  value={newEvent.descriptionUrdu}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, descriptionUrdu: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600"
                  rows={4}
                  required
                  dir="rtl"
                />
              </div>
            </div>

            {/* Event Type and Mode */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'ایونٹ کی قسم' : 'Event Type'}
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600"
                  required
                >
                  {eventTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {language === 'ur' ? type.labelUrdu : type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'ایونٹ کا طریقہ' : 'Event Mode'}
                </label>
                <select
                  value={newEvent.mode}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, mode: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600"
                  required
                >
                  {eventModes.map(mode => (
                    <option key={mode.id} value={mode.id}>
                      {language === 'ur' ? mode.labelUrdu : mode.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'تاریخ' : 'Date'}
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'وقت' : 'Time'}
                </label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600"
                  required
                />
              </div>
            </div>

            {/* Location (for in-person events) */}
            {newEvent.mode !== 'online' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {language === 'ur' ? 'مقام (انگریزی)' : 'Location (English)'}
                  </label>
                  <TextInput
                    value={newEvent.location}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {language === 'ur' ? 'مقام (اردو)' : 'Location (Urdu)'}
                  </label>
                  <TextInput
                    value={newEvent.locationUrdu}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, locationUrdu: e.target.value }))}
                    required
                    dir="rtl"
                  />
                </div>
              </div>
            )}

            {/* Meeting Link (for online events) */}
            {(newEvent.mode === 'online' || newEvent.mode === 'hybrid') && (
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'میٹنگ لنک' : 'Meeting Link'}
                </label>
                <TextInput
                  value={newEvent.meetingLink}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, meetingLink: e.target.value }))}
                  type="url"
                  placeholder="https://"
                  required
                />
              </div>
            )}

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'رابطہ ای میل' : 'Contact Email'}
                </label>
                <TextInput
                  value={newEvent.contactEmail}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, contactEmail: e.target.value }))}
                  type="email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'رابطہ فون' : 'Contact Phone'}
                </label>
                <TextInput
                  value={newEvent.contactPhone}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, contactPhone: e.target.value }))}
                  type="tel"
                  required
                />
              </div>
            </div>

            {/* Prerequisites */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'ضروریات (انگریزی)' : 'Prerequisites (English)'}
                </label>
                <textarea
                  value={newEvent.prerequisites}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, prerequisites: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'ضروریات (اردو)' : 'Prerequisites (Urdu)'}
                </label>
                <textarea
                  value={newEvent.prerequisitesUrdu}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, prerequisitesUrdu: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600"
                  rows={3}
                  dir="rtl"
                />
              </div>
            </div>

            {/* Maximum Participants */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {language === 'ur' ? 'زیادہ سے زیادہ شرکاء' : 'Maximum Participants'}
              </label>
              <TextInput
                type="number"
                value={newEvent.maxParticipants}
                onChange={(e) => setNewEvent(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                min={1}
                required
              />
            </div>

            {/* Event Image */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {language === 'ur' ? 'ایونٹ کی تصویر' : 'Event Image'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewEvent(prev => ({ ...prev, image: e.target.files[0] }))}
                className="w-full"
                required
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-4">
            <Button
              color="gray"
              onClick={() => setShowCreateModal(false)}
            >
              {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
            >
              {language === 'ur' ? 'ایونٹ بنائیں' : 'Create Event'}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Registration Modal */}
      <Modal
        show={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      >
        <Modal.Header>
          {language === 'ur' ? 'ایونٹ میں رجسٹر کریں' : 'Register for Event'}
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div className="space-y-6">
              {/* Event Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? selectedEvent.titleUrdu : selectedEvent.title}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <HiCalendar className="w-4 h-4 mr-2" />
                    {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    {selectedEvent.mode === 'online' ? (
                      <>
                        <HiVideoCamera className="w-4 h-4 mr-2" />
                        {language === 'ur' ? 'آن لائن ایونٹ' : 'Online Event'}
                      </>
                    ) : (
                      <>
                        <HiLocationMarker className="w-4 h-4 mr-2" />
                        {language === 'ur' ? selectedEvent.locationUrdu : selectedEvent.location}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              {selectedEvent.prerequisites && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {language === 'ur' ? 'ضروری شرائط' : 'Prerequisites'}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {language === 'ur' ? selectedEvent.prerequisitesUrdu : selectedEvent.prerequisites}
                  </p>
                </div>
              )}

              {/* Registration Confirmation */}
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'ur'
                  ? 'کیا آپ واقعی اس ایونٹ میں رجسٹر کرنا چاہتے ہیں؟'
                  : 'Are you sure you want to register for this event?'}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-4">
            <Button
              color="gray"
              onClick={() => setShowRegisterModal(false)}
            >
              {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
            </Button>
            <Button
              gradientDuoTone="purpleToBlue"
              onClick={() => handleRegister(selectedEvent.id)}
            >
              {language === 'ur' ? 'رجسٹر کریں' : 'Register'}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Event Details Modal */}
      <Modal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        size="lg"
      >
        <Modal.Header>
          {language === 'ur' ? 'ایونٹ کی تفصیلات' : 'Event Details'}
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div className="space-y-6">
              {/* Event Image */}
              <img
                src={selectedEvent.image}
                alt={language === 'ur' ? selectedEvent.titleUrdu : selectedEvent.title}
                className="w-full rounded-lg"
              />

              {/* Event Information */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? selectedEvent.titleUrdu : selectedEvent.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {language === 'ur' ? selectedEvent.descriptionUrdu : selectedEvent.description}
                </p>
              </div>

              {/* Event Details List */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <HiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {language === 'ur' ? 'تاریخ اور وقت' : 'Date & Time'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  {selectedEvent.mode === 'online' ? (
                    <>
                      <HiVideoCamera className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {language === 'ur' ? 'میٹنگ لنک' : 'Meeting Link'}
                        </h4>
                        <a 
                          href={selectedEvent.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedEvent.meetingLink}
                        </a>
                      </div>
                    </>
                  ) : (
                    <>
                      <HiLocationMarker className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {language === 'ur' ? 'مقام' : 'Location'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {language === 'ur' ? selectedEvent.locationUrdu : selectedEvent.location}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center">
                  <HiMail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {language === 'ur' ? 'رابطہ' : 'Contact'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedEvent.contactEmail}
                      {selectedEvent.contactPhone && ` • ${selectedEvent.contactPhone}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              {selectedEvent.prerequisites && (
                <div className="border-t dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {language === 'ur' ? 'ضروری شرائط' : 'Prerequisites'}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {language === 'ur' ? selectedEvent.prerequisitesUrdu : selectedEvent.prerequisites}
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end">
            <Button
              color="gray"
              onClick={() => setShowDetailModal(false)}
            >
              {language === 'ur' ? 'بند کریں' : 'Close'}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Events;