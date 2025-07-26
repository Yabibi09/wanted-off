import React, { useState } from "react";
import CalendarComponent from "./CalendarComponent";
import Login from "./Login";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {user ? <CalendarComponent user={user} /> : <Login onLogin={setUser} />}
    </div>
  );
}