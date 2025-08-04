// export default CategoryDrawer;
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
  useMediaQuery,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import FilterListIcon from "@mui/icons-material/FilterList";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCategory } from "../categorySlice";
import { iconMap } from "../CategoryIcons";
import { useTheme } from "@mui/material/styles";
import { closeDrawer } from "./drawerSlice";

function CategoryDrawer({ onCategorySelect }) {
  const [newLabel, setNewLabel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryTaskCount, setCategoryTaskCount] = useState({});

  const isDrawerOpen = useSelector((state) => state.drawer.isOpen);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // sm = 600px

  const categories = useSelector((state) => state.categories);
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    const counts = {};
    categories.forEach((cat) => (counts[cat.id] = 0));
    tasks.forEach((task) => {
      const categoryId = task.categoryId || "unknown";
      counts[categoryId] = (counts[categoryId] || 0) + 1;
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
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      onCategorySelect(null);
    } else {
      setSelectedCategory(categoryId);
      onCategorySelect(categoryId);
    }

    if (isMobile) {
      dispatch(closeDrawer()); // بستن دراور در موبایل بعد از انتخاب
    }
  };

  const drawerContent = (
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Categories</Typography>
        <Chip
          icon={<FilterListIcon />}
          label={selectedCategory ? "Filtered" : "All Tasks"}
          color={selectedCategory ? "primary" : "default"}
          onClick={() => {
            setSelectedCategory(null);
            onCategorySelect(null);
            if (isMobile) dispatch(closeDrawer());
          }}
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
                  onClick={() => handleCategoryClick(item.id)}
                  sx={{
                    borderRadius: 1,
                    backgroundColor: isSelected
                      ? `${item.color}20`
                      : "transparent",
                    border: isSelected ? `1px solid ${item.color}` : "none",
                    "&:hover": {
                      backgroundColor: isSelected
                        ? `${item.color}30`
                        : "rgba(0, 0, 0, 0.04)",
                    },
                  }}
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
                      textAlign: "center",
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
  );

  return (
    <>
      {/* onClick={() => setMobileOpen(!mobileOpen) */}
      {/* Temporary Drawer for Mobile */}
      {isMobile && (
        <Drawer
          anchor="left"
          variant="temporary"
          open={isDrawerOpen}
          onClose={() => dispatch(closeDrawer())}
          ModalProps={{ keepMounted: true }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Permanent Drawer for Desktop */}
      {!isMobile && (
        <Drawer variant="permanent" anchor="left">
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}

export default CategoryDrawer;
