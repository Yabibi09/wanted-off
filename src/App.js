import React, { useState } from "react";
import Login from "./Login";
import CalendarComponent from "./CalendarComponent";

function App() {
  const [user, setUser] = useState(null);
  return user ? <CalendarComponent user={user} /> : <Login onLogin={setUser} />;
}
export default App;