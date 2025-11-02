import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode"; // ✅ Correct import

interface MyJwtPayload {
  name: string;
  email: string;
  id: string;
  exp?: number;
}

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [userData, setUserData] = useState({ name: "Loading...", email: "" });
  const profileImage =
    "https://cdn.pixabay.com/photo/2020/11/19/15/32/sculpture-5758884_1280.jpg";

  // Animations
  const iconFloatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(iconFloatAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  // 🔹 Decode token safely
  const getUserFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return null;
      const decoded = jwtDecode<MyJwtPayload>(token);
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // 🔹 Refresh token function
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) return null;

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
      console.log("🔄 Access token refreshed successfully!");
      return data.accessToken;
    } catch (err) {
      console.error("Error refreshing token:", err);
      return null;
    }
  };

  // 🔹 Verify token expiry
  const isTokenExpired = (decoded: MyJwtPayload) => {
    if (!decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  };

  // 🔹 Fetch user info (auto refresh if expired)
  const loadUserData = async () => {
    try {
      let token = await AsyncStorage.getItem("accessToken");
      if (!token) return;

      let decoded = jwtDecode<MyJwtPayload>(token);

      if (isTokenExpired(decoded)) {
        console.log("⚠️ Access token expired, refreshing...");
        const newToken = await refreshAccessToken();
        if (!newToken) {
          console.log("❌ Failed to refresh token, logging out...");
          handleLogout();
          return;
        }
        token = newToken;
        decoded = jwtDecode<MyJwtPayload>(token);
      }

      setUserData({
        name: decoded.name,
        email: decoded.email,
      });

      console.log("✅ User loaded:", decoded);
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  // 🔹 Logout
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

    await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.contentWrapper}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
          <View style={styles.card}>
            <Image source={{ uri: profileImage }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.email}>{userData.email}</Text>
            </View>
          </View>
        </Animated.View>

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
  contentWrapper: { flex: 1, padding: 20, justifyContent: "space-between" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 16,
    borderRadius: 12,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: "#FFD700" },
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
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
});
