import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import app from "./firebase";

const auth = getAuth(app);

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = `${name.toLowerCase()}@nurse.com`;
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("회원가입 완료!");
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("로그인 성공!");
      }
      onLogin(userCredential.user);
    } catch (err) {
      alert("에러: " + err.message);
    }
  };

  return (
    <div>
      <h2>{isSignUp ? "회원가입" : "로그인"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{isSignUp ? "회원가입" : "로그인"}</button>
      </form>
      <p>
        {isSignUp ? "계정이 이미 있으신가요?" : "처음이신가요?"}
        <button onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? "로그인으로" : "회원가입으로"}</button>
      </p>
    </div>
  );
}