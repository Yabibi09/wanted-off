import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove
} from "firebase/firestore";
import app from "./firebase";
import 'react-calendar/dist/Calendar.css';
import './calendar.css';

const db = getFirestore(app);

export default function CalendarComponent({ user }) {
  const [selectedDates, setSelectedDates] = useState([]);
  const [submittedDates, setSubmittedDates] = useState([]);
  const [dateInfo, setDateInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchDateInfo = async () => {
    setLoading(true);
    let newInfo = {};
    let newSubmitted = [];
    const today = new Date();
    const dates = Array.from({ length: 60 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d.toISOString().slice(0, 10);
    });

    for (const date of dates) {
      const ref = doc(db, "offRequests", date);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const apps = snap.data().applicants || [];
        newInfo[date] = apps;
        if (apps.includes(user.email)) newSubmitted.push(date);
      }
    }
    setDateInfo(newInfo);
    setSubmittedDates(newSubmitted);
    setLoading(false);
  };

  useEffect(() => { fetchDateInfo(); }, [user]);

  const toggleDate = (date) => {
    const dateStr = date.toISOString().slice(0, 10);

    if (submittedDates.includes(dateStr)) {
      if (window.confirm(`${dateStr} 신청을 취소하시겠어요?`)) {
        cancelOff(dateStr);
      }
      return;
    }

    if (selectedDates.includes(dateStr)) {
      setSelectedDates(prev => prev.filter(d => d !== dateStr));
    } else {
      if (selectedDates.length >= 3) {
        alert("최대 3일까지만 선택할 수 있습니다.");
        return;
      }
      const apps = dateInfo[dateStr] || [];
      if (apps.length >= 3) {
        alert(`${dateStr}는 이미 마감되었습니다.`);
        return;
      }
      setSelectedDates(prev => [...prev, dateStr]);
    }
  };

  const submitOff = async () => {
    for (const dateStr of selectedDates) {
      const ref = doc(db, "offRequests", dateStr);
      const snap = await getDoc(ref);
      let current = snap.exists() ? snap.data().applicants || [] : [];

      if (!current.includes(user.email) && current.length < 3) {
        if (snap.exists()) {
          await updateDoc(ref, { applicants: arrayUnion(user.email) });
        } else {
          await setDoc(ref, { applicants: [user.email] });
        }
      }
    }
    setSelectedDates([]);
    fetchDateInfo();
    alert("신청 완료!");
  };

  const cancelOff = async (dateStr) => {
    const ref = doc(db, "offRequests", dateStr);
    await updateDoc(ref, { applicants: arrayRemove(user.email) });
    fetchDateInfo();
  };

  return (
    <div>
      {loading ? <p>불러오는 중...</p> : (
        <>
          <Calendar
            onClickDay={toggleDate}
            tileClassName={({ date }) => {
              const ds = date.toISOString().slice(0, 10);
              if (submittedDates.includes(ds)) return "submitted-date";
              if (selectedDates.includes(ds)) return "selected-date";
              return "";
            }}
            tileContent={({ date }) => {
              const ds = date.toISOString().slice(0, 10);
              const cnt = (dateInfo[ds] || []).length;
              return cnt > 0 ? <div style={{fontSize:'0.7em'}}>{cnt}/3</div> : null;
            }}
          />
          <p>선택한 날짜: {selectedDates.join(", ")}</p>
          <p>신청 완료된 날짜: {submittedDates.join(", ")}</p>
          <button onClick={submitOff} disabled={selectedDates.length === 0}>오프 신청하기</button>
        </>
      )}
    </div>
);
}
