/**
 * Authentication API calls
 */

const BASE_URL = "https://dummyjson.com";

/**
 * Login API call
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {Promise<Object>} Response with token and user data
 */
export async function loginUser(username, password) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
      })
    });
    
    const data = await response.json();
    
    if (data.message) {
      throw new Error(data.message);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Register API call
 * @param {Object} userData - User data for registration
 * @returns {Promise<Object>} Response with user data
 */
export async function registerUser(userData) {
  try {
    const response = await fetch(`${BASE_URL}/users/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (data.message) {
      throw new Error(data.message);
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Get user profile API call
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} User profile data
 */
export async function getUserProfile(token) {
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });
    
    const data = await response.json();
    
    if (data.message) {
      throw new Error(data.message);
    }
    
    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
}
