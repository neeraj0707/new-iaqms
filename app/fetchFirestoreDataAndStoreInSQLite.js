// // fetchFirestoreDataAndStoreInSQLite.js

// import { collection, getDocs, orderBy, query } from 'firebase/firestore';
// import { insertAqiData } from './database'; // your existing insertAqiData
// import { firestore } from './firebase'; // adjust path to your firebase.js

// export const fetchFirestoreDataAndStoreInSQLite = async () => {
//     try {
//         // const now = Date.now();
//         // const twentyFourHoursAgo = new Date(now - (24 * 60 * 60 * 1000));

//         const q = query(
//             collection(firestore, "AQMSS3_Historical"), // Your Firestore collection name
//             // where("timestamp", ">=", Timestamp.fromDate(twentyFourHoursAgo)),
//             orderBy("timestamp", "asc")
//         );

//         const querySnapshot = await getDocs(q);

//         // console.log(`Found ${querySnapshot.size} documents in past 24h.`);

//         for (const doc of querySnapshot.docs) {
//             const data = doc.data();

//             // Prepare data object for SQLite insert
//             const sqliteData = {
//                 AQI: data.AQI || '',
//                 CO2: data.CO2 || '',
//                 PM10: data.PM10 || '',
//                 PM25: data.PM25 || '',
//                 RH: data.RH || '',
//                 TVOC: data.TVOC || '',
//                 Time: data.timeString || '', // use the same timeString field from Firestore
//                 temp: data.temp || ''
//             };

//             // Insert into SQLite
//             await insertAqiData(sqliteData);
//         }

//         // console.log('✅ All Firestore data inserted into SQLite.');
//     } catch (error) {
//         console.error('❌ Error fetching data from Firestore and storing in SQLite:', error);
//     }
// };








    // fetchFirestoreDataAndStoreInSQLite.js
    import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { insertAqiData } from './database'; // your existing insertAqiData
import { firestore } from './firebase'; // adjust path to your firebase.js
import { getLastUpdateTime, setLastUpdateTime } from './storage'; // Implement these functions

    export const fetchFirestoreDataAndStoreInSQLite = async () => {
        try {
            const lastUpdateTime = await getLastUpdateTime(); // Get the last update timestamp
            console.log("lastUpdateTime", lastUpdateTime)
            let q;

            if (lastUpdateTime) {
                // Fetch only documents newer than the last update
                q = query(
                    collection(firestore, "AQMSS3_Historical"),
                    where("timestamp", ">", lastUpdateTime),
                    orderBy("timestamp", "asc")
                );
            } else {
                // Fetch all documents if it's the first time
                q = query(
                    collection(firestore, "AQMSS3_Historical"),
                    orderBy("timestamp", "asc")
                );
            }

            const querySnapshot = await getDocs(q);

            console.log(`Found ${querySnapshot.size} new documents.`);

            for (const doc of querySnapshot.docs) {
                const data = doc.data();

                // Prepare data object for SQLite insert
                const sqliteData = {
                    AQI: data.AQI || '',
                    CO2: data.CO2 || '',
                    PM10: data.PM10 || '',
                    PM25: data.PM25 || '',
                    RH: data.RH || '',
                    TVOC: data.TVOC || '',
                    Time: data.timeString || '', // use the same timeString field from Firestore
                    temp: data.temp || '',
                    timestamp: data.timestamp // Use the Firestore timestamp directly
                };

                // Insert into SQLite
                await insertAqiData(sqliteData);
            }

            if (querySnapshot.size > 0) {
                // Update the last update time to the latest timestamp
                const latestTimestamp = querySnapshot.docs[querySnapshot.docs.length - 1].data().timestamp;
                await setLastUpdateTime(latestTimestamp);
                console.log('✅ Last update time updated.');
            }

            console.log('✅ Firestore data inserted into SQLite.');
        } catch (error) {
            console.error('❌ Error fetching data from Firestore and storing in SQLite:', error);
        }
    };
    