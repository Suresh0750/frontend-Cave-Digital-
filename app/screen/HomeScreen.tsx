
import { View, Text, StyleSheet, Button, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Task } from '../types/tasks';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import {storeEditeTask } from '../store/slices/taskSlice';
import useTask from '../hooks/useTask';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TaskScreen() {
  const navigation = useNavigation();

  const {handleSearch,handleDelete,paginate,state:{searchText,currentPage,totalTasks,tasks,loading}} = useTask()

  const dispatch = useDispatch();
  const tasksPerPage = 5; 

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login' as never);
  }
 
 
  const handleEdit = (task:Task) => {
    dispatch(storeEditeTask(task));
    navigation.navigate('EditTask' as never); 
  }


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search tasks..."
        value={searchText}
        onChangeText={handleSearch}
      />
      <Button title="Add Task" onPress={() => navigation.navigate('AddTask' as never)} />
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={tasks as unknown as Task[]}
          keyExtractor={(item: Task) => item._id}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <View style={styles.taskActions}>
                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <Icon name="edit" size={18} color="black" /> 
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item._id)}>
                    <Icon name="trash-2" size={18} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.taskDescription}>{item.description}</Text>
            </View>
          )}
        />
      )}

      <View style={styles.pagination}>
        {Array.from({ length: Math.ceil(totalTasks / tasksPerPage) }, (_, index) => (
          <TouchableOpacity
            key={index + 1}
            style={[styles.pageButton, currentPage === index + 1 && styles.activePageButton]}
            onPress={() => paginate(index + 1)}
          >
            <Text style={styles.pageButtonText}>{index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Logout" onPress={() => handleLogout()} />
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
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  pageButton: {
    padding: 8,
    marginHorizontal: 4,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  activePageButton: {
    backgroundColor: '#007BFF',
  },
  pageButtonText: {
    color: '#000',
  },
  taskHeader:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  taskActions:{
    flexDirection:'row',
    alignItems:'center'
  }
});
