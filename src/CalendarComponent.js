// 수정된 CalendarComponent.js 예시 (정상 빌드 가능하도록 마감 및 쉼표 정리 포함)

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarComponent.css';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const CalendarComponent = () => {
  const { currentUser } = useAuth();
  const [selectedDates, setSelectedDates] = useState([]);
  const [userOffDates, setUserOffDates] = useState([]);
  const [allOffData, setAllOffData] = useState({});

  const userId = currentUser?.email?.split('@')[0];

  const fetchOffData = async () => {
    if (!userId) return;
    const docRef = doc(db, 'offData', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data().dates || [];
      setUserOffDates(data);
      setSelectedDates(data);
    }

    // Load all users' data
    const allUsersRef = doc(db, 'offData', '__all__');
    const allSnap = await getDoc(allUsersRef);
    if (allSnap.exists()) {
      setAllOffData(allSnap.data());
    }
  };

  useEffect(() => {
    fetchOffData();
  }, [userId]);

  const handleDateChange = (date) => {
    const timestamp = date.getTime();
    const isSelected = selectedDates.some(d => new Date(d).getTime() === timestamp);

    let newDates;
    if (isSelected) {
      newDates = selectedDates.filter(d => new Date(d).getTime() !== timestamp);
    } else {
      if (selectedDates.length >= 3) {
        alert('최대 3일까지만 선택할 수 있습니다.');
        return;
      }
      const dateStr = date.toISOString().split('T')[0];
      const dateKey = dateStr;
      const count = Object.values(allOffData).filter(arr => arr.includes(dateKey)).length;
      if (count >= 3) {
        alert(`${dateStr}에는 이미 3명의 오프 신청이 있습니다.`);
        return;
      }
      newDates = [...selectedDates, date];
    }

    setSelectedDates(newDates);
  };

  const saveOffDates = async () => {
    const formattedDates = selectedDates.map(d => d.toISOString().split('T')[0]);
    await setDoc(doc(db, 'offData', userId), { dates: formattedDates });

    const allDocRef = doc(db, 'offData', '__all__');
    const allSnap = await getDoc(allDocRef);
    const allData = allSnap.exists() ? allSnap.data() : {};
    allData[userId] = formattedDates;
    await setDoc(allDocRef, allData);
    alert('오프가 저장되었습니다.');
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const count = Object.values(allOffData).filter(arr => arr.includes(dateStr)).length;
      if (selectedDates.some(d => new Date(d).toISOString().split('T')[0] === dateStr)) {
        return 'selected';
      }
      if (count >= 3) {
        return 'disabled';
      }
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <h2>{userId} 님의 오프 신청</h2>
      <Calendar
        onClickDay={handleDateChange}
        value={null}
        tileClassName={tileClassName}
      />
      <button onClick={saveOffDates}>신청 저장</button>
      <h4>선택된 날짜:</h4>
      <ul>
        {selectedDates.map((d, idx) => (
          <li key={idx}>{d.toISOString().split('T')[0]}</li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarComponent;
