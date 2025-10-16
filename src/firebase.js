import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
    apiKey: "AIzaSyAxUxu96Wle68lmXAJPd2d8eEQG4P6pz0A",
    authDomain: "tripplanner-7a29d.firebaseapp.com",
    projectId: "tripplanner-7a29d",
    storageBucket: "tripplanner-7a29d.firebasestorage.app",
    messagingSenderId: "1004488977013",
    appId: "1:1004488977013:web:5005e65c81dd7bf3c3e63c"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
