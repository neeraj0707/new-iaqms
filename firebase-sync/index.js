import { initializeApp } from "firebase/app";
import { get, getDatabase, ref } from "firebase/database";
import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";

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

async function syncData() {
  try {
    const snapshot = await get(ref(db, "AQMSS3"));
    const data = snapshot.val();

    if (data) {
      await addDoc(collection(firestore, "AQMSS3_Historical"), {
        ...data,
        timestamp: serverTimestamp()
      });
      console.log("Data synced at", new Date().toISOString());
    } else {
      console.log("No data found in Realtime Database.");
    }
  } catch (err) {
    console.error("Sync failed:", err);
  }
}

syncData();
