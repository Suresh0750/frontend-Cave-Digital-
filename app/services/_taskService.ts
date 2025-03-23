import axios from 'axios';
import api, { errorHandler } from './api';
import { Task } from '../types/tasks';
// Error handler function



// *  Add a new task
export const addTask = async (title: string, description: string) => {
  try {
    const response = await api.post('/tasks/', { title, description });
    return response;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
};

//  * get task 
export const getTasks = async (searchText:string,page:number,limit:number) => {
    try {
      const response = await api.get(`/tasks/?searchText=${searchText}&page=${page}&limit=${limit}`);
      // console.log('User data:', response);   
      return response

    } catch (error:unknown) {
      throw errorHandler(error);
    }
  };

  // * delete task
  export const deleteTask = async (taskId: string) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response;
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  };

  // * update task
  export const updateTask = async (task:Task) => {
    try {
      const response = await api.put(`/tasks/${task._id}`, task);
      // console.log(response,'response');
      return response;
    } catch (error: unknown) {
      throw errorHandler(error);
    }
  };
