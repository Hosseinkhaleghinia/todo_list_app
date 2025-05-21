// CategoryFilter.js
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { iconMap } from "./CategoryIcons";

function CategoryFilter({ onCategoryFilter }) {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const categories = useSelector((state) => state.categories);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    onCategoryFilter(value === "all" ? null : value);
  };

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 150, ml: 2 }}>
      <InputLabel>دسته‌بندی</InputLabel>
      <Select
        value={selectedCategory}
        onChange={handleChange}
        label="دسته‌بندی"
        sx={{ 
          backgroundColor: "#F6F6F6",
          borderRadius: "8px",
          "& .MuiSvgIcon-root": { color: "#333" }
        }}
      >
        <MenuItem value="all">همه</MenuItem>
        {categories.map((category) => {
          const IconComponent = iconMap[category.icon];
          return (
            <MenuItem key={category.id} value={category.id}>
              {IconComponent && React.cloneElement(IconComponent, { 
                sx: { color: category.color, marginRight: "8px" },
                fontSize: "small" 
              })}
              {category.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export default CategoryFilter;