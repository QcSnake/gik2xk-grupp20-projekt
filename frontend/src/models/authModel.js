import api from '../api.js';

export async function login(credentials) {
  try {
    const result = await api.post('/auth/login', credentials);
    
    if (result.status === 200) {
      // Store user in localStorage and set up API header for future requests
      localStorage.setItem('user', JSON.stringify(result.data));
      api.defaults.headers.common['X-User-Info'] = JSON.stringify(result.data);
      return result.data;
    } else {
      throw new Error(result.data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.error || 'Login failed. Please try again.');
  }
}

export async function register(userData) {
  try {
    const result = await api.post('/auth/register', userData);
    
    if (result.status === 200) {
      return result.data;
    } else {
      throw new Error(result.data.error || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.response?.data?.error || 'Registration failed. Please try again.');
  }
}

export function getCurrentUser() {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
}

export function logout() {
  localStorage.removeItem('user');
  // Remove the header
  delete api.defaults.headers.common['X-User-Info'];
}

export function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === 'admin';
}

export async function resetDatabase() {
  try {
    const result = await api.post('/auth/resetDatabase');
    
    if (result.status === 200) {
      return result.data;
    } else {
      throw new Error(result.data.error || 'Database reset failed');
    }
  } catch (error) {
    console.error('Database reset error:', error);
    throw new Error(error.response?.data?.error || 'Failed to reset database. Please try again.');
  }
}

// Initialize header if user is logged in
const user = getCurrentUser();
if (user) {
  api.defaults.headers.common['X-User-Info'] = JSON.stringify(user);
}
