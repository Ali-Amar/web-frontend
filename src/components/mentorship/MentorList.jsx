import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  TextInput,
  Button,
  Dropdown,
  Badge,
  Card,
  Select
} from 'flowbite-react';
import { 
  HiSearch,
  HiFilter,
  HiSortAscending,
  HiLocationMarker,
  HiTranslate,
  HiAcademicCap,
  HiOfficeBuilding
} from 'react-icons/hi';

import MentorCard from './MentorCard';
import LoadingSpinner from '../common/LoadingSpinner';

const MentorList = ({
  onRequestMentorship,
  onViewProfile
}) => {
  const {language} = useSelector(state => state.language) || 'en';
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    expertise: '',
    location: '',
    language: '',
    availability: '',
    rating: '',
    sort: 'rating'
  });

  const [showFilters, setShowFilters] = useState(false);

  // Filter options
  const filterOptions = {
    expertise: [
      { id: 'business', label: language === 'ur' ? 'کاروبار' : 'Business' },
      { id: 'handicrafts', label: language === 'ur' ? 'دستکاری' : 'Handicrafts' },
      { id: 'marketing', label: language === 'ur' ? 'مارکیٹنگ' : 'Marketing' },
      { id: 'finance', label: language === 'ur' ? 'فنانس' : 'Finance' }
    ],
    languages: [
      { id: 'ur', label: 'اردو' },
      { id: 'en', label: 'English' },
      { id: 'pa', label: language === 'ur' ? 'پنجابی' : 'Punjabi' },
      { id: 'sd', label: language === 'ur' ? 'سندھی' : 'Sindhi' }
    ],
    availability: [
      { id: 'available', label: language === 'ur' ? 'ابھی دستیاب' : 'Available Now' },
      { id: 'this_week', label: language === 'ur' ? 'اس ہفتے' : 'This Week' },
      { id: 'next_week', label: language === 'ur' ? 'اگلے ہفتے' : 'Next Week' }
    ],
    sort: [
      { id: 'rating', label: language === 'ur' ? 'درجہ بندی' : 'Rating' },
      { id: 'experience', label: language === 'ur' ? 'تجربہ' : 'Experience' },
      { id: 'mentees', label: language === 'ur' ? 'طلباء' : 'Mentees' }
    ]
  };

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`/api/mentors?${queryParams}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        setMentors(data.mentors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      expertise: '',
      location: '',
      language: '',
      availability: '',
      rating: '',
      sort: 'rating'
    });
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-wrap gap-4">
            <TextInput
              type="text"
              icon={HiSearch}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder={
                language === 'ur' 
                  ? 'نام یا مہارت سے تلاش کریں...'
                  : 'Search by name or expertise...'
              }
              className="flex-1"
            />
            <Button
              color="gray"
              onClick={() => setShowFilters(!showFilters)}
            >
              <HiFilter className="w-5 h-5 mr-2" />
              {language === 'ur' ? 'فلٹرز' : 'Filters'}
            </Button>
            <Dropdown
              label={
                <div className="flex items-center">
                  <HiSortAscending className="w-5 h-5 mr-2" />
                  {language === 'ur' ? 'ترتیب دیں' : 'Sort By'}
                </div>
              }
            >
              {filterOptions.sort.map(option => (
                <Dropdown.Item
                  key={option.id}
                  onClick={() => handleFilterChange('sort', option.id)}
                >
                  {option.label}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Expertise Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'مہارت' : 'Expertise'}
                </label>
                <Select
                  value={filters.expertise}
                  onChange={(e) => handleFilterChange('expertise', e.target.value)}
                  icon={HiAcademicCap}
                >
                  <option value="">
                    {language === 'ur' ? 'تمام مہارتیں' : 'All Expertise'}
                  </option>
                  {filterOptions.expertise.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'زبان' : 'Language'}
                </label>
                <Select
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  icon={HiTranslate}
                >
                  <option value="">
                    {language === 'ur' ? 'تمام زبانیں' : 'All Languages'}
                  </option>
                  {filterOptions.languages.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'مقام' : 'Location'}
                </label>
                <TextInput
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder={language === 'ur' ? 'شہر یا علاقہ' : 'City or Region'}
                  icon={HiLocationMarker}
                />
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ur' ? 'دستیابی' : 'Availability'}
                </label>
                <Select
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  icon={HiOfficeBuilding}
                >
                  <option value="">
                    {language === 'ur' ? 'کوئی بھی وقت' : 'Any Time'}
                  </option>
                  {filterOptions.availability.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {Object.entries(filters).some(([key, value]) => value && key !== 'search' && key !== 'sort') && (
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || key === 'search' || key === 'sort') return null;
                
                let label = value;
                if (key === 'expertise') {
                  label = filterOptions.expertise.find(opt => opt.id === value)?.label;
                } else if (key === 'language') {
                  label = filterOptions.languages.find(opt => opt.id === value)?.label;
                } else if (key === 'availability') {
                  label = filterOptions.availability.find(opt => opt.id === value)?.label;
                }

                return (
                  <Badge
                    key={key}
                    color="purple"
                    className="flex items-center gap-2"
                  >
                    {label}
                    <button
                      onClick={() => handleFilterChange(key, '')}
                      className="ml-1"
                    >
                      ×
                    </button>
                  </Badge>
                );
              })}
              <Button
                color="gray"
                size="xs"
                onClick={clearFilters}
              >
                {language === 'ur' ? 'فلٹرز صاف کریں' : 'Clear Filters'}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Mentors Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : mentors.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {language === 'ur' ? 'کوئی مینٹر نہیں ملا' : 'No Mentors Found'}
          </h3>
          <p className="text-gray-500">
            {language === 'ur' 
              ? 'اپنی تلاش کو وسیع کرنے کے لیے فلٹرز کو ایڈجسٹ کریں'
              : 'Try adjusting your filters to broaden your search'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map(mentor => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onRequestMentorship={onRequestMentorship}
              onViewProfile={onViewProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorList;