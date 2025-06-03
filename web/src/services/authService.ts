import { post } from '../lib/api';
import { saveAuthToken, removeAuthToken } from '../lib/auth';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse 
} from '../types/api';

// Login user
export const login = async (credentials: LoginRequest): Promise<void> => {
  const response = await post<LoginResponse>('/auth/login', credentials);
  saveAuthToken(response.token);
};

// Register user
export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  return await post<RegisterResponse>('/auth/register', userData);
};

// Logout user
export const logout = (): void => {
  removeAuthToken();
};