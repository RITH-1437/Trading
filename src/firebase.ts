import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATMHv176Q0LA9DHR7C0e-2iTD__rNTf2c",
  authDomain: "trading-discipline.firebaseapp.com",
  databaseURL: "https://trading-discipline-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trading-discipline",
  storageBucket: "trading-discipline.firebasestorage.app",
  messagingSenderId: "753964588555",
  appId: "1:753964588555:web:d48b36000966976319967c2",
  measurementId: "G-fGV0ZT2MTE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
