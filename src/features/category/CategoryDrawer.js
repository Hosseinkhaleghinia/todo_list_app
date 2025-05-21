// // CategoryDrawer.js
// import {
//   Box,
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   TextField,
//   IconButton,
//   Typography,
// } from "@mui/material";
// import AddBoxIcon from "@mui/icons-material/AddBox";
// import React, { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { addCategory } from "./categorySlice";
// import { iconMap } from "./CategoryIcons";

// function CategoryDrawer() {
//   const [newLabel, setNewLabel] = useState("");
//   const categories = useSelector((state) => state.categories);
//   const dispatch = useDispatch();

//   const handleAdd = () => {
//     const trimmed = newLabel.trim();
//     if (!trimmed) return;

//     dispatch(addCategory({ label: trimmed }));
//     setNewLabel("");
//   };

//   return (
//     <Drawer variant="permanent"
//         anchor="left">
//       <Box
//         sx={{
//           width: 300,
//           height: "100%",
//           display: "flex",
//           flexDirection: "column",
//           p: 2,
//         }}
//         role="presentation"
//       >
//         <Typography variant="h6" sx={{ mb: 2 }}>
//           Categories
//         </Typography>

//         <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
//           <List>
//             {categories.map((item, index) => {
//               const IconComponent = iconMap[item.icon];
//               return (
//                 <ListItem key={index} disablePadding sx={{ mb: 1 }}>
//                   <ListItemButton sx={{ borderRadius: 1 }}>
//                     <ListItemIcon>
//                       {IconComponent &&
//                         React.cloneElement(IconComponent, {
//                           sx: { color: item.color },
//                         })}
//                     </ListItemIcon>
//                     <ListItemText primary={item.label} />
//                     <Box
//                       sx={{
//                         backgroundColor: "#F6F6F6",
//                         borderRadius: "6px",
//                         padding: "6px 8px",
//                       }}
//                     >
//                       <Typography
//                         variant="body2"
//                         sx={{ color: "#333", fontSize: 14 }}
//                       >
//                         0
//                       </Typography>
//                     </Box>
//                   </ListItemButton>
//                 </ListItem>
//               );
//             })}
//           </List>
//         </Box>

//         <Box sx={{ mt: 2 }}>
//           <TextField
//             label="Add Category"
//             variant="outlined"
//             fullWidth
//             value={newLabel}
//             onChange={(e) => setNewLabel(e.target.value)}
//             InputProps={{
//               endAdornment: (
//                 <IconButton
//                   onClick={handleAdd}
//                   disabled={!newLabel.trim()}
//                   sx={{
//                     color: "#000000",
//                     borderRadius: "6px",
//                     "&:hover": { backgroundColor: "#e0e0e0" },
//                   }}
//                 >
//                   <AddBoxIcon fontSize="large" />
//                 </IconButton>
//               ),
//             }}
//           />
//         </Box>
//       </Box>
//     </Drawer>
//   );
// }

// export default CategoryDrawer;
// CategoryDrawer.js
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  IconButton,
  Typography,
  Chip,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import FilterListIcon from "@mui/icons-material/FilterList";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCategory } from "./categorySlice";
import { iconMap } from "./CategoryIcons";

function CategoryDrawer({ onCategorySelect }) {
  const [newLabel, setNewLabel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryTaskCount, setCategoryTaskCount] = useState({});
  
  const categories = useSelector((state) => state.categories);
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  // محاسبه تعداد تسک‌های هر دسته‌بندی
  useEffect(() => {
    const counts = {};
    // مقداردهی اولیه برای همه دسته‌بندی‌ها
    categories.forEach(cat => {
      counts[cat.id] = 0;
    });
    
    // شمارش تسک‌ها
    tasks.forEach(task => {
      const categoryId = task.categoryId || "unknown";
      if (counts[categoryId] !== undefined) {
        counts[categoryId] += 1;
      } else {
        counts[categoryId] = 1;
      }
    });
    
    setCategoryTaskCount(counts);
  }, [tasks, categories]);

  const handleAdd = () => {
    const trimmed = newLabel.trim();
    if (!trimmed) return;

    dispatch(addCategory({ label: trimmed }));
    setNewLabel("");
  };

  const handleCategoryClick = (categoryId) => {
    // اگر همان دسته‌بندی قبلی انتخاب شد، فیلتر را برمی‌داریم
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      onCategorySelect(null);
    } else {
      setSelectedCategory(categoryId);
      onCategorySelect(categoryId);
    }
  };

  const handleShowAll = () => {
    setSelectedCategory(null);
    onCategorySelect(null);
  };

  return (
    <Drawer variant="permanent" anchor="left">
      <Box
        sx={{
          width: 300,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
        role="presentation"
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">
            Categories
          </Typography>
          <Chip 
            icon={<FilterListIcon />} 
            label={selectedCategory ? "Filtered" : "All Tasks"} 
            color={selectedCategory ? "primary" : "default"}
            onClick={handleShowAll}
            sx={{ fontWeight: selectedCategory ? "bold" : "normal" }}
          />
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List>
            {categories.map((item, index) => {
              const IconComponent = iconMap[item.icon];
              const isSelected = selectedCategory === item.id;
              
              return (
                <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton 
                    sx={{ 
                      borderRadius: 1,
                      backgroundColor: isSelected ? `${item.color}20` : "transparent",
                      border: isSelected ? `1px solid ${item.color}` : "none",
                      "&:hover": {
                        backgroundColor: isSelected ? `${item.color}30` : "rgba(0, 0, 0, 0.04)",
                      }
                    }}
                    onClick={() => handleCategoryClick(item.id)}
                  >
                    <ListItemIcon>
                      {IconComponent &&
                        React.cloneElement(IconComponent, {
                          sx: { color: item.color },
                        })}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                    <Box
                      sx={{
                        backgroundColor: "#F6F6F6",
                        borderRadius: "6px",
                        padding: "6px 8px",
                        minWidth: "30px",
                        textAlign: "center"
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#333", fontSize: 14 }}
                      >
                        {categoryTaskCount[item.id] || 0}
                      </Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        <Box sx={{ mt: 2 }}>
          <TextField
            label="Add Category"
            variant="outlined"
            fullWidth
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={handleAdd}
                  disabled={!newLabel.trim()}
                  sx={{
                    color: "#000000",
                    borderRadius: "6px",
                    "&:hover": { backgroundColor: "#e0e0e0" },
                  }}
                >
                  <AddBoxIcon fontSize="large" />
                </IconButton>
              ),
            }}
          />
        </Box>
      </Box>
    </Drawer>
  );
}

export default CategoryDrawer;