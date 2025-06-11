// import { initializeApp } from "firebase/app";
// import { get, getDatabase, ref } from "firebase/database";
// import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";

// const firebaseConfig = {
//    apiKey: "AIzaSyDU9mNo8CuyTkmHioODR-mewZMJwWVnpQ8",
//   authDomain: "security-53f3f.firebaseapp.com",
//   databaseURL: "https://security-53f3f-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "security-53f3f",
//   storageBucket: "security-53f3f.firebasestorage.app",
//   messagingSenderId: "425571787479",
//   appId: "1:425571787479:web:ff6b8c968ef075491f4692",
//   measurementId: "G-8T0EVQE60T"
// };

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);
// const firestore = getFirestore(app);

// async function syncData() {
//   try {
//     const snapshot = await get(ref(db, "AQMSS3"));
//     const data = snapshot.val();

//     if (data) {
//       await addDoc(collection(firestore, "AQMSS3_Historical"), {
//         ...data,
//         timestamp: serverTimestamp()
//       });
//       console.log("Data synced at", new Date().toISOString());
//     } else {
//       console.log("No data found in Realtime Database.");
//     }
//   } catch (err) {
//     console.error("Sync failed:", err);
//   }
// }

// syncData();









// import { initializeApp } from "firebase/app";
// import { getDatabase, onValue, ref } from "firebase/database";
// import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDU9mNo8CuyTkmHioODR-mewZMJwWVnpQ8",
//   authDomain: "security-53f3f.firebaseapp.com",
//   databaseURL: "https://security-53f3f-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "security-53f3f",
//   storageBucket: "security-53f3f.appspot.com",  // You had a typo here!
//   messagingSenderId: "425571787479",
//   appId: "1:425571787479:web:ff6b8c968ef075491f4692",
//   measurementId: "G-8T0EVQE60T"
// };

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);
// const firestore = getFirestore(app);

// const dataRef = ref(db, "AQMSS3");

// onValue(dataRef, async (snapshot) => {
//   const data = snapshot.val();

//   if (data) {
//     try {
//       await addDoc(collection(firestore, "AQMSS3_Historical"), {
//         ...data,
//         timestamp: serverTimestamp()
//       });
//       console.log("✅ Synced at", new Date().toISOString());
//     } catch (err) {
//       console.error("❌ Firestore sync error:", err);
//     }
//   } else {
//     console.log("❌ No data found in RTDB.");
//   }
// });













import { initializeApp } from "firebase/app";
import { get, getDatabase, ref } from "firebase/database";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDU9mNo8CuyTkmHioODR-mewZMJwWVnpQ8",
  authDomain: "security-53f3f.firebaseapp.com",
  databaseURL: "https://security-53f3f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "security-53f3f",
  storageBucket: "security-53f3f.appspot.com",
  messagingSenderId: "425571787479",
  appId: "1:425571787479:web:ff6b8c968ef075491f4692",
  measurementId: "G-8T0EVQE60T"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const firestore = getFirestore(app);

// Main sync function
async function syncData() {
  try {
    const snapshot = await get(ref(db, "AQMSS3"));
    const data = snapshot.val();

    if (data && data.Time) {
      // Generate a unique ID using current date and time
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0]; // e.g., "2025-06-11"
      const timeKey = `${dateStr}_${data.Time.replace(/:/g, "-")}`; // e.g., "2025-06-11_16-41-42"

      // Use setDoc with that ID to overwrite or create unique entries
      await setDoc(doc(firestore, "AQMSS3_Historical", timeKey), {
        ...data,
        timestamp: serverTimestamp()
      });

      console.log("✅ Synced:", timeKey);
    } else {
      console.log("⚠️ No data or time field found in RTDB.");
    }
  } catch (err) {
    console.error("❌ Sync failed:", err);
  }
}

syncData();
