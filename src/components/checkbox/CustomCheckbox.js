import * as React from "react";
import IconButton from "@mui/material/IconButton";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

export default function CustomCheckbox({ checked, onChange }) {
  return (
    <IconButton
      onClick={onChange}
      sx={{
        backgroundColor: checked ? "#E0F7FA" : "#F6F6F6",
        borderRadius: "6px",
        padding: "6px",
        "&:hover": {
          backgroundColor: checked ? "#B2EBF2" : "#e0e0e0",
        },
      }}
    >
      {checked ? (
        <CheckBoxIcon  sx={{ color: "#00796B" }} />
      ) : (
        <CheckBoxOutlineBlankIcon sx={{ color: "#757575" }} />
      )}
    </IconButton>
  );
}
