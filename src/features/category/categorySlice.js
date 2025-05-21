import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  // دسته‌بندی نامشخص برای موارد null
  { id: "unknown", label: "نامشخص", icon: "Unknown", color: "#9E9E9E" },
  { id: "work", label: "Work", icon: "Work", color: "#2196F3" },
  { id: "personal", label: "Personal", icon: "Person", color: "#9C27B0" },
  {
    id: "shopping",
    label: "Shopping",
    icon: "ShoppingCart",
    color: "#4CAF50",
  },
  { id: "health", label: "Health", icon: "Favorite", color: "#F44336" },
  { id: "learning", label: "Learning", icon: "School", color: "#FFEB3B" },
];

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory: (state, action) => {
      const { label, icon, color } = action.payload;
      const exists = state.some((cat) => cat.label === label);
      if (!label || exists) return;

      state.push({
        label,
        icon: icon || "Work", // default icon
        color: color || "#90A4AE", // default grey-blue
        id: label.toLowerCase().replace(/\s+/g, "-"), // generate a unique id
      });
    },
  },
});
export const { addCategory } = categorySlice.actions;
export default categorySlice.reducer;