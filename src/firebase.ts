import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { 
  initializeFirestore, 
  persistentLocalCache,
  persistentSingleTabManager,
  Firestore
} from "firebase/firestore";

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
const auth = getAuth(app);

const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager(undefined),
    cacheSizeBytes: 50 * 1024 * 1024
  }),
  experimentalForceLongPolling: true
});

if (process.env.NODE_ENV === 'development') {
  const currentDomain = window.location.hostname;
  console.log(`Adicione ${currentDomain} aos domínios autorizados no Firebase Console`);
}

export { db, auth }; 