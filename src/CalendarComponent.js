import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";
import app from "./firebase";
import "./calendar.css";

const db = getFirestore(app);

export default function CalendarComponent({ user }) {
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateChange = async (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const offRef = collection(db, "offRequests");

    const q = query(offRef, where("date", "==", dateStr));
    const querySnapshot = await getDocs(q);
    const existing = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const userOff = existing.find((off) => off.uid === user.uid);

    if (userOff) {
      await deleteDoc(userOff.id ? doc(db, "offRequests", userOff.id) : "");
      setSelectedDates(selectedDates.filter((d) => d !== dateStr));
    } else if (existing.length < 3) {
      await addDoc(offRef, {
        uid: user.uid,
        name: user.email.split("@")[0],
        date: dateStr,
      });
      setSelectedDates([...selectedDates, dateStr]);
    } else {
      alert("이 날짜는 이미 3명이 신청했습니다.");
    }
  };

  const tileClassName = ({ date }) => {
    const dateStr = date.toISOString().split("T")[0];
    return selectedDates.includes(dateStr) ? "selected" : null;
  };

  useEffect(() => {
    const fetchOffDates = async () => {
      const q = query(collection(db, "offRequests"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const dates = snapshot.docs.map((doc) => doc.data().date);
      setSelectedDates(dates);
    };
    fetchOffDates();
  }, [user]);

  return (
    <div>
      <h2>오프 신청</h2>
      <Calendar onClickDay={handleDateChange} tileClassName={tileClassName} />
    </div>
  );
}