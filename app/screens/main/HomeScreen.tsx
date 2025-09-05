import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated, Easing, SafeAreaView, Platform } from 'react-native';
import Logo from "../../../assets/images/file.svg";

export default function HomeScreen() {
  const [open, setOpen] = useState(false);
  const iconFloatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(iconFloatAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  }, [iconFloatAnim]);

  const getFloatStyle = (delay: number) => ({
    transform: [{
      translateY: iconFloatAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -10, 0],
      }),
    }],
    animationDelay: `${delay}ms`,
  });

  return (
    <View style={styles.container}>
      {/* Animated Background Elements */}
      <View style={styles.background}>
        {/* Stars and Floating Icons */}
        <Animated.View style={[styles.floatingIcon, { left: '10%', top: '25%' }, getFloatStyle(0)]}>
          <Ionicons name="wallet-outline" size={30} color="rgba(255, 255, 255, 0.3)" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { right: '15%', top: '20%' }, getFloatStyle(1000)]}>
          <Ionicons name="cash-outline" size={25} color="rgba(255, 255, 255, 0.4)" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { left: '15%', bottom: '15%' }, getFloatStyle(500)]}>
          <Ionicons name="people-outline" size={28} color="rgba(255, 255, 255, 0.35)" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { right: '10%', bottom: '30%' }, getFloatStyle(1500)]}>
          <Ionicons name="star-outline" size={20} color="rgba(255, 255, 255, 0.5)" />
        </Animated.View>
        
        {/* Gradient Orbs */}
        <View style={[styles.orb, styles.orb1]} />
        <View style={[styles.orb, styles.orb2]} />
      </View>

      {/* Main Content Area */}
      <SafeAreaView style={styles.contentWrapper}>
        <View style={styles.centeredContent}>
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
      </SafeAreaView>
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
  floatingIcon: {
    position: 'absolute',
  },
  orb: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  orb1: {
    width: 120,
    height: 120,
    backgroundColor: '#FFD700',
    top: '25%',
    left: '25%',
    transform: [{ translateX: -60 }, { translateY: -60 }],
  },
  orb2: {
    width: 160,
    height: 160,
    backgroundColor: '#2e86de',
    bottom: '25%',
    right: '25%',
    transform: [{ translateX: 80 }, { translateY: 80 }],
  },
  contentWrapper: {
    flex: 1,
    padding: 16,
    ...Platform.select({
      web: {
        paddingTop: 50,
      },
    }),
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    tintColor: '#fff',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subheader: {
    fontSize: 18,
    color: '#a0a0a0',
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#FFD700',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    zIndex: 2,
  },
  options: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    alignItems: 'flex-end',
    zIndex: 2,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
});
