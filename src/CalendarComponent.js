import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { getFirestore, collection, addDoc, deleteDoc, getDocs, query, where, doc } from "firebase/firestore";
import { app } from "./firebase";
import './calendar.css';

const db = getFirestore(app);

export default function CalendarComponent({ user }) {
  const [selectedDates, setSelectedDates] = useState([]);
  const [userDates, setUserDates] = useState([]);

  const handleDateClick = async (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const userEmail = user.email;

    // 오늘까지 선택한 날짜가 3개 이상이면 제한
    if (!userDates.includes(dateStr) && userDates.length >= 3) {
      alert("오프 신청은 최대 3일까지 가능합니다.");
      return;
    }

    const dateRef = collection(db, "offRequests");
    const q = query(dateRef, where("date", "==", dateStr));
    const snapshot = await getDocs(q);
    const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const currentUserDoc = entries.find(e => e.uid === user.uid);
    if (currentUserDoc) {
      await deleteDoc(doc(db, "offRequests", currentUserDoc.id));
      setUserDates(userDates.filter(d => d !== dateStr));
    } else {
      if (entries.length >= 3) {
        alert("이 날짜는 이미 3명이 신청했습니다.");
        return;
      }
      await addDoc(dateRef, {
        uid: user.uid,
        name: userEmail.split("@")[0],
        date: dateStr,
      });
      setUserDates([...userDates, dateStr]);
    }
  };

  const tileClassName = ({ date }) => {
    const dateStr = date.toISOString().split("T")[0];
    if (userDates.includes(dateStr)) {
      return "my-off";
    }
    return null;
  };

  useEffect(() => {
    const fetchUserDates = async () => {
      const q = query(collection(db, "offRequests"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const dates = snapshot.docs.map(doc => doc.data().date);
      setUserDates(dates);
    };
    fetchUserDates();
  }, [user]);

  return (
    <div>
      <h2>오프 신청</h2>
      <p>날짜를 클릭하여 오프를 신청하거나 취소할 수 있습니다. (최대 3일)</p>
      <Calendar onClickDay={handleDateClick} tileClassName={tileClassName} />
    </div>
  );
}