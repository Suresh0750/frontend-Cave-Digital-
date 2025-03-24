import React, { useContext, useEffect, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../screen/HomeScreen';
import LoginScreen from '../screen/LoginScreen';
import SignupScreen from '../screen/SignupScreen';
import AddTaskScreen from '../screen/AddTaskScreen';
import EditTaskScreen from '../screen/EditTaskScreen';
import { AuthContext } from './AuthContext';
import { Alert } from 'react-native';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isLoggedIn, login } = useContext(AuthContext);


  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Add Task', headerShown: true }} />
          <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ title: 'Edit Task', headerShown: true }} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
