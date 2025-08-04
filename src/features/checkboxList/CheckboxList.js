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
import { updateTaskInDB, deleteTaskFromDB } from "../../services/taskService";

export default function CheckboxList({
  selectedDate = null,
  selectedCategory = null,
}) {
  const [checked, setChecked] = React.useState([]);
  const tasks = useSelector((state) => state.tasks) || [];
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const handleChecked = (taskId) => async () => {
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

    try {
      // 1. ابتدا در Redux به‌روزرسانی کن (برای سرعت UI)
      dispatch(updateTask({ id: taskId, finished: isFinished }));
      setChecked(newChecked);
      
      // 2. سپس در Firebase به‌روزرسانی کن
      await updateTaskInDB(taskId, { finished: isFinished });
    } catch (error) {
      console.error("خطا در به‌روزرسانی تسک:", error);
      // در صورت خطا، تغییرات Redux رو برگردون
      dispatch(updateTask({ id: taskId, finished: !isFinished }));
      const revertedChecked = [...checked];
      setChecked(revertedChecked);
    }
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

  const handleDelete = async (taskId) => {
    try {
      // 1. ابتدا از Redux حذف کن (برای سرعت UI)
      dispatch(deleteTask(taskId));
      
      // 2. سپس از Firebase حذف کن
      await deleteTaskFromDB(taskId);
    } catch (error) {
      console.error("خطا در حذف تسک:", error);
      // در صورت خطا، تسک رو دوباره به Redux اضافه کن
      // (البته باید تسک اصلی رو ذخیره کرده باشیم)
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        // overflowY: "auto",
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
                key={task.id} // استفاده از task.id به جای index
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
                      onClick={() => handleDelete(task.id)}
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