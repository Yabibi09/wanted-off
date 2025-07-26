// src/firebase.js

// 1) Firebase core 초기화 함수 가져오기
import { initializeApp } from "firebase/app";

// 2) (선택) Auth, Firestore 사용 예정이면 모듈도 가져오기
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 3) Firebase 콘솔에서 복사한 설정 객체
const firebaseConfig = {
  apiKey: "AIzaSyC7mj6LzGEzlm3mxRilUMtvAKc-PmG_cj0",
  authDomain: "nurse-off.firebaseapp.com",
  projectId: "nurse-off",
  storageBucket: "nurse-off.appspot.com",
  messagingSenderId: "754923113150",
  appId: "1:754923113150:web:94f069f252260edcdfecef"
};

// 4) 앱 초기화
const app = initializeApp(firebaseConfig);

// 5) (선택) auth, db 인스턴스 생성하여 export
export const auth = getAuth(app);
export const db   = getFirestore(app);

// 6) default export 로 app 인스턴스도 내보내기
export default app;
