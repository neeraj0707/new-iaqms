
// import React, { useState, useEffect, useRef } from "react";
// import { View, Text, ScrollView, StyleSheet } from "react-native";
// import { db } from "./firebase";
// import { ref, onValue } from "firebase/database";

// const formatTimeString = (timeString) => {
//   if (typeof timeString === 'string' && timeString.match(/^\d{2}:\d{2}:\d{2}$/ )) {
//     return timeString;
//   }
  
//   const now = new Date();
//   const hours = String(now.getHours()).padStart(2, "0");
//   const minutes = String(now.getMinutes()).padStart(2, "0");
//   const seconds = String(now.getSeconds()).padStart(2, "0");
//   return `${hours}:${minutes}:${seconds}`;
// };

// const formatDisplayTimestamp = (timeString) => {
//   const today = new Date();
//   const day = String(today.getDate()).padStart(2, "0");
//   const month = String(today.getMonth() + 1).padStart(2, "0");
//   const year = String(today.getFullYear()).slice(-2);
  
//   return `${day}-${month}-${year} ${timeString || "00:00:00"}`;
// };

// const FetchData = ({ onDataFetched }) => {
//   const [currentData, setCurrentData] = useState(null);
//   const [history, setHistory] = useState([]);
//   const lastDataRef = useRef(null);

//   useEffect(() => {
//     const dataRef = ref(db, "AQMSS1");
//     const unsubscribe = onValue(dataRef, (snapshot) => {
//       const data = snapshot.val();

      

//       if (data) {
//         const newEntry = {
//           id: Date.now().toString(),
//           TEMP: parseFloat(data.temp) || 0,
//           RH: parseFloat(data.RH) || 0,
//           CO2: parseFloat(data.CO2) || 0,
//           TVOC: parseFloat(data.TVOC) || 0,
//           PM25: parseFloat(data.PM25) || 0,
//           PM10: parseFloat(data.PM10) || 0,
//           AQI: parseFloat(data.AQI) || 0,
//           time: data.Time || formatTimeString(null),
//           timestamp: data.Time || formatTimeString(null)
//         };

//         // Only update if data has changed
//         if (!lastDataRef.current || 
//             JSON.stringify(lastDataRef.current) !== JSON.stringify(newEntry)) {
          
//           lastDataRef.current = newEntry;
//           setCurrentData(newEntry);
          
//           // Maintain a history of last 20 readings
//           setHistory(prev => {
//             const newHistory = [newEntry, ...prev].slice(0, 20);
//             // if (onDataFetched) onDataFetched(newHistory);
//             return newHistory;
//           });
//         }
        
//       }
//     });

//     return () => unsubscribe();
//   }, []); // Removed onDataFetched from dependencies to prevent loops

//    // Notify parent of data changes via useEffect
//    useEffect(() => {
//     if (history.length > 0 && onDataFetched) {
//       onDataFetched(history);
//     }
//   }, [history, onDataFetched]);

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         style={styles.tableScrollView}
//         contentContainerStyle={styles.scrollContent}
//         nestedScrollEnabled={true}
//       >
//         <View style={styles.table}>
//           <View style={styles.tableRow}>
//             <Text style={styles.tableHeader}>Date Time</Text>
//             <Text style={styles.tableHeader}>TEMP (°C)</Text>
//             <Text style={styles.tableHeader}>RH (%)</Text>
//             <Text style={styles.tableHeader}>CO2 (ppm)</Text>
//             <Text style={styles.tableHeader}>TVOC (ppb)</Text>
//             <Text style={styles.tableHeader}>PM2.5 (µg/m³)</Text>
//             <Text style={styles.tableHeader}>PM10 (µg/m³)</Text>
//           </View>
          
//           {currentData ? (
//             <>
//               {/* Current reading */}
//               <View style={[styles.tableRow, styles.currentReading]}>
//                 <Text style={[styles.tableData, styles.timestampText]}>
//                   {formatDisplayTimestamp(currentData.time)}
//                 </Text>
//                 <Text style={styles.tableData}>{currentData.TEMP.toFixed(1)}</Text>
//                 <Text style={styles.tableData}>{currentData.RH.toFixed(1)}</Text> 
//                 <Text style={styles.tableData}>{currentData.CO2.toFixed(0)}</Text>
//                 <Text style={styles.tableData}>{currentData.TVOC.toFixed(0)}</Text>
//                 <Text style={styles.tableData}>{currentData.PM25.toFixed(0)}</Text>
//                 <Text style={styles.tableData}>{currentData.PM10.toFixed(0)}</Text>
//               </View>
              
//               {/* History separator */}
//               {/* <View style={styles.historySeparator}>
//                 <Text style={styles.historyText}>Previous Readings</Text>
//               </View> */}
              
//               {/* Historical readings */}
//               {history.slice(1).map((data, index) => (
//                 <View style={styles.tableRow} key={data.id}>
//                   <Text style={[styles.tableData, styles.timestampText]}>
//                     {formatDisplayTimestamp(data.time)}
//                   </Text>
//                   <Text style={styles.tableData}>{data.TEMP.toFixed(1)}</Text>
//                   <Text style={styles.tableData}>{data.RH.toFixed(1)}</Text> 
//                   <Text style={styles.tableData}>{data.CO2.toFixed(0)}</Text>
//                   <Text style={styles.tableData}>{data.TVOC.toFixed(0)}</Text>
//                   <Text style={styles.tableData}>{data.PM25.toFixed(0)}</Text>
//                   <Text style={styles.tableData}>{data.PM10.toFixed(0)}</Text>
//                 </View>
//               ))}
//             </>
//           ) : (
//             <View style={styles.tableRow}>
//               <Text style={styles.tableData}>Waiting for data...</Text>
//             </View>
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   tableScrollView: {
//     maxHeight: 270,
//   },
//   scrollContent: {
//     paddingBottom: 20,
//   },
//   table: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 5,
//   },
//   tableRow: {
//     flexDirection: "row",
//     paddingTop: 9,
//     paddingBottom: 8,
//     paddingLeft: 3,
//     borderBottomWidth: 1,
//     borderColor: "#ddd",
//   },
//   currentReading: {
//     // backgroundColor: 'rgba(0, 200, 0, 0.1)', 
//   },
//   historySeparator: {
//     padding: 5,
//     backgroundColor: '#f0f0f0',
//     borderBottomWidth: 1,
//     borderColor: '#ddd',
//   },
//   historyText: {
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: 12,
//   },
//   tableHeader: {
//     flex: 1,
//     fontWeight: "bold",
//     textAlign: "center",
//     fontSize: 12,
//   },
//   tableData: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 12,
//   },
//   timestampText: {
//     fontSize: 11,
//   },
// });

// export default FetchData;









import { onValue, ref } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { insertAqiData } from './database';
import { db } from "./firebase";

const formatTimeString = (timeString) => {
  if (typeof timeString === 'string' && timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
    return timeString;
  }
  
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const formatDisplayTimestamp = (timeString) => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = String(today.getFullYear()).slice(-2);
  
  return `${day}-${month}-${year} ${timeString || "00:00:00"}`;
};

const FetchData = ({ onDataFetched }) => {
  const [currentData, setCurrentData] = useState(null);
  const [history, setHistory] = useState([]);
  const lastDataRef = useRef(null);
  const [data, setData] = useState([]); // Initialize as empty array

  useEffect(() => {
    const dataRef = ref(db, "AQMSS3");
    const unsubscribe = onValue(dataRef, async (snapshot) => {
      const newData = snapshot.val();
      
      if (!newData) return;

      try {
        // Store in SQLite
        await insertAqiData(newData);
        
        // Update state with the new data
        setData(prevData => {
          const safePrevData = Array.isArray(prevData) ? prevData : [];
          return [newData, ...safePrevData.slice(0, 9)];
        });

        if (typeof onDataFetched === 'function') {
          onDataFetched([newData, ...(Array.isArray(data) ? data.slice(0, 9) : [])]);
        }

        const newEntry = {
          id: Date.now().toString(),
          TEMP: parseFloat(newData.temp) || 0,
          RH: parseFloat(newData.RH) || 0,
          CO2: parseFloat(newData.CO2) || 0,
          TVOC: parseFloat(newData.TVOC) || 0,
          PM25: parseFloat(newData.PM25) || 0,
          PM10: parseFloat(newData.PM10) || 0,
          AQI: parseFloat(newData.AQI) || 0,
          time: newData.Time || formatTimeString(null),
          timestamp: newData.Time || formatTimeString(null)
        };

        // Only update if data has changed
        if (!lastDataRef.current || 
            JSON.stringify(lastDataRef.current) !== JSON.stringify(newEntry)) {
          
          lastDataRef.current = newEntry;
          setCurrentData(newEntry);
          
          // Maintain a history of last 20 readings
          setHistory(prev => {
            const safePrev = Array.isArray(prev) ? prev : [];
            return [newEntry, ...safePrev.slice(0, 19)];
          });
        }
      } catch (error) {
        console.error("Error processing data:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  // Notify parent of data changes via useEffect
  useEffect(() => {
    if (history.length > 0 && typeof onDataFetched === 'function') {
      onDataFetched(history);
    }
  }, [history]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.tableScrollView}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
      >
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Date Time</Text>
            <Text style={styles.tableHeader}>TEMP (°C)</Text>
            <Text style={styles.tableHeader}>RH (%)</Text>
            <Text style={styles.tableHeader}>CO2 (ppm)</Text>
            <Text style={styles.tableHeader}>TVOC (mg/m³)</Text>
            <Text style={styles.tableHeader}>PM2.5 (µg/m³)</Text>
            <Text style={styles.tableHeader}>PM10 (µg/m³)</Text>
          </View>
          
          {currentData ? (
            <>
              <View style={[styles.tableRow, styles.currentReading]}>
                <Text style={[styles.tableData, styles.timestampText]}>
                  {formatDisplayTimestamp(currentData.time)}
                </Text>
                <Text style={styles.tableData}>{currentData.TEMP.toFixed(0)}</Text>
                <Text style={styles.tableData}>{currentData.RH.toFixed(0)}</Text> 
                <Text style={styles.tableData}>{currentData.CO2.toFixed(0)}</Text>
                <Text style={styles.tableData}>{(currentData.TVOC / 100).toFixed(2)}</Text>
                <Text style={styles.tableData}>{currentData.PM25.toFixed(0)}</Text>
                <Text style={styles.tableData}>{currentData.PM10.toFixed(0)}</Text>
              </View>
              
              {history.slice(1).map((data, index) => (
                <View style={styles.tableRow} key={`${data.id}-${index}`}>
                  <Text style={[styles.tableData, styles.timestampText]}>
                    {formatDisplayTimestamp(data.time)}
                  </Text>
                  <Text style={styles.tableData}>{data.TEMP.toFixed(0)}</Text>
                  <Text style={styles.tableData}>{data.RH.toFixed(0)}</Text> 
                  <Text style={styles.tableData}>{data.CO2.toFixed(0)}</Text>
                  <Text style={styles.tableData}>{(data.TVOC / 100).toFixed(2)}</Text>
                  <Text style={styles.tableData}>{data.PM25.toFixed(0)}</Text>
                  <Text style={styles.tableData}>{data.PM10.toFixed(0)}</Text>
                </View>
              ))}
            </>
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.tableData}>Waiting for data...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableScrollView: {
    maxHeight: 270,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: "row",
    paddingTop: 9,
    paddingBottom: 8,
    paddingLeft: 3,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  currentReading: {
    backgroundColor: 'rgba(0, 200, 0, 0.1)', 
  },
  tableHeader: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  tableData: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
  },
  timestampText: {
    fontSize: 11,
  },
});

export default FetchData;






















