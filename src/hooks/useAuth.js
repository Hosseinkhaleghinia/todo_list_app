// src/hooks/useAuth.js
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setTasks } from '../features/checkboxList/taskSlice';
import { getAllTasks } from '../services/taskService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // کاربر لاگین کرده - تسک‌هایش را بگیر
        try {
          const tasks = await getAllTasks();
          dispatch(setTasks(tasks));
        } catch (error) {
          console.error("خطا در دریافت تسک‌ها:", error);
          dispatch(setTasks([]));
        }
      } else {
        // کاربر لاگ‌اوت کرده - تسک‌ها را پاک کن
        dispatch(setTasks([]));
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  return { user, loading };
};