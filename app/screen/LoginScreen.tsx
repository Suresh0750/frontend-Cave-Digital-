import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import { loginUser } from '../services/_authService';
import Toast from 'react-native-toast-message';
import { LoginSchema } from '../ValidationSchema/useSchema';
import { AuthContext } from '../navigation/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';


const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {login} = useContext(AuthContext);
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        }
      } catch (error) {
        console.error('Error getting token:', error);
      }
    };

    checkToken();
  }); 

  const handleLogin = async (values: any) => {
    try {
      if(isLoading) return;
      setIsLoading(true);

      const response :any = await loginUser(values.email, values.password);
      console.log('Login successful:', response);
      if(response.success){
      await login(response.token);

       await Toast.show({
          text1: response?.message || 'Login successful',
          type: 'success',
          position: 'top',  
        });
        setTimeout(() => {
           navigation.navigate('Home');
        }, 2000);
        
      } 
    } catch (error:any) {
      Toast.show({
        text1: error?.message || 'Login failed',
        type: 'error',
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Login Header */}
      <Text style={styles.header}>Login</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            {/* Password Input */}
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            {/* Login Button */}
            <Button title="Login" onPress={()=>handleSubmit()} />

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
      <Toast />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff', // White background
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
    color: '#007BFF', // Blue color for the link
    fontWeight: 'bold',
  },
});

export default LoginScreen;