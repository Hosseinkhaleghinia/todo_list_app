import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./features/category/categorySlice";
import tasksReducer from "./features/checkboxList/taskSlice";
import editToggleReducer from "./features/createTask/toggleSlice";
import drawerReducer from "./features/category/CategoryDrawer/drawerSlice"

export const store = configureStore({
    reducer: {
        categories: categoryReducer,
        tasks: tasksReducer,
        editToggle: editToggleReducer,
        drawer: drawerReducer,
    },
})