
import { useCallback, useEffect, useState } from "react";
import { Alert, Task } from "react-native";
import Toast from "react-native-toast-message";
import { deleteTask, getTasks } from "../services/_taskService";
import { useFocusEffect } from "expo-router";
import _ from 'lodash'; 
import AsyncStorage from "@react-native-async-storage/async-storage";


const useTask = () => {

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [cachedTasks, setCachedTasks] = useState<{ [key: string]: Task[] }>({});
  const [cachedTotalPages,setCachedTotalPages] = useState<{ [key: string]: number}>({});
  
  const [loading, setLoading] = useState(false);
  const tasksPerPage = 5; 


//  useEffect(()=>{
//   const getToken = async () => {
//     const token = await AsyncStorage.getItem('token');
//     if(!token){
//       navigation.navigate('Login');
//     }
//   }

  /** 🔹 Fetch tasks with caching and API optimization */
  const fetchTasks = async (query: string, page: number) => {
    const cacheKey = `${query}-${page}`;

    // ✅ Check cache first to avoid unnecessary API calls
    if (cachedTasks[cacheKey]) {
      setTasks(cachedTasks[cacheKey]);
      setTotalTasks(Number(cachedTotalPages[cacheKey]))
      console.log(`Loaded from cache: ${cacheKey}`);
      return;
    }

    try {
      setLoading(true);
      const response: any = await getTasks(query, page, tasksPerPage);

      if (response.success) {
        setTasks(response.data.tasks);
        setTotalTasks(response.data.totalTasks);

        // ✅ Cache the new fetched data
        setCachedTasks((prev) => ({
          ...prev,
          [cacheKey]: response.data.tasks,
        }));
        setCachedTotalPages((prev)=>({
          ...prev,
          [cacheKey] : Number(response.data.totalTasks)
        }))

        console.log(`Fetched from API: ${cacheKey}`);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // *  Optimized search with debouncing
  const debouncedFetchTasks = useCallback(_.debounce(fetchTasks, 500), []);

  /** 🔹 Handle search input changes */
  const handleSearch = (text: string) => {
    setSearchText(text);
    setCurrentPage(1); // Reset to first page when searching

    // * Check cache first before making API call
    const cacheKey = `${text}-1`;
    if (cachedTasks[cacheKey]) {
      setTasks(cachedTasks[cacheKey]);
      console.log(`Loaded search results from cache for "${text}"`);
      return;
    }

    // ✅ Fetch only if not cached
    debouncedFetchTasks(text, 1);
  };
  const clearCache = useCallback(()=>{
    setTasks([]);
    setTotalTasks(0);
    setCachedTotalPages({});
    setCachedTasks({});
    setCurrentPage(1)
    fetchTasks(searchText, currentPage);
  },[])

  useFocusEffect(
    useCallback(() => {
      clearCache()
    }, [])
  );

  const handleDelete = (taskId: string) => {
    Alert.alert("Delete", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress:async () =>{
          try {
            const response:any = await deleteTask(taskId);
            console.log(response);
            if(response.success){
              Toast.show({
                type: "success",
                text1: response.message,
              });
              clearCache()
            }
          } catch (error:any) {
            console.log(error);
            Toast.show({
              type: "error",
              text1: error.message,
            });
          }
      } },
    ]);
  } 

  /** 🔹 Load tasks when searchText or currentPage changes */
  useEffect(() => {
    // Alert.alert('Hello', 'World');
    fetchTasks(searchText, currentPage);
  }, [searchText, currentPage]);

  /** 🔹 Handle pagination */
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // * logout


  return {
    tasks,
    totalTasks,
    loading,
    handleDelete,
    handleSearch,
    paginate,
    state : {
        searchText,
        currentPage,
        cachedTasks,
        cachedTotalPages,
        totalTasks,
        tasks,
        loading,
    }
  }

}

export default useTask;

