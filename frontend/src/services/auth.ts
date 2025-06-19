import axiosInstance from '@/lib/api/axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

// Updated to match the new response format
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthResponseData {
  user: any;
  token: string;
  message: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

// This is what will be returned after the axios interceptor processes the response
type AuthResponse = AuthResponseData;

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/reset-password', data);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await axiosInstance.post('/logout');
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get('/user');
    return response.data?.user;
  },
};
