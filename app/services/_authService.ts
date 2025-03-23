import api, { errorHandler } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const loginUser = async (email: string, password: string) => {
  try {
    // console.log("email",email,"password",password,'api');
    const response:any = await api.post("/auth/login", { email, password });
    // console.log('Login response:', JSON.stringify(response));
    await AsyncStorage.setItem('token', response.token);
    return response;
  } catch (error:unknown) {
    throw errorHandler(error);
  }
};

export const signupUser = async (name: string,email:string, password: string) => {
    try {
      const response = await api.post("/auth/signup", { name, email, password });
      // console.log('User data:', response);
      return response;
    } catch (error:unknown) {
      throw errorHandler(error);
    }
  };
  
