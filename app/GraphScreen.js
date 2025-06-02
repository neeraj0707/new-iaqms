//correct code latest
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler } from 'react-native-reanimated';
import { getFirestore, collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import DateTimePicker from '@react-native-community/datetimepicker';

const pollutantRanges = { 
  CO2: { unit: 'ppm', ll: 400, ul: 5000 },
  RH: { unit: '%', ll: 0, ul: 100 },
  PM10: { unit: 'µg/m³', ll: 0, ul: null },
  'PM2.5': { unit: 'µg/m³', ll: 0, ul: null },
  TEMP: { unit: '°C', ll: 0, ul: 80 },
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

export default function GraphScreen({ route }) {
  const { realtimeData = [] } = route.params || {};
  const [selectedData, setSelectedData] = useState({ label: '', values: [], unit: '', ll: 0, ul: 10 });
  const [activeButton, setActiveButton] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [dataType, setDataType] = useState('realtime'); // 'realtime' or 'historical'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date for historical data
  const [showDatePicker, setShowDatePicker] = useState(false);

  const firestore = getFirestore(getApp());

  const scale = useSharedValue(1);
  const pinchGestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = withSpring(Math.max(1, event.scale));
    },
    onEnd: () => {
      scale.value = withSpring(1);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const fetchHistoricalData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const historicalCollection = collection(firestore, 'historical_data');

      // Calculate start and end timestamps for the selected date (24-hour period)
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0); // Start of the selected day
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999); // End of the selected day

      const q = query(
        historicalCollection,
        orderBy('timestamp', 'asc'),
        where('timestamp', '>=', startOfDay.getTime()),
        where('timestamp', '<=', endOfDay.getTime())
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setHistoricalData(data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setError('Failed to fetch historical data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [firestore, selectedDate]);

  useEffect(() => {
    if (dataType === 'historical') {
      fetchHistoricalData();
    }
  }, [dataType, fetchHistoricalData]);

  const handleButtonPress = useCallback((label) => {
    if (!pollutantRanges[label]) return;

    const selectedDataset = dataType === 'realtime' ? realtimeData : historicalData;
    const sortedData = [...selectedDataset].sort((a, b) => b.timestamp - a.timestamp);
    const values = sortedData.map(data => (isNaN(data[label]) ? 0 : data[label]));

     // Add a dummy data point at 400 ppm for CO2
  if (label === 'CO2') {
    values.unshift(400); // Add 400 ppm as the first data point
    // values.push(5000); //Add 5000 ppm as the last data point
  }
  if (label === 'RH') {
    values.unshift(0); // Add 400 ppm as the first data point
    values.push(100); //Add 5000 ppm as the last data point
  }
  if (label === 'TEMP') {
    values.unshift(0); // Add 400 ppm as the first data point
    values.push(100); //Add 5000 ppm as the last data point
  }
  if (label === 'PM10' || label === 'PM2.5') {
    values.unshift(0); // Add 400 ppm as the first data point
    values.push(600); //Add 5000 ppm as the last data point
  }


    // Fixed y-axis range for CO2
  let yMin, yMax;
  if (label === 'CO2') {
    yMin = 400; // Fixed lower limit for CO2
    yMax = 5000; // Fixed upper limit for CO2
  } else {
    // Use pollutantRanges for other pollutants
    yMin = pollutantRanges[label].ll;
    yMax = pollutantRanges[label].ul !== null 
      ? pollutantRanges[label].ul 
      : (values.length > 0 ? Math.max(...values) + 5 : 10);
  }


    // // Get the y-axis limits from pollutantRanges
    // const yMin = pollutantRanges[label].ll;
    // const yMax = pollutantRanges[label].ul !== null ? pollutantRanges[label].ul : (values.length > 0 ? Math.max(...values) + 5 : 10);



    setSelectedData({
      label,
      values,
      unit: pollutantRanges[label].unit,
      ll: yMin,
      ul: yMax,
    });

    setActiveButton(label);
  }, [dataType, realtimeData, historicalData]);

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setSelectedDate(selectedDate); // Update the selected date
    }
    setShowDatePicker(false); // Hide the date picker
  };
  

  const selectedDataset = dataType === 'realtime' ? realtimeData : historicalData;
  const sortedData = [...selectedDataset].sort((a, b) => a.timestamp - b.timestamp);
  const timeLabels = sortedData.map(data => formatTime(data.timestamp));
  const xAxisLabelInterval = Math.ceil(timeLabels.length / 7);
  const filteredTimeLabels = timeLabels.map((label, index) =>
    index % xAxisLabelInterval === 0 ? label : ''
  );

  if ((!realtimeData || realtimeData.length === 0) && (!historicalData || historicalData.length === 0)) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No data available</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerText}>Pollutant Levels</Text>

        {/* Toggle Buttons for Real-time & Historical */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, dataType === 'realtime' && styles.activeToggle]}
            onPress={() => setDataType('realtime')}
          >
            <Text style={styles.toggleText}>Real-time Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, dataType === 'historical' && styles.activeToggle]}
            onPress={() => setDataType('historical')}
          >
            <Text style={styles.toggleText}>Browse Data</Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker for Historical Data */}
        {dataType === 'historical' && (
          <View style={styles.datePickerContainer}>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {selectedDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
        )}

        {/* Pollutant Selection Buttons */}
        <View style={styles.buttonContainer}>
          {Object.keys(pollutantRanges).map((pollutant) => (
            <TouchableOpacity
              key={pollutant}
              style={[styles.button, activeButton === pollutant && styles.activeButton]}
              onPress={() => handleButtonPress(pollutant)}
            >
              <Text style={[styles.buttonText, activeButton === pollutant && styles.activeButtonText]}>
                {pollutant}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Loading and Error States */}
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Graph */}
        {selectedData.values.length > 0 && (
          <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
            <Animated.View style={[styles.graphContainer, animatedStyle]}>
              <LineChart
                data={{
                  labels: filteredTimeLabels,
                  datasets: [{ 
                    data: selectedData.values.map(val => (isNaN(val) ? 0 : Number(val))),
                    strokeWidth: 2 
                  }],
                }}
                width={Dimensions.get('window').width - 30}
                height={300}
                yAxisSuffix={` ${selectedData.unit}`}
                yAxisMin={selectedData.ll} // Use the lower limit from pollutantRanges
                yAxisMax={selectedData.ul} // Use the upper limit from pollutantRanges
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#E3F2FD',
                  backgroundGradientTo: '#90CAF9',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(33, 33, 33, ${opacity})`,
                  style: { borderRadius: 8 },
                  // propsForDots: { r: '1', strokeWidth: '2', stroke: '#007BFF' },
                  propsForDots: dataType === 'historical' ? {r: '0'} : { r: '1', strokeWidth: '2', stroke: '#007BFF' }, // Conditionally remove points for historical data
                  propsForLabels: {
                    fontSize: 9, // Reduce font size for x-axis labels
                  },
                  propsForVerticalLabels: {
                    fontSize: 10, // Reduce font size for y-axis labels
                  },
                }} 
                bezier
                style={styles.graphStyle}
                withVerticalLines={false}
                withHorizontalLabels={true}
                fromZero={false}
                withDots={true}
                withShadow={true}
                withInnerLines={true}
              />
            </Animated.View>
          </PinchGestureHandler>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingBottom: 100, // Add padding to avoid overlap with the bottom tab bar
  },
  headerText: {
    fontSize: 19,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333333',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#718ce3',
    marginHorizontal: 5,
  },
  activeToggle: {
    backgroundColor: '#3e7843',
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerContainer: {
    marginBottom: 10,
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: '#718ce3',
    borderRadius: 5,
  },
  datePickerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#718ce3',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
    margin: 5,
  },
  activeButton: {
    backgroundColor: '#3e7843',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeButtonText: {
    color: '#ffff',
  },
  graphStyle: {
    borderRadius: 8,
    marginVertical: 8,
  },
  errorText: {
    color: 'red', 
    fontSize: 16,
    marginBottom: 10,
  },
});
