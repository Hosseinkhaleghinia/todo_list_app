import React, { useState } from "react";
import { Box } from "@mui/material";
import CheckboxList from "./CheckboxList";
import TaskDateFilter from "./TaskDateFilter";
import dayjs from "dayjs";

export default function TaskManager() {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* کامپوننت فیلتر تاریخ را می‌توانید در هر جایی قرار دهید */}
      <Box sx={{ 
        mb: 2, 
        display: "flex", 
        justifyContent: "flex-start",
        // می‌توانید موقعیت را به دلخواه تغییر دهید
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor: "#f8f8f8",
        p: 2,
        borderBottom: "1px solid #eee"
      }}>
        <TaskDateFilter onDateChange={handleDateChange} />
      </Box>
      
      {/* کامپوننت لیست تسک‌ها */}
      <CheckboxList selectedDate={selectedDate} />
    </Box>
  );
}