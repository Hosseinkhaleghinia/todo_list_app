import { useEffect, useState } from "react";

function useDateTime() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Get the current date and time
  const date = dateTime.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    weekday: "long",
    day: "2-digit",
  });

  // Format the date to "YYYY/MM/DD"
  const time = dateTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Format the time to "HH:MM:SS"
  const hour = parseInt(time.split(":")[0], 10);

  // Get the current hour
  const getGreeting = (hour) => {
    if (hour >= 5 && hour < 10) return "Good morning";
    if (hour >= 10 && hour < 15) return "Good noon";
    if (hour >= 15 && hour < 19) return "Good afternoon";
    if (hour >= 19 && hour < 24) return "Good evening";
    return "Feeling sleepy?";
  };

  return { date, time, hour, getGreeting: () => getGreeting(hour) };
}

export default useDateTime;
