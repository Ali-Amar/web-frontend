import React from 'react';
import { Button as FlowbiteButton } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { HiOutlineLoading } from 'react-icons/hi';

const Button = ({ 
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon: Icon,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  gradientDuoTone,
  color,
  pill,
  outline,
  ...props
}) => {
  // Get language from redux store for any translated button text
  const {language} = useSelector(state => state.language) || 'en';

  // Styles based on variant
  const getVariantClasses = () => {
    if (gradientDuoTone || color) return {};

    const variants = {
      primary: {
        base: 'bg-blue-600 hover:bg-blue-700 text-white',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
      },
      secondary: {
        base: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
        outline: 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
      },
      success: {
        base: 'bg-green-600 hover:bg-green-700 text-white',
        outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50'
      },
      danger: {
        base: 'bg-red-600 hover:bg-red-700 text-white',
        outline: 'border-2 border-red-600 text-red-600 hover:bg-red-50'
      },
      warning: {
        base: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        outline: 'border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-50'
      }
    };

    return outline ? variants[variant].outline : variants[variant].base;
  };

  // Size classes
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  // If using Flowbite's built-in styles
  if (gradientDuoTone || color) {
    return (
      <FlowbiteButton
        gradientDuoTone={gradientDuoTone}
        color={color}
        size={size}
        pill={pill}
        outline={outline}
        disabled={disabled || loading}
        onClick={onClick}
        type={type}
        className={fullWidth ? 'w-full' : ''}
        {...props}
      >
        {loading ? (
          <>
            <HiOutlineLoading className="w-5 h-5 mr-2 animate-spin" />
            {language === 'ur' ? 'لوڈ ہو رہا ہے...' : 'Loading...'}
          </>
        ) : (
          <>
            {Icon && <Icon className="w-5 h-5 mr-2" />}
            {children}
          </>
        )}
      </FlowbiteButton>
    );
  }

  // Custom styled button
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        ${sizeClasses[size]}
        ${getVariantClasses()}
        ${pill ? 'rounded-full' : 'rounded-lg'}
        ${fullWidth ? 'w-full' : ''}
        font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${props.className || ''}
      `}
      {...props}
    >
      {loading ? (
        <>
          <HiOutlineLoading className="w-5 h-5 mr-2 animate-spin" />
          {language === 'ur' ? 'لوڈ ہو رہا ہے...' : 'Loading...'}
        </>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 mr-2" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;