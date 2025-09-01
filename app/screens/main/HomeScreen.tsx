import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
import Logo from "../../../assets/images/file.svg";

export default function HomeScreen() {
  const [open, setOpen] = useState(false);
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
      {/* Background with fluid motion */}
      <View style={styles.background}>
        <Animated.View style={[styles.fluidBlob, styles.blob1, getAnimatedStyle(0, 100)]} />
        <Animated.View style={[styles.fluidBlob, styles.blob2, getAnimatedStyle(100, -50)]} />
        <Animated.View style={[styles.fluidBlob, styles.blob3, getAnimatedStyle(-50, 150)]} />
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        <Logo width={1000} height={450} style={styles.logo} />
        <Text style={styles.greeting}>Hi Dev,</Text>
        <Text style={styles.subheader}>Welcome to SettleKar!</Text>
      </View>

      {/* Floating Options Menu */}
      {open && (
        <View style={styles.options}>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Create Group</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setOpen(!open)}>
        <Ionicons name={open ? "close" : "add"} size={28} color="#fff" />
      </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  logo: {
    tintColor: '#fff',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subheader: {
    fontSize: 18,
    color: "#a0a0a0",
    marginBottom: 20,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#2e86de",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    zIndex: 2, // Added zIndex to ensure it's on top
  },
  options: {
    position: "absolute",
    bottom: 100,
    right: 30,
    alignItems: "flex-end",
    zIndex: 2, // Added zIndex to ensure it's on top
  },
  optionButton: {
    backgroundColor: "#2c2c2c",
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  optionText: {
    fontSize: 16,
    color: "#fff",
  },
});
