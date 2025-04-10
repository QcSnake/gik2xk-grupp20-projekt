import api from '../api.js';

export async function login(email, password) {
  try {
    console.log("Försöker logga in med:", email);
    const credentials = { email, password };
    
    const result = await api.post('/auth/login', credentials);
    
    if (result.status === 200 && result.data) {
      console.log("Inloggning lyckades:", result.data);
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(result.data));
      
      // Set auth header for future requests
      api.defaults.headers.common['X-User-Info'] = JSON.stringify(result.data);
      
      // Dispatch auth change event to update UI everywhere
      window.dispatchEvent(new Event('auth-change'));
      
      return result.data;
    } else {
      console.error("Oväntat svar från servern:", result);
      throw new Error(result.data?.error || 'Inloggning misslyckades');
    }
  } catch (error) {
    console.error('Inloggningsfel:', error);
    throw new Error(error.response?.data?.error || 'Inloggning misslyckades. Försök igen.');
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
  try {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    
    const user = JSON.parse(userJson);
    
    // Verify user object is valid
    if (!user || !user.id || !user.email) {
      console.warn("Invalid user data in localStorage, clearing...");
      localStorage.removeItem('user');
      return null;
    }
    
    // Also set the header when getting current user (helps when page refreshes)
    api.defaults.headers.common['X-User-Info'] = userJson;
    
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    localStorage.removeItem('user');
    return null;
  }
}

export function logout() {
  // Remove user from localStorage
  localStorage.removeItem('user');
  
  // Remove auth header
  delete api.defaults.headers.common['X-User-Info'];
  
  // Dispatch auth change event
  window.dispatchEvent(new Event('auth-change'));
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

// This runs when the file is imported - ensure headers are set on page load
const user = getCurrentUser();
if (user) {
  console.log("Found existing user session:", user.email);
  api.defaults.headers.common['X-User-Info'] = JSON.stringify(user);
}
