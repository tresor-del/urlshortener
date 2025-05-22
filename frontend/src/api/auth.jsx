import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/' ;

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}register/`, userData);
        return response.data;
    } catch (error) {
        console.error('Register Error', error);
        throw error;
    }
}

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}api/token/`, credentials);
        return response.data;
    } catch (error) {
        console.error('Login Error', error);
        throw error;
    }
};

export const fetchUser = async (token) => {
  try {
    const response = await axios.get(`${API_URL}user/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;  // Return user data
  } catch (error) {
    console.error('Fetch Error', error);
    throw error;  // Rethrow the error to be handled later
  }
};