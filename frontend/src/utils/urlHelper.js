// utils/urlHelper.js
const getBaseUrl = () => {
  // For production, use environment variable
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL?.replace('/api', '') || '';
  }
  // For development
  return 'http://localhost:5000';
};

export const getFullUrl = (url) => {
  if (!url) return null;
  // If it's already a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Otherwise, prepend base URL
  return `${getBaseUrl()}${url}`;
};

export const isFullUrl = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://'));
};