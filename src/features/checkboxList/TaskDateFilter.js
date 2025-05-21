import React, { useState } from "react";
import {
  Box,
  Button,
  Grow,
  Popper,
  Paper,
  ClickAwayListener,
  ButtonGroup,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import dayjs from "dayjs";

function formatDateLabel(date) {
  if (!date) return "All Tasks";
  
  const today = dayjs();
  const selected = dayjs(date);

  if (selected.isSame(today, "day")) return "Today";
  if (selected.isSame(today.add(1, "day"), "day")) return "Tomorrow";
  if (selected.isSame(today.subtract(1, "day"), "day")) return "Yesterday";

  return selected.format("D MMMM"); // 4 April
}

export default function  TaskDateFilter({ onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  

  const handleToggle = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setShowAllTasks(false);
    setOpen(false);
    if (onDateChange) onDateChange(newDate);
  };

  const handleShowAllTasks = () => {
    setShowAllTasks(true);
    setOpen(false);
    if (onDateChange) onDateChange(null);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleToggle}
        color="black"
        size="large"
        sx={{ 
          bgcolor: "#fff", 
          textTransform: "none", 
          px: 2,
          minWidth: "140px",
          justifyContent: "flex-start",
        }}
        startIcon={<KeyboardArrowDownIcon/>}
      >
        {showAllTasks ? "All Tasks" : formatDateLabel(selectedDate)}
      </Button>

      <Popper open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: "top left" }}>
            <Paper elevation={3} sx={{ mt: 1 }}>
              <ClickAwayListener onClickAway={handleClickAway}>
                <Box>
                  <Box p={1}>
                    <Button 
                      fullWidth
                      variant="text"
                      onClick={handleShowAllTasks}
                      sx={{ mb: 1, textTransform: "none" }}
                    >
                      Show all tasks
                    </Button>
                  </Box>
                  <Box p={1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateCalendar value={selectedDate} onChange={handleDateChange} />
                    </LocalizationProvider>
                  </Box>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
}