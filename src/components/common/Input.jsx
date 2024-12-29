import React, { forwardRef } from 'react';
import { TextInput, Label } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { HiExclamationCircle } from 'react-icons/hi';

const Input = forwardRef(({
  label,
  labelUrdu,
  error,
  icon: Icon,
  required,
  className,
  dir,
  type = 'text',
  ...props
}, ref) => {
  const {language} = useSelector(state => state.language) || 'en';

  return (
    <div className={`w-full ${className || ''}`}>
      {(label || labelUrdu) && (
        <div className="flex justify-between items-center mb-2">
          <Label
            htmlFor={props.id}
            value={language === 'ur' ? labelUrdu : label}
            className={`block text-sm font-medium text-gray-900 dark:text-white ${
              required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''
            }`}
          />
          
          {props.helperText && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {props.helperText}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <TextInput
          ref={ref}
          type={type}
          icon={Icon}
          color={error ? 'failure' : undefined}
          dir={dir || (language === 'ur' ? 'rtl' : 'ltr')}
          className={`
            block w-full rounded-lg
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 dark:border-red-500' : ''}
          `}
          {...props}
        />
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <HiExclamationCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;