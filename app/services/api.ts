
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACK_END_URL } from '@/app/utils/contstant';




const api: AxiosInstance = axios.create({
  baseURL: BACK_END_URL, 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  },
});

export const errorHandler = (error: unknown) => {
  console.log(error)
  let message ;
  if (axios.isAxiosError(error)) {
    message = error.response?.data?.message || 'API request failed';
  } else if (error instanceof Error) {
    message = error?.message ;
  }
  throw new Error(message ||'An unknown error occurred')
};


api.interceptors.request.use(
  async (config: any) => {   
    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem('token');  
    if (token) {
      config.headers = config.headers || {}; // Ensure headers object exists
      config.headers.Authorization = `Bearer ${token}`;
      
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    if (error.response) {
      
      if (error.response.status === 401) {
        console.log('Unauthorized access. Redirect to login.');
      
        AsyncStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;