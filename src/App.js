import React, { useState } from "react";
import Login from "./Login";
import CalendarComponent from "./CalendarComponent";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {user ? <CalendarComponent user={user} /> : <Login onLogin={setUser} />}
    </div>
  );
}

export default App;