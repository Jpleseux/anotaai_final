import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { login, register } from '@/services/auth';

// Define types
type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Web storage fallback when SecureStore is not available (e.g., web)
const webStorage = {
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
  getItem: (key: string) => localStorage.getItem(key),
  deleteItem: (key: string) => localStorage.removeItem(key),
};

// Storage helper that works across platforms
const secureStorage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      webStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      return webStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  deleteItem: async (key: string) => {
    if (Platform.OS === 'web') {
      webStorage.deleteItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

// Create the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load token from storage on startup
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await secureStorage.getItem('token');
        const storedUser = await secureStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { token: newToken, user: userData } = await login(email, password);
      setToken(newToken);
      setUser(userData);
      
      // Save to storage
      await secureStorage.setItem('token', newToken);
      await secureStorage.setItem('user', JSON.stringify(userData));
      
      router.replace('/(tabs)');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await register(name, email, password);
      // After registration, sign in automatically
      await signIn(email, password);
    } catch (error: any) {
      setError(error.message || 'Failed to sign up');
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setToken(null);
    setUser(null);
    
    // Remove from storage
    await secureStorage.deleteItem('token');
    await secureStorage.deleteItem('user');
    
    router.replace('/(auth)/login');
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isLoading, 
        error, 
        signIn, 
        signUp, 
        signOut,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};