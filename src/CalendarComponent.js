import React from "react";

export default function CalendarComponent({ user }) {
  return (
    <div>
      <h2>안녕하세요, {user.email}</h2>
      <p>여기에 달력이 들어갈 예정입니다.</p>
    </div>
  );
}