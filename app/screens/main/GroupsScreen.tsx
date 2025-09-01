import { useNavigation } from "@react-navigation/native";
import React, { useRef, useEffect } from "react";
import { StyleSheet, Text, View, Animated, Easing } from "react-native";
import GroupList from './GroupList';

export default function GroupsScreen() {
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

      <View style={styles.header}>
        <Text style={styles.title}>Groups</Text>
      </View>
      <GroupList />
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
});
