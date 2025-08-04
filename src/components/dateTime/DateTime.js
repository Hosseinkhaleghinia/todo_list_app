import React from "react";
import useDateTime from "../../hooks/useDateTime";
import "./DateTime.css";
import { useAuth } from "../../hooks/useAuth";

function DateTimeDisplay() {
  const { date, getGreeting } = useDateTime();
  const { user } = useAuth();

  // استخراج نام کاربر از ایمیل اگر displayName وجود نداشته باشد
  const getUserDisplayName = () => {
    if (!user) return " ";
    
    // اگر displayName وجود داشت از آن استفاده کن
    if (user.user_metadata?.display_name) {
      return user.user_metadata.display_name;
    }
    
    // اگر نه، قسمت اول ایمیل را برگردان
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return " ";
  };

  return (
    <div className="greeting-box">
      <h2>
        {getGreeting()}, {getUserDisplayName()}
        <span className="wave">👋</span>
      </h2>
      <p>today: {date}</p>
    </div>
  );
}

export default DateTimeDisplay;