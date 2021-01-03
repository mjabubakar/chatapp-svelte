const getMonth = (date) => {
  return (
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
};
export const getTime = (str) => {
  const date = new Date(str);
  const currentDate = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  if (getMonth(currentDate) === getMonth(date)) {
    return "Today";
  }
  for (let i = 1; i <= 7; i++) {
    const newDate = new Date(str);
    const d = new Date(date.setDate(date.getDate() + 1));
    const check = getMonth(d) === getMonth(currentDate);
    if (check && i === 1) {
      return "Yesterday";
    } else if (check) {
      return days[newDate.getDay()];
    }
  }

  return getMonth(currentDate);
};

export const hoursAgo = (str) => {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24);
  const date = new Date(str);
  if (date >= yesterday) {
    if (today.getTime() - date.getTime() < 1000 * 60 * 60) {
      const mins = today.getMinutes() - date.getMinutes();
      if (mins < 2) return "1m ago";
      return mins + "m ago";
    }
    if (date.getDate() === today.getDate()) {
      const t = today.getHours() - date.getHours();
      return t + "h ago";
    }
    return today.getHours() + 24 - date.getHours() + "h ago";
  }

  return false;
};

export const time = (d) => {
  const date = new Date(d);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const time =
    check(hours % 12) + ":" + check(minutes) + `${hours >= 12 ? " PM" : " AM"}`;
  return time;
};

const check = (val) => {
  if (val === 0) return "12";
  if (val < 10) return `0${val}`;
  return val;
};
