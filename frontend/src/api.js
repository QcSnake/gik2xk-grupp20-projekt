import axios from 'axios';

// Skapa en axios-instans med specifika konfigurationer
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Lägg till interceptor för att logga förfrågningar (för enklare debugging)
api.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, 
      config.data ? config.data : '');
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Lägg till interceptor för att logga svar (för enklare debugging)
api.interceptors.response.use(
  response => {
    console.log(`API Response [${response.status}]: ${response.config.method.toUpperCase()} ${response.config.url}`);
    return response;
  },
  error => {
    console.error('API Response Error:', error.response || error);
    return Promise.reject(error);
  }
);

export default api;