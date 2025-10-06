import { useNavigation } from "@react-navigation/native";
import React, { useRef, useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "",
    profileImage:
      "https://cdn.pixabay.com/photo/2020/11/19/15/32/sculpture-5758884_1280.jpg",
  });

  const iconFloatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    fetchUserData();
    animateIcons();
  }, []);

  const animateIcons = () => {
    Animated.loop(
      Animated.timing(iconFloatAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

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
  };

  const fetchUserData = async () => {
    try {
      let accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (!accessToken) {
        console.warn("No access token found, user might be logged out");
        return;
      }

      let response = await fetch("https://settlekar.onrender.com/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 401) {
        console.log("Access token expired, refreshing...");
        const refreshed = await refreshAccessToken(refreshToken);
        if (!refreshed) return;
        accessToken = refreshed;
        response = await fetch("https://settlekar.onrender.com/auth/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }

      const data = await response.json();
      if (!data.name) {
        console.log("Invalid response:", data);
        return;
      }

      setUserData({
        name: data.name,
        email: data.email,
        profileImage:
          data.profileImage ||
          "https://cdn.pixabay.com/photo/2020/11/19/15/32/sculpture-5758884_1280.jpg",
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const refreshAccessToken = async (refreshToken: string | null) => {
    if (!refreshToken) return null;
    try {
      const response = await fetch("https://settlekar.onrender.com/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        console.warn("Failed to refresh access token");
        return null;
      }

      const data = await response.json();
      await AsyncStorage.setItem("accessToken", data.accessToken);
      await AsyncStorage.setItem("refreshToken", data.refreshToken);
      return data.accessToken;
    } catch (err) {
      console.error("Error refreshing token:", err);
      return null;
    }
  };
  const handleLogout = async () => {
  const confirmLogout =
    Platform.OS === "web"
      ? window.confirm("Are you sure you want to logout?")
      : await new Promise((resolve) =>
          Alert.alert("Logout", "Are you sure you want to log out?", [
            { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
            { text: "Logout", onPress: () => resolve(true), style: "destructive" },
          ])
        );

  if (!confirmLogout) return;

  try {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    console.log("cleared");

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

  const UserCard = ({ name, email, profileImage }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: profileImage }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.background}>
        <View style={styles.gradientOverlay} />
      </View>

      <SafeAreaView style={styles.contentWrapper}>
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
        >
          <UserCard {...userData} />
        </Animated.View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
  contentWrapper: { flex: 1, padding: 20, justifyContent: "space-between" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 16,
    borderRadius: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  info: { marginLeft: 16 },
  name: { fontSize: 18, fontWeight: "600", color: "#fff" },
  email: { fontSize: 14, color: "#ccc" },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff4d4d",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
