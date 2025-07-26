import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export default function CalendarComponent() {
  const [selectedDates, setSelectedDates] = useState([]);

  const toggleDate = (date) => {
    const dateStr = date.toISOString().slice(0, 10);
    const alreadySelected = selectedDates.includes(dateStr);

    if (alreadySelected) {
      setSelectedDates(prev => prev.filter(d => d !== dateStr));
    } else {
      if (selectedDates.length >= 3) {
        alert("최대 3일까지만 선택할 수 있습니다.");
        return;
      }
      setSelectedDates(prev => [...prev, dateStr]);
    }
  };

  return (
    <div>
      <Calendar
        onClickDay={toggleDate}
        tileClassName={({ date }) => {
          const dateStr = date.toISOString().slice(0, 10);
          return selectedDates.includes(dateStr) ? "selected-date" : "";
        }}
      />
      <p>선택한 날짜: {selectedDates.map(d => d.slice(5)).join(", ")}</p>
    </div>
  );
}
