import { useNavigation } from '@react-navigation/native';
import React, { useRef, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';

export default function ProfileScreen() {
  const navigation = useNavigation();
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
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Sadu_Kathmandu_Pashupatinath_2006_Luca_Galuzzi.jpg/500px-Sadu_Kathmandu_Pashupatinath_2006_Luca_Galuzzi.jpg" }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>Dev Sadhu</Text>
        </View>

        {/* Options Section */}
        <View style={styles.optionsSection}>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Language</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Currency</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionButton, styles.logoutButton]}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a1421",
    padding: 20,
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
    position: 'relative',
    zIndex: 1,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#66c2ff",
  },
  name: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "bold",
    color: "#e0e0e0",
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
  logoutButton: {
    backgroundColor: "rgba(255, 69, 58, 0.15)", // A subtle reddish background
    borderColor: "rgba(255, 69, 58, 0.3)", // A subtle reddish border
    borderWidth: StyleSheet.hairlineWidth,
  },
  logoutText: {
    fontSize: 18,
    color: "#ff6666",
  },
});
