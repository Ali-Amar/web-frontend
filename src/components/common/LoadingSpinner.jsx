import React from 'react';
import { useSelector } from 'react-redux';
import { Spinner } from 'flowbite-react';

const LoadingSpinner = ({
  size = 'md',
  fullScreen = false,
  light = false,
  text = true,
  className = ''
}) => {
  const {language} = useSelector(state => state.language) || 'en';

  // Size mappings for spinner
  const spinnerSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  // Text sizes corresponding to spinner sizes
  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const content = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Spinner
        size={spinnerSizes[size]}
        className={light ? 'text-white' : 'text-blue-600 dark:text-blue-500'}
      />
      {text && (
        <p className={`
          mt-2 
          ${textSizes[size]}
          ${light ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
        `}>
          {language === 'ur' ? 'لوڈ ہو رہا ہے...' : 'Loading...'}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;