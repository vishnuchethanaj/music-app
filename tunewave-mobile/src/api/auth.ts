import axios from 'axios';
import api from './axios';

export type AuthUser = {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
  isArtist: boolean;
  createdAt: string;
};

export type AuthResponse = {
  success: boolean;
  token: string;
  user: AuthUser;
};

export type CurrentUserResponse = {
  success: boolean;
  user: AuthUser;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', payload);
  return response.data;
};

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', payload);
  return response.data;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await api.get<CurrentUserResponse>('/auth/me');
  return response.data.user;
};

export const logoutUser = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const apiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      return data.message;
    }
  }

  return fallback;
};
