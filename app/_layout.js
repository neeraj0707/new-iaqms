import { Tabs } from 'expo-router';
import { child, get, ref } from "firebase/database";
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import AirEstimationModal from '../components/AirEstimationModal';
import { exportDataToCSV } from '../components/dataExporter';
import MenuButton from '../components/MenuButton';
import TabBar from '../components/TabBar';
import { db } from "./firebase";



const Layout = () => {
  const [airEstimationVisible, setAirEstimationVisible] = useState(false);
  

  const handleMenuSelect = async (optionId) => {
    if (optionId === 'air-estimation') {
      setAirEstimationVisible(true);
    }
    // Handle other menu options if needed
    else if (optionId === 'export-data') {
      try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, "realtimeData")); // 🔁 update this to match your actual database path
  
        if (snapshot.exists()) {
          const rawData = snapshot.val();
  
          // Convert to array for export
          const dataArray = Object.values(rawData);
          exportDataToCSV(dataArray);
        } else {
          Alert.alert("No data available");
        }
      } catch (error) {
        console.error("Realtime DB fetch error:", error);
        Alert.alert("Error", "Failed to fetch data from Realtime Database");
      }
    }
  };

  const CustomHeaderTitle = ({ children }) => (
  <Text style={{
    fontSize: 18,
    // backgroundColor: "black",
    fontWeight: 'bold',
    color: '#007bff', // Blue color to match your theme
    // fontFamily: 'Georgia', // Or your preferred font
    textTransform: 'uppercase', 
    letterSpacing: 0.5 // Optional: adds slight letter spacing
  }}>
    {children}
  </Text>
);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={props => <TabBar {...props} />}
        screenOptions={{
          headerTitleAlign: 'center',
          headerTitle: (props) => <CustomHeaderTitle>{props.children}</CustomHeaderTitle>,
          headerRight: () => <MenuButton onSelect={handleMenuSelect} />, // Changed to headerLeft
           headerStyle: {
    //   backgroundColor: '#ffffff', // White background
      elevation: 0, // Remove shadow on Android
      shadowOpacity: 0, // Remove shadow on iOS
      // borderBottomWidth: 1, 
      borderBottomColor: '#f0f0f0',
      backgroundColor: '#A7C7E7', 
    },
        }}
      >
        {/* Home Screen */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'IAQMS by TECSAGE',
            tabBarLabel: 'Home',
          }}
        />

        {/* Map Screen */}
        {/* <Tabs.Screen
          name="map"
          options={{
            title: 'Map',
            tabBarLabel: 'Map',
          }}
        /> */}

        {/* Shop Screen */}
        <Tabs.Screen
          name="shop"
          options={{
            title: 'Products',
            tabBarLabel: 'Products',
          }}
        />

        {/* Explore Screen */}
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarLabel: 'Explore',
          }}
        />
      </Tabs>

      {/* Global Air Estimation Modal */}
      <AirEstimationModal
        visible={airEstimationVisible}
        onClose={() => setAirEstimationVisible(false)}
        onSubmit={(volume) => {
          console.log('Calculated volume:', volume);
          setAirEstimationVisible(false);
        }}
      />
    </View>
  );
};

export default Layout;

