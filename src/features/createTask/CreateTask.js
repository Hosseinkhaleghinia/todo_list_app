// export default CreateTask;
import { useState, useEffect } from "react";
import { Box, Button, TextField, Paper, Grow } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import { useDispatch, useSelector } from "react-redux";
import { addTask, updateTask } from "../checkboxList/taskSlice";
import { closeEditTask } from "./toggleSlice";
import CategoryOptions from "../category/CategoryOptions";
import dayjs from "dayjs";
import { addTaskToDB, updateTaskInDB } from "../../services/taskService";

function CreateTask() {
  const dispatch = useDispatch();

  // استفاده از useSelector با مدیریت خطا برای جلوگیری از خطای destructuring
  const editToggleState = useSelector((state) => state.editToggle) || {};
  const showEditTask = editToggleState.showEditTask || false;
  const idTask = editToggleState.idTask || null;

  const tasks = useSelector((state) => state.tasks) || [];
  const taskToEdit = idTask ? tasks.find((task) => task.id === idTask) : null;

  const [showCreate, setShowCreate] = useState(false);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState(null);
  const [categoryId, setCategoryId] = useState(null);

  // بستن فرم وقتی showEditTask به false تغییر می‌کند
  useEffect(() => {
    if (!showEditTask && showCreate) {
      // اگر حالت ویرایش بسته شد، فرم را هم ببند
      setShowCreate(false);
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showEditTask]);

  // پر کردن فرم با اطلاعات تسک در حالت ویرایش
  useEffect(() => {
    if (showEditTask && taskToEdit) {
      setLabel(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setDateTime(taskToEdit.dateTime ? dayjs(taskToEdit.dateTime) : null);
      setCategoryId(taskToEdit.categoryId || null);
      setShowCreate(true);
    }
  }, [showEditTask, idTask, taskToEdit]);

  const handleSubmit = async () => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    const payload = {
      title: trimmedLabel,
      description,
      dateTime: dateTime ? dayjs(dateTime).format("YYYY-MM-DDTHH:mm:ss") : null,
      categoryId,
      finished: false,
    };

    try {
      if (showEditTask && idTask) {
        // ویرایش تسک موجود
        // 1. ابتدا در Redux به‌روزرسانی کن
        dispatch(updateTask({ id: idTask, ...payload }));

        // 2. سپس در Firebase به‌روزرسانی کن
        await updateTaskInDB(idTask, payload);
        dispatch(closeEditTask());
      } else {
        // اضافه کردن تسک جدید
        // 1. ابتدا در Firebase ذخیره کن تا ID بگیریم
        const newTask = await addTaskToDB(payload);

        // 2. سپس به Redux اضافه کن
        dispatch(addTask(newTask));
      }

      resetForm();
      setShowCreate(false);
    } catch (error) {
      console.error("خطا در ذخیره‌سازی:", error);

      // در صورت خطا در ویرایش، تغییرات Redux رو برگردون
      if (showEditTask && idTask && taskToEdit) {
        dispatch(updateTask({ id: idTask, ...taskToEdit }));
      }
    }
  };

  const resetForm = () => {
    setLabel("");
    setDescription("");
    setDateTime(null);
    setCategoryId(null);
  };

  const toggleCreateTask = () => {
    if (showCreate) {
      setShowCreate(false);
      resetForm();
      // اگر در حالت ویرایش بودیم، حالت ویرایش را هم ببند
      if (showEditTask) {
        dispatch(closeEditTask());
      }
    } else {
      setShowCreate(true);
    }
  };

  // تغییر رفتار دکمه ویرایش - اگر در حال ویرایش هستیم و دوباره روی دکمه کلیک شد، فرم بسته شود
  const handleEditButtonClick = () => {
    if (showEditTask) {
      dispatch(closeEditTask()); // بستن حالت ویرایش
    } else {
      toggleCreateTask(); // باز کردن فرم معمولی
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: {
          xs: "100%", // موبایل (0px - 600px)
          sm: "80%", // تبلت (600px - 900px)
          md: "60%", // لپ‌تاپ (900px - 1200px)
          lg: "45%", // دسکتاپ بزرگ (1200px+)
        },
        marginTop: "auto",
      }}
    >
      {(showCreate || showEditTask) && (
        <Box
          sx={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            mb: 1,
            width: "100%",
          }}
        >
          <Grow
            in={showCreate || showEditTask}
            style={{ transformOrigin: "0 100% 0" }}
            timeout={{ enter: 500, exit: 300 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 2,
                bgcolor: "#F6F6F6",
                borderRadius: 2,
                maxHeight: "calc(100vh - 200px)",
                overflow: "auto",
              }}
            >
              <TextField
                label="Label"
                variant="filled"
                size="small"
                fullWidth
                margin="normal"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />

              <TextField
                label="Description"
                variant="filled"
                size="small"
                fullWidth
                multiline
                rows={3}
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Due Date"
                  value={dateTime}
                  onChange={(newValue) => setDateTime(newValue)}
                  viewRenderers={{
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                  }}
                  slotProps={{
                    textField: { fullWidth: true, margin: "normal" },
                  }}
                />
              </LocalizationProvider>

              <CategoryOptions onCategorySelect={(id) => setCategoryId(id)} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{ width: "100%" }}
                >
                  save Changes
                </Button>
              </Box>
            </Paper>
          </Grow>
        </Box>
      )}

      <Button
        variant="outlined"
        onClick={showEditTask ? handleEditButtonClick : toggleCreateTask}
        size="large"
        fullWidth
        sx={{
          bgcolor: "#000000",
          mt: 2,
          borderColor: "#FFFFFF",
          color: "#FFFFFF",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            transition: "transform 0.4s ease",
            transform: showCreate ? "rotate(180deg)" : "rotate(0deg)",
            mr: 1,
          }}
        >
          {showCreate ? <CloseIcon /> : <AddIcon />}
        </Box>
        {showEditTask ? "edit task" : "create new task"}
      </Button>
    </Box>
  );
}

export default CreateTask;
