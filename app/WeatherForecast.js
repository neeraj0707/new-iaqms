
//bg video 
import axios from 'axios';
import { Video } from 'expo-av';
import * as Location from 'expo-location';
// import { Video } from 'expo-video';
import LottieView from 'lottie-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';


import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

const WeatherForecast = () => {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uvIndex, setUvIndex] = useState(null); // State for UV index
  const [backgroundVideo, setBackgroundVideo] = useState(null);

  const getWeatherAnimation = useCallback((weather) => {
    switch (weather) {
      case 'Clear':
        return require('../assets/animations/sun.json');
      case 'Clouds':
        return require('../assets/animations/cloudy.json');
      case 'Rain':
        return require('../assets/animations/rain.json');
      case 'Snow':
        return require('../assets/animations/snow.json');
      case 'Thunderstorm':
        return require('../assets/animations/thunder.json');
      default:
        return require('../assets/animations/cloudy.json');
    }
  }, []);

  const getBackgroundVideo = useCallback((weather) => {
    switch (weather) {
      case 'Clear':
        return require('../assets/videos/sunny.mp4'); // Path to sunny background video
      case 'Clouds':
        return require('../assets/videos/cloudy.mp4'); // Path to cloudy background video
      case 'Rain':
        return require('../assets/videos/rainy.mp4'); // Path to rainy background video
      case 'Snow':
        return require('../assets/videos/snow.mp4'); // Path to snowy background video
      case 'Thunderstorm':
        return require('../assets/videos/thunder.mp4'); // Path to thunderstorm background video
      default:
        return require('../assets/videos/cloudy.mp4');
    }
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Location permission denied');
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);

        const WEATHER_API_KEY = 'd7676f26e867ad13873d0bf87fb3a449'; // Replace with your API key

        // Fetch current weather
        const currentWeatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
          params: {
            lat: loc.coords.latitude,
            lon: loc.coords.longitude,
            appid: WEATHER_API_KEY,
            units: 'metric',
          },
        });

        // console.log("Weather API Response:", currentWeatherResponse.data);

        // Fetch forecast weather
        const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
          params: {
            lat: loc.coords.latitude,
            lon: loc.coords.longitude,
            appid: WEATHER_API_KEY,
            units: 'metric',
          },
        });

        // Fetch UV index (requires a separate API call)
        const uvResponse = await axios.get(`https://api.openweathermap.org/data/2.5/uvi`, {
          params: {
            lat: loc.coords.latitude,
            lon: loc.coords.longitude,
            appid: WEATHER_API_KEY,
          },
        });

        // Store current weather, forecast data, and UV index
        setWeatherData(currentWeatherResponse.data);
        setForecastData(forecastResponse.data);
        setUvIndex(uvResponse.data.value);
        setBackgroundVideo(getBackgroundVideo(currentWeatherResponse.data.weather[0].main)); // Set background video
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [getBackgroundVideo]);

  if (loading) return <ActivityIndicator size="large" color="#007bff" />;

  if (!weatherData || !forecastData) {
    return <Text>Weather data unavailable.</Text>;
  }

  const hourlyForecast = forecastData.list.slice(0, 8);
  const dailyForecast = forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 5);

  return (
    <View style={styles.container}>
      {/* Background Video */}
      {backgroundVideo && (
        <Video
          source={backgroundVideo}
          rate={0.8}
          volume={0.3}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          isLooping
          style={styles.backgroundVideo}
        />
      )}

      {/* Gradient Overlay to fade out the video at the top and bottom */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 1)', 'transparent', 'transparent', 'rgba(255, 255, 255, 0.9)']}
        locations={[0, 0.2, 0.8, 1]} // Adjust gradient stops
        style={styles.gradientOverlay}
      />

      {/* Weather Content */}
      <View style={styles.weatherContainer}>
        <Text style={styles.title}>Weather Forecast</Text>

        {/* Current Weather */}
        <View style={styles.currentWeather}>
          <LottieView
            source={getWeatherAnimation(weatherData.weather[0].main)}
            autoPlay
            loop
            style={styles.animation}
          />
          <View>
            <Text style={styles.temperature}>{Math.round(weatherData.main.temp)}°C</Text>
            <Text style={styles.description}>{weatherData.weather[0].description}</Text>
          </View>
        </View>

        {/* Additional Weather Details */}
        <View style={styles.weatherDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>UV Index</Text>
            <Text style={styles.detailValue}>{uvIndex || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Air Pressure</Text>
            <Text style={styles.detailValue}>{weatherData.main.pressure} hPa</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Humidity</Text>
            <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
          </View>
        </View>

        {/* Hourly Forecast */}
        <Text style={styles.subtitle}>Hourly Forecast</Text>
        <FlatList
          horizontal
          data={hourlyForecast}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.hourlyItem}>
              <Text style={styles.hour}>{new Date(item.dt * 1000).getHours()}:00</Text>
              <Image
                source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }}
                style={styles.weatherIcon}
              />
              <Text style={styles.temp}>{Math.round(item.main.temp)}°C</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />

        {/* Daily Forecast */}
        <Text style={styles.subtitle}>Daily Forecast</Text>
        <FlatList
          horizontal
          data={dailyForecast}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.dailyItem}>
              <Text style={styles.day}>
                {new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
              </Text>
              <Image
                source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }}
                style={styles.weatherIcon}
              />
              <Text style={styles.temp}>{Math.round(item.main.temp)}°C</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: Dimensions.get('window').width, // Ensure full width
    position: 'relative',
    marginBottom: 50,
    width:'100%',
    
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject, // Fill the entire screen with the video
    zIndex: -1, // Make sure the video stays behind other components
    width:'100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0, // Place the gradient above the video but below the content
  },
  weatherContainer: {
    flex: 1,
    width: '100%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure content is above the overlay and video
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
    marginBottom: 10,
    textAlign: 'center',
    color: '#0066b2', // White text for better contrast
  },
  currentWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFF', // White text for better contrast
  },
  description: {
    fontSize: 18,
    textTransform: 'capitalize',
    color: '#FFF', // White text for better contrast
  },
  animation: {
    width: 100,
    height: 100,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
    width: '100%',
    paddingHorizontal: 20,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#0039a6', // White text for better contrast
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '400',
    color: '#0039a6', // White text for better contrast
  },
  hourlyItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white background
    borderRadius: 10,
    marginHorizontal: 10,
    height: 80,
    marginTop: 10,
    marginBottom: 20,
  },
  hour: {
    fontSize: 12,
    fontWeight: '400',
    color: '#323232', // White text for better contrast
  },
  temp: {
    fontSize: 12,
    fontWeight: '400',
    color: '#323232', // White text for better contrast
  },
  weatherIcon: {
    width: 40,
    height: 40,
  },
  dailyItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white background
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    height: 80,
  },
  day: {
    fontSize: 12,
    fontWeight: '400',
    color: '#323232', // White text for better contrast
  },
});

export default WeatherForecast;
