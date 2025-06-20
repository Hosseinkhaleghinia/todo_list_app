import {
  Favorite,
  Person,
  School,
  ShoppingCart,
  Work,
  HelpOutline, // آیکون برای دسته‌بندی نامشخص
  
} from "@mui/icons-material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

export const iconMap = {
  Favorite: <Favorite />,
  Person: <Person />,
  School: <School />,
  ShoppingCart: <ShoppingCart />,
  Work: <Work />,
  Unknown: <HelpOutline />, // آیکون برای دسته‌بندی نامشخص
  default: <CheckBoxOutlineBlankIcon />, // آیکون برای ساخت دسته بندی جدید
};