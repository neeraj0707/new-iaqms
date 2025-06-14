
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import * as Sharing from "expo-sharing";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AQIScale from "../components/AQIScale";
import {
  checkAndNotifyAQIChange,
  registerForPushNotificationsAsync,
} from "../components/notificationService";
import TabBar from "../components/TabBar";
// import { initDatabase } from './database';
import FetchData from "./fetch_data";
import GraphScreen from "./GraphScreen";
import HealthAdvisory from "./health_advisory";
import HistoricalData from "./HistoricalData";
import WeatherForecast from "./WeatherForecast";
// import { initDatabase } from './database';
// import AqiDataViewer from './AqiDataViewer';
// import { initDatabase } from './database';
// import { fetchFirestoreDataAndStoreInSQLite } from './fetchFirestoreDataAndStoreInSQLite';
// import AqiDataViewer from "./AqiDataViewer";
// import { startSyncStoreDataToSQLite } from './storeDataFetcher'; // Adjust path as needed
// import TwentyFourHourGraph from './TwentyFourHourGraph';
const Tab = createBottomTabNavigator();
// initDatabase();

// Constants
const WEATHER_API_KEY = "d7676f26e867ad13873d0bf87fb3a449";
const AQI_STATUS = [
  { max: 50, status: "Good", color: "#00E400" },
  { max: 100, status: "Moderate", color: "#FFC300" },
  { max: 150, status: "Poor", color: "#FF7E00" },
  { max: 200, status: "Unhealthy", color: "#FF0000" },
  { max: 300, status: "Severe", color: "#8F3F97" },
  { max: Infinity, status: "Hazardous", color: "#800020" },
];

// Helper functions
const formatTimestamp = (timestamp) => new Date(timestamp).toLocaleString();

const getAQIStatus = (value) => {
  if (value === null || value === undefined) {
    return { status: "Loading...", color: "#CCCCCC" };
  }
  return AQI_STATUS.find((level) => value <= level.max);
};

const generateCSV = (data) => {
  const headers = "DateTime,CO2 (ppm),RH (%),PM10 (µg/m³),PM2.5 (µg/m³),TEMP (°C)\n";
  const rows = data.map((item) => {
    const formattedDateTime = formatTimestamp(item.timestamp);
    return [
      `"${formattedDateTime}"`,
      item.CO2 || "",
      item.RH || "",
      item.PM10 || "",
      item.PM25 || "",
      item.TEMP || "",
    ].join(",");
  }).join("\n");
  return headers + rows;
};

export default function App() {
  const [aqi, setAqi] = useState(null);
  const [realtimeData, setRealtimeData] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  const handleDataFetched = useCallback((data) => {
    setRealtimeData(data);
    if (data.length > 0) {
      setAqi(data[0].AQI);
      checkAndNotifyAQIChange(data[0].AQI); // Notify if AQI changes significantly
    }
  }, []);

  const fetchLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      const { latitude, longitude } = loc.coords;
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "YourAppName/1.0 (neeraj.technology2024@gmail.com)",
        },
      });

      const data = await response.json();
      const address = data.address || {};

      const firstLine = [
        address.city,
        address.neighbourhood,
        address.road,
        address.town,
        address.village,
      ].find(Boolean) || "Nearby Area";

      const secondLine = [
        address.state,
        address.postcode,
        address.country,
      ].filter(Boolean).join(", ");

      setLocationName(`${firstLine}\n${secondLine}`.trim());
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocationName("Location error");
    }
  }, []);

  const fetchWeather = useCallback(async () => {
    if (!location) return;

    try {
      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            lat: location.latitude,
            lon: location.longitude,
            appid: WEATHER_API_KEY,
            units: "metric",
          },
        }
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setWeatherLoading(false);
    }
  }, [location]);

  const exportData = useCallback(async () => {
    if (!realtimeData.length) {
      Alert.alert("No data available");
      return;
    }

    try {
      const csv = generateCSV(realtimeData);
      const filename = `aqi_data_${new Date().toISOString().split("T")[0]}.csv`;
      const path = FileSystem.cacheDirectory + filename;

      await FileSystem.writeAsStringAsync(path, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(path, {
        mimeType: "text/csv",
        dialogTitle: "Export AQI Data",
        UTI: "public.comma-separated-values-text",
      });
    } catch (error) {
      console.error("Export Error:", error);
      Alert.alert("Export Failed", error.message);
    }
  }, [realtimeData]);

  useEffect(() => {
    registerForPushNotificationsAsync();
    fetchLocation();
  }, [fetchLocation]);

  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location, fetchWeather]);



  //  useEffect(() => {
  //   startSyncStoreDataToSQLite();
  // }, []);
   


  

  
  const { status, color } = getAQIStatus(aqi);

  

  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name="Home" options={{ headerShown: false }}>
        {() => (
          <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.mainContainer}>
              <LinearGradient
                colors={[`${color}00`, `${color}70`, `${color}00`]}
                locations={[0, 0.8, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.backgroundView, { height: 600 }]}
              />
              
              <View style={styles.paddedContainer}>
                <View style={styles.locationExportContainer}>
                  <View style={styles.locationContainer}>
                  <MaterialIcons name="location-pin" size={30} color="#000080"/>
                  <Text style={[styles.locationText,  ]}>
                    {locationName || "Fetching location..."}
                  </Text>
                </View>  
                  <TouchableOpacity
                    style={styles.exportButton}
                    onPress={exportData}
                  >
                    <Text style={styles.buttonText}>Export Data</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.aqiRowContainer}>
                  <View style={styles.aqiContainer}>
                    <View style={styles.liveaqi}>
                      <LottieView
                        source={require("../assets/live-animation.json")}
                        autoPlay
                        loop
                        style={styles.lottieAnimation}
                      />
                      <Text style={styles.label}>Live AQI: </Text>
                    </View>
                    <Text style={[styles.aqiValue, { color }]}>
                      {aqi !== null ? aqi : "Loading..."}
                    </Text>
                  </View>

                  <View style={styles.aqidesc}>
                    <Text style={styles.label}>Air Quality is </Text>
                    <View style={[styles.statusButton, { backgroundColor: `${color}30` }]}>
                      <Text style={[styles.statusText, { color }]}>
                        {status}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.paddedContainer2}>
                <FetchData onDataFetched={handleDataFetched} />
                <AQIScale aqi={aqi} />
              </View>

              <WeatherForecast />
              
              <View style={styles.paddedContainer}>
                <HistoricalData />
              </View>

              

              <HealthAdvisory aqi={aqi} />

              {/* <FirebaseToSQLite /> */}
             

              {/* <View style={styles.paddedContainer}>
                 <TwentyFourHourGraph />
              </View> */}



               {/* <AqiDataViewer />; */}

                {/* <AqiDataViewer />  */}
            </ScrollView>
          </View>
        )}
        
      </Tab.Screen>

      <Tab.Screen
        name="Graph"
        component={GraphScreen}
        options={{ headerTitle: "AQI Graph" }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
  },
  paddedContainer: {
    padding: 15,
  },
  paddedContainer2: {
    paddingHorizontal: 15,
  },
  locationExportContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2 ,
    width: "100%",
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight: 10, 
     flexShrink: 1, 
  },
  locationText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#333",
  },
  aqiRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  liveaqi: {
    paddingTop: 10,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  aqiContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
  aqiValue: {
    fontSize: 50,
    fontWeight: "bold",
  },
  aqidesc: {
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  statusButton: {
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  backgroundView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    zIndex: -1,
  },
  exportButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  lottieAnimation: {
    width: 15,
    height: 15,
  },
});