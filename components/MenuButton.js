// MenuButton.js corrected
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MenuButton = ({ onSelect }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;

  const menuOptions = [
    { id: 'air-estimation', label: 'Air Estimation' },
    { id: 'export-data', label: 'Export Data' },
    { id: 'settings', label: 'Settings' },
  ];

  const toggleMenu = () => {
    if (menuVisible) {
      // Close menu animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      // Open menu animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleOptionSelect = (optionId) => {
    onSelect && onSelect(optionId);
    toggleMenu();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (menuVisible) {
        toggleMenu();
      }
    };

    // In a real app, you'd need to implement a proper click-outside handler
    // This is just a placeholder for the concept
    return () => {
      // Cleanup if needed
    };
  }, [menuVisible]);

  const slideInterpolation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={toggleMenu} 
        style={styles.menuButton}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={menuVisible ? "close" : "menu"} 
          size={30} 
          color={menuVisible ? "#333" : "#333"} 
        />
      </TouchableOpacity>

      {menuVisible && (
        <Animated.View 
          style={[
            styles.menu,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideInterpolation }],
            },
          ]}
        >
          {menuOptions.map((option) => (
            <TouchableOpacity 
              key={option.id}
              style={styles.menuItem}
              onPress={() => handleOptionSelect(option.id)}
              activeOpacity={0.6}
            >
              <Text style={styles.menuText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

export default MenuButton;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 11,
    zIndex: 100,
  },
  menuButton: {
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  menu: {
    position: 'absolute',
    top: 60,
    // left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});

