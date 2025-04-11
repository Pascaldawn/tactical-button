// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQUHOdpdpdmsi8E7HNAmgj44_fZkN3rzc",
  authDomain: "tactical-button-c8a62.firebaseapp.com",
  projectId: "tactical-button-c8a62",
  storageBucket: "tactical-button-c8a62.firebasestorage.app",
  messagingSenderId: "667547202980",
  appId: "1:667547202980:web:cec31c902838c550fe3d31",
  measurementId: "G-3S9DBL21K2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
