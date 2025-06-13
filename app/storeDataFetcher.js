import { onValue, ref } from 'firebase/database';
import { insertAqiData } from './database';
import { db as firebaseDb } from './firebase';

export const startSyncStoreDataToSQLite = () => {
  const storeDataRef = ref(firebaseDb, 'AQMSS3_storeData');

  onValue(storeDataRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    Object.entries(data).forEach(([id, record]) => {
      const timestamp = record.timestamp?.seconds
        ? record.timestamp
        : { seconds: Date.now() / 1000 }; // fallback

      insertAqiData({
        ...record,
        timestamp,
      });
    });
  });
};
