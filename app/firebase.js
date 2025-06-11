

import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDU9mNo8CuyTkmHioODR-mewZMJwWVnpQ8",
  authDomain: "security-53f3f.firebaseapp.com",
  databaseURL: "https://security-53f3f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "security-53f3f",
  storageBucket: "security-53f3f.firebasestorage.app",
  messagingSenderId: "425571787479",
  appId: "1:425571787479:web:ff6b8c968ef075491f4692",
  measurementId: "G-8T0EVQE60T"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const firestore = getFirestore(app);
// const auth = getAuth(app);


export { app, db, firestore };

