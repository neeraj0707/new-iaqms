
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Function to determine AQI status and color
const getAQIStatus = (value) => {
  if (value <= 50) return { status: "Good", color: "#00E400" };
  if (value <= 100) return { status: "Moderate", color: "#FFC300" };
  if (value <= 150) return { status: "Unhealthy for Sensitive Groups", color: "#FF7E00" };
  if (value <= 200) return { status: "Unhealthy", color: "#FF0000" };
  if (value <= 300) return { status: "Very Unhealthy", color: "#8F3F97" };
  return { status: "Hazardous", color: "	#D27D2D" };
};

const AQIScale = ({ aqi }) => {
  const { status, color } = getAQIStatus(aqi);

  return (
    <View style={styles.scaleContainer}>
      <Text style={styles.scaleLabel}>AQI Scale</Text>

      {/* AQI Scale Segments */}
      <View style={styles.scale}>
        <View style={[styles.scaleSegment, { backgroundColor: "#00E400", width: '16.66%' }]} />
        <View style={[styles.scaleSegment, { backgroundColor: "#FFC300", width: '16.66%' }]} />
        <View style={[styles.scaleSegment, { backgroundColor: "#FF7E00", width: '16.66%' }]} />
        <View style={[styles.scaleSegment, { backgroundColor: "#FF0000", width: '16.66%' }]} />
        <View style={[styles.scaleSegment, { backgroundColor: "#8F3F97", width: '16.66%' }]} />
        <View style={[styles.scaleSegment, { backgroundColor: "#800020", width: '16.66%' }]} />
      </View>

      {/* Labels for Each Segment */}
      <View style={styles.labelsContainer}>
        <Text style={styles.labelText}>Good</Text>
        <Text style={styles.labelText}>Moderate</Text>
        <Text style={styles.labelText}>Poor</Text>
        <Text style={styles.labelText}>Unhealthy</Text>
        <Text style={styles.labelText}>Severe</Text>
        <Text style={styles.labelText}>Hazardous</Text>
      </View>

     
      
    </View>
  );
};

const styles = StyleSheet.create({
  scaleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 30,
    // padding: 10, // Add padding to the container if needed
    
  },
  scaleLabel: {
    fontSize: 18,
    fontWeight: 400,
    marginBottom: 10,
  },
  scale: {
    flexDirection: 'row',
    width: '100%',
    height: 6,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 5, // Reduced margin to bring labels closer
  },
  scaleSegment: {
    height: 20,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  labelText: {
    fontSize: 10,
    fontWeight: 400,
    textAlign: 'center',
    flex: 1, // Ensures equal spacing for each label
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AQIScale;