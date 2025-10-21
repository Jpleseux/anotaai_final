import { jwtDecode } from 'jwt-decode';
import { User } from '../types/api';

// Constants
const TOKEN_KEY = 'anotaai_token';

// Interface for decoded JWT token
interface DecodedToken {
  sub: string;
  name: string;
  email: string;
  exp: number;
}

// Save token to localStorage
export const saveAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  
  if (!token) {
    return false;
  }
  
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decodedToken.exp < currentTime) {
      removeAuthToken();
      return false;
    }
    
    return true;
  } catch (error) {
    removeAuthToken();
    return false;
  }
};

// Get current user from token
export const getCurrentUser = (): User | null => {
  const token = getAuthToken();
  
  if (!token) {
    return null;
  }
  
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    
    return {
      uuid: decodedToken.sub,
      name: decodedToken.name,
      email: decodedToken.email,
    };
  } catch (error) {
    return null;
  }
};