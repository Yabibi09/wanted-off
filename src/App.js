import React, { useState } from "react";
import Login from "./Login";
import CalendarComponent from "./CalendarComponent";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <>
          <h2>{user.email.split('@')[0]}님, 환영합니다</h2>
          <CalendarComponent user={user} />
          <button onClick={() => setUser(null)} style={{ marginTop: '10px' }}>로그아웃</button>
        </>
      )}
    </div>
  );
}

export default App;
