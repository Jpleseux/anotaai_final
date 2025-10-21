import api from './api';

// Types
type LoginResponse = {
  token: string;
  user: {
    uuid: string;
    name: string;
    email: string;
  };
};

type RegisterParams = {
  name: string;
  email: string;
  password: string;
};

// Login function
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post<{ token: string }>('/auth/login', {
      email,
      password,
    });
    
    // Mock user data since the API doesn't return user info with the token
    // In a real app, you'd either get this from the API or decode from JWT
    const user = {
      uuid: '1', // This would normally come from the API or JWT
      name: email.split('@')[0], // Use part of email as name for demo
      email,
    };
    
    return {
      token: response.data.token,
      user,
    };
  } catch (error) {
    throw error;
  }
};

// Register function
export const register = async (name: string, email: string, password: string) => {
  try {
    await api.post('/auth/register', {
      name,
      email,
      password,
    });
    
    // Return success - the login will happen automatically after this
    return { success: true };
  } catch (error) {
    throw error;
  }
};