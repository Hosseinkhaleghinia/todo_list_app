// CategoryListView.js
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addCategory } from "./categorySlice"; // Adjust the import path as necessary
import { iconMap } from "./CategoryIcons";

function CategoryListView() {
  const [newLabel, setNewLabel] = useState("");
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const handleAdd = () => {
    const trimmed = newLabel.trim();
    if (!trimmed) return;

    dispatch(addCategory({ label: trimmed }));
    setNewLabel("");
  };

  return (
    <Box
      sx={{
        height: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "background.paper",
        p: 2,
        borderRadius: 1,
        boxShadow: 3,
      }}
    >
      {/* قسمت بالا: تیتر و لیست */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: "left" }}>
          Categories
        </Typography>

        <List>
          {categories.map((item, index) => {
        const IconComponent = iconMap[item.icon];
        return (
          <ListItem key={index} disablePadding sx={{ mb: 1 }}>
            <ListItemButton sx={{ borderRadius: 1 }}>
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
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                     // "&:hover": { backgroundColor: "#ffffff" },
                      //cursor: "pointer",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#333", fontSize: 14 }}
                    >
                      0
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
                id="outlined-basic"
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
}

export default CategoryListView;


