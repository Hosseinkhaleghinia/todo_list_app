import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./pages/counter-redux/counterSlice"


const StoreTest = configureStore({
    reducer : {
        counter : counterReducer,
    }
})

export default StoreTest;