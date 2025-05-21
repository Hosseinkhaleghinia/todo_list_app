import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showEditTask: false,
    idTask: null,
}

const toggleSlice = createSlice({
    name: "editToggle",
    initialState,
    reducers: {
        toggleEditTask: (state, action) => {
            state.showEditTask = !state.showEditTask;
            state.idTask = action.payload;
        },
        closeEditTask: (state) => {
            state.showEditTask = false;
            state.idTask = null;
        },
    },
})
export const { toggleEditTask , closeEditTask } = toggleSlice.actions;
export default toggleSlice.reducer;