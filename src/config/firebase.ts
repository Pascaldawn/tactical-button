
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAQUHOdpdpdmsi8E7HNAmgj44_fZkN3rzc",
  authDomain: "tactical-button-c8a62.firebaseapp.com",
  projectId: "tactical-button-c8a62",
  storageBucket: "tactical-button-c8a62.firebasestorage.app",
  messagingSenderId: "667547202980",
  appId: "1:667547202980:web:cec31c902838c550fe3d31",
  measurementId: "G-3S9DBL21K2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("Firebase initialized successfully");
