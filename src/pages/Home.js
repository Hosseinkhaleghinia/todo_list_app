import { useState } from "react";
import { Box, IconButton, useMediaQuery, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CategoryDrawer from "../features/category/CategoryDrawer/CategoryDrawer";
import CheckboxList from "../features/checkboxList/CheckboxList";
import DateTimeDisplay from "../components/dateTime/DateTime";
import CreateTask from "../features/createTask/CreateTask";
import TaskDateFilter from "../features/checkboxList/TaskDateFilter";
import "./Home.css";
import LogoutButton from "../components/logout/LogoutButton";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleDrawer,
  closeDrawer,
} from "../features/category/CategoryDrawer/drawerSlice";
import { Card } from "./sign-in/SignIn";

function Home() {
  const isDrawerOpen = useSelector((state) => state.drawer.isOpen);
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const isDesktop = useMediaQuery("(min-width:1024px)");

  const handleDateChange = (newDate) => setSelectedDate(newDate);
  const handleCategorySelect = (categoryId) => setSelectedCategory(categoryId);

  return (
    
    <div className="App">
      <div className="logout">
        <LogoutButton/>
      </div>
      <div className="App-body">
        {!isDesktop && (
          <IconButton
            onClick={() => dispatch(toggleDrawer())}
            sx={{ position: "absolute", top: 10, left: 10 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {isDesktop ? (
          <CategoryDrawer onCategorySelect={handleCategorySelect} />
        ) : (
          <Drawer open={isDrawerOpen} onClose={() => dispatch(toggleDrawer())}>
            <CategoryDrawer
              onCategorySelect={(id) => {
                handleCategorySelect(id);
                dispatch(closeDrawer()); // بستن دراور بعد از انتخاب
              }}
            />
          </Drawer>
        )}

        <Box className="App-checkbox">
          <Box
            className="header-box"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <DateTimeDisplay />

            <TaskDateFilter onDateChange={handleDateChange} />
          </Box>

          <div className="checkbox-list-container">
            <CheckboxList
              selectedDate={selectedDate}
              selectedCategory={selectedCategory}
            />
          </div>

          <div className="footer-box">
            <CreateTask />
            {/* <LogoutButton/> */}
          </div>
        </Box>
      </div>
    </div>
  );
}

export default Home;
