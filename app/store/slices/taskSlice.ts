// app/store/slices/taskSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { Task } from '../../types/tasks';

// Initial state for tasks
const initialState = {
  tasks: null
};

// Create the task slice
const taskSlice = createSlice({
  name: 'tasks', // Slice name
  initialState, // Initial state
  reducers: {
    // Action to edit an existing task
    storeEditeTask: (state: any, action:{payload:Task | null}) => {
      state.tasks = action.payload  
    },
  },
});

// Export the actions
export const {storeEditeTask } = taskSlice.actions;

// Export the reducer
export default taskSlice.reducer;