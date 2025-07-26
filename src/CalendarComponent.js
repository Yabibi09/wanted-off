import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db } from "./firebase";
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export default function CalendarComponent({ user }) {
  const [selectedDates, setSelectedDates] = useState([]);
  const [submittedDates, setSubmittedDates] = useState([]);

  const fetchDates = async () => {
    const info = [];
    const subs = [];
    const start = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const ds = d.toISOString().slice(0,10);
      const ref = doc(db, "offRequests", ds);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const apps = snap.data().applicants || [];
        if (apps.includes(user.email.split('@')[0])) subs.push(ds);
        info.push({ date: ds, count: apps.length });
      }
    }
    setSubmittedDates(subs);
  };

  useEffect(() => { fetchDates(); }, [user]);

  const onClickDay = async (date) => {
    const ds = date.toISOString().slice(0,10);
    const already = selectedDates.includes(ds);
    if (already) {
      setSelectedDates(prev => prev.filter(d => d !== ds));
      return;
    }
    if (selectedDates.length >= 3) {
      alert("최대 3일까지만 선택 가능합니다.");
      return;
    }
    const ref = doc(db, "offRequests", ds);
    const snap = await getDoc(ref);
    const apps = snap.exists() ? snap.data().applicants || [] : [];
    if (!apps.includes(user.email.split('@')[0]) && apps.length >= 3) {
      alert("이미 3명이 신청했습니다.");
      return;
    }
    setSelectedDates(prev => [...prev, ds]);
  };

  const handleSubmit = async () => {
    for (const ds of selectedDates) {
      const ref = doc(db, "offRequests", ds);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, { applicants: arrayUnion(user.email.split('@')[0]) });
      } else {
        await setDoc(ref, { applicants: [user.email.split('@')[0]] });
      }
    }
    setSelectedDates([]);
    fetchDates();
    alert("신청 완료!");
  };

  const tileClassName = ({ date }) => {
    const ds = date.toISOString().slice(0,10);
    if (submittedDates.includes(ds)) return "submitted-date";
    if (selectedDates.includes(ds)) return "selected-date";
    return "";
  };

  const tileContent = ({ date }) => {
    const ds = date.toISOString().slice(0,10);
    return (
      <p style={{ fontSize: '0.7em', margin: 0 }}>
        {/* count display */}
      </p>
    );
  };

  return (
    <div>
      <Calendar onClickDay={onClickDay} tileClassName={tileClassName} tileContent={tileContent} />
      <p>선택된 날짜: {selectedDates.join(", ")}</p>
      <p>신청 내역: {submittedDates.join(", ")}</p>
      <button onClick={handleSubmit} disabled={selectedDates.length===0}>오프 신청하기</button>
    </div>
