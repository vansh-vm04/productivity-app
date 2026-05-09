export function formatTimestamp(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  // Check if today
  if (compareDate.getTime() === today.getTime()) {
    return "Today";
  }

  // Check if yesterday
  if (compareDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  // Check if within the past week
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  if (compareDate.getTime() > weekAgo.getTime()) {
    // Return day name (Monday, Tuesday, etc.)
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return dayNames[compareDate.getDay()];
  }

  // Return date format like "7 May"
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = compareDate.getDate();
  const month = monthNames[compareDate.getMonth()];
  return `${day} ${month}`;
}
