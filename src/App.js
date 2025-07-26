import React, { useState } from "react";
import Login from "./Login";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <div>
          <h1>{user.email}님, 로그인 되었습니다.</h1>
          <button onClick={() => setUser(null)}>로그아웃</button>
        </div>
      )}
    </div>
  );
}

export default App;
