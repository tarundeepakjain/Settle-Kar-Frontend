import { useNavigation } from "@react-navigation/native";
import React, { useRef, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const iconFloatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Floating animation for icons
    Animated.loop(
      Animated.timing(iconFloatAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    // Initial fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getFloatStyle = (delay: number) => ({
    transform: [
      {
        translateY: iconFloatAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -15, 0],
        }),
      },
    ],
    // @ts-ignore
    animationDelay: `${delay}ms`,
  });

  const handlePress = (screenName: string) => {
    if (screenName === "Logout") {
      console.log("User logged out.");
    } else {
      navigation.navigate(screenName);
    }
  };

  return (
    <View style={styles.container}>
      {/* Enhanced Animated Background */}
      <View style={styles.background}>
        <View style={styles.gradientOverlay} />

        {/* Floating Icons */}
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
            name="settings-outline"
            size={26}
            color="rgba(255, 100, 200, 0.5)"
          />
        </Animated.View>

        {/* Gradient Orbs */}
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

      {/* Main content */}
      <SafeAreaView style={styles.contentWrapper}>
        <Animated.View
          style={[
            styles.profileSection,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageGlow} />
            <View style={styles.profileImageBorder}>
              <Image
                source={{
                  uri: "https://cdn.pixabay.com/photo/2020/11/19/15/32/sculpture-5758884_1280.jpg",
                }}
                style={styles.profileImage}
              />
            </View>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
            </View>
          </View>
          <Text style={styles.name}>Dev</Text>
          <View style={styles.nameDivider} />
          <Text style={styles.userEmail}>dev@settlekar.com</Text>
        </Animated.View>

        <Animated.View style={[styles.optionsSection, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handlePress("Settings")}
            activeOpacity={0.8}
          >
            <View style={[styles.optionIconContainer, styles.settingsIcon]}>
              <Ionicons name="settings-sharp" size={20} color="#FFD700" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Settings</Text>
              <Text style={styles.optionSubtext}>Manage your preferences</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="rgba(255, 255, 255, 0.4)"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handlePress("Language")}
            activeOpacity={0.8}
          >
            <View style={[styles.optionIconContainer, styles.languageIcon]}>
              <Ionicons name="language" size={20} color="#64B5F6" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Language</Text>
              <Text style={styles.optionSubtext}>Choose your language</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="rgba(255, 255, 255, 0.4)"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handlePress("Currency")}
            activeOpacity={0.8}
          >
            <View style={[styles.optionIconContainer, styles.currencyIcon]}>
              <Ionicons name="cash" size={20} color="#96E6A1" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Currency</Text>
              <Text style={styles.optionSubtext}>Set default currency</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="rgba(255, 255, 255, 0.4)"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.logoutButton]}
            onPress={() => handlePress("Logout")}
            activeOpacity={0.8}
          >
            <View style={[styles.optionIconContainer, styles.logoutIcon]}>
              <Ionicons name="log-out" size={20} color="#FF6B6B" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.logoutText}>Logout</Text>
              <Text style={styles.logoutSubtext}>Sign out of your account</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="rgba(255, 107, 107, 0.5)"
            />
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>SettleKar v1.0.0</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a1421" },
  background: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  floatingIcon: { position: "absolute" },
  iconGlow: Platform.select({
    ios: {
      shadowColor: "#FFD700",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 15,
    },
    android: { elevation: 8 },
  }),
  orb: { position: "absolute", borderRadius: 9999, opacity: 0.12 },
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
  },
  orbInner: {
    width: "100%",
    height: "100%",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  contentWrapper: { flex: 1, padding: 20, position: "relative", zIndex: 1 },
  profileSection: { alignItems: "center", marginTop: 40, marginBottom: 40 },
  profileImageContainer: { position: "relative", marginBottom: 20 },
  profileImageGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFD700",
    opacity: 0.15,
    top: -10,
    left: -10,
    ...Platform.select({
      ios: {
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 25,
      },
      android: { elevation: 12 },
    }),
  },
  profileImageBorder: {
    padding: 4,
    borderRadius: 65,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 2,
    borderColor: "#FFD700",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: { elevation: 8 },
    }),
  },
  profileImage: { width: 120, height: 120, borderRadius: 60 },
  statusIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0a1421",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0a1421",
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#96E6A1",
    ...Platform.select({
      ios: {
        shadowColor: "#96E6A1",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
      },
    }),
  },
  name: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
    textShadowColor: "rgba(255,215,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  nameDivider: {
    width: 40,
    height: 2,
    backgroundColor: "#FFD700",
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 8,
  },
  userEmail: { fontSize: 14, color: "#a0a0a0", letterSpacing: 0.3 },
  optionsSection: { flex: 1, gap: 12 },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: 12,
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  settingsIcon: {
    backgroundColor: "rgba(255,215,0,0.15)",
    borderColor: "rgba(255,215,0,0.3)",
  },
  languageIcon: {
    backgroundColor: "rgba(100,181,246,0.15)",
    borderColor: "rgba(100,181,246,0.3)",
  },
  currencyIcon: {
    backgroundColor: "rgba(150,230,161,0.15)",
    borderColor: "rgba(150,230,161,0.3)",
  },
  logoutIcon: {
    backgroundColor: "rgba(255,107,107,0.15)",
    borderColor: "rgba(255,107,107,0.3)",
  },
  optionTextContainer: { flex: 1 },
  optionText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  optionSubtext: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 0.2,
  },
  logoutButton: {
    backgroundColor: "rgba(255,107,107,0.1)",
    borderColor: "rgba(255,107,107,0.25)",
    marginTop: 8,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FF6B6B",
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  logoutSubtext: {
    fontSize: 12,
    color: "rgba(255,107,107,0.6)",
    letterSpacing: 0.2,
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 20,
    marginTop: "auto",
  },
  versionText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    letterSpacing: 0.5,
  },
});
