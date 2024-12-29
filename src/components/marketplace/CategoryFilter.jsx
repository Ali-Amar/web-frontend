import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  TextInput,
  Label,
  RangeSlider,
  Accordion,
  Checkbox,
  Rating
} from 'flowbite-react';
import {
  HiFilter,
  HiX,
  HiCheck,
  HiStar,
  HiLocationMarker
} from 'react-icons/hi';

const CategoryFilter = ({
  categories,
  initialFilters,
  onFilterChange,
  onReset,
  isLoading
}) => {
  const { language } = useSelector(state => state.language) || 'en';
  const [filters, setFilters] = useState(initialFilters || {
    category: '',
    subCategory: '',
    priceRange: [0, 10000],
    rating: 0,
    location: '',
    availability: false,
    shipping: [],
    certifications: [],
    sortBy: 'popularity'
  });

  console.log(filters);

  const [isPriceCustom, setIsPriceCustom] = useState(false);

  const priceRanges = [
    { label: 'Under Rs. 1000', value: [0, 1000] },
    { label: 'Rs. 1000 - Rs. 5000', value: [1000, 5000] },
    { label: 'Rs. 5000 - Rs. 10000', value: [5000, 10000] },
    { label: 'Above Rs. 10000', value: [10000, 50000] }
  ];

  const shippingOptions = [
    { id: 'free', label: language === 'ur' ? 'مفت ڈیلیوری' : 'Free Delivery' },
    { id: 'express', label: language === 'ur' ? 'فوری ڈیلیوری' : 'Express Delivery' },
    { id: 'pickup', label: language === 'ur' ? 'پک اپ دستیاب' : 'Pickup Available' }
  ];

  const certificationOptions = [
    { id: 'verified', label: language === 'ur' ? 'تصدیق شدہ سیلر' : 'Verified Seller' },
    { id: 'organic', label: language === 'ur' ? 'آرگینک' : 'Organic Certified' },
    { id: 'handicraft', label: language === 'ur' ? 'دستکاری' : 'Handicraft Certified' }
  ];

  const sortOptions = [
    { value: 'popularity', label: language === 'ur' ? 'مقبولیت' : 'Popularity' },
    { value: 'priceLow', label: language === 'ur' ? 'کم قیمت' : 'Price: Low to High' },
    { value: 'priceHigh', label: language === 'ur' ? 'زیادہ قیمت' : 'Price: High to Low' },
    { value: 'newest', label: language === 'ur' ? 'تازہ ترین' : 'Newest First' },
    { value: 'rating', label: language === 'ur' ? 'ریٹنگ' : 'Rating' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (range) => {
    setFilters(prev => ({
      ...prev,
      priceRange: range
    }));
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setIsPriceCustom(false);
    onReset();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <HiFilter className="w-5 h-5 mr-2 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {language === 'ur' ? 'فلٹرز' : 'Filters'}
          </h3>
        </div>
        <Button
          color="gray"
          size="sm"
          onClick={handleReset}
          disabled={isLoading}
        >
          <HiX className="w-4 h-4 mr-1" />
          {language === 'ur' ? 'ری سیٹ' : 'Reset'}
        </Button>
      </div>

      {/* Filter Sections */}
      <Accordion>
        {/* Categories */}
        <Accordion.Panel>
          <Accordion.Title>
            {language === 'ur' ? 'کیٹیگریز' : 'Categories'}
          </Accordion.Title>
          <Accordion.Content>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category._id} className="flex items-center">
                  <Checkbox
                    id={category._id}
                    checked={filters.category === category._id}
                    onChange={() => handleFilterChange('category', category.name)}
                  />
                  <Label htmlFor={category._id} className="ml-2">
                    {language === 'ur' ? category.nameUrdu : category.name}
                    <span className="text-sm text-gray-500 ml-1">
                      ({category.productCount})
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Panel>

        {/* Price Range */}
        <Accordion.Panel>
          <Accordion.Title>
            {language === 'ur' ? 'قیمت کی حد' : 'Price Range'}
          </Accordion.Title>
          <Accordion.Content>
            <div className="space-y-4">
              {/* Preset Ranges */}
              {!isPriceCustom && priceRanges.map((range, index) => (
                <div key={index} className="flex items-center">
                  <Checkbox
                    id={`price-${index}`}
                    checked={filters.priceRange[0] === range.value[0] &&
                      filters.priceRange[1] === range.value[1]}
                    onChange={() => handlePriceRangeChange(range.value)}
                  />
                  <Label htmlFor={`price-${index}`} className="ml-2">
                    {range.label}
                  </Label>
                </div>
              ))}

              {/* Custom Range */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Rs. {filters.priceRange[0]}</span>
                  <span className="text-sm">Rs. {filters.priceRange[1]}</span>
                </div>
                <RangeSlider
                  min={0}
                  max={50000}
                  step={100}
                  value={filters.priceRange}
                  onChange={handlePriceRangeChange}
                  className="w-full"
                />
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Panel>

        {/* Rating */}
        <Accordion.Panel>
          <Accordion.Title>
            {language === 'ur' ? 'ریٹنگ' : 'Rating'}
          </Accordion.Title>
          <Accordion.Content>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={filters.rating === rating}
                    onChange={() => handleFilterChange('rating', rating)}
                  />
                  <Label htmlFor={`rating-${rating}`} className="ml-2 flex items-center">
                    <Rating>
                      {[...Array(5)].map((_, index) => (
                        <Rating.Star
                          key={index}
                          filled={index < rating}
                        />
                      ))}
                    </Rating>
                    <span className="ml-2 text-sm text-gray-500">& up</span>
                  </Label>
                </div>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Panel>

        {/* Location */}
        <Accordion.Panel>
          <Accordion.Title>
            {language === 'ur' ? 'مقام' : 'Location'}
          </Accordion.Title>
          <Accordion.Content>
            <div className="space-y-4">
              <div className="flex items-center">
                <HiLocationMarker className="w-5 h-5 text-gray-400" />
                <TextInput
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder={language === 'ur' ? 'شہر یا علاقہ' : 'City or Region'}
                  className="ml-2"
                />
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Panel>

        {/* Shipping Options */}
        <Accordion.Panel>
          <Accordion.Title>
            {language === 'ur' ? 'ڈیلیوری کے اختیارات' : 'Shipping Options'}
          </Accordion.Title>
          <Accordion.Content>
            <div className="space-y-2">
              {shippingOptions.map(option => (
                <div key={option.id} className="flex items-center">
                  <Checkbox
                    id={option.id}
                    checked={filters.shipping.includes(option.id)}
                    onChange={(e) => {
                      const newShipping = e.target.checked
                        ? [...filters.shipping, option.id]
                        : filters.shipping.filter(id => id !== option.id);
                      handleFilterChange('shipping', newShipping);
                    }}
                  />
                  <Label htmlFor={option.id} className="ml-2">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Panel>

        {/* Certifications */}
        <Accordion.Panel>
          <Accordion.Title>
            {language === 'ur' ? 'سرٹیفیکیشنز' : 'Certifications'}
          </Accordion.Title>
          <Accordion.Content>
            <div className="space-y-2">
              {certificationOptions.map(cert => (
                <div key={cert.id} className="flex items-center">
                  <Checkbox
                    id={cert.id}
                    checked={filters.certifications.includes(cert.id)}
                    onChange={(e) => {
                      const newCerts = e.target.checked
                        ? [...filters.certifications, cert.id]
                        : filters.certifications.filter(id => id !== cert.id);
                      handleFilterChange('certifications', newCerts);
                    }}
                  />
                  <Label htmlFor={cert.id} className="ml-2">
                    {cert.label}
                  </Label>
                </div>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>

      {/* Sort Options */}
      <div className="mt-6">
        <Label htmlFor="sortBy" className="mb-2 block">
          {language === 'ur' ? 'ترتیب دیں' : 'Sort By'}
        </Label>
        <select
          id="sortBy"
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Apply Filters Button */}
      <div className="mt-6">
        <Button
          gradientDuoTone="purpleToBlue"
          className="w-full"
          onClick={() => onFilterChange(filters)}
          disabled={isLoading}
        >
          <HiCheck className="w-5 h-5 mr-2" />
          {language === 'ur' ? 'فلٹرز لاگو کریں' : 'Apply Filters'}
        </Button>
      </div>
    </div>
  );
};

export default CategoryFilter;