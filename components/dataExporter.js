import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

// Helper function to format timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString(); // You can customize this format
};

// Function to generate CSV content
const generateCSV = (data) => {
  const headers =
    "DateTime,CO2 (ppm),RH (%),PM10 (µg/m³),PM2.5 (µg/m³),TEMP (°C)\n";

  const rows = data
    .map((item) => {
      const formattedDateTime = formatTimestamp(item.timestamp);
      return [
        `"${formattedDateTime}"`,
        item.CO2 || "",
        item.RH || "",
        item.PM10 || "",
        item.PM25 || "",
        item.TEMP || "",
      ].join(",");
    })
    .join("\n");

  return headers + rows;
};

// Main export function
export const exportDataToCSV = async (realtimeData) => {
  try {
    console.log("Full data being exported:", realtimeData);

    if (!realtimeData.length) {
      Alert.alert("No data available");
      return;
    }

    const csv = generateCSV(realtimeData);
    const filename = `aqi_data_${new Date().toISOString().split("T")[0]}.csv`;
    const path = FileSystem.cacheDirectory + filename;

    await FileSystem.writeAsStringAsync(path, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Error", "Sharing is not available on this device.");
      return;
    }

    await Sharing.shareAsync(path, {
      mimeType: "text/csv",
      dialogTitle: "Export AQI Data",
      UTI: "public.comma-separated-values-text",
    });
  } catch (error) {
    console.error("Export Error:", error);
    Alert.alert("Export Failed", error.message);
  }
};
