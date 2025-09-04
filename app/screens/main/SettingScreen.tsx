import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const fluidAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(fluidAnimation, {
        toValue: 1,
        duration: 25000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  }, [fluidAnimation]);

  const getAnimatedStyle = (start: number, end: number) => ({
    transform: [
      {
        translateX: fluidAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [start, end],
        }),
      },
      {
        translateY: fluidAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [end, start],
        }),
      },
      {
        scale: fluidAnimation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.2, 1],
        }),
      },
    ],
  });

  const handlePress = (screenName: string) => {
    // You can add logic to navigate to other screens here
    console.log(`Navigating to ${screenName}`);
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      {/* Fluid motion background */}
      <View style={styles.background}>
        <Animated.View style={[styles.fluidBlob, styles.blob1, getAnimatedStyle(0, 100)]} />
        <Animated.View style={[styles.fluidBlob, styles.blob2, getAnimatedStyle(100, -50)]} />
        <Animated.View style={[styles.fluidBlob, styles.blob3, getAnimatedStyle(-50, 150)]} />
      </View>

      {/* Main content */}
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.optionsSection}>
          <TouchableOpacity style={styles.optionButton} onPress={() => handlePress('AccountSettings')}>
            <Text style={styles.optionText}>Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => handlePress('Notifications')}>
            <Text style={styles.optionText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => handlePress('Privacy')}>
            <Text style={styles.optionText}>Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => handlePress('About')}>
            <Text style={styles.optionText}>About</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1421',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  fluidBlob: {
    position: 'absolute',
    borderRadius: 500,
  },
  blob1: {
    width: 350,
    height: 350,
    backgroundColor: 'rgba(46, 134, 222, 0.2)',
    top: -50,
    left: -50,
  },
  blob2: {
    width: 400,
    height: 400,
    backgroundColor: 'rgba(230, 126, 34, 0.1)',
    bottom: -100,
    right: -100,
  },
  blob3: {
    width: 500,
    height: 500,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: '30%',
    left: '10%',
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80, // Add padding for header
    position: 'relative',
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  optionsSection: {
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  optionText: {
    fontSize: 18,
    color: "#fff",
  },
  
});
