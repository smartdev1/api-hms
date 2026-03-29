import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// En mode "Web", le navigateur tourne sur votre PC donc il connait 'localhost'. En mode mobile, c'est l'IP.
const BASE_URL = Platform.OS === 'web' ? 'http://localhost:3000/v1' : 'http://192.168.1.69:3000/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync('access_token', token);
};

export const deleteToken = async () => {
  await SecureStore.deleteItemAsync('access_token');
};
