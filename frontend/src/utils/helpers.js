/**
 * Format a date to a readable string
 * @param {string|Date} date - Date to format
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' })
  };
  return d.toLocaleDateString(undefined, options);
};

/**
 * Format a date as relative time (e.g., "2 hours ago")
 * @param {string|Date} date 
 * @returns {string}
 */
export const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 0) return 'just now';
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const count = Math.floor(seconds / secondsInUnit);
    if (count >= 1) {
      return `${count} ${unit}${count !== 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};

/**
 * Truncate a string to a maximum length
 * @param {string} str 
 * @param {number} length 
 * @param {string} suffix 
 * @returns {string}
 */
export const truncate = (str, length = 100, suffix = '...') => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length).trim() + suffix;
};

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} str 
 * @returns {string}
 */
export const escapeHtml = (str) => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Unescape HTML entities
 * @param {string} str 
 * @returns {string}
 */
export const unescapeHtml = (str) => {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  return re.test(email);
};

/**
 * Validate password strength (at least 6 characters)
 * @param {string} password 
 * @returns {boolean}
 */
export const isStrongPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validate username (alphanumeric, 3-20 characters)
 * @param {string} username 
 * @returns {boolean}
 */
export const isValidUsername = (username) => {
  const re = /^[a-zA-Z0-9_]{3,20}$/;
  return re.test(username);
};

/**
 * Debounce function for search inputs and expensive operations
 * @param {Function} func 
 * @param {number} delay 
 * @returns {Function}
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function to limit execution rate
 * @param {Function} func 
 * @param {number} limit 
 * @returns {Function}
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Copy text to clipboard
 * @param {string} text 
 * @returns {Promise<boolean>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Download a file from a URL
 * @param {string} url 
 * @param {string} filename 
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Get file extension from filename
 * @param {string} filename 
 * @returns {string}
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

/**
 * Format file size in bytes to human readable
 * @param {number} bytes 
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return 'Unknown size';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if file is an image
 * @param {string} filename 
 * @returns {boolean}
 */
export const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const ext = getFileExtension(filename);
  return imageExtensions.includes(ext);
};

/**
 * Check if file is a video
 * @param {string} filename 
 * @returns {boolean}
 */
export const isVideoFile = (filename) => {
  const videoExtensions = ['mp4', 'webm', 'avi', 'mov', 'mkv'];
  const ext = getFileExtension(filename);
  return videoExtensions.includes(ext);
};

/**
 * Check if user is on mobile device
 * @returns {boolean}
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Check if user is on desktop
 * @returns {boolean}
 */
export const isDesktop = () => {
  return !isMobile();
};

/**
 * Generate a random ID (for temporary use)
 * @returns {string}
 */
export const generateTempId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Parse query string from URL
 * @param {string} url 
 * @returns {Object}
 */
export const parseQueryParams = (url) => {
  const params = {};
  const queryString = url.split('?')[1];
  if (!queryString) return params;
  queryString.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });
  return params;
};

/**
 * Build query string from object
 * @param {Object} params 
 * @returns {string}
 */
export const buildQueryString = (params) => {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return query ? `?${query}` : '';
};

/**
 * Sleep/delay for async functions
 * @param {number} ms 
 * @returns {Promise}
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Capitalize first letter of each word
 * @param {string} str 
 * @returns {string}
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Capitalize first letter only
 * @param {string} str 
 * @returns {string}
 */
export const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert string to slug for URLs
 * @param {string} str 
 * @returns {string}
 */
export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

/**
 * Get a random item from an array
 * @param {Array} arr 
 * @returns {*}
 */
export const getRandomItem = (arr) => {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Shuffle an array (Fisher-Yates algorithm)
 * @param {Array} arr 
 * @returns {Array}
 */
export const shuffleArray = (arr) => {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/**
 * Remove duplicates from an array
 * @param {Array} arr 
 * @returns {Array}
 */
export const removeDuplicates = (arr) => {
  return [...new Set(arr)];
};

/**
 * Group array items by a key
 * @param {Array} arr 
 * @param {string} key 
 * @returns {Object}
 */
export const groupBy = (arr, key) => {
  return arr.reduce((group, item) => {
    const groupKey = item[key];
    group[groupKey] = group[groupKey] || [];
    group[groupKey].push(item);
    return group;
  }, {});
};

/**
 * Sort array by key
 * @param {Array} arr 
 * @param {string} key 
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array}
 */
export const sortBy = (arr, key, order = 'asc') => {
  return [...arr].sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

/**
 * Get nested object value using dot notation
 * @param {Object} obj 
 * @param {string} path 
 * @returns {*}
 */
export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Set nested object value using dot notation
 * @param {Object} obj 
 * @param {string} path 
 * @param {*} value 
 * @returns {Object}
 */
export const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
  return obj;
};

/**
 * Local storage wrapper with JSON support
 * @param {string} key 
 * @param {*} value - if provided, sets; if omitted, gets
 * @returns {*}
 */
export const storage = (key, value = undefined) => {
  if (value === undefined) {
    const item = localStorage.getItem(key);
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } else {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  }
};

/**
 * Clear all local storage data except specified keys
 * @param {Array} excludeKeys 
 */
export const clearStorageExcept = (excludeKeys = []) => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (!excludeKeys.includes(key)) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Show a toast notification (simple alert fallback)
 * @param {string} message 
 * @param {string} type - 'success', 'error', 'info'
 */
export const showToast = (message, type = 'info') => {
  // You can replace this with a proper toast library like react-hot-toast
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const icon = icons[type] || 'ℹ️';
  alert(`${icon} ${message}`);
};

/**
 * Scroll to top of page smoothly
 */
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Scroll to element by ID
 * @param {string} elementId 
 */
export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

/**
 * Detect dark mode preference
 * @returns {boolean}
 */
export const isDarkMode = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Get current URL without query parameters
 * @returns {string}
 */
export const getBaseUrl = () => {
  return window.location.origin + window.location.pathname;
};

/**
 * Reload current page
 */
export const reloadPage = () => {
  window.location.reload();
};

/**
 * Redirect to external URL
 * @param {string} url 
 * @param {boolean} newTab 
 */
export const redirectTo = (url, newTab = false) => {
  if (newTab) {
    window.open(url, '_blank');
  } else {
    window.location.href = url;
  }
};

export default {
  formatDate,
  timeAgo,
  truncate,
  escapeHtml,
  unescapeHtml,
  isValidEmail,
  isStrongPassword,
  isValidUsername,
  debounce,
  throttle,
  copyToClipboard,
  downloadFile,
  getFileExtension,
  formatFileSize,
  isImageFile,
  isVideoFile,
  isMobile,
  isDesktop,
  generateTempId,
  parseQueryParams,
  buildQueryString,
  sleep,
  capitalizeWords,
  capitalizeFirstLetter,
  slugify,
  getRandomItem,
  shuffleArray,
  removeDuplicates,
  groupBy,
  sortBy,
  getNestedValue,
  setNestedValue,
  storage,
  clearStorageExcept,
  showToast,
  scrollToTop,
  scrollToElement,
  isDarkMode,
  getBaseUrl,
  reloadPage,
  redirectTo
};