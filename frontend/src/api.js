import axios from 'axios';

// Create an instance with custom config
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Initialize auth header from localStorage if user exists
try {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    const user = JSON.parse(userJson);
    if (user && user.id) {
      console.log("Setting auth header on API initialization");
      api.defaults.headers.common['X-User-Info'] = userJson;
    }
  }
} catch (error) {
  console.error("Error initializing auth header:", error);
}

// Add request interceptor to log requests
api.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method?.toUpperCase() || 'UNKNOWN'} ${config.url}`);
    return config;
  },
  error => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to help with debugging
api.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} ${response.config.method?.toUpperCase() || 'UNKNOWN'} ${response.config.url}`);
    return response;
  },
  error => {
    const status = error.response?.status;
    const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
    const url = error.config?.url;
    
    console.error(`API Error ${status}: ${method} ${url}`, error.response?.data || error.message);
    
    // If 401 Unauthorized, clear auth state
    if (status === 401) {
      localStorage.removeItem('user');
      delete api.defaults.headers.common['X-User-Info'];
      // Notify about auth change
      window.dispatchEvent(new Event('auth-change'));
    }
    
    return Promise.reject(error);
  }
);

export default api;