import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

let dbInstance = null;

const openDb = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('aqi_data.db');
    console.log('Database connection opened');
  }
  return dbInstance;
};

const AqiDataViewer = () => {
  const [data, setData] = useState([]);
  const [dbStatus, setDbStatus] = useState('Initializing...');

  // Test function to verify database operations
  const testDatabaseOperations = async () => {
    try {
      const db = await openDb();
      setDbStatus('Testing database...');
      
      // Insert test record
      const timestamp = Date.now();
      await db.runAsync(
        `INSERT INTO aqi_data (aqi, co2, pm10, pm25, rh, tvoc, time, temp, timestamp) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['150', '800', '35', '25', '60', '300', new Date().toISOString(), '22.5', timestamp]
      );
      console.log('Test data inserted successfully');
      
      // Verify insertion
      const testResults = await db.getAllAsync('SELECT * FROM aqi_data ORDER BY timestamp DESC LIMIT 1');
      console.log('Test query results:', testResults);
      
      setDbStatus(`Test successful. Records found: ${testResults.length}`);
      fetchData(); // Refresh the view
    } catch (error) {
      console.error('Database test failed:', error);
      setDbStatus(`Test failed: ${error.message}`);
    }
  };

  // Fetch data function
  const fetchData = async () => {
    try {
      const db = await openDb();
      setDbStatus('Fetching data...');
      
      // First verify table exists
      const tableInfo = await db.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='aqi_data'"
      );
      
      if (tableInfo.length === 0) {
        setDbStatus('aqi_data table does not exist');
        return;
      }
      
      // Get column info
      const columns = await db.getAllAsync('PRAGMA table_info(aqi_data)');
      console.log('Table columns:', columns);
      
      // Fetch data
      const result = await db.getAllAsync('SELECT * FROM aqi_data ORDER BY timestamp DESC LIMIT 50');
      console.log('Fetched data:', result);
      
      setData(result);
      setDbStatus(`Loaded ${result.length} records`);
    } catch (error) {
      console.error('Error fetching data:', error);
      setDbStatus(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Stored AQI Data (SQLite)</Text>
      <Text style={styles.status}>Status: {dbStatus}</Text>
      
      <TouchableOpacity style={styles.testButton} onPress={testDatabaseOperations}>
        <Text style={styles.testButtonText}>Test Database</Text>
      </TouchableOpacity>
      
      {data.length === 0 ? (
        <Text style={styles.empty}>No data found in database</Text>
      ) : (
        data.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.text}>Time: {item.time || 'N/A'}</Text>
            <Text style={styles.text}>AQI: {item.aqi || 'N/A'}</Text>
            <Text style={styles.text}>CO₂: {item.co2 || 'N/A'}</Text>
            <Text style={styles.text}>PM10: {item.pm10 || 'N/A'}</Text>
            <Text style={styles.text}>PM2.5: {item.pm25 || 'N/A'}</Text>
            <Text style={styles.text}>RH: {item.rh || 'N/A'}</Text>
            <Text style={styles.text}>TVOC: {item.tvoc || 'N/A'}</Text>
            <Text style={styles.text}>Temp: {item.temp || 'N/A'}</Text>
            <Text style={styles.text}>
              Timestamp: {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}
            </Text>
            <View style={styles.separator} />
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: '#f9f9f9' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  status: { fontSize: 14, color: '#666', marginBottom: 10 },
  row: { marginBottom: 10, padding: 10, backgroundColor: '#fff', borderRadius: 5 },
  text: { fontSize: 14, marginBottom: 3 },
  separator: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  empty: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 20 },
  testButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center'
  },
  testButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default AqiDataViewer;