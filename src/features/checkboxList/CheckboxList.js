import * as React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CustomCheckbox from "../../components/checkbox/CustomCheckbox";
import { useSelector, useDispatch } from "react-redux";
import { iconMap } from "../category/CategoryIcons";
import dayjs from "dayjs";
import { deleteTask, updateTask } from "./taskSlice";
import { toggleEditTask } from "../createTask/toggleSlice";

export default function CheckboxList({
  selectedDate = null,
  selectedCategory = null,
}) {
  const [checked, setChecked] = React.useState([]);
  const tasks = useSelector((state) => state.tasks);
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const handleChecked = (taskId) => () => {
    const currentIndex = checked.indexOf(taskId);
    const newChecked = [...checked];
    let isFinished;

    if (currentIndex === -1) {
      newChecked.push(taskId);
      isFinished = true;
    } else {
      newChecked.splice(currentIndex, 1);
      isFinished = false;
    }

    dispatch(updateTask({ id: taskId, finished: isFinished }));
    setChecked(newChecked);
  };

  // پیدا کردن اطلاعات دسته‌بندی برای نمایش آیکون و رنگ
  const getCategoryInfo = (categoryId) => {
    if (!categoryId)
      return categories.find((cat) => cat.id === "unknown") || {};
    return (
      categories.find((cat) => cat.id === categoryId) ||
      categories.find((cat) => cat.id === "unknown") ||
      {}
    );
  };

  // فیلتر کردن تسک‌ها براساس تاریخ و دسته‌بندی انتخاب شده
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      // فیلتر براساس تاریخ
      let passesDateFilter = true;
      if (selectedDate) {
        if (!task.dateTime) return false;
        const taskDate = dayjs(task.dateTime);
        passesDateFilter = taskDate.isSame(selectedDate, "day");
      }

      // فیلتر براساس دسته‌بندی
      let passesCategoryFilter = true;
      if (selectedCategory) {
        passesCategoryFilter = task.categoryId === selectedCategory;
      }

      return passesDateFilter && passesCategoryFilter;
    });
  }, [tasks, selectedDate, selectedCategory]);

  return (
    <Box
      sx={{
        width: "100%",
        overflowY: "auto",
        height: "calc(75vh - 150px)",
      }}
    >
      {/* Task List */}
      <List sx={{ width: "100%", maxWidth: "100%" }}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, index) => {
            const labelId = `checkbox-list-label-${index}`;
            const categoryInfo = getCategoryInfo(task.categoryId);
            const IconComponent = iconMap[categoryInfo.icon];

            return (
              <ListItem
                key={index}
                sx={{
                  marginBottom: "10px",
                  padding: "8px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "4px",
                }}
                secondaryAction={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        backgroundColor: "#F6F6F6",
                        borderRadius: "6px",
                        padding: "6px 8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        "&:hover": { backgroundColor: "#e0e0e0" },
                        cursor: "pointer",
                      }}
                    >
                      <AccessTimeIcon sx={{ color: "#333", fontSize: 20 }} />
                      <Typography
                        variant="body2"
                        sx={{ color: "#333", fontSize: 14 }}
                      >
                        {task.dateTime
                          ? dayjs(task.dateTime).format("HH:mm")
                          : "00:00"}
                      </Typography>
                    </Box>

                    <IconButton
                      onClick={() => {
                        dispatch(toggleEditTask(task.id));
                      }}
                      sx={{
                        backgroundColor: "#F6F6F6",
                        borderRadius: "6px",
                        padding: "4px",
                        "&:hover": { backgroundColor: "#e0e0e0" },
                      }}
                      aria-label="edit task"
                    >
                      <EditIcon sx={{ color: "#333" }} />
                    </IconButton>
                    <IconButton
                      onClick={() => dispatch(deleteTask(task.id))}
                      sx={{
                        backgroundColor: "#F6F6F6",
                        borderRadius: "6px",
                        padding: "4px",
                        "&:hover": { backgroundColor: "#e0e0e0" },
                      }}
                      aria-label="delete task"
                    >
                      <DeleteIcon sx={{ color: "#333" }} />
                    </IconButton>
                  </Box>
                }
                disablePadding
              >
                <ListItemButton
                  role={undefined}
                  onClick={handleChecked(task.id)}
                  dense
                >
                  <ListItemIcon>
                    <CustomCheckbox
                      checked={checked.includes(task.id)}
                      onChange={handleChecked(task.id)}
                    />
                  </ListItemIcon>
                  <Box
                    sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}
                  >
                    {IconComponent && (
                      <Box sx={{ mr: 1 }}>
                        {React.cloneElement(IconComponent, {
                          sx: { color: categoryInfo.color },
                          fontSize: "small",
                        })}
                      </Box>
                    )}
                    <ListItemText
                      id={labelId}
                      primary={task.title}
                      secondary={categoryInfo.label || "نامشخص"}
                    />
                  </Box>
                </ListItemButton>
              </ListItem>
            );
          })
        ) : (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="body1" color="text.secondary">
              {selectedDate || selectedCategory
                ? "No tasks found for this date"
                : "No tasks available"}
            </Typography>
          </Box>
        )}
      </List>
      {console.log(tasks)}
    </Box>
  );
}
