import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import app from "./firebase";
import 'react-calendar/dist/Calendar.css';
import './calendar.css';

const db = getFirestore(app);

export default function CalendarComponent({ user }) {
  const [selectedDates, setSelectedDates] = useState([]);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async () => {
    for (const dateStr of selectedDates) {
      const ref = doc(db, "offRequests", dateStr);
      const snap = await getDoc(ref);
      let current = [];

      if (snap.exists()) {
        current = snap.data().applicants || [];
        if (current.includes(user.email)) continue;
        if (current.length >= 3) {
          alert(`${dateStr}는 이미 마감되었습니다.`);
          continue;
        }
        await updateDoc(ref, {
          applicants: arrayUnion(user.email)
        });
      } else {
        await setDoc(ref, {
          applicants: [user.email]
        });
      }
    }

    setSubmitted(true);
    alert("신청이 완료되었습니다.");
    setSelectedDates([]);
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
      <button onClick={handleSubmit} disabled={selectedDates.length === 0 || submitted}>
        오프 신청하기
      </button>
    </div>
  );
}
