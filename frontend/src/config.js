// config.js
const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  baseUrl: import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000',
};

export default config;