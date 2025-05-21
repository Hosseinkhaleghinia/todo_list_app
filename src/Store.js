import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./features/category/categorySlice";
import tasksReducer from "./features/checkboxList/taskSlice";
import editToggleReducer from "./features/createTask/toggleSlice";

export const store = configureStore({
    reducer: {
        categories: categoryReducer,
        tasks: tasksReducer,
        editToggle: editToggleReducer,
    },
})