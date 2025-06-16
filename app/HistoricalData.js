

// import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import {
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View
// } from "react-native";
// import { BarChart } from "react-native-chart-kit";
// import RNPickerSelect from "react-native-picker-select";
// import { firestore } from "./firebase";

// const HistoricalData = () => {
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [{ data: [] }],
//   });
//   const [selectedData, setSelectedData] = useState("CO2"); // State for the selected data type
//   const [rawData, setRawData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true); // State to track loading status
//   const [maxValue, setMaxValue] = useState(0);
//   const [minValue, setMinValue] = useState(0);
//   const [tooltipVisible, setTooltipVisible] = useState(false);
//   const [tooltipData, setTooltipData] = useState({ value: 0, x: 0, y: 0 });
//   const [showTable, setShowTable] = useState(false); // State to control table visibility
//   const [tableData, setTableData] = useState([]); // State to store table data

//   useEffect(() => {
//     const fetchHistoricalData = async () => {
//       try {
//         const now = new Date();
//         const past24Hours = new Date(now);
//         past24Hours.setHours(now.getHours() - 24); // Past 24 hours

//         // console.log('🕒 Querying range:', past24Hours, 'to', now);

//         // Firestore query to fetch data within the past 24 hours
//         const q = query(
//           collection(firestore, "historical_data"),
//           where("timestamp", ">=", past24Hours.getTime()),
//           where("timestamp", "<=", now.getTime()),
//           orderBy("timestamp", "asc")
//         );

//         const querySnapshot = await getDocs(q);
//         const data = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         if (data.length === 0) {
//           console.warn("❌ No data found for the past 24 hours.");
//         }

//         // Store raw data for filtering based on the selected dropdown option
//         setRawData(data);

//         // Group data into hourly intervals and prepare chart based on the selected data type
//         const hourlyData = groupDataByHour(data);
//         prepareChartData(hourlyData, selectedData, now);
//       } catch (error) {
//         console.error("🔥 Error fetching historical data:", error);
//       } finally {
//         setIsLoading(false); // Set loading to false after fetching data (whether success or failure)
//       }
//     };
//     fetchHistoricalData();
//   }, []); // Empty dependency array ensures this runs only once on mount

//   // Groups data into hourly intervals
//   const groupDataByHour = (data) => {
//     const hourlyData = Array(24)
//       .fill(null)
//       .map(() => []); // Initialize 24-hour buckets

//     data.forEach((item) => {
//       const date = new Date(item.timestamp);
//       const hour = date.getHours(); // Get the hour (0-23)
//       hourlyData[hour].push(item); // Add the item to the corresponding hour bucket
//     });

//     return hourlyData;
//   };

//   // Prepares data for the chart
//   const prepareChartData = (hourlyData, selectedData, now) => {
//     const labels = [];
//     const values = [];

//     const currentHour = now.getHours(); // Get the current hour
//     const startHour = (currentHour - 23 + 24) % 24; // Start from the correct hour (wrap around if necessary)

//     // Loop through the 24 hours to populate the chart data
//     for (let i = 0; i < 24; i++) {
//       const hourIndex = (startHour + i) % 24; // Get the correct hour index in the array

//       // Calculate average value for each hour
//       const hourData = hourlyData[hourIndex];
//       if (hourData && hourData.length > 0) {
//         const sum = hourData.reduce(
//           (acc, item) => acc + (item[selectedData] || 0),
//           0
//         );
//         const avg = sum / hourData.length; // Calculate average for the hour
//         values.push(avg);
//       } else {
//         values.push(0); // If no data for the hour, default to 0
//       }

//       // Add labels at 3-hour intervals
//       if (i % 4 === 0) {
//         const hourLabel = (startHour + i) % 24;
//         const timeLabel = `${hourLabel === 0 ? 12 : hourLabel % 12} ${
//           hourLabel < 12 ? "AM" : "PM"
//         }`;
//         labels.push(timeLabel);
//       } else {
//         labels.push("");
//       }
//     }

//     // Calculate max and min values
//     const validValues = values.filter((value) => value !== 0);
//     setMaxValue(validValues.length ? Math.max(...validValues) : 0);
//     setMinValue(validValues.length ? Math.min(...validValues) : 0);

//     setChartData({
//       labels,
//       datasets: [{ data: values }],
//     });
//   };

//   // Handle dropdown selection change
//   const handleDropdownChange = (value) => {
//     setSelectedData(value); // Update the selected data type
//     const hourlyData = groupDataByHour(rawData); // Use cached raw data
//     const now = new Date();
//     prepareChartData(hourlyData, value, now); // Prepare chart data without fetching from Firestore
//   };


//   // Handle bar press to show tooltip
//   const handleBarPress = (data) => {
//     const { value, index } = data;
//     const barX = index * (300 / 24) + 20; // Calculate X position of the bar
//     const barY = 300 - (value / maxValue) * 300; // Calculate Y position of the bar

//     setTooltipData({ value, x: barX, y: barY });
//     setTooltipVisible(true);
//   };
//   const hideTooltip = () => {
//     setTooltipVisible(false);
//   };

//   // Dynamically adjust Y-axis label position
//   const getYAxisLabelPosition = (dataType) => {
//     switch (dataType) {
//       case "CO2":
//         return { left: -40, top: 140 }; // CO2 position
//       case "PM10":
//         return { left: -50, top: 140 }; // PM10 position
//       case "PM25":
//         return { left: -50, top: 140 }; // PM2.5 position
//       case "RH":
//         return { left: -25, top: 140 }; // Relative Humidity position
//       case "TVOC":
//         return { left: -40, top: 140 }; // TVOC position 
//       case "TEMP":
//         return { left: -40, top: 140 }; // Temperature position
      
//       default:
//         return { left: -40, top: 140 }; // Default position
//     }
//   };

//   // Function to get the correct unit based on the selected data type
//   const getUnit = (dataType) => {
//     switch (dataType) {
//       case "CO2":
//         return "(ppm)";
//       case "PM10":
//       case "PM25":
//         return "(µg/m³)";
//       case "RH":
//         return "(%)";
//       case "TVOC":
//         return "(mg/m³)"; // Assuming TVOC is in parts per billion
//       case "TEMP":
//         return "(°C)";
//       default:
//         return "";
//     }
//   };

//    // Function to prepare table data
//    const prepareTableData = () => {
//     const hourlyData = groupDataByHour(rawData);
//     const now = new Date();
//     const currentHour = now.getHours();
//     const startHour = (currentHour - 23 + 24) % 24;

//     const tableRows = [];
    
//     for (let i = 0; i < 24; i++) {
//       const hourIndex = (startHour + i) % 24;
//       const hourData = hourlyData[hourIndex];
      
//       let avgValue = 0;
//       if (hourData && hourData.length > 0) {
//         const sum = hourData.reduce((acc, item) => acc + (item[selectedData] || 0), 0);
//         avgValue = sum / hourData.length;
//       }
      
//       const hourLabel = hourIndex === 0 ? 12 : hourIndex % 12;
//       const ampm = hourIndex < 12 ? 'AM' : 'PM';

//       tableRows.push({
//         hour: `${hourLabel} ${ampm}`,
//         value: avgValue.toFixed(1),
//         unit: getUnit(selectedData)
//       });
//     }
//     return tableRows;
//   };

//    // Function to toggle table visibility
//    const toggleTable = () => {
//     if (!showTable) {
//       setTableData(prepareTableData());
//     }
//     setShowTable(!showTable);
//   };


//   return (
//     <TouchableWithoutFeedback onPress={hideTooltip}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.title}> Data History (last 24 hrs)</Text>

//         {/* Dropdown to select data type */}
//         <RNPickerSelect
//           // onValueChange={(value) => setSelectedData(value)}
//           onValueChange={handleDropdownChange}
//           items={[
//             { label: "CO₂", value: "CO2" },
//             // { label: "AQI", value: "AQI" },
//             { label: "PM10", value: "PM10" },
//             { label: "PM2.5", value: "PM25" },
//             { label: "Relative Humidity", value: "RH" },
//             { label: "TVOC", value: "TVOC" },
//             { label: "Temperature", value: "TEMP" },
//           ]}
//           value={selectedData}
//           style={pickerSelectStyles}
//           placeholder={{ label: "Select", value: null }}
//         />

//         {/* Add the View Data button */}
//         <TouchableOpacity style={styles.viewDataButton} onPress={toggleTable}>
//           <Text style={styles.viewDataButtonText}>
//             {showTable ? 'Hide Data Table' : 'View Data Table'}
//           </Text>
//         </TouchableOpacity>

//         {isLoading ? (
//           <Text style={styles.noDataText}>Loading data...</Text>
//         ) : chartData.labels.length === 0 ? (
//           <Text style={styles.noDataText}>
//             No data available for the past 24 hours.
//           </Text>
//         ) : (
//           <View style={styles.chartWrapper}>
//             <View
//               style={[styles.yAxisLabel, getYAxisLabelPosition(selectedData)]}
//             >
//               <Text style={styles.yAxisText}>
//                 {selectedData} {getUnit(selectedData)}
//               </Text>
//             </View>

//             <BarChart
//               data={chartData}
//               width={300}
//               // width={Dimensions.get('window').width - 20} // Adjust width to fit screen
//               height={300}
//               yAxisLabel=""
//               chartConfig={{
//                 backgroundColor: "#FFFFFF", // Set chart background to white
//                 backgroundGradientFrom: "#FFFFFF", // White gradient start
//                 backgroundGradientTo: "#FFFFFF", // White gradient end
//                 decimalPlaces: 0,
//                 color: () => "#0000FF", // Bars color (solid blue)
//                 labelColor: () => "#000000", // Axis labels in black
//                 style: { borderRadius: 16 },
//                 barPercentage: 0.12,
//                 propsForLabels: {
//                   fontSize: "8",
//                 },
//                 fillShadowGradient: "#0000FF", // Bar fill color (blue)
//                 fillShadowGradientOpacity: 1, // Make bars solid
//                 // Customize background lines
//                 propsForBackgroundLines: {
//                   strokeDasharray: "5 5", // Dashed line pattern
//                   strokeWidth: 1, // Line thickness
//                   stroke: "#CCCCCC", // Line color
//                   x1: 60, // Start point of the line (left)
//                   x2: 300, // Limit the line length (adjust this value)
//                 },
//               }}
//               verticalLabelRotation={0}
//               fromZero={false}
//               yAxisMin={0}
//               // renderBarCustom={({ x, y, value, index, height }) => (
//               //   <View key={index}>
//               //     <Text
//               //       style={[styles.barLabel, { left: x -15 , top: y + height / 2 - 10 }]}>
//               //       {value.toFixed(1)} {/* Display value with 1 decimal place */}
//               //     </Text>
//               //   </View>
//               // )}
//               onDataPointPress={handleBarPress}
//             />
//             {tooltipVisible && (
//               <View
//                 style={[
//                   styles.tooltip,
//                   { left: tooltipData.x, top: tooltipData.y },
//                 ]}
//               >
//                 <Text style={styles.tooltipText}>
//                   {selectedData}: {tooltipData.value.toFixed(1)}{" "}
//                   {getUnit(selectedData)}
//                 </Text>
//               </View>
//             )}

//             <View style={styles.statsContainer}>
//               <Text style={styles.statsText}>Max: {maxValue.toFixed(1)} </Text>
//               <Text style={styles.statsText}>Min: {minValue.toFixed(1)} </Text>
//             </View>
//           </View>
//         )}

//          {/* Add the modal for the data table */}
//          <Modal
//           visible={showTable}
//           animationType="slide"
//           transparent={true}
//           onRequestClose={toggleTable}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>
//                 {selectedData} Data (Past 24 Hours)
//               </Text>
              
//               <ScrollView style={styles.tableScroll}>
//                 <View style={styles.tableHeader}>
//                   <Text style={[styles.headerCell, styles.hourCell]}>Hour</Text>
//                   <Text style={[styles.headerCell, styles.valueCell]}>Value</Text>
//                 </View>
                
//                 {tableData.map((row, index) => (
//                   <View key={index} style={styles.tableRow}>
//                     <Text style={[styles.rowCell, styles.hourCell]}>{row.hour}</Text>
//                     <Text style={[styles.rowCell, styles.valueCell]}>
//                       {row.value} {row.unit}
//                     </Text>
//                   </View>
//                 ))}
//               </ScrollView>
              
//               <TouchableOpacity 
//                 style={styles.closeButton} 
//                 onPress={toggleTable}
//               >
//                 <Text style={styles.closeButtonText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </ScrollView>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     paddingVertical: 20,
//     backgroundColor: "#f9f9f9",
//     paddingHorizontal: 10,
//     marginBottom: 50,
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 20,

//     // Elevation for Android
//     elevation: 3,

//     // Shadow for iOS
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "300",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   noDataText: {
//     fontSize: 16,
//     color: "gray",
//     textAlign: "center",
//   },
//   chartWrapper: {
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     width: "100%",
//     position: "relative",
//   },
//   yAxisLabel: {
//     transform: [{ rotate: "-90deg" }],
//     position: "absolute",
//     left: -40,
//     top: 120,
//   },
//   yAxisText: {
//     fontSize: 15,
//     fontWeight: "500",
//     color: "#3F51B5",
//   },
//   barLabel: {
//     position: "absolute",
//     fontSize: 10,
//     color: "white",
//   },
//   statsContainer: {
//     flexDirection: "row",
//     gap: 50,
//     justifyContent: "space-between",
//     marginTop: 10,
//   },
//   statsText: {
//     fontSize: 12,
//     fontWeight: "400",
//     color: "black",
//   },
//   tooltip: {
//     position: "absolute",
//     backgroundColor: "#000",
//     color: "#fff",
//     padding: 5,
//     borderRadius: 5,
//     zIndex: 1000,
//   },
//   tooltipText: {
//     fontSize: 12,
//     color: "#fff",
//   },
//   viewDataButton: {
//     backgroundColor: '#318CE7',
//     padding: 8,
//     borderRadius: 5,
//     marginTop: 10,
//     marginBottom: 10,
//     width: '40%',
//     alignSelf: 'center',
//   },
//   viewDataButtonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontWeight: '400',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//     width: '90%',
//     maxHeight: '80%',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//     color: '#3F51B5',
//   },
//   tableScroll: {
//     maxHeight: '80%',
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     paddingBottom: 8,
//     marginBottom: 8,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   headerCell: {
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   hourCell: {
//     flex: 1,
//     textAlign: 'left',
//   },
//   valueCell: {
//     flex: 1,
//     textAlign: 'right',
//   },
//   rowCell: {
//     color: '#555',
//   },
//   closeButton: {
//     backgroundColor: '#3F51B5',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 15,
//   },
//   closeButtonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontWeight: '500',
//   },


// });

// // Styles for the picker
// const pickerSelectStyles = {
//   inputIOS: {
//     backgroundColor: "#f0f0f0",
//     borderRadius: 8,
//     // paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginVertical: 10,
//     fontSize: 16,
//   },
//   inputAndroid: {
//     backgroundColor: "#f0f0f0",
//     borderRadius: 8,
//     // paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginVertical: 10,
//     fontSize: 16,
//   },
// };

// export default HistoricalData;



























// import { useEffect, useState } from "react";
// import {
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View
// } from "react-native";
// import { BarChart } from "react-native-chart-kit";
// import RNPickerSelect from "react-native-picker-select";
// import { openDb } from "./FirebaseToSQLite"; // Import the openDb function

// const HistoricalData = () => {
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [{ data: [] }],
//   });
//   const [selectedData, setSelectedData] = useState("co2");
//   const [rawData, setRawData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [maxValue, setMaxValue] = useState(0);
//   const [minValue, setMinValue] = useState(0);
//   const [tooltipVisible, setTooltipVisible] = useState(false);
//   const [tooltipData, setTooltipData] = useState({ value: 0, x: 0, y: 0 });
//   const [showTable, setShowTable] = useState(false);
//   const [tableData, setTableData] = useState([]);

//   useEffect(() => {
//     const fetchHistoricalData = async () => {
//       try {
//         const db = await openDb();
//         const now = new Date();
//         const past24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

//         // Debug: Check the time range
//         console.log('Fetching data between:', past24Hours.toISOString(), 'and', now.toISOString());

//         // Fetch data from SQLite for the past 24 hours
//         const query = `
//           SELECT * FROM aqi_data 
//           WHERE timestamp >= ? 
//           ORDER BY timestamp DESC
          
//         `;
//         const results = await db.getAllAsync(query, [
//           past24Hours.toISOString(),
//           // now.toISOString(),
//         ]);

//           console.log(`✅ Found ${results.length} records`);
//         if (results.length > 0) {
//           console.log('First record:', {
//             id: results[0].id,
//             timestamp: results[0].timestamp,
//             co2: results[0].co2,
//             datetime: results[0].datetime
//           });
//         }

//         setRawData(results);
//         const hourlyData = groupDataByHour(results);
//         prepareChartData(hourlyData, selectedData, now);
//       } catch (error) {
//         console.error("🔥 Error fetching historical data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchHistoricalData();
//   }, []); 

//   const groupDataByHour = (data) => {
//     const hourlyData = Array(24).fill(null).map(() => []);
//     data.forEach((item) => {
//       try {
//         // Use timestamp column for consistency
//         const date = new Date(item.timestamp || item.datetime);
//         if (isNaN(date.getTime())) {
//           console.warn('Invalid date for item:', item);
//           return;
//         }
//         const hour = date.getHours();
//         hourlyData[hour].push(item);
//       } catch (e) {
//         console.error("Error processing item:", item, e);
//       }
//     });
//     return hourlyData;
//   };

//   const prepareChartData = (hourlyData, dataType, now) => {
//     const labels = [];
//     const values = [];
//     const currentHour = now.getHours();
//     const startHour = (currentHour - 23 + 24) % 24;

//     for (let i = 0; i < 24; i++) {
//       const hourIndex = (startHour + i) % 24;
//       const hourData = hourlyData[hourIndex];
//        let avgValue = 0;
//        if (hourData && hourData.length > 0) {
//         // Convert all values to numbers and filter out invalid ones
//         const validValues = hourData
//           .map(item => parseFloat(item[dataType]))
//           .filter(val => !isNaN(val));
        
//         if (validValues.length > 0) {
//           avgValue = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
//         }
//       }
//       values.push(avgValue);


//       if (i % 4 === 0) {
//         const hourLabel = (startHour + i) % 24;
//         const timeLabel = `${hourLabel === 0 ? 12 : hourLabel % 12} ${hourLabel < 12 ? "AM" : "PM"}`;
//         labels.push(timeLabel);
//       } else {
//         labels.push("");
//       }
//     }

//      // Calculate min/max excluding zeros
//     const nonZeroValues = values.filter(v => v > 0);
//     setMaxValue(nonZeroValues.length ? Math.max(...nonZeroValues) : 0);
//     setMinValue(nonZeroValues.length ? Math.min(...nonZeroValues) : 0);


//     setChartData({
//       labels,
//       datasets: [{ data: values }],
//     });
//   };

//   const handleDropdownChange = (value) => {
//      const lowerValue = value.toLowerCase();
//     setSelectedData(value.toLowerCase());
//     const hourlyData = groupDataByHour(rawData);
//     const now = new Date();
//     prepareChartData(hourlyData, lowerValue, now);
//   };

//   const handleBarPress = (data) => {
//     const { value, index } = data;
//     const barX = index * (300 / 24) + 20;
//     const barY = 300 - (value / maxValue) * 300;

//     setTooltipData({ value, x: barX, y: barY });
//     setTooltipVisible(true);
//   };

//   const hideTooltip = () => {
//     setTooltipVisible(false);
//   };

//   const getYAxisLabelPosition = (dataType) => {
//     switch (dataType) {
//       case "CO2":
//         return { left: -40, top: 140 };
//       case "PM10":
//         return { left: -50, top: 140 };
//       case "PM25":
//         return { left: -50, top: 140 };
//       case "RH":
//         return { left: -25, top: 140 };
//       case "TVOC":
//         return { left: -40, top: 140 };
//       case "TEMP":
//         return { left: -40, top: 140 };
//       default:
//         return { left: -40, top: 140 };
//     }
//   };

//   const getUnit = (dataType) => {
//     switch (dataType) {
//       case "CO2":
//         return "(ppm)";
//       case "PM10":
//       case "PM25":
//         return "(µg/m³)";
//       case "RH":
//         return "(%)";
//       case "TVOC":
//         return "(mg/m³)";
//       case "TEMP":
//         return "(°C)";
//       default:
//         return "";
//     }
//   };

//   const prepareTableData = () => {
//     const hourlyData = groupDataByHour(rawData);
//     const now = new Date();
//     const currentHour = now.getHours();
//     const startHour = (currentHour - 23 + 24) % 24;

//     const tableRows = [];
    
//     for (let i = 0; i < 24; i++) {
//       const hourIndex = (startHour + i) % 24;
//       const hourData = hourlyData[hourIndex];
      
//       let avgValue = 0;
//       if (hourData && hourData.length > 0) {
//         const sum = hourData.reduce((acc, item) => acc + (parseFloat(item[selectedData]) || 0), 0);
//         avgValue = sum / hourData.length;
//       }
      
//       const hourLabel = hourIndex === 0 ? 12 : hourIndex % 12;
//       const ampm = hourIndex < 12 ? 'AM' : 'PM';

//       tableRows.push({
//         hour: `${hourLabel} ${ampm}`,
//         value: avgValue.toFixed(1),
//         unit: getUnit(selectedData)
//       });
//     }
//     return tableRows;
//   };

//   const toggleTable = () => {
//     if (!showTable) {
//       setTableData(prepareTableData());
//     }
//     setShowTable(!showTable);
//   };

//   return (
//     <TouchableWithoutFeedback onPress={hideTooltip}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.title}> Data History (last 24 hrs)</Text>

//         <RNPickerSelect
//           onValueChange={handleDropdownChange}
//           items={[
//             { label: "CO₂", value: "CO2" },
//             { label: "PM10", value: "PM10" },
//             { label: "PM2.5", value: "PM25" },
//             { label: "Relative Humidity", value: "RH" },
//             { label: "TVOC", value: "TVOC" },
//             { label: "Temperature", value: "TEMP" },
//           ]}
//           value={selectedData}
//           style={pickerSelectStyles}
//           placeholder={{ label: "Select", value: null }}
//         />

//         <TouchableOpacity style={styles.viewDataButton} onPress={toggleTable}>
//           <Text style={styles.viewDataButtonText}>
//             {showTable ? 'Hide Data Table' : 'View Data Table'}
//           </Text>
//         </TouchableOpacity>

//         {isLoading ? (
//           <Text style={styles.noDataText}>Loading data...</Text>
//         ) : chartData.labels.length === 0 ? (
//           <Text style={styles.noDataText}>
//             No data available for the past 24 hours.
//           </Text>
//         ) : (
//           <View style={styles.chartWrapper}>
//             <View
//               style={[styles.yAxisLabel, getYAxisLabelPosition(selectedData)]}
//             >
//               <Text style={styles.yAxisText}>
//                 {selectedData} {getUnit(selectedData)}
//               </Text>
//             </View>

//             <BarChart
//               data={chartData}
//               width={300}
//               height={300}
//               yAxisLabel=""
//               chartConfig={{
//                 backgroundColor: "#FFFFFF",
//                 backgroundGradientFrom: "#FFFFFF",
//                 backgroundGradientTo: "#FFFFFF",
//                 decimalPlaces: 0,
//                 color: () => "#0000FF",
//                 labelColor: () => "#000000",
//                 style: { borderRadius: 16 },
//                 barPercentage: 0.12,
//                 propsForLabels: {
//                   fontSize: "8",
//                 },
//                 fillShadowGradient: "#0000FF",
//                 fillShadowGradientOpacity: 1,
//                 propsForBackgroundLines: {
//                   strokeDasharray: "5 5",
//                   strokeWidth: 1,
//                   stroke: "#CCCCCC",
//                   x1: 60,
//                   x2: 300,
//                 },
//               }}
//               verticalLabelRotation={0}
//               fromZero={false}
//               yAxisMin={0}
//               onDataPointPress={handleBarPress}
//             />
//             {tooltipVisible && (
//               <View
//                 style={[
//                   styles.tooltip,
//                   { left: tooltipData.x, top: tooltipData.y },
//                 ]}
//               >
//                 <Text style={styles.tooltipText}>
//                   {selectedData}: {tooltipData.value.toFixed(1)}{" "}
//                   {getUnit(selectedData)}
//                 </Text>
//               </View>
//             )}

//             <View style={styles.statsContainer}>
//               <Text style={styles.statsText}>Max: {maxValue.toFixed(1)} </Text>
//               <Text style={styles.statsText}>Min: {minValue.toFixed(1)} </Text>
//             </View>
//           </View>
//         )}

//         <Modal
//           visible={showTable}
//           animationType="slide"
//           transparent={true}
//           onRequestClose={toggleTable}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>
//                 {selectedData} Data (Past 24 Hours)
//               </Text>
              
//               <ScrollView style={styles.tableScroll}>
//                 <View style={styles.tableHeader}>
//                   <Text style={[styles.headerCell, styles.hourCell]}>Hour</Text>
//                   <Text style={[styles.headerCell, styles.valueCell]}>Value</Text>
//                 </View>
                
//                 {tableData.map((row, index) => (
//                   <View key={index} style={styles.tableRow}>
//                     <Text style={[styles.rowCell, styles.hourCell]}>{row.hour}</Text>
//                     <Text style={[styles.rowCell, styles.valueCell]}>
//                       {row.value} {row.unit}
//                     </Text>
//                   </View>
//                 ))}
//               </ScrollView>
              
//               <TouchableOpacity 
//                 style={styles.closeButton} 
//                 onPress={toggleTable}
//               >
//                 <Text style={styles.closeButtonText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </ScrollView>
//     </TouchableWithoutFeedback>
//   );
// };




// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     paddingVertical: 20,
//     backgroundColor: "#f9f9f9",
//     paddingHorizontal: 10,
//     marginBottom: 50,
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 20,

//     // Elevation for Android
//     elevation: 3,

//     // Shadow for iOS
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "300",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   noDataText: {
//     fontSize: 16,
//     color: "gray",
//     textAlign: "center",
//   },
//   chartWrapper: {
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     width: "100%",
//     position: "relative",
//   },
//   yAxisLabel: {
//     transform: [{ rotate: "-90deg" }],
//     position: "absolute",
//     left: -40,
//     top: 120,
//   },
//   yAxisText: {
//     fontSize: 15,
//     fontWeight: "500",
//     color: "#3F51B5",
//   },
//   barLabel: {
//     position: "absolute",
//     fontSize: 10,
//     color: "white",
//   },
//   statsContainer: {
//     flexDirection: "row",
//     gap: 50,
//     justifyContent: "space-between",
//     marginTop: 10,
//   },
//   statsText: {
//     fontSize: 12,
//     fontWeight: "400",
//     color: "black",
//   },
//   tooltip: {
//     position: "absolute",
//     backgroundColor: "#000",
//     color: "#fff",
//     padding: 5,
//     borderRadius: 5,
//     zIndex: 1000,
//   },
//   tooltipText: {
//     fontSize: 12,
//     color: "#fff",
//   },
//   viewDataButton: {
//     backgroundColor: '#318CE7',
//     padding: 8,
//     borderRadius: 5,
//     marginTop: 10,
//     marginBottom: 10,
//     width: '40%',
//     alignSelf: 'center',
//   },
//   viewDataButtonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontWeight: '400',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//     width: '90%',
//     maxHeight: '80%',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//     color: '#3F51B5',
//   },
//   tableScroll: {
//     maxHeight: '80%',
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     paddingBottom: 8,
//     marginBottom: 8,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   headerCell: {
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   hourCell: {
//     flex: 1,
//     textAlign: 'left',
//   },
//   valueCell: {
//     flex: 1,
//     textAlign: 'right',
//   },
//   rowCell: {
//     color: '#555',
//   },
//   closeButton: {
//     backgroundColor: '#3F51B5',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 15,
//   },
//   closeButtonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontWeight: '500',
//   },


// });

// // Styles for the picker
// const pickerSelectStyles = {
//   inputIOS: {
//     backgroundColor: "#f0f0f0",
//     borderRadius: 8,
//     // paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginVertical: 10,
//     fontSize: 16,
//   },
//   inputAndroid: {
//     backgroundColor: "#f0f0f0",
//     borderRadius: 8,
//     // paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginVertical: 10,
//     fontSize: 16,
//   },
// };

// export default HistoricalData;















// import { Picker } from '@react-native-picker/picker';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Dimensions,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
// import { openDb } from './FirebaseToSQLite'; // Ensure path is correct

// const screenWidth = Dimensions.get('window').width;

// const parameters = {
//   co2: 'CO₂ (ppm)',
//   pm10: 'PM10 (µg/m³)',
//   pm25: 'PM2.5 (µg/m³)',
//   tvoc: 'TVOC (mg/m³)',
//   humidity: 'RH (%)',
//   temperature: 'Temp (°C)',
// };

// const HistoricalData = () => {
//   const [selectedParam, setSelectedParam] = useState('co2');
//   const [chartData, setChartData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchData = async () => {
//     const db = await openDb();

//     const now = new Date();
//     const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

//     const rows = await db.getAllAsync(
//       `
//       SELECT ${selectedParam}, datetime 
//       FROM aqi_data 
//       WHERE timestamp >= ? 
//       ORDER BY timestamp ASC
//     `,
//       [past24h]
//     );

//     if (rows.length === 0) {
//       setChartData(null);
//       return;
//     }

//     const labels = rows.map((row) => row.datetime.split(' ')[1].slice(0, 5));
//     const data = rows.map((row) => parseFloat(row[selectedParam]) || 0);
//     const min = Math.min(...data);
//     const max = Math.max(...data);

//     setChartData({
//       labels,
//       datasets: [{ data }],
//       min,
//       max,
//     });

//     console.log('📊 Total rows fetched:', rows.length);
//     console.log('📊 Sample data:', rows.slice(0, 5));
//   };

//   // useEffect(() => {
//   //   fetchData().finally(() => setLoading(false));
//   // }, [selectedParam]);

//    useEffect(() => {
//     let isMounted = true;

//     // Auto-refresh every 10 seconds
//     const interval = setInterval(() => {
//       if (isMounted) {
//         fetchData();
//       }
//     }, 10 * 60 * 1000); // 10 min

//     // Initial load
//     fetchData().finally(() => setLoading(false));

//     return () => {
//       isMounted = false;
//       clearInterval(interval);
//     };
//   }, [selectedParam]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Historical {parameters[selectedParam]} (24h)</Text>

//       <Picker
//         selectedValue={selectedParam}
//         onValueChange={(value) => {
//           setSelectedParam(value);
//           setLoading(true);
//         }}
//         style={styles.picker}
//       >
//         {Object.keys(parameters).map((key) => (
//           <Picker.Item label={parameters[key]} value={key} key={key} />
//         ))}
//       </Picker>

//       {loading ? (
//         <ActivityIndicator size="large" />
//       ) : chartData ? (
//         <>
//           <LineChart
//             data={{
//               labels: chartData.labels,
//               datasets: [{ data: chartData.datasets[0].data }],
//             }}
//             width={screenWidth - 50}
//             height={240}
//             chartConfig={{
//               backgroundColor: '#f0f4ff',
//               backgroundGradientFrom: '#f0f4ff',
//               backgroundGradientTo: '#ffffff',
//               decimalPlaces: 0,
//               color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
//               labelColor: () => '#333',
//               strokeWidth: 2,
//               propsForDots: {
//                 r: '4',
//                 strokeWidth: '2',
//                 stroke: '#007AFF',
//                 fill: '#ffffff',
//               },
//               propsForBackgroundLines: {
//                 stroke: '#e3e3e3',
//                 strokeDasharray: '', // solid lines
//               },
//             }}
//             bezier
//             style={styles.chart}
//           />
//           <View style={styles.minMaxContainer}>
//             <Text style={styles.minMaxText}>🔻 Min: {chartData.min}</Text>
//             <Text style={styles.minMaxText}>🔺 Max: {chartData.max}</Text>
//           </View>
//         </>
//       ) : (
//         <Text style={styles.noData}>No data found for past 24 hours.</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//     backgroundColor: '#fff',
//     flex: 1,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   picker: {
//     marginBottom: 10,
//   },
//   chart: {
//     borderRadius: 10,
    
//   },
//   minMaxContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//     paddingHorizontal: 10,
//   },
//   minMaxText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#444',
//   },
//   noData: {
//     textAlign: 'center',
//     color: '#888',
//     marginTop: 20,
//   },
// });

// export default HistoricalData;





























import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { openDb } from './FirebaseToSQLite';

const screenWidth = Dimensions.get('window').width;

const parameters = {
  co2: 'CO₂ (ppm)',
  pm10: 'PM10 (µg/m³)',
  pm25: 'PM2.5 (µg/m³)',
  tvoc: 'TVOC (mg/m³)',
  humidity: 'RH (%)',
  temperature: 'Temp (°C)',
};

const HistoricalData = () => {
  const [selectedParam, setSelectedParam] = useState('co2');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const db = await openDb();

    const now = new Date();
    const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    const rows = await db.getAllAsync(
      `
      SELECT ${selectedParam}, datetime 
      FROM aqi_data 
      WHERE timestamp >= ? 
      ORDER BY timestamp ASC
    `,
      [past24h]
    );

    if (rows.length === 0) {
      setChartData(null);
      return;
    }

    const data = rows.map((row) => parseFloat(row[selectedParam]) || 0);

    // Show only every Nth label
    const labelInterval = Math.ceil(rows.length / 8); // show max 8 labels
    // const labels = rows.map((row, index) =>
    //   index % labelInterval === 0 ? row.datetime.split(' ')[1].slice(0, 5) : ''
    // );

    const labels = rows.map((row, index) => {
  if (index % labelInterval === 0) {
    const timeStr = row.datetime.split(' ')[1]; // "14:35:20"
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`; // e.g., "2:35 PM"
  }
  return '';
});


    const min = Math.min(...data);
    const max = Math.max(...data);

    setChartData({
      labels,
      datasets: [{ data }],
      min,
      max,
    });

    console.log('📊 Total rows fetched:', rows.length);
  };

  useEffect(() => {
    let isMounted = true;

    const interval = setInterval(() => {
      if (isMounted) {
        fetchData();
      }
    }, 10 * 60 * 1000); // 10 minutes

    fetchData().finally(() => setLoading(false));

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedParam]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historical {parameters[selectedParam]} (24h)</Text>

      <Picker
        selectedValue={selectedParam}
        onValueChange={(value) => {
          setSelectedParam(value);
          setLoading(true);
        }}
        style={styles.picker}
      >
        {Object.keys(parameters).map((key) => (
          <Picker.Item label={parameters[key]} value={key} key={key} />
        ))}
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : chartData ? (
        <>
       
          <ScrollView horizontal showsHorizontalScrollIndicator={false} >
            <LineChart
              data={{
                labels: chartData.labels,
                datasets: [{ data: chartData.datasets[0].data }],
              }}
              // width={Math.max(screenWidth, chartData.labels.length * 40)} // Scrollable
              width={Math.max(chartData.labels.length * 40, screenWidth)} // Scrollable width
              height={240}
              yAxisLabel=""
              yAxisSuffix=""
              // fromZero
              
              chartConfig={{
                backgroundColor: '#f0f4ff',
                backgroundGradientFrom: '#f0f4ff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                labelColor: () => '#333',
                strokeWidth: 2,
                // paddingLeft: 30,
                propsForDots: {
                  r: '3',
                  strokeWidth: '2',
                  stroke: '#007AFF',
                  fill: '#ffffff',
                },
                propsForBackgroundLines: {
                  stroke: '#e3e3e3',
                  strokeDasharray: '',
                },
                //  paddingLeft: 40,
              }}
              

              bezier
              // style={styles.chart}
              style={{
      marginLeft: 5, // Add left margin to shift chart right
      
    }}
            />
          </ScrollView>
         
          <View style={styles.minMaxContainer}>
            <Text style={styles.minMaxText}>🔻 Min: {chartData.min}</Text>
            <Text style={styles.minMaxText}>🔺 Max: {chartData.max}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.noData}>No data found for past 24 hours.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  picker: {
    marginBottom: 10,
  },
  chart: {
    borderRadius: 10,
    paddingRight: 20,
   
  },
  minMaxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  minMaxText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  noData: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default HistoricalData;

















