import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  TextInput,
  Button,
  Dropdown,
  Badge,
  Spinner
} from 'flowbite-react';
import { 
  HiSearch,
  HiFilter,
  HiSortAscending,
  HiTranslate
} from 'react-icons/hi';
import CourseCard from './CourseCard';

const CourseList = ({
  courses,
  isLoading,
  userProgress,
  enrolledCourses,
  onEnroll,
  onBookmark,
  onLoadMore,
  hasMore
}) => {
  const {language} = useSelector(state => state.language) || 'en';
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: '',
    language: '',
    duration: '',
    sort: 'popular'
  });

  const [displayedCourses, setDisplayedCourses] = useState(courses);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = [
    { id: 'business', label: language === 'ur' ? 'کاروبار' : 'Business Skills' },
    { id: 'crafts', label: language === 'ur' ? 'دستکاری' : 'Handicrafts' },
    { id: 'digital', label: language === 'ur' ? 'ڈیجیٹل مہارتیں' : 'Digital Skills' },
    { id: 'finance', label: language === 'ur' ? 'مالیات' : 'Financial Literacy' }
  ];

  const levels = [
    { id: 'beginner', label: language === 'ur' ? 'ابتدائی' : 'Beginner' },
    { id: 'intermediate', label: language === 'ur' ? 'درمیانی' : 'Intermediate' },
    { id: 'advanced', label: language === 'ur' ? 'ایڈوانسڈ' : 'Advanced' }
  ];

  const durations = [
    { id: 'short', label: language === 'ur' ? '2 گھنٹے سے کم' : 'Under 2 hours' },
    { id: 'medium', label: language === 'ur' ? '2-5 گھنٹے' : '2-5 hours' },
    { id: 'long', label: language === 'ur' ? '5 گھنٹے سے زیادہ' : 'Over 5 hours' }
  ];

  const sortOptions = [
    { id: 'popular', label: language === 'ur' ? 'مقبول' : 'Most Popular' },
    { id: 'newest', label: language === 'ur' ? 'تازہ ترین' : 'Newest First' },
    { id: 'rating', label: language === 'ur' ? 'ریٹنگ' : 'Highest Rated' }
  ];

  // Filter courses based on current filters
  useEffect(() => {
    let filtered = [...courses];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm) ||
        course.titleUrdu.includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(course => course.category === filters.category);
    }

    // Apply level filter
    if (filters.level) {
      filtered = filtered.filter(course => course.level === filters.level);
    }

    // Apply language filter
    if (filters.language) {
      filtered = filtered.filter(course => 
        course.languages.includes(filters.language)
      );
    }

    // Apply duration filter
    if (filters.duration) {
      filtered = filtered.filter(course => {
        const hours = parseInt(course.duration);
        switch(filters.duration) {
          case 'short': return hours < 2;
          case 'medium': return hours >= 2 && hours <= 5;
          case 'long': return hours > 5;
          default: return true;
        }
      });
    }

    // Apply sorting
    switch(filters.sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default: // 'popular'
        filtered.sort((a, b) => b.studentsCount - a.studentsCount);
    }

    setDisplayedCourses(filtered);
  }, [courses, filters]);

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      level: '',
      language: '',
      duration: '',
      sort: 'popular'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1">
          <TextInput
            type="text"
            icon={HiSearch}
            placeholder={language === 'ur' ? 'کورس تلاش کریں...' : 'Search courses...'}
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <Button
          color="gray"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <HiFilter className="w-5 h-5 mr-2" />
          {language === 'ur' ? 'فلٹرز' : 'Filters'}
        </Button>
        <Dropdown
          label={
            <div className="flex items-center">
              <HiSortAscending className="w-5 h-5 mr-2" />
              {sortOptions.find(opt => opt.id === filters.sort)?.label}
            </div>
          }
        >
          {sortOptions.map(option => (
            <Dropdown.Item
              key={option.id}
              onClick={() => setFilters(prev => ({ ...prev, sort: option.id }))}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>

      {/* Active Filters */}
      {Object.values(filters).some(Boolean) && (
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || key === 'search') return null;
            const label = (() => {
              switch(key) {
                case 'category':
                  return categories.find(c => c.id === value)?.label;
                case 'level':
                  return levels.find(l => l.id === value)?.label;
                case 'duration':
                  return durations.find(d => d.id === value)?.label;
                case 'sort':
                  return sortOptions.find(s => s.id === value)?.label;
                default:
                  return value;
              }
            })();

            return (
              <Badge
                key={key}
                color="info"
                className="flex items-center gap-2"
              >
                {label}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))}
                  className="ml-1"
                >
                  ×
                </button>
              </Badge>
            );
          })}
          {Object.values(filters).some(Boolean) && (
            <Button
              color="gray"
              size="xs"
              onClick={clearFilters}
            >
              {language === 'ur' ? 'صاف کریں' : 'Clear All'}
            </Button>
          )}
        </div>
      )}

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {/* Categories */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'ur' ? 'کیٹیگری' : 'Category'}
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-lg"
            >
              <option value="">{language === 'ur' ? 'تمام' : 'All'}</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'ur' ? 'سطح' : 'Level'}
            </label>
            <select
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
              className="w-full rounded-lg"
            >
              <option value="">{language === 'ur' ? 'تمام' : 'All'}</option>
              {levels.map(level => (
                <option key={level.id} value={level.id}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'ur' ? 'دورانیہ' : 'Duration'}
            </label>
            <select
              value={filters.duration}
              onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full rounded-lg"
            >
              <option value="">{language === 'ur' ? 'تمام' : 'All'}</option>
              {durations.map(duration => (
                <option key={duration.id} value={duration.id}>
                  {duration.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'ur' ? 'زبان' : 'Language'}
            </label>
            <select
              value={filters.language}
              onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
              className="w-full rounded-lg"
            >
              <option value="">{language === 'ur' ? 'تمام' : 'All'}</option>
              <option value="en">English</option>
              <option value="ur">اردو</option>
            </select>
          </div>
        </div>
      )}

      {/* Course Grid */}
      {isLoading && !displayedCourses.length ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" />
        </div>
      ) : displayedCourses.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.map(course => (
            <CourseCard
              key={course._id}
              course={course}
              onEnroll={onEnroll}
              onBookmark={onBookmark}
              userProgress={userProgress}
              isEnrolled={enrolledCourses?.includes(course._id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {language === 'ur' ? 'کوئی کورس نہیں ملا' : 'No Courses Found'}
          </h3>
          <p className="text-gray-500">
            {language === 'ur' 
              ? 'اپنی تلاش کو وسیع کریں یا فلٹرز کو ایڈجسٹ کریں'
              : 'Try broadening your search or adjusting the filters'}
          </p>
        </div>
      )}

      {/* Load More */}
      {hasMore && !isLoading && (
        <div className="flex justify-center mt-8">
          <Button
            gradientDuoTone="purpleToBlue"
            size="lg"
            onClick={onLoadMore}
          >
            {language === 'ur' ? 'مزید دکھائیں' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseList;