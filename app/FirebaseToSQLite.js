// import * as SQLite from 'expo-sqlite';
// import { getDatabase, onValue, ref } from 'firebase/database';
// import { useEffect } from 'react';
// import { ScrollView, Text } from 'react-native';

// let dbInstance = null;

// // 1. Open SQLite Database
// const openDb = async () => {
//   if (!dbInstance) {
//     dbInstance = await SQLite.openDatabaseAsync('aqi_data.db');
//   }
//   return dbInstance;
// };

// // 🔥 2. Drop old table (only once)
// const dropOldTable = async (db) => {
//   await db.execAsync(`DROP TABLE IF EXISTS aqi_data`);
// };

// // 2. Create Table
// const createTable = async (db) => {
//   await db.execAsync(`
//     CREATE TABLE IF NOT EXISTS aqi_data (
//       id TEXT PRIMARY KEY NOT NULL,
//       aqi TEXT,
//       co2 TEXT,
//       pm10 TEXT,
//       pm25 TEXT,
//       tvoc TEXT,
//       humidity TEXT,
//       temperature TEXT,
//       timestamp INTEGER
//     );
//   `);
// };

// // 3. Insert data into SQLite (ignoring duplicates)
// const insertOrIgnoreData = async (db, key, value) => {
//   try {
//     await db.runAsync(
//       `INSERT OR IGNORE INTO aqi_data 
//       (id, aqi, co2, pm10, pm25, tvoc, humidity, temperature, timestamp) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         key,
//         value?.AQI || '',
//         value?.CO2 || '',
//         value?.PM10 || '',
//         value?.PM25 || '',
//         value?.TVOC || '',
//         value?.RH || '',
//         value?.temp || '',
//         value?.timestamp?.seconds ? value.timestamp.seconds * 1000 : Date.now(),
//       ]
//     );
//   } catch (error) {
//     console.error('Error inserting data:', error);
//   }
// };

// // 4. Fetch data from Firebase and store into SQLite
// const fetchDataFromFirebase = async (db) => {
//   const database = getDatabase();
//   const dataRef = ref(database, 'AQMSS3_storeData');

//   onValue(dataRef, async (snapshot) => {
//     const data = snapshot.val();
//     console.log("📥 Firebase data snapshot:", data); // ✅ Log raw data
//     if (data) {
//       const entries = Object.entries(data);
//       console.log("🔍 Total entries from Firebase:", entries.length);
//       for (const [key, value] of entries) {
//         console.log("➡️ Inserting key:", key, "value:", value);
//         await insertOrIgnoreData(db, key, value);
//       }
//     }
//     else {
//       console.log("⚠️ No data found at 'AQMSS3_storeData'");
//     }
//   });
// };

// // 5. Main component
// const FirebaseToSQLite = () => {
//   useEffect(() => {
//     const init = async () => {
//       const db = await openDb();

//       // console.log("Creating table...");
//       await dropOldTable(db);  
//       console.log("Creating table...");
//       await createTable(db);
//       console.log("Table created.");
//       console.log("Fetching from Firebase...");
//       await fetchDataFromFirebase(db);
//     };

//     init();
//   }, []);

//   return (
//     <ScrollView style={{ padding: 20 }}>
//       <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
//         Syncing Firebase Data to SQLite...
//       </Text>
//     </ScrollView>
//   );
// };

// export default FirebaseToSQLite;




// import * as SQLite from 'expo-sqlite';
// import { getDatabase, onValue, ref } from 'firebase/database';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

// let dbInstance = null;

// const openDb = async () => {
//   if (!dbInstance) {
//     dbInstance = await SQLite.openDatabaseAsync('aqi_data.db');
//   }
//   return dbInstance;
// };

// const dropOldTable = async (db) => {
//   await db.execAsync(`DROP TABLE IF EXISTS aqi_data`);
// };

// const createTable = async (db) => {
//   await db.execAsync(`
//     CREATE TABLE IF NOT EXISTS aqi_data (
//       id TEXT PRIMARY KEY NOT NULL,
//       aqi TEXT,
//       co2 TEXT,
//       pm10 TEXT,
//       pm25 TEXT,
//       tvoc TEXT,
//       humidity TEXT,
//       temperature TEXT,
//       timestamp INTEGER
//     );
//   `);
// };

// const insertOrIgnoreData = async (db, key, value) => {
//   try {
//     await db.runAsync(
//       `INSERT OR IGNORE INTO aqi_data 
//       (id, aqi, co2, pm10, pm25, tvoc, humidity, temperature, timestamp) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         key,
//         value?.AQI || '',
//         value?.CO2 || '',
//         value?.PM10 || '',
//         value?.PM25 || '',
//         value?.TVOC || '',
//         value?.RH || '',
//         value?.temp || '',
//         value?.timestamp?.seconds ? value.timestamp.seconds * 1000 : Date.now(),
//       ]
//     );
//   } catch (error) {
//     console.error('Error inserting data:', error);
//   }
// };

// const fetchDataFromFirebase = async (db) => {
//   const database = getDatabase();
//   const dataRef = ref(database, 'AQMSS3_storeData');

//   onValue(dataRef, async (snapshot) => {
//     const data = snapshot.val();
//     if (data) {
//       const entries = Object.entries(data);
//       for (const [key, value] of entries) {
//         await insertOrIgnoreData(db, key, value);
//       }
//     }
//   });
// };

// const FirebaseToSQLite = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const init = async () => {
//       const db = await openDb();
//       await dropOldTable(db);
//       await createTable(db);
//       await fetchDataFromFirebase(db);

//       // Wait 1s then read from SQLite
//       setTimeout(() => {
//         db.getAllAsync('SELECT * FROM aqi_data ORDER BY timestamp DESC')
//           .then((rows) => {
//             console.log('📥 Data from SQLite:', rows);
//             setData(rows);
//             setLoading(false);
//           })
//           .catch((err) => {
//             console.error('❌ Read error:', err);
//             setLoading(false);
//           });
//       }, 1000);
//     };

//     init();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Firebase to SQLite Data</Text>
//       {data.length === 0 ? (
//         <Text style={styles.noData}>No data found.</Text>
//       ) : (
//         data.map((item) => (
//           <View key={item.id} style={styles.card}>
//             <Text>AQI: {item.aqi}</Text>
//             <Text>CO₂: {item.co2}</Text>
//             <Text>PM10: {item.pm10}</Text>
//             <Text>PM2.5: {item.pm25}</Text>
//             <Text>Humidity: {item.humidity}</Text>
//             <Text>TVOC: {item.tvoc}</Text>
//             <Text>Temperature: {item.temperature}°C</Text>
//             <Text style={styles.timestamp}>
//               {new Date(item.timestamp).toLocaleString()}
//             </Text>
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
//   card: {
//     backgroundColor: '#f2f2f2',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   timestamp: { marginTop: 5, fontSize: 12, color: '#555' },
//   noData: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 20 },
// });

// export default FirebaseToSQLite;














// import * as SQLite from 'expo-sqlite';
// import { getDatabase, onValue, ref } from 'firebase/database';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

// let dbInstance = null;

// // Open DB
// const openDb = async () => {
//   if (!dbInstance) {
//     dbInstance = await SQLite.openDatabaseAsync('aqi_data.db');
//   }
//   return dbInstance;
// };

// // Drop old table (optional)
// const dropOldTable = async (db) => {
//   await db.execAsync(`DROP TABLE IF EXISTS aqi_data`);
// };

// // Create table
// const createTable = async (db) => {
//   await db.execAsync(`
//     CREATE TABLE IF NOT EXISTS aqi_data (
//       id TEXT PRIMARY KEY NOT NULL,
//       aqi TEXT,
//       co2 TEXT,
//       pm10 TEXT,
//       pm25 TEXT,
//       tvoc TEXT,
//       humidity TEXT,
//       temperature TEXT,
//       datetime TEXT
//     );
//   `);
// };

// // Convert Firebase key to date
// const getDateFromFirebaseKey = (key) => {
//   const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
//   let timestamp = 0;
//   for (let i = 0; i < 8; i++) {
//     timestamp = timestamp * 64 + PUSH_CHARS.indexOf(key.charAt(i));
//   }
//   return new Date(timestamp);
// };

// // Insert data
// const insertOrIgnoreData = async (db, key, value) => {
//   try {
//     const createdDate = getDateFromFirebaseKey(key);
//     const dateStr = `${String(createdDate.getDate()).padStart(2, '0')}-${String(createdDate.getMonth() + 1).padStart(2, '0')}-${createdDate.getFullYear()}`;
//     const timeStr = value?.Time || '00:00:00';
//     const datetime = `${dateStr} ${timeStr}`;

//     await db.runAsync(
//       `INSERT OR IGNORE INTO aqi_data 
//       (id, aqi, co2, pm10, pm25, tvoc, humidity, temperature, datetime) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         key,
//         value?.AQI || '',
//         value?.CO2 || '',
//         value?.PM10 || '',
//         value?.PM25 || '',
//         value?.TVOC || '',
//         value?.RH || '',
//         value?.temp || '',
//         datetime
//       ]
//     );
//   } catch (error) {
//     console.error('❌ Error inserting data:', error);
//   }
// };

// // Firebase fetch
// const fetchDataFromFirebase = async (db) => {
//   const database = getDatabase();
//   const dataRef = ref(database, 'AQMSS3_storeData');

//   onValue(dataRef, async (snapshot) => {
//     const data = snapshot.val();
//     if (data) {
//       const entries = Object.entries(data);
//       for (const [key, value] of entries) {
//         await insertOrIgnoreData(db, key, value);
//       }
//     }
//   });
// };

// // Main UI
// const FirebaseToSQLite = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const init = async () => {
//       const db = await openDb();
//       await dropOldTable(db); // Remove this in production
//       await createTable(db);
//       await fetchDataFromFirebase(db);

//       // Load after short delay
//       setTimeout(() => {
//         db.getAllAsync('SELECT * FROM aqi_data ORDER BY datetime DESC')
//           .then((rows) => {
//             console.log('📥 Data from SQLite:', rows);
//             setData(rows);
//             setLoading(false);
//           })
//           .catch((err) => {
//             console.error('❌ Read error:', err);
//             setLoading(false);
//           });
//       }, 1000);
//     };

//     init();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Firebase to SQLite Data</Text>
//       {data.length === 0 ? (
//         <Text style={styles.noData}>No data found.</Text>
//       ) : (
//         data.map((item) => (
//           <View key={item.id} style={styles.card}>
//             <Text>AQI: {item.aqi}</Text>
//             <Text>CO₂: {item.co2}</Text>
//             <Text>PM10: {item.pm10}</Text>
//             <Text>PM2.5: {item.pm25}</Text>
//             <Text>Humidity: {item.humidity}</Text>
//             <Text>TVOC: {item.tvoc}</Text>
//             <Text>Temperature: {item.temperature}°C</Text>
//             <Text style={styles.timestamp}>{item.datetime}</Text>
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
//   card: {
//     backgroundColor: '#f2f2f2',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   timestamp: { marginTop: 5, fontSize: 12, color: '#555' },
//   noData: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 20 },
// });

// export default FirebaseToSQLite;















// import * as SQLite from 'expo-sqlite';
// import { getDatabase, onValue, ref } from 'firebase/database';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

// let dbInstance = null;

// // Open DB
// const openDb = async () => {
//   if (!dbInstance) {
//     dbInstance = await SQLite.openDatabaseAsync('aqi_data.db');
//   }
//   return dbInstance;
// };

// // Drop old table (for development)
// const dropOldTable = async (db) => {
//   await db.execAsync(`DROP TABLE IF EXISTS aqi_data`);
// };

// // Create table
// const createTable = async (db) => {
//   await db.execAsync(`
//     CREATE TABLE IF NOT EXISTS aqi_data (
//       id TEXT PRIMARY KEY NOT NULL,
//       aqi TEXT,
//       co2 TEXT,
//       pm10 TEXT,
//       pm25 TEXT,
//       tvoc TEXT,
//       humidity TEXT,
//       temperature TEXT,
//       datetime TEXT,
//     );
//   `);
// };

// // Decode Firebase key to date
// const getDateFromFirebaseKey = (key) => {
//   const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
//   let timestamp = 0;
//   for (let i = 0; i < 8; i++) {
//     timestamp = timestamp * 64 + PUSH_CHARS.indexOf(key.charAt(i));
//   }
//   return new Date(timestamp);
// };

// // Insert or ignore data
// const insertOrIgnoreData = async (db, key, value) => {
//   try {
//     const createdDate = getDateFromFirebaseKey(key);
//     const dateStr = `${String(createdDate.getDate()).padStart(2, '0')}-${String(createdDate.getMonth() + 1).padStart(2, '0')}-${createdDate.getFullYear()}`;
//     const timeStr = value?.Time || '00:00:00';
//     const datetime = `${dateStr} ${timeStr}`;

//     await db.runAsync(
//       `INSERT OR IGNORE INTO aqi_data 
//         (id, aqi, co2, pm10, pm25, tvoc, humidity, temperature, datetime) 
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         key,
//         value?.AQI || '',
//         value?.CO2 || '',
//         value?.PM10 || '',
//         value?.PM25 || '',
//         value?.TVOC || '',
//         value?.RH || '',
//         value?.temp || '',
//         datetime
//       ]
//     );
//   } catch (error) {
//     console.error('❌ Error inserting data:', error);
//   }
// };

// // Firebase + SQLite live sync
// const startRealtimeSync = (db, setData, setLoading) => {
//   const database = getDatabase();
//   const dataRef = ref(database, 'AQMSS3_storeData');

//   onValue(dataRef, async (snapshot) => {
//     const data = snapshot.val();
//     if (data) {
//       const entries = Object.entries(data);
//       for (const [key, value] of entries) {
//         await insertOrIgnoreData(db, key, value);
//       }
//     }

//     // Read from SQLite and update UI
//     db.getAllAsync('SELECT * FROM aqi_data ORDER BY datetime DESC')
//       .then((rows) => {
//         setData(rows);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('❌ Read error:', err);
//         setLoading(false);
//       });
//   });
// };

// // Main UI
// const FirebaseToSQLite = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const init = async () => {
//       const db = await openDb();
//       await dropOldTable(db); 
//       await createTable(db);
//       startRealtimeSync(db, setData, setLoading);
//     };

//     init();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Firebase to SQLite Data</Text>
//       {data.length === 0 ? (
//         <Text style={styles.noData}>No data found.</Text>
//       ) : (
//         data.map((item) => (
//           <View key={item.id} style={styles.card}>
//             {/* <Text>AQI: {item.aqi}</Text> */}
//             <Text>CO₂: {item.co2}</Text>
//             <Text>PM10: {item.pm10}</Text>
//             <Text>PM2.5: {item.pm25}</Text>
//             <Text>Humidity: {item.humidity}</Text>
//             <Text>TVOC: {item.tvoc}</Text>
//             <Text>Temperature: {item.temperature}°C</Text>
//             <Text style={styles.timestamp}>🕒 {item.datetime}</Text>
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
//   card: {
//     backgroundColor: '#f2f2f2',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   timestamp: { marginTop: 5, fontSize: 12, color: '#555' },
//   noData: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 20 },
// });

// export default FirebaseToSQLite;












// import * as SQLite from 'expo-sqlite';
// import { getDatabase, onValue, ref } from 'firebase/database';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

// let dbInstance = null;

// // Open DB
// const openDb = async () => {
//   if (!dbInstance) {
//     dbInstance = await SQLite.openDatabaseAsync('aqi_data.db');
//   }
//   return dbInstance;
// };

// // Create table if not exists
// const createTable = async (db) => {
//   await db.execAsync(`
//     CREATE TABLE IF NOT EXISTS aqi_data (
//       id TEXT PRIMARY KEY NOT NULL,
//       aqi TEXT,
//       co2 TEXT,
//       pm10 TEXT,
//       pm25 TEXT,
//       tvoc TEXT,
//       humidity TEXT,
//       temperature TEXT,
//       datetime TEXT
//     );
//   `);
// };

// // Decode Firebase push key to timestamp
// const getDateFromFirebaseKey = (key) => {
//   const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
//   let timestamp = 0;
//   for (let i = 0; i < 8; i++) {
//     timestamp = timestamp * 64 + PUSH_CHARS.indexOf(key.charAt(i));
//   }
//   return new Date(timestamp);
// };

// // Insert or ignore data (no await for faster batching)
// const insertOrIgnoreData = (db, key, value) => {
//   const createdDate = getDateFromFirebaseKey(key);
//   const dateStr = `${String(createdDate.getDate()).padStart(2, '0')}-${String(createdDate.getMonth() + 1).padStart(2, '0')}-${createdDate.getFullYear()}`;
//   const timeStr = value?.Time || '00:00:00';
//   const datetime = `${dateStr} ${timeStr}`;

//   db.runAsync(
//     `INSERT OR IGNORE INTO aqi_data 
//       (id, aqi, co2, pm10, pm25, tvoc, humidity, temperature, datetime) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//     [
//       key,
//       value?.AQI || '',
//       value?.CO2 || '',
//       value?.PM10 || '',
//       value?.PM25 || '',
//       value?.TVOC || '',
//       value?.RH || '',
//       value?.temp || '',
//       datetime
//     ]
//   ).catch((err) => {
//     console.error(`❌ Failed to insert key ${key}`, err);
//   });
// };

// // Start Firebase → SQLite sync
// const startRealtimeSync = (db, setData, setLoading) => {
//   const database = getDatabase();
//   const dataRef = ref(database, 'AQMSS3_storeData');

//   onValue(dataRef, async (snapshot) => {
//     const data = snapshot.val();

//     if (data) {
//       const entries = Object.entries(data);

//       // Batch insert
//       await db.execAsync('BEGIN TRANSACTION');
//       for (const [key, value] of entries) {
//         insertOrIgnoreData(db, key, value); // Don't await!
//       }
//       await db.execAsync('COMMIT');
//     }

//     // Fetch from SQLite
//     db.getAllAsync('SELECT * FROM aqi_data ORDER BY datetime DESC')
//       .then((rows) => {
//         setData(rows);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('❌ Error reading from DB:', err);
//         setLoading(false);
//       });
//   });
// };

// // Main component
// const FirebaseToSQLite = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const init = async () => {
//       const db = await openDb();
//       await createTable(db);
//       startRealtimeSync(db, setData, setLoading);
//     };
//     init();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Firebase to SQLite Data</Text>
//       {data.length === 0 ? (
//         <Text style={styles.noData}>No data found.</Text>
//       ) : (
//         data.map((item) => (
//           <View key={item.id} style={styles.card}>
//             <Text>CO₂: {item.co2}</Text>
//             <Text>PM10: {item.pm10}</Text>
//             <Text>PM2.5: {item.pm25}</Text>
//             <Text>Humidity: {item.humidity}</Text>
//             <Text>TVOC: {item.tvoc}</Text>
//             <Text>Temperature: {item.temperature}°C</Text>
//             <Text style={styles.timestamp}>🕒 {item.datetime}</Text>
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
//   card: {
//     backgroundColor: '#f2f2f2',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   timestamp: { marginTop: 5, fontSize: 12, color: '#555' },
//   noData: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 20 },
// });

// export default FirebaseToSQLite;





















// import * as SQLite from 'expo-sqlite';
// import { getDatabase, onChildAdded, ref } from 'firebase/database';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

// let dbInstance = null;

// // Open DB
// const openDb = async () => {
//   if (!dbInstance) {
//     dbInstance = await SQLite.openDatabaseAsync('aqi_data.db');
//   }
//   return dbInstance;
// };

// // Create table
// const createTable = async (db) => {
//   await db.execAsync(`
//     CREATE TABLE IF NOT EXISTS aqi_data (
//       id TEXT PRIMARY KEY NOT NULL,
//       aqi TEXT,
//       co2 TEXT,
//       pm10 TEXT,
//       pm25 TEXT,
//       tvoc TEXT,
//       humidity TEXT,
//       temperature TEXT,
//       datetime TEXT
//     );
//   `);
// };

// // Decode Firebase push key to timestamp
// const getDateFromFirebaseKey = (key) => {
//   const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
//   let timestamp = 0;
//   for (let i = 0; i < 8; i++) {
//     timestamp = timestamp * 64 + PUSH_CHARS.indexOf(key.charAt(i));
//   }
//   return new Date(timestamp);
// };

// // Insert if not exists
// const insertIfNew = async (db, key, value) => {
//   const createdDate = getDateFromFirebaseKey(key);
//   const dateStr = `${String(createdDate.getDate()).padStart(2, '0')}-${String(createdDate.getMonth() + 1).padStart(2, '0')}-${createdDate.getFullYear()}`;
//   const timeStr = value?.Time || '00:00:00';
//   const datetime = `${dateStr} ${timeStr}`;

//   try {
//     await db.runAsync(`
//       INSERT OR IGNORE INTO aqi_data 
//       (id, aqi, co2, pm10, pm25, tvoc, humidity, temperature, datetime)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `, [
//       key,
//       value?.AQI || '',
//       value?.CO2 || '',
//       value?.PM10 || '',
//       value?.PM25 || '',
//       value?.TVOC || '',
//       value?.RH || '',
//       value?.temp || '',
//       datetime,
//     ]);
//   } catch (e) {
//     console.error(`❌ Insert error for ${key}:`, e);
//   }
// };

// // Firebase to SQLite realtime sync
// const startRealtimeEfficientSync = (db, setData, setLoading) => {
//   const database = getDatabase();
//   const dataRef = ref(database, 'AQMSS3_storeData');

//   // Listen to new children only
//   onChildAdded(dataRef, async (snapshot) => {
//     const key = snapshot.key;
//     const value = snapshot.val();
//     if (!key || !value) return;

//     await insertIfNew(db, key, value);

//     // Fetch full table (you requested no LIMIT)
//     db.getAllAsync(`
//       SELECT * FROM aqi_data ORDER BY datetime DESC
//     `)
//       .then((rows) => {
//         setData(rows);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('❌ Fetch error:', err);
//         setLoading(false);
//       });
//   });
// };

// // Main Component
// const FirebaseToSQLite = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const init = async () => {
//       const db = await openDb();
//       await createTable(db);
//       startRealtimeEfficientSync(db, setData, setLoading);
//     };
//     init();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Firebase to SQLite Data</Text>
//       {data.length === 0 ? (
//         <Text style={styles.noData}>No data found.</Text>
//       ) : (
//         data.map((item) => (
//           <View key={item.id} style={styles.card}>
//             <Text>CO₂: {item.co2}</Text>
//             <Text>PM10: {item.pm10}</Text>
//             <Text>PM2.5: {item.pm25}</Text>
//             <Text>Humidity: {item.humidity}</Text>
//             <Text>TVOC: {item.tvoc}</Text>
//             <Text>Temperature: {item.temperature}°C</Text>
//             <Text style={styles.timestamp}>🕒 {item.datetime}</Text>
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
//   card: {
//     backgroundColor: '#f2f2f2',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   timestamp: { marginTop: 5, fontSize: 12, color: '#555' },
//   noData: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 20 },
// });

// export default FirebaseToSQLite;












// import * as SQLite from 'expo-sqlite';
// import { getDatabase, onChildAdded, ref } from 'firebase/database';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

// let dbInstance = null;

// // Open DB
// export const openDb = async () => {
//   if (!dbInstance) {
//     dbInstance = await SQLite.openDatabaseAsync('aqi_data.db');
//   }
//   return dbInstance;
// };

// // Create table
// const createTable = async (db) => {
//   await db.execAsync(`
//     CREATE TABLE IF NOT EXISTS aqi_data (
//       id TEXT PRIMARY KEY NOT NULL,
//       aqi TEXT,
//       co2 TEXT,
//       pm10 TEXT,
//       pm25 TEXT,
//       tvoc TEXT,
//       humidity TEXT,
//       temperature TEXT,
//       datetime TEXT
//     );
//   `);
// };

// // Decode Firebase push key to timestamp
// const getDateFromFirebaseKey = (key) => {
//   const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
//   let timestamp = 0;
//   for (let i = 0; i < 8; i++) {
//     timestamp = timestamp * 64 + PUSH_CHARS.indexOf(key.charAt(i));
//   }
//   return new Date(timestamp);
// };

// // Format datetime for UI
// const formatDateTime = (key, timeStr) => {
//   const createdDate = getDateFromFirebaseKey(key);
//   const dateStr = `${String(createdDate.getDate()).padStart(2, '0')}-${String(createdDate.getMonth() + 1).padStart(2, '0')}-${createdDate.getFullYear()}`;
//   const timeFormatted = timeStr || '00:00:00';
//   return `${dateStr} ${timeFormatted}`;
//   //  return createdDate.toISOString(); // ✅ ISO format: 2025-06-14T10:30:00.000Z
// };

// // Insert if new
// const insertIfNew = async (db, key, value) => {
//   const datetime = formatDateTime(key, value?.Time);
//   try {
//     await db.runAsync(`
//       INSERT OR IGNORE INTO aqi_data 
//       (id, aqi, co2, pm10, pm25, tvoc, humidity, temperature, datetime)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `, [
//       key,
//       value?.AQI || '',
//       value?.CO2 || '',
//       value?.PM10 || '',
//       value?.PM25 || '',
//       value?.TVOC || '',
//       value?.RH || '',
//       value?.temp || '',
//       datetime,
//     ]);

//     return {
//       id: key,
//       aqi: value?.AQI || '',
//       co2: value?.CO2 || '',
//       pm10: value?.PM10 || '',
//       pm25: value?.PM25 || '',
//       tvoc: value?.TVOC || '',
//       humidity: value?.RH || '',
//       temperature: value?.temp || '',
//       datetime,
//     };
//   } catch (e) {
//     console.error(`❌ Insert error for ${key}:`, e);
//     return null;
//   }
// };

// // Firebase sync: insert new, update UI without fetching full table
// const startRealtimeEfficientSync = (db, setData) => {
//   const database = getDatabase();
//   const dataRef = ref(database, 'AQMSS3_storeData');

//   onChildAdded(dataRef, async (snapshot) => {
//     const key = snapshot.key;
//     const value = snapshot.val();
//     if (!key || !value) return;

//     const insertedItem = await insertIfNew(db, key, value);
//     if (insertedItem) {
//       // setData((prevData) => {
//       //   const updated = [insertedItem, ...prevData];
//       //   return updated.slice(0, 100); // Keep only 100 latest in UI
//       // });
//       setData((prevData) => {
//   // Check if this item already exists
//   const exists = prevData.some(item => item.id === insertedItem.id);
//   if (exists) return prevData; // skip duplicate

//   const updated = [insertedItem, ...prevData];
//   return updated.slice(0, 100);
// });

//     }
//   });
// };

// // Main Component
// const FirebaseToSQLite = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const init = async () => {
//       const db = await openDb();
//       await createTable(db);

//       // Load latest 100 entries
//       const initialRows = await db.getAllAsync(`
//         SELECT * FROM aqi_data ORDER BY datetime DESC LIMIT 100
//       `);
//       setData(initialRows);
//       setLoading(false);

//       // Start real-time sync after initial load
//       startRealtimeEfficientSync(db, setData);
//     };
//     init();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Firebase to SQLite Data</Text>
//       {data.length === 0 ? (
//         <Text style={styles.noData}>No data found.</Text>
//       ) : (
//         data.map((item) => (
//           <View key={item.id} style={styles.card}>
//             <Text>CO₂: {item.co2}</Text>
//             <Text>PM10: {item.pm10}</Text>
//             <Text>PM2.5: {item.pm25}</Text>
//             <Text>Humidity: {item.humidity}</Text>
//             <Text>TVOC: {item.tvoc}</Text>
//             <Text>Temperature: {item.temperature}°C</Text>
//             <Text style={styles.timestamp}>🕒 {item.datetime}</Text>
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
//   card: {
//     backgroundColor: '#f2f2f2',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   timestamp: { marginTop: 5, fontSize: 12, color: '#555' },
//   noData: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 20 },
// });

// export default FirebaseToSQLite;














import * as SQLite from 'expo-sqlite';
import { getDatabase, onChildAdded, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

let dbInstance = null;

// Open DB
export const openDb = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('aqi_data.db');
  }
  return dbInstance;
};

// Create table with datetime (display) and timestamp (ISO)
const createTable = async (db) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS aqi_data (
      id TEXT PRIMARY KEY NOT NULL,
      aqi TEXT,
      co2 TEXT,
      pm10 TEXT,
      pm25 TEXT,
      tvoc TEXT,
      humidity TEXT,
      temperature TEXT,
      datetime TEXT,   -- for user display
      timestamp TEXT   -- for filtering and graphs
    );
  `);
};

const addMissingTimestampColumn = async (db) => {
  const columns = await db.getAllAsync(`PRAGMA table_info(aqi_data);`);
  const hasTimestamp = columns.some(col => col.name === 'timestamp');
  if (!hasTimestamp) {
    await db.execAsync(`ALTER TABLE aqi_data ADD COLUMN timestamp TEXT;`);
    console.log("✅ 'timestamp' column added to 'aqi_data' table.");
  }
};


// Decode Firebase push key to timestamp
const getDateFromFirebaseKey = (key) => {
  const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
  let timestamp = 0;
  for (let i = 0; i < 8; i++) {
    timestamp = timestamp * 64 + PUSH_CHARS.indexOf(key.charAt(i));
  }
  return new Date(timestamp);
};

// Return both display-friendly and ISO formats
const formatDateTime = (key, timeStr) => {
  const createdDate = getDateFromFirebaseKey(key);
  const dateStr = `${String(createdDate.getDate()).padStart(2, '0')}-${String(createdDate.getMonth() + 1).padStart(2, '0')}-${createdDate.getFullYear()}`;
  const timeFormatted = timeStr || '00:00:00';
  const readable = `${dateStr} ${timeFormatted}`;
  const iso = createdDate.toISOString();
  return { readable, iso };
};

// Insert if new, store both datetime and timestamp
const insertIfNew = async (db, key, value) => {
  const { readable, iso } = formatDateTime(key, value?.Time);
  const tvocFormatted = value?.TVOC ? (parseFloat(value.TVOC) / 100).toFixed(2) : '';

  try {
    await db.runAsync(`
      INSERT OR IGNORE INTO aqi_data 
      (id, aqi, co2, pm10, pm25, tvoc, humidity, temperature, datetime, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      key,
      value?.AQI || '',
      value?.CO2 || '',
      value?.PM10 || '',
      value?.PM25 || '',
      tvocFormatted,
      // value?.TVOC ? (parseFloat(value.TVOC) / 100).toFixed(2) : '',
      // value?.TVOC || '',
      value?.RH || '',
      value?.temp || '',
      readable,
      iso
    ]);

    return {
      id: key,
      aqi: value?.AQI || '',
      co2: value?.CO2 || '',
      pm10: value?.PM10 || '',
      pm25: value?.PM25 || '',
       tvoc: tvocFormatted, 
      // tvoc: value?.TVOC || '',
      humidity: value?.RH || '',
      temperature: value?.temp || '',
      datetime: readable,
      timestamp: iso,
    };
  } catch (e) {
    console.error(`❌ Insert error for ${key}:`, e);
    return null;
  }
};

// Start Firebase listener and update SQLite + UI
const startRealtimeEfficientSync = (db, setData) => {
  const database = getDatabase();
  const dataRef = ref(database, 'AQMSS3_storeData');

  onChildAdded(dataRef, async (snapshot) => {
    const key = snapshot.key;
    const value = snapshot.val();
    if (!key || !value) return;

    const insertedItem = await insertIfNew(db, key, value);
    if (insertedItem) {
      setData((prevData) => {
        const exists = prevData.some(item => item.id === insertedItem.id);
        if (exists) return prevData;
        const updated = [insertedItem, ...prevData];
        return updated.slice(0, 100); // Keep UI light
      });
    }
  });
};

// Component
const FirebaseToSQLite = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const db = await openDb();
      await createTable(db);
      await addMissingTimestampColumn(db);


      const initialRows = await db.getAllAsync(`
        SELECT * FROM aqi_data ORDER BY timestamp DESC LIMIT 100
      `);
      setData(initialRows);
      setLoading(false);

      startRealtimeEfficientSync(db, setData);
    };
    init();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>History Timeline</Text>
      {data.length === 0 ? (
        <Text style={styles.noData}>No data found.</Text>
      ) : (
        data.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text>CO₂: {item.co2} ppm</Text>
            <Text>PM10: {item.pm10} µg/m³</Text>
            <Text>PM2.5: {item.pm25} µg/m³</Text>
            <Text>Humidity: {item.humidity} %</Text>
            <Text>TVOC: {item.tvoc} mg/m³</Text>
            <Text>Temperature: {item.temperature}°C</Text>
            <Text style={styles.timestamp}>🕒 {item.datetime}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  timestamp: { marginTop: 5, fontSize: 12, color: '#555' },
  noData: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 20 },
});

export default FirebaseToSQLite;
