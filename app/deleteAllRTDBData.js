// // deleteAllFirestoreData.js
// import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
// import { firestore } from './firebase'; // adjust path to your firebase.js

// export const deleteAllFirestoreData = async () => {
//   try {
//     const querySnapshot = await getDocs(collection(firestore, "AQMSS3_Historical"));

//     console.log(`Found ${querySnapshot.size} documents to delete.`);

//     for (const docSnap of querySnapshot.docs) {
//       await deleteDoc(doc(firestore, "AQMSS3_Historical", docSnap.id));
//       console.log(`Deleted document with ID: ${docSnap.id}`);
//     }

//     console.log('✅ All Firestore data deleted.');
//   } catch (error) {
//     console.error('❌ Error deleting Firestore data:', error);
//   }
// };





// deleteAllRTDBData.js
import { get, getDatabase, ref, remove } from 'firebase/database';

export const deleteAllRTDBData = async () => {
  try {
    const db = getDatabase();
    const dataRef = ref(db, 'AQMSS3_storeData');

    const snapshot = await get(dataRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const keys = Object.keys(data);

      for (const key of keys) {
        const childRef = ref(db, `AQMSS3_storeData/${key}`);
        await remove(childRef);
        console.log(`🗑️ Deleted child key: ${key}`);
      }

      console.log('✅ All child data under AQMSS3_storeData deleted, node preserved.');
    } else {
      console.log('ℹ️ No data found under AQMSS3_storeData.');
    }
  } catch (error) {
    console.error('❌ Error deleting child data from RTDB:', error);
  }
};

