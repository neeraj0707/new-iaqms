
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
// import { deleteAllFirestoreData } from './deleteAllFirestoreData'; // Adjust path as needed
import { deleteAllRTDBData } from "./deleteAllRTDBData"; // Adjust path as needed
const products = [
  {
    id: "1",
    name: "Prana 151",
    price: "₹4999",
    description: [
      "Monitoring parameters : CO2,  Temperature and Humidity.",
       "Power Supply : USB-C",
      "Battery Backup : No",
      "Display : 2.5 inch TFT ",
      ],
    image: require("../assets/a1.png"), 
  },
  {
    id: "2",
    name: "Prana 751",
    price: "₹8999",
    description: [
      "Monitoring parameters : CO2, PM2.5, PM10, TVOC, Temperature and Humidity.",
       "Power Supply : USB-C",
      "Battery Backup : 8 hours",
      "Display : 2.5 inch TFT ",
      ],
    image: require("../assets/a2.png"),
  },
  {
    id: "3",
    name: "Prana 781",
    price: "₹12499",
    description:  [
      "Monitoring parameters : CO2, PM2.5, PM10, TVOC, Temperature and Humidity.",
       "Power Supply : USB-C",
      "Battery Backup : 8 hours",
      "Display : 2.5 inch TFT ",
      "Connectivity : Wi-Fi that enables realtime data transmission to cloud platforms or mobile apps.",
      ],
    image: require("../assets/a3.png"),
  },
  {
    id: "4",
    name: "Prana 720",
    price: "₹14000",
    description:  [
      "Monitoring parameters : CO2, PM2.5, PM10, HCHO, TVOC, Temperature and Humidity.",
       "Power Supply : USB-C",
      "Battery Backup : 8 hours",
      "Display : 5.2 inch segment ",
      "Connectivity : Wi-Fi that enables realtime data transmission to cloud platforms or mobile apps.",
      ],
    image: require("../assets/a4.png"),
  },
    {
    id: "5",
    name: "Prana 725",
    price: "₹12499",
    description:  [
      "Monitoring parameters : CO2, PM2.5, Temp. and Humidity.",
      "Power Supply : USB-C",
      "Battery Backup : 8 hours",
      "Display : 3 inch segment ",
      "Connectivity : Wi-Fi that enables realtime data transmission to cloud platforms or mobile apps.",
      ],
    image: require("../assets/a5.png"),
  },
];

export default function Shop() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  

  return (
    <Animated.ScrollView
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 100, // Increased padding to avoid overlap with TabBar
      }}
      keyboardShouldPersistTaps="handled"
    >



      <Text style={{ fontSize: 30, fontWeight: 600, marginBottom: 10 , color: "#054193", paddingBottom: 25 }}>Air Quality Devices</Text>

      


      {products.map((item) => (
        <TouchableOpacity
        activeOpacity={1} // Disable the opacity change effect
          key={item.id}
          // onPress={() => router.push(`/shop/${item.id}`)}
          
          style={{
            flexDirection: "column",
            backgroundColor: "#dff6f8",
            borderRadius: 10,
            padding: 10,
            marginBottom: 20,
            alignItems: "center",
            elevation: 3, // Elevation for Android devices (for box shadow effect)
            
          }}
        >
          <Image source={item.image} style={{ width: 200, height: 200, borderRadius: 10 }} resizeMode="contain" />

          <View style={{ marginTop: 10, alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "400" , color: "rgb(10, 65, 167) "}}>{item.name}</Text>
            {/* <Text style={{ fontSize: 14, fontWeight: "300", color: "#837B73", marginVertical: 5, textAlign: "center", lineHeight: 20 }}>
              {item.description}
            </Text> */}

            {/* {Array.isArray(item.description) ? (
  item.description.map((point, index) => (
    <Text
      key={index}
      style={{
        fontSize: 14,
        fontWeight: "300",
        color: "#837B73",
        marginVertical: 2,
        textAlign: "left",
        lineHeight: 20,
        alignSelf: "flex-start",
      }}
    >
      • {point}
    </Text>
  ))
) : (
  <Text
    style={{
      fontSize: 14,
      fontWeight: "300",
      color: "#837B73",
      marginVertical: 5,
      textAlign: "left",
      lineHeight: 20,
       alignSelf: "flex-start", // Ensure text block aligns to the left
    }}
  >
    {item.description}
  </Text>
)} */}

{Array.isArray(item.description) ? (
  item.description.map((point, index) => {
    const [label, ...rest] = point.split(":");
    const value = rest.join(":").trim();
    return (
      <Text
        key={index}
        style={{
          fontSize: 14,
          fontWeight: "300",
          color: "black",
          marginVertical: 2,
          textAlign: "left",
          lineHeight: 20,
          alignSelf: "flex-start",
        }}
      >
        • <Text style={{ fontWeight: "bold" }}>{label}:</Text> {value}
      </Text>
    );
  })
) : (
  <Text
    style={{
      fontSize: 14,
      fontWeight: "500",
      color: "black",
      marginVertical: 5,
      textAlign: "left",
      lineHeight: 20,
      alignSelf: "flex-start",
    }}
  >
    {item.description}
  </Text>
)}


            <Text style={{ fontSize: 14, color: "#007bff", fontWeight: "bold" }}>{item.price}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={{ marginBottom: 10 }}>
  <TouchableOpacity
    onPress={() => {
      // deleteAllFirestoreData();
      deleteAllRTDBData();
    }}
    style={{
      backgroundColor: "red",
      padding: 10,
      borderRadius: 8,
      alignItems: "center",
    }}
  >
    <Text style={{ color: "white", fontWeight: "bold" }}>
      Delete All Firestore Data
    </Text>
  </TouchableOpacity>
</View>
    </Animated.ScrollView>
  );
}





