// import { useEffect, useState } from 'react';
// import { FlatList, StyleSheet, Text, View } from 'react-native';
// import { fetchAllAqiData } from './database'; // update with your actual path

// const AqiDataViewer = () => {
//   const [aqiData, setAqiData] = useState([]);

//   const loadData = async () => {
//     const data = await fetchAllAqiData();
//     setAqiData(data);
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       loadData(); // refresh every 5 seconds
//     }, 5000);

//     loadData(); // initial load
//     return () => clearInterval(interval); // cleanup on unmount
//   }, []);

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Text>AQI: {item.aqi}</Text>
//       <Text>CO₂: {item.co2}</Text>
//       <Text>PM10: {item.pm10}</Text>
//       <Text>PM2.5: {item.pm25}</Text>
//       <Text>RH: {item.rh}</Text>
//       <Text>TVOC: {item.tvoc}</Text>
//       <Text>Temp: {item.temp} °C</Text>
//       <Text>Time: {item.time}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Stored AQI Data (Last 24h)</Text>
//       <FlatList
//         data={aqiData}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 100 }}
//       />
//     </View>
//   );
// };

// export default AqiDataViewer;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 50,
//     paddingHorizontal: 20,
//     backgroundColor: '#fff',
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   card: {
//     backgroundColor: '#f0f0f0',
//     padding: 15,
//     marginVertical: 10,
//     borderRadius: 10,
//     elevation: 3,
//   },
// });









// import { useEffect, useState } from 'react';
// import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
// import database from './database'; // Adjust path if needed

// const ViewAqiData = () => {
//   const [aqiData, setAqiData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         await database.initDatabase(); // Initialize the database
//         const data = await database.fetchAllAqiData(); // Fetch all data
//         setAqiData(data || []); // Set the fetched data to state
//       } catch (error) {
//         console.error('Error loading AQI data:', error);
//       } finally {
//         setLoading(false); // Set loading to false after data is loaded
//       }
//     };

//     loadData(); // Call the loadData function
//   }, []);

//   const renderItem = ({ item }) => (
//     <View style={styles.itemContainer}>
//       <Text style={styles.itemText}><Text style={styles.label}>Time:</Text> {item.time}</Text>
//       <Text style={styles.itemText}><Text style={styles.label}>AQI:</Text> {item.aqi}</Text>
//       <Text style={styles.itemText}><Text style={styles.label}>CO2:</Text> {item.co2}</Text>
//       <Text style={styles.itemText}><Text style={styles.label}>PM10:</Text> {item.pm10}</Text>
//       <Text style={styles.itemText}><Text style={styles.label}>PM2.5:</Text> {item.pm25}</Text>
//       <Text style={styles.itemText}><Text style={styles.label}>RH:</Text> {item.rh}</Text>
//       <Text style={styles.itemText}><Text style={styles.label}>TVOC:</Text> {item.tvoc}</Text>
//       <Text style={styles.itemText}><Text style={styles.label}>Temp:</Text> {item.temp}</Text>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007bff" />
//         <Text>Loading data...</Text>
//       </View>
//     );
//   }

//   if (!aqiData.length) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text style={styles.emptyText}>No AQI data found.</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>AQI Data Records</Text>
//       <FlatList
//         data={aqiData}
//         keyExtractor={(item) => item.id.toString()} // Ensure the key is a string
//         renderItem={renderItem}
//         contentContainerStyle={styles.list}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f4f8',
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#222',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   list: {
//     paddingBottom: 20,
//   },
//   itemContainer: {
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   itemText: {
//     fontSize: 16,
//     color: '#333',
//     marginVertical: 2,
//   },
//   label: {
//     fontWeight: '600',
//     color: '#007bff',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: '#666',
//     fontStyle: 'italic',
//   },
// });

// export default ViewAqiData;





// import { Alert, Button, View } from 'react-native';
// import { exportAqiDataToJson } from './database';

// const ExportButton = () => {
//   const handleExport = async () => {
//     const filePath = await exportAqiDataToJson();
//     if (filePath) {
//       Alert.alert('Export Successful', `File saved at:\n${filePath}`);
//     }
//   };

//   return (
//     <View style={{ margin: 20 }}>
//       <Button title="Export AQI Data to JSON" onPress={handleExport} />
//     </View>
//   );
// };

// export default ExportButton;








// import * as Sharing from 'expo-sharing';
// import { Alert, Button, View } from 'react-native';
// import { exportAqiDataToJson } from './database';

// const ExportAndShareButton = () => {
//   const handleExportAndShare = async () => {
//     try {
//       const fileUri = await exportAqiDataToJson();

//       if (fileUri && await Sharing.isAvailableAsync()) {
//         await Sharing.shareAsync(fileUri);
//       } else {
//         Alert.alert('Error', 'Sharing is not available on this device.');
//       }
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Button title="Export and Share AQI JSON" onPress={handleExportAndShare} />
//     </View>
//   );
// };

// export default ExportAndShareButton;





// import { useEffect } from 'react';
// import { Text, View } from 'react-native';
// import { fetchAllAqiData } from './database'; // Adjust path if needed

// const ViewAqiData = () => {
//   useEffect(() => {
//     const fetchData = async () => {
//       console.log('📡 Calling fetchAllAqiData...');
//       const result = await fetchAllAqiData();
//       console.log('📦 Fetched Data:', result);
//     };

//     fetchData();
//   }, []);

//   return (
//     <View>
//       <Text>Check console for AQI data</Text>
//     </View>
//   );
// };

// export default ViewAqiData;










import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { fetchAllAqiData } from './database'; // Adjust path if needed
import { deleteAllFirestoreData } from './deleteAllFirestoreData'; // Adjust path if needed
import { fetchFirestoreDataAndStoreInSQLite } from './fetchFirestoreDataAndStoreInSQLite';

const ViewAqiData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      await fetchFirestoreDataAndStoreInSQLite();
      const result = await fetchAllAqiData();
      setData(result);
    };
    

    loadData();

     // Poll every 1 seconds
     const interval = setInterval(loadData, 1000); // 10000 ms = 10 sec

     return () => clearInterval(interval); // Cleanup
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.time}>{item.time}</Text>
      <Text style={styles.text}>AQI: {item.aqi}</Text>
      <Text style={styles.text}>CO₂: {item.co2}</Text>
      <Text style={styles.text}>PM10: {item.pm10}</Text>
      <Text style={styles.text}>PM2.5: {item.pm25}</Text>
      <Text style={styles.text}>RH: {item.rh}</Text>
      <Text style={styles.text}>TVOC: {item.tvoc}</Text>
      <Text style={styles.text}>Temp: {item.temp}°C</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Latest AQI Data</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <Button style={styles.b}
  title="Delete All Firestore Data"
  onPress={deleteAllFirestoreData}
/>

    </View>
  );
};

export default ViewAqiData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginVertical: 2,
  },
  time: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 6,
  },
  b: {
    // marginBottom: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 150,
  },
});
