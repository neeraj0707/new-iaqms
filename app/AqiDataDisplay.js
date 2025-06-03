import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { fetchAllAqiData } from './database'; // Adjust the import path as necessary

const AqiDataDisplay = () => {
  const [aqiData, setAqiData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAllAqiData();
      setAqiData(data);
    };

    loadData();
  }, []);

  return (
    <View>
      <Text>AQI Data</Text>
      <FlatList
        data={aqiData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>
            AQI: {item.aqi}, CO2: {item.co2}, PM10: {item.pm10}, PM25: {item.pm25}, RH: {item.rh}, TVOC: {item.tvoc}, Time: {item.time}, Temp: {item.temp}
          </Text>
        )}
      />
    </View>
  );
};

export default AqiDataDisplay;







