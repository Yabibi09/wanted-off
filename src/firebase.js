import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7mj6LzGEzlm3mxRilUMtvAKc-PmG_cj0",
  authDomain: "nurse-off.firebaseapp.com",
  projectId: "nurse-off",
  storageBucket: "nurse-off.firebasestorage.app",
  messagingSenderId: "754923113150",
  appId: "1:754923113150:web:94f069f252260edcdfecef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
