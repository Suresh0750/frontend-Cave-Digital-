import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { signupUser } from '@/app/services/_authService';
import Toast from 'react-native-toast-message';


// Validation Schema
const SignupSchema = Yup.object().shape({
  name: Yup.string().trim().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string().trim()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

type SignupFormValues = {
  name: string;
  email: string;
  password: string;
};

type SignupScreenProps = {
  navigation: any; // Replace with proper navigation type if using @react-navigation
};

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (values: SignupFormValues) => {
    try {

      if(isLoading) return;
      setIsLoading(true);
      console.log('Signup values:', values);
      const response:any = await signupUser(values.name, values.email, values.password);
      console.log('Signup response:', response);
      if(response.success){
        Toast.show({
          text1: response?.message,
          type: 'success',
          position: 'top',
        });
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      }

    } catch (error:any) {
      Toast.show({
        text1: error?.message || 'Signup failed',
        type: 'error',
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Signup</Text>

        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              {/* Name Input */}
              <TextInput
                style={styles.input}
                placeholder="Name"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                accessibilityLabel="Name input"
              />
              {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

              {/* Email Input */}
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                accessibilityLabel="Email input"
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
                accessibilityLabel="Password input"
              />
              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}

              {/* Sign Up Button */}
              {isLoading ? (
                <ActivityIndicator size="small" color="#007BFF" />
              ) : (
                <TouchableOpacity style={styles.button} onPress={()=>handleSubmit()}>
                  <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
              )}

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>
      <Toast/>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
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
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default SignupScreen;