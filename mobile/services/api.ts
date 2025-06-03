import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Base URL for the API
const API_URL = 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get token from secure storage
const getToken = async () => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('token');
  } else {
    return await SecureStore.getItemAsync('token');
  }
};

// Add request interceptor to add authorization header
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with a status code that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Handle unauthorized errors (e.g., token expired)
        // You could redirect to login here or refresh the token
        console.log('Unauthorized - you may need to login again');
      }
      
      // Return the error message from the server if available
      if (error.response.data && error.response.data.message) {
        return Promise.reject(new Error(error.response.data.message));
      }
    }
    
    // Network error or something prevented the request from completing
    return Promise.reject(
      new Error(error.message || 'Something went wrong. Please try again.')
    );
  }
);

export default api;