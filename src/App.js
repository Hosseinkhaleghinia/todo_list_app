import "./App.css";
import CheckboxList from "./features/checkboxList/CheckboxList.js";
import DateTimeDisplay from "./components/dateTime/DateTime.js";
import CreateTask from "./features/createTask/CreateTask.js";
import CategoryDrawer from "./features/category/CategoryDrawer.js";
import TaskDateFilter from "./features/checkboxList/TaskDateFilter.js";

import { useState } from "react";
import { Box } from "@mui/material";

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="App">
      <div className="App-body">
        <div>
          <CategoryDrawer onCategorySelect={handleCategorySelect} />
        </div>
        <Box
          className="App-checkbox"
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            position: "relative",
          }}
        >
          {/* باکس بالایی که باید ثابت باشد */}
          <Box
            className="header-box"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2
            }}
          >
            <DateTimeDisplay />
            <TaskDateFilter onDateChange={handleDateChange} />
          </Box>

          {/* باکس میانی که اسکرول می‌شود */}
          <div className="checkbox-list-container">
            <CheckboxList selectedDate={selectedDate} selectedCategory={selectedCategory} />
          </div>
          
          {/* باکس پایینی که باید ثابت باشد */}
          <div className="footer-box">
            <CreateTask />
          </div>
        </Box>
        <div></div>
      </div>
    </div>
  );
}

export default App;