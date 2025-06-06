// src/services/taskService.js
import { db } from "../firebase/firebaseConfig"; // اتصال به Firebase
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

const tasksCollection = collection(db, "tasks");

// دریافت تمام تسک‌های مربوط به کاربر فعلی
export const getAllTasks = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  // اگر کاربر وارد نشده باشد، آرایه خالی برگردان
  if (!user) {
    return [];
  }

  try {
    // فقط تسک‌هایی که userId آنها برابر با آیدی کاربر فعلی است
    const q = query(tasksCollection, where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("خطا در دریافت تسک‌ها:", error);
    return [];
  }
};

// اضافه کردن تسک جدید با آیدی کاربر
export const addTaskToDB = async (task) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error("کاربر وارد نشده است");
  }

  try {
    // اضافه کردن userId به تسک
    const taskWithUserId = {
      ...task,
      userId: user.uid,
    };
    
    const docRef = await addDoc(tasksCollection, taskWithUserId);
    return { id: docRef.id, ...taskWithUserId };
  } catch (error) {
    console.error("خطا در اضافه کردن تسک:", error);
    throw error;
  }
};

// به‌روزرسانی تسک (فقط اگر متعلق به کاربر فعلی باشد)
export const updateTaskInDB = async (id, updates) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error("کاربر وارد نشده است");
  }

  try {
    const taskRef = doc(db, "tasks", id);
    // اطمینان از اینکه userId تغییر نکند
    const { userId, ...safeUpdates } = updates;
    await updateDoc(taskRef, safeUpdates);
    return { id, ...safeUpdates };
  } catch (error) {
    console.error("خطا در به‌روزرسانی تسک:", error);
    throw error;
  }
};

// حذف تسک (فقط اگر متعلق به کاربر فعلی باشد)
export const deleteTaskFromDB = async (id) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error("کاربر وارد نشده است");
  }

  try {
    const taskRef = doc(db, "tasks", id);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("خطا در حذف تسک:", error);
    throw error;
  }
};