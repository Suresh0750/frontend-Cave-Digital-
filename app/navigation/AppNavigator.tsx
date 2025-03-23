import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screen/HomeScreen';
import LoginScreen from '../screen/LoginScreen';
import SignupScreen from '../screen/SignupScreen';
import AddTaskScreen from '../screen/AddTaskScreen';
import EditTaskScreen from '../screen/EditTaskScreen';


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'My Tasks' }} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Add Task' }} />
      <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ title: 'Edit Task' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
