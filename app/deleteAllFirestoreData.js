// deleteAllFirestoreData.js
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { firestore } from './firebase'; // adjust path to your firebase.js

export const deleteAllFirestoreData = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "AQMSS3_Historical"));

    console.log(`Found ${querySnapshot.size} documents to delete.`);

    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(doc(firestore, "AQMSS3_Historical", docSnap.id));
      console.log(`Deleted document with ID: ${docSnap.id}`);
    }

    console.log('✅ All Firestore data deleted.');
  } catch (error) {
    console.error('❌ Error deleting Firestore data:', error);
  }
};
