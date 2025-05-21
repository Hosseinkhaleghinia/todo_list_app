import React from "react";
import useDateTime from "../../hooks/useDateTime";
import "./DateTime.css";

function DateTimeDisplay() {
  const { date, time ,getGreeting } = useDateTime();
  
  return (
    <div className="greeting-box">
     <h2>{getGreeting()}<span className="wave">👋</span></h2>
      <p>today: {date}</p>
    </div>
  );
}

export default DateTimeDisplay;
