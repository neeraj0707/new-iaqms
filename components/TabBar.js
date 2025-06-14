
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { PlatformPressable } from '@react-navigation/elements';
import { StyleSheet, Text, View } from 'react-native';
// import { syncDataToFirestore } from '../app/syncDataToFirestore';

const buildHref = (name, params) => {
  return `/${name}${params ? '?' + new URLSearchParams(params).toString() : ''}`;
};

const TabBar = ({ state, descriptors, navigation }) => {
  // Move colors object to the top
  const colors = {
    primary: '#007bff',
    text: '#737373',
  };

  // Define icons
  const icons = {
    index: (props) => <AntDesign name="home" size={26} color={props.color} {...props} />,
    map: (props) => <FontAwesome name="globe" size={26} color={props.color} {...props} />,
    explore: (props) => <Feather name="compass" size={26} color={props.color} {...props} />,
    shop: (props) => <AntDesign name="shoppingcart" size={26} color={props.color} {...props} />,
  };

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        if (['fetch_data','map', '_sitemap', '+not-found', 'aqi_details', 'AqiDataDisplay' ,'details_screen', 'syncData', 'GraphScreen','LiveDataGraph','HistoricalDataGraph','HistoryData','WeatherForecast','HIstogram','pastData','Histogram','HistoricalData','health_advisory','AQIListener','detail','firebase','syncDataToFirestore','SendPushNotification','registerForPushNotifications','database', 'TwentyFourHourGraph'].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          } 
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Use default icon if route.name does not exist in icons
        const Icon = icons[route.name] || (() => <AntDesign name="question" size={26} color={colors.text} />);

        return (
          <PlatformPressable
            key={route.name}
            style={styles.tabbarItem}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {/* Render the icon */}
            {Icon({ color: isFocused ? colors.primary : colors.text })}

            {/* Render the label */}
            <Text style={{ color: isFocused ? colors.primary : colors.text }}>
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',  
    bottom: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000814',
    marginHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 45,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.27,
    shadowRadius: 10,
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
  },
});

export default TabBar;
