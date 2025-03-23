import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import { EditTaskSchema } from '../ValidationSchema/taskSchema';
import { useSelector } from 'react-redux';
import { Task } from '../types/tasks';
import { updateTask } from '@/app/services/_taskService';

export default function EditTask() {

  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const task = useSelector((state: any) => state.tasks?.tasks);


    const handleEditTask = async (values: Task) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
        console.log(values);
        const response: any = await updateTask(values);

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
        initialValues={{ _id:task._id, title: task.title, description: task.description }}
        validationSchema={EditTaskSchema}
        onSubmit={handleEditTask}
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
            {touched.title && errors.title && typeof errors.title === 'string' && (
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
            {touched.description && errors.description && typeof errors.description === 'string' && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}

            {/* Add Task Button */}
            <Button title="Update Task" onPress={()=>handleSubmit()} />
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