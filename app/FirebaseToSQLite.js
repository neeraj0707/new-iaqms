import * as SQLite from 'expo-sqlite';
import { getDatabase, onValue, ref } from 'firebase/database';
import { useEffect } from 'react';
import { ScrollView, Text } from 'react-native';

let dbInstance = null;

// 1. Open SQLite Database
const openDb = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('aqi_data.db');
  }
  return dbInstance;
};

// 2. Create Table
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
      timestamp INTEGER
    );
  `);
};

// 3. Insert data into SQLite (ignoring duplicates)
const insertOrIgnoreData = async (db, key, value) => {
  try {
    await db.runAsync(
      `INSERT OR IGNORE INTO aqi_data 
      (id, aqi, co2, pm10, pm25, tvoc, humidity, temperature, timestamp) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        key,
        value?.AQI || '',
        value?.CO2 || '',
        value?.PM10 || '',
        value?.PM25 || '',
        value?.TVOC || '',
        value?.Humidity || '',
        value?.Temperature || '',
        value?.timestamp?.seconds ? value.timestamp.seconds * 1000 : Date.now(),
      ]
    );
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

// 4. Fetch data from Firebase and store into SQLite
const fetchDataFromFirebase = async (db) => {
  const database = getDatabase();
  const dataRef = ref(database, 'AQMSS3_storeData');

  onValue(dataRef, async (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const entries = Object.entries(data);
      for (const [key, value] of entries) {
        await insertOrIgnoreData(db, key, value);
      }
    }
  });
};

// 5. Main component
const FirebaseToSQLite = () => {
  useEffect(() => {
    const init = async () => {
      const db = await openDb();
      await createTable(db);
      await fetchDataFromFirebase(db);
    };

    init();
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Syncing Firebase Data to SQLite...
      </Text>
    </ScrollView>
  );
};

export default FirebaseToSQLite;
