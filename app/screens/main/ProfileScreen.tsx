import { useNavigation } from '@react-navigation/native';
import React, { useRef, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Animated, Easing, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
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
    // @ts-ignore
    animationDelay: `${delay}ms`,
  });

  const handlePress = (screenName: string) => {
    if (screenName === 'Logout') {
      // Handle logout logic here
      console.log('User logged out.');
    } else {
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated Background Elements */}
      <View style={styles.background}>
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

      {/* Main content */}
      <SafeAreaView style={styles.contentWrapper}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: "https://cdn.pixabay.com/photo/2020/11/19/15/32/sculpture-5758884_1280.jpg" }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>Dev</Text>
        </View>

        <View style={styles.optionsSection}>
          <TouchableOpacity style={styles.optionButton} onPress={() => handlePress('Settings')}>
            <Text style={styles.optionText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => handlePress('Language')}>
            <Text style={styles.optionText}>Language</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => handlePress('Currency')}>
            <Text style={styles.optionText}>Currency</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionButton, styles.logoutButton]} onPress={() => handlePress('Logout')}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    backgroundColor: "rgba(255, 69, 58, 0.15)",
    borderColor: "rgba(255, 69, 58, 0.3)",
    borderWidth: StyleSheet.hairlineWidth,
  },
  logoutText: {
    fontSize: 18,
    color: "#ff6666",
  },
});
