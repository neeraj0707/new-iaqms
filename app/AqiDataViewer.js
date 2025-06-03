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




