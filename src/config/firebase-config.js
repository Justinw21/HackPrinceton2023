// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDC1DobrxcwHoKkdBjIkDlG8LTF-s0WTJ8",
  authDomain: "hackprinceton2023-36bd2.firebaseapp.com",
  projectId: "hackprinceton2023-36bd2",
  storageBucket: "hackprinceton2023-36bd2.appspot.com",
  messagingSenderId: "56281845924",
  appId: "1:56281845924:web:d36cea55a7356c09fc5631",
  measurementId: "G-17Y8W3BZED"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// firebase login
// firebase init
// firebase deploy
