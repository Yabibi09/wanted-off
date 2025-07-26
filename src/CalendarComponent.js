import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarComponent.css";

const CalendarComponent = ({ user, onLogout }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [offData, setOffData] = useState({});

  const handleDateChange = (date) => {
    const timestamp = date.getTime();
    if (selectedDates.includes(timestamp)) {
      setSelectedDates(selectedDates.filter((d) => d !== timestamp));
    } else {
      if (selectedDates.length < 3) {
        setSelectedDates([...selectedDates, timestamp]);
      } else {
        alert("한 번에 최대 3일까지만 신청할 수 있습니다.");
      }
    }
  };

  const handleSubmit = () => {
    const today = new Date();
    const todayKey = today.toISOString().split("T")[0];
    const updates = { ...offData };
    selectedDates.forEach((timestamp) => {
      const date = new Date(timestamp);
      const dateKey = date.toISOString().split("T")[0];
      if (!updates[dateKey]) {
        updates[dateKey] = [];
      }
      if (!updates[dateKey].includes(user.displayName)) {
        if (updates[dateKey].length < 3) {
          updates[dateKey].push(user.displayName);
        } else {
          alert(`${dateKey}에는 이미 3명이 신청했습니다.`);
        }
      }
    });
    setOffData(updates);
    setSelectedDates([]);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toDateString();
  };

  return (
    <div className="calendar">
      <h2>{user.displayName} 님의 오프 신청</h2>
      <Calendar onClickDay={handleDateChange} />
      <div className="selected-dates">
        <strong>선택된 날짜:</strong>
        <ul>
          {selectedDates.map((date) => (
            <li key={date}>{formatDate(date)}</li>
          ))}
        </ul>
      </div>
      <button onClick={handleSubmit}>신청</button>
      <button onClick={onLogout}>로그아웃</button>
    </div>
  );
};

export default CalendarComponent;
