import React from "react";
import useDateTime from "../../hooks/useDateTime";
import "./DateTime.css";
import { auth } from "../../firebase/firebaseConfig";

function DateTimeDisplay() {
  const { date, time ,getGreeting } = useDateTime();
  const user = auth.currentUser;

  
  return (
    <div className="greeting-box">
     <h2>{getGreeting() + ", " + user.displayName}<span className="wave">👋</span></h2>
      <p>today: {date}</p>
    </div>
  );
}

export default DateTimeDisplay;
