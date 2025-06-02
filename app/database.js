// import * as SQLite from 'expo-sqlite';

// // Open or create the database
// const db = SQLite.openDatabaseAsync('aqi_data.db');

// // Initialize the database
// export const initDatabase = () => {
//   db.transaction(tx => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS aqi_data (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         aqi TEXT,
//         co2 TEXT,
//         pm10 TEXT,
//         pm25 TEXT,
//         rh TEXT,
//         tvoc TEXT,
//         time TEXT,
//         temp TEXT,
//         timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
//       );`
//     );
//   });
// };

// // Function to insert data into SQLite
// export const insertAqiData = (data) => {
//   db.transaction(tx => {
//     tx.executeSql(
//       `INSERT INTO aqi_data (aqi, co2, pm10, pm25, rh, tvoc, time, temp) 
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         data.AQI || '',
//         data.CO2 || '',
//         data.PM10 || '',
//         data.PM25 || '',
//         data.RH || '',
//         data.TVOC || '',
//         data.Time || '',
//         data.temp || ''
//       ],
//       (_, result) => console.log('Data inserted successfully'),
//       (_, error) => console.log('Error inserting data:', error)
//     );
//   });
// };

// // Function to fetch all data from SQLite
// export const fetchAllAqiData = (callback) => {
//   db.transaction(tx => {
//     tx.executeSql(
//       'SELECT * FROM aqi_data ORDER BY timestamp DESC',
//       [],
//       (_, { rows }) => callback(rows._array),
//       (_, error) => console.log('Error fetching data:', error)
//     );
//   });
// };

// // Function to get the count of records
// export const getRecordCount = (callback) => {
//   db.transaction(tx => {
//     tx.executeSql(
//       'SELECT COUNT(*) as count FROM aqi_data',
//       [],
//       (_, { rows }) => callback(rows._array[0].count),
//       (_, error) => console.log('Error counting records:', error)
//     );
//   });
// };

// export default {
//      initDatabase,
//   insertAqiData,
//     db
// };





import * as SQLite from 'expo-sqlite';

// Open database connection asynchronously
const openDatabaseAsync = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('aqi_data.db');
     console.log('Database opened successfully');
    return db;
  } catch (error) {
    console.error('Error opening database:', error);
    throw error;
  }
};

// Initialize database
export const initDatabase = async () => {
  try {
    const db = await openDatabaseAsync();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS aqi_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        aqi TEXT,
        co2 TEXT,
        pm10 TEXT,
        pm25 TEXT,
        rh TEXT,
        tvoc TEXT,
        time TEXT,
        temp TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Insert data function
export const insertAqiData = async (data) => {
  try {
     console.log('Inserting data:', data); // Log the data being inserted
    const db = await openDatabaseAsync();
    await db.runAsync(
      `INSERT INTO aqi_data (aqi, co2, pm10, pm25, rh, tvoc, time, temp) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.AQI || '',
        data.CO2 || '',
        data.PM10 || '',
        data.PM25 || '',
        data.RH || '',
        data.TVOC || '',
        data.Time || '',
        data.temp || ''
      ]
    );
    console.log('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

// Fetch all data
export const fetchAllAqiData = async () => {
  try {
    const db = await openDatabaseAsync();
    const result = await db.getAllAsync('SELECT * FROM aqi_data ORDER BY timestamp DESC');
    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export default {
  initDatabase,
  insertAqiData,
  fetchAllAqiData
};