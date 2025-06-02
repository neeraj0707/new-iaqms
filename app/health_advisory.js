

import React, { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image'; 
import LottieView from 'lottie-react-native'; 

const { width, height } = Dimensions.get('window');

const HealthAdvisory = ({ aqi }) => {
  const [opacity] = useState(new Animated.Value(0));
  const [showPrecautions, setShowPrecautions] = useState(false);

  const healthAnimation = require('../assets/health.json');

  const getHealthAdvisory = (aqi) => {
    if (aqi <= 50) {
      return {
        color: 'green',
        bgColor: '#E0F8E0',
        message: 'Good air quality. Enjoy your day!',
        precautions: ['No restrictions', 'Enjoy outdoor activities'],
        icon: require('../assets/good.json'),
      };
    } else if (aqi <= 100) {
      return {
        color: '#FDDA0D',
        bgColor: '#FFF5CC',
        message: 'Moderate air quality. Sensitive individuals should limit prolonged outdoor activities.',
        precautions: ['Limit outdoor activities if sensitive', 'Use air purifiers indoors'],
        icon: require('../assets/moderate (2).gif'),
      };
    } else if (aqi <= 150) {
      return {
        color: 'orange',
        bgColor: '#FFE5CC',
        message: 'Unhealthy for sensitive groups. People with respiratory issues should limit outdoor activities.',
        precautions: ['Wear a mask outdoors', 'Close windows to prevent outdoor air'],
        icon: require('../assets/sad (2).gif'),
      };
    } else if (aqi <= 200) {
      return {
        color: 'red',
        bgColor: '#FFCCCC',
        message: 'Unhealthy air quality. Everyone may begin to experience health effects.',
        precautions: ['Limit outdoor activities', 'Use N95 masks if going outside'],
        icon: require('../assets/allegy.gif'),
      };
    } else if (aqi <= 300) {
      return {
        color: 'purple',
        bgColor: '#E5CCFF',
        message: 'Very unhealthy air quality. Health alert. Everyone should avoid outdoor activities.',
        precautions: ['Stay indoors', 'Use air purifiers'],
        icon: require('../assets/mask.gif'),
      };
    } else {
      return {
        color: 'maroon',
        bgColor: '#D9B3B3',
        message: 'Hazardous air quality. Emergency health warning. Everyone should stay indoors.',
        precautions: ['Avoid all outdoor exposure', 'Seek medical help if feeling unwell'],
        icon: require('../assets/toxic.gif'),
      };
    }
  };

  const advisory = getHealthAdvisory(aqi);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [aqi]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Health Advisory</Text>
      <LottieView source={healthAnimation} autoPlay loop style={styles.lottie} />

      <Animated.View style={[styles.card, { opacity, backgroundColor: advisory.bgColor }]}>
        <Text style={[styles.aqiValue,]}>AQI: {aqi}</Text>
        <Image source={advisory.icon} style={styles.icon} />
        <Text style={[styles.message, ]}>{advisory.message}</Text>

        {showPrecautions && (
          <View style={styles.precautionsContainer}>
            <Text style={styles.precautionTitle}>Precautions:</Text>
            {advisory.precautions.map((precaution, index) => (
              <Text key={index} style={styles.precautionItem}>• {precaution}</Text>
            ))}
          </View>
        )}

        {/* Show More / Show Less Button */}
        <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowPrecautions(!showPrecautions)}
        >
          <Text style={styles.buttonText}>
            {showPrecautions ? 'Show Less' : 'Show More'}
          </Text>
        </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    width: 320,
    alignSelf: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '300',
    // marginBottom: 5,
    color: '#333',
    alignSelf: 'center',
  },
  lottie: {
    width: 350,
    height: 350,
    alignSelf: 'center',
  },
  aqiValue: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 5,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    // textAlign: 'center',
    marginBottom: 10,
    color:'#1B1B1B',
  },
  precautionsContainer: {
    marginTop: 8,
    width: '100%',
    paddingHorizontal: 10,
    // alignItems: 'center',
  },
  precautionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    // textAlign: 'center',
  },
  precautionItem: {
    fontSize: 13,
    // textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    alignSelf: 'flex-start', // Aligns the button to the start (left)
    paddingLeft: 18, // Adds some space from the left
    marginBottom: 5,
  },
  button: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
    backgroundColor: '#318CE7',
  
  },
  buttonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '400',
  },
});

export default HealthAdvisory;





