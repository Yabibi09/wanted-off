// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7mj6LzGEzlm3mxRilUMtvAKc-PmG_cj0",
  authDomain: "nurse-off.firebaseapp.com",
  projectId: "nurse-off",
  storageBucket: "nurse-off.appspot.com",
  messagingSenderId: "754923113150",
  appId: "1:754923113150:web:94f069f252260edcdfecef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// (Optional) You can also export auth and db if needed
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Export the app instance as default
export default app;
