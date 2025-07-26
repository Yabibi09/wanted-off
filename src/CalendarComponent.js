import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarComponent({ user }) {
  const [dates, setDates] = useState([]);

  const handleChange = (selectedDates) => {
    setDates(selectedDates);
  };

  return (
    <div>
      <h2>{user.email} 님의 오프 신청</h2>
      <Calendar selectRange={false} onChange={handleChange} value={dates} />
      <p>선택된 날짜: {Array.isArray(dates) ? dates.join(", ") : dates?.toString()}</p>
    </div>
  );
}