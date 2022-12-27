import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1mNX9WjAVSqAaNwOz_D1c307UydXKnLs",
  authDomain: "fir-pinia-f0755.firebaseapp.com",
  projectId: "fir-pinia-f0755",
  storageBucket: "fir-pinia-f0755.appspot.com",
  messagingSenderId: "347868721394",
  appId: "1:347868721394:web:606bf704266067f3c2206b",
  measurementId: "G-HN6EEB4DZN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth();

export { app, db, analytics, auth };
