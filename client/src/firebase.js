import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgdEYPNBd3XsIJRiSFICW8UYtnDl-ncmw",
  authDomain: "timeless-m-gala.firebaseapp.com",
  projectId: "timeless-m-gala",
  storageBucket: "timeless-m-gala.firebasestorage.app",
  messagingSenderId: "869685382201",
  appId: "1:869685382201:web:a917167af7bcd73c2111e8",
  measurementId: "G-F14W59FTCN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

export default app;