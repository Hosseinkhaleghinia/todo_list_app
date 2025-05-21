// CategoryOptions.js
import { Autocomplete, TextField } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "./categorySlice"; // Adjust the import path as necessary
import { iconMap } from "./CategoryIcons";

function CategoryOptions({onCategorySelect}) {
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  return (
    <Autocomplete
      options={categories}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.label
      }
      freeSolo
      onChange={(event, newValue) => {
        
        if (newValue && typeof newValue !== "string") {
          onCategorySelect(newValue.id); // ارسال id دسته‌بندی به والد
        } else if (typeof newValue === "string") {
           dispatch(addCategory({ label: newValue })); 
          onCategorySelect(newValue); // در صورت تایپ دستی، همون رشته
        } else {
          onCategorySelect(null); // اگر خالی شد
        }
      }}
       renderOption={(props, option) => {
          const { key, ...rest } = props;
        const IconComponent = iconMap[option.icon];
        return (
          <li key={option.id} {...rest}>
            {IconComponent && React.cloneElement(IconComponent, { sx: { color: option.color } })}
            <span style={{ marginLeft: 8 }}>{option.label}</span>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Category"
          variant="filled"
          size="small"
          fullWidth
          margin="normal"
        />
      )}
    />
  );
}

export default CategoryOptions;
