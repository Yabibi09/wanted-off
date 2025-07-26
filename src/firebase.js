// firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "너의 키",
  authDomain: "너의 도메인",
  projectId: "너의 ID",
  storageBucket: "너의 버킷",
  messagingSenderId: "너의 ID",
  appId: "너의 App ID"
};

const app = initializeApp(firebaseConfig);
export default app;
