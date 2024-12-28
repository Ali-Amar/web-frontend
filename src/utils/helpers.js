import moment from 'moment';

// Date and Time Formatting
export const formatDate = (date, format = 'MMMM D, YYYY') => {
  return moment(date).format(format);
};

export const timeAgo = (date) => {
  return moment(date).fromNow();
};

// Price Formatting
export const formatPrice = (price, currency = 'PKR') => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(price);
};

// Text Utilities
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

// Validation Helpers
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (phone) => {
  const regex = /^(\+92|92|0)?(3\d{2}|4[89]\d|5\d{2}|6\d{2}|7\d{2}|8\d{2}|9\d{2})\d{7}$/;
  return regex.test(phone);
};

export const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(password);
};

// File Helpers
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Array and Object Utilities
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
};

export const sortByKey = (array, key, order = 'asc') => {
  return array.sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};

// Local Storage Helpers
export const storeItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error storing item:', error);
    return false;
  }
};

export const getItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error retrieving item:', error);
    return null;
  }
};

// Form Helpers
export const serializeForm = (formData) => {
  const obj = {};
  for (let [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
};

// Error Handling
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return {
      message: error.response.data.message || 'Server Error',
      status: error.response.status
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'No response from server',
      status: 503
    };
  } else {
    // Error in request setup
    return {
      message: error.message || 'Request Error',
      status: 400
    };
  }
};

// Progress Calculation
export const calculateProgress = (completed, total) => {
  return Math.round((completed / total) * 100);
};

// Role-based Access Control
export const hasPermission = (userRole, requiredRoles) => {
  return requiredRoles.includes(userRole);
};

// Input Sanitization
export const sanitizeInput = (input) => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim(); // Remove leading/trailing whitespace
};

// URL Helpers
export const getQueryParams = () => {
  return Object.fromEntries(new URLSearchParams(window.location.search));
};

export const buildUrl = (baseUrl, params) => {
  const url = new URL(baseUrl);
  Object.keys(params).forEach(key => 
    url.searchParams.append(key, params[key])
  );
  return url.toString();
};