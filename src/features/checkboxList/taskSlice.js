import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    id: "initial", // برای تشخیص اینکه نمونه اولیه‌ست
    title: "Example",
    description: "Description ...",
    dateTime: new Date().toISOString(),
    categoryId: "unknown", // دسته‌بندی پیش‌فرض به نامشخص تغییر کرده
    finished: false,
  },
];

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      const { title, description, dateTime, categoryId = "unknown", finished = false } = action.payload;
      const exists = state.some((task) => task.title === title);
      if (!title || exists) return;

      // اگر نمونه اولیه هنوز هست، حذفش کن
      if (state.length === 1 && state[0].id === "initial") {
        state.pop();
      }

      state.push({
        id: crypto.randomUUID(), // شناسه یکتا برای مدیریت ویرایش/حذف
        title,
        description,
        dateTime,
        categoryId: categoryId || "unknown", // اگر null یا undefined بود، نامشخص قرار بده
        finished,
      });
    },

    updateTask: (state, action) => {
      const { id, ...updates } = action.payload;
      const existingTask = state.find((task) => task.id === id);
      if (existingTask) {
        // فقط زمانی که categoryId در updates وجود داشته باشد و null یا undefined باشد
        if ('categoryId' in updates && (updates.categoryId === null || updates.categoryId === undefined)) {
          updates.categoryId = "unknown";
        }
        Object.assign(existingTask, updates); // فقط اونایی که اومدن رو آپدیت کن
      }
    },

    deleteTask: (state, action) => {
      const idToDelete = action.payload;
      return state.filter((task) => task.id !== idToDelete);
    },
  },
});

export const { addTask, editTask, updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;