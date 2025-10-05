import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  SafeAreaView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Svg, Path } from "react-native-svg";

export default function HomeScreen() {
  const [open, setOpen] = useState(false);
  const iconFloatAnim = useRef(new Animated.Value(0)).current;
  const fabRotateAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fabRotateAnim, {
        toValue: open ? 1 : 0,
        duration: 300,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.spring(optionsAnim, {
        toValue: open ? 1 : 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open]);

  const getFloatStyle = (delay: number) => ({
    transform: [
      {
        translateY: iconFloatAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -15, 0],
        }),
      },
    ],
    animationDelay: `${delay}ms`,
  });

  const fabRotation = fabRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "135deg"],
  });

  return (
    <View style={styles.container}>
      {/* Enhanced Animated Background */}
      <View style={styles.background}>
        {/* Gradient Overlay */}
        <View style={styles.gradientOverlay} />

        {/* Floating Icons with Glow Effect */}
        <Animated.View
          style={[
            styles.floatingIcon,
            styles.iconGlow,
            { left: "10%", top: "25%" },
            getFloatStyle(0),
          ]}
        >
          <Ionicons
            name="wallet-outline"
            size={32}
            color="rgba(255, 215, 0, 0.6)"
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingIcon,
            styles.iconGlow,
            { right: "15%", top: "20%" },
            getFloatStyle(1000),
          ]}
        >
          <Ionicons
            name="cash-outline"
            size={28}
            color="rgba(100, 200, 255, 0.6)"
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingIcon,
            styles.iconGlow,
            { left: "15%", bottom: "20%" },
            getFloatStyle(500),
          ]}
        >
          <Ionicons
            name="people-outline"
            size={30}
            color="rgba(150, 255, 150, 0.5)"
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingIcon,
            styles.iconGlow,
            { right: "10%", bottom: "30%" },
            getFloatStyle(1500),
          ]}
        >
          <Ionicons name="star" size={24} color="rgba(255, 215, 0, 0.7)" />
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingIcon,
            { left: "50%", top: "15%" },
            getFloatStyle(750),
          ]}
        >
          <Ionicons
            name="receipt-outline"
            size={26}
            color="rgba(255, 100, 200, 0.5)"
          />
        </Animated.View>

        {/* Enhanced Gradient Orbs */}
        <View style={[styles.orb, styles.orb1]}>
          <View style={styles.orbInner} />
        </View>
        <View style={[styles.orb, styles.orb2]}>
          <View style={styles.orbInner} />
        </View>
        <View style={[styles.orb, styles.orb3]}>
          <View style={styles.orbInner} />
        </View>
      </View>

      {/* Main Content Area */}
      <SafeAreaView style={styles.contentWrapper}>
        <View style={styles.centeredContent}>
          {/* Logo with Backdrop */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBackdrop} />
            <Svg
              width={120}
              height={120}
              style={styles.logo}
              viewBox="0 0 120 120"
            >
              {/* Replace the Path below with your actual SVG path data */}
              <Path
                d="M60 10a50 50 0 1 1 0 100a50 50 0 1 1 0-100"
                fill="#FFD700"
              />
            </Svg>
          </View>

          {/* Enhanced Text with Gradient */}
          <View style={styles.textContainer}>
            <Text style={styles.greeting}>Hi Dev,</Text>
            <View style={styles.divider} />
            <Text style={styles.subheader}>Welcome to SettleKar!</Text>
            <Text style={styles.tagline}>
              Split bills, share expenses, settle easy
            </Text>
          </View>
        </View>

        {/* Enhanced Floating Options Menu */}
        {open && (
          <Animated.View
            style={[
              styles.options,
              {
                opacity: optionsAnim,
                transform: [
                  {
                    translateY: optionsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                  {
                    scale: optionsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.optionButton, styles.optionButton1]}
              activeOpacity={0.8}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="receipt" size={20} color="#FFD700" />
              </View>
              <Text style={styles.optionText}>Add Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, styles.optionButton2]}
              activeOpacity={0.8}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="people" size={20} color="#64B5F6" />
              </View>
              <Text style={styles.optionText}>Create Group</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Enhanced Floating Action Button */}
        <Animated.View
          style={[
            styles.fabContainer,
            { transform: [{ rotate: fabRotation }] },
          ]}
        >
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setOpen(!open)}
            activeOpacity={0.9}
          >
            <View style={styles.fabGlow} />
            <Ionicons name="add" size={32} color="#0a1421" />
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a1421",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    backgroundImage:
      "radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(46, 134, 222, 0.08) 0%, transparent 50%)",
  },
  floatingIcon: {
    position: "absolute",
  },
  iconGlow: {
    ...Platform.select({
      ios: {
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  orb: {
    position: "absolute",
    borderRadius: 9999,
    opacity: 0.12,
  },
  orb1: {
    width: 200,
    height: 200,
    backgroundColor: "#FFD700",
    top: "15%",
    left: "10%",
    ...Platform.select({
      ios: {
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 40,
      },
    }),
  },
  orb2: {
    width: 240,
    height: 240,
    backgroundColor: "#2e86de",
    bottom: "20%",
    right: "15%",
    ...Platform.select({
      ios: {
        shadowColor: "#2e86de",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 50,
      },
    }),
  },
  orb3: {
    width: 160,
    height: 160,
    backgroundColor: "#96E6A1",
    top: "60%",
    left: "60%",
    opacity: 0.08,
    ...Platform.select({
      ios: {
        shadowColor: "#96E6A1",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 30,
      },
    }),
  },
  orbInner: {
    width: "100%",
    height: "100%",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  contentWrapper: {
    flex: 1,
    padding: 20,
    ...Platform.select({
      web: {
        paddingTop: 50,
      },
    }),
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    position: "relative",
    marginBottom: 40,
  },
  logoBackdrop: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    top: -10,
    left: -10,
    ...Platform.select({
      ios: {
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  logo: {
    tintColor: "#FFD700",
  },
  textContainer: {
    alignItems: "center",
  },
  greeting: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
    letterSpacing: 1,
    textShadowColor: "rgba(255, 215, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: "#FFD700",
    borderRadius: 2,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
      },
    }),
  },
  subheader: {
    fontSize: 20,
    fontWeight: "600",
    color: "#e0e0e0",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: "#a0a0a0",
    fontStyle: "italic",
    letterSpacing: 0.3,
  },
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
    zIndex: 3,
  },
  fab: {
    backgroundColor: "#FFD700",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#FFD700",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  fabGlow: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFD700",
    opacity: 0.2,
  },
  options: {
    position: "absolute",
    bottom: 110,
    right: 30,
    alignItems: "flex-end",
    zIndex: 2,
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    gap: 12,
  },
  optionButton1: {
    borderLeftWidth: 3,
    borderLeftColor: "#FFD700",
  },
  optionButton2: {
    borderLeftWidth: 3,
    borderLeftColor: "#64B5F6",
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.3,
  },
});
