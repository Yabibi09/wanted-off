import React, { useState } from "react";
import Login from "./Login";
import CalendarComponent from "./CalendarComponent";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <>
          <h3>{user.email}님, 환영합니다</h3>
          <CalendarComponent />
          <button onClick={() => setUser(null)}>로그아웃</button>
        </>
      )}
    </div>
  );
}

export default App;
