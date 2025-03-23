import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import { addTask } from '@/app/services/_taskService';
import Toast from 'react-native-toast-message';
import { TaskSchema } from '../ValidationSchema/taskSchema';



export default function AddTask({ navigation }: { navigation: any }) {

  const [isLoading, setIsLoading] = useState(false);

const handleAddTask = async (values: any) => {
  if (isLoading) return;

  setIsLoading(true); 

  try {
    const response: any = await addTask(values.title, values.description);

    if (response?.success) {
      Toast.show({
        type: 'success',
        text1: response.message || 'Task added successfully',
      });

      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    }
  } catch (error: any) {
    console.error('Error:', error?.message || error);

    Toast.show({
      type: 'error',
      text1: error?.message || 'Something went wrong',
    });
  } finally {
    setIsLoading(false); 
  }
};


  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ title: '', description: '' }}
        validationSchema={TaskSchema}
        onSubmit={handleAddTask}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            {/* Task Title Input */}
            <TextInput
              style={styles.input}
              placeholder="Task Title"
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              value={values.title}
            />
            {touched.title && errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}

            {/* Task Description Input */}
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Task Description"
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
              multiline
            />
            {touched.description && errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}

            {/* Add Task Button */}
            <Button title="Add Task" onPress={()=>handleSubmit()} />
          </>
        )}
      </Formik>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top', // Align text to the top for multiline input
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
  },
});