import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAKmA4pMrb6yYGoCM-L6_iwsps0Zb1L6v8",
  authDomain: "tell-me-mom.firebaseapp.com",
  projectId: "tell-me-mom",
  storageBucket: "tell-me-mom.firebasestorage.app",
  messagingSenderId: "710820709969",
  appId: "1:710820709969:web:e2f8ba94a611f63e729a70",
  measurementId: "G-2Z580Y9T5V"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
