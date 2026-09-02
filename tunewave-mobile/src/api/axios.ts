import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authTokenStorageKey = 'tunewave_auth_token';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5000/api',
  // You might need to use your machine's IP address if testing on a physical device.
  // For the emulator, 10.0.2.2 is usually the address of the host machine.
  baseURL: 'http://10.0.2.2:5000/api',
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem(authTokenStorageKey);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting token from AsyncStorage', error);
  }

  return config;
});

export default api;
