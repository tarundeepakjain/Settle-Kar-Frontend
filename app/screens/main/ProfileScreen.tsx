import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChangePassword from "../../components/ChangePassword";
import CurrencySetting from "../../components/CurrencySetting";
import EditProfile from "../../components/EditProfile";

import { useCurrency } from "../../context/CurrencyContext"; // ⭐ GLOBAL CURRENCY

interface MyJwtPayload {
  name: string;
  email: string;
  id: string;
  exp?: number;
}

const ProfileOption = ({
  iconName,
  title,
  onPress,
  isDestructive = false,
  detail = "",
}: {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  isDestructive?: boolean;
  detail?: string;
}) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress} activeOpacity={0.8}>
    <View
      style={[
        styles.optionIconContainer,
        { backgroundColor: isDestructive ? "rgba(255, 77, 77, 0.2)" : "rgba(255, 215, 0, 0.15)" },
      ]}
    >
      <Ionicons name={iconName} size={22} color={isDestructive ? "#FF4D4D" : "#FFD700"} />
    </View>
    <Text style={[styles.optionTitle, isDestructive && styles.destructiveText]}>{title}</Text>
    <Text style={styles.optionDetail}>{detail}</Text>
    <Ionicons name="chevron-forward" size={18} color="#555" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { currency } = useCurrency(); // ⭐ GLOBAL CURRENCY

  const [userData, setUserData] = useState({ name: "Loading...", email: "loading@example.com" });
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);

  const profileImage =
    "https://cdn.pixabay.com/photo/2020/11/19/15/32/sculpture-5758884_1280.jpg";

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
      return data.accessToken;
    } catch (err) {
      console.error("Error refreshing token:", err);
      return null;
    }
  };

  const isTokenExpired = (decoded: MyJwtPayload) => {
    if (!decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  };

  const loadUserData = async () => {
    try {
      let token = await AsyncStorage.getItem("accessToken");
      if (!token) return;

      let decoded = jwtDecode<MyJwtPayload>(token);

      if (isTokenExpired(decoded)) {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          handleLogout();
          return;
        }
        token = newToken;
        decoded = jwtDecode<MyJwtPayload>(token);
      }

      const newUserData = {
        name: decoded.name,
        email: decoded.email,
      };

      setUserData(newUserData);
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
            <View style={styles.editableCard}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: profileImage }} style={styles.avatar} />
                <TouchableOpacity
                  style={styles.avatarEditButton}
                  onPress={() => setIsEditProfileVisible(true)}
                >
                  <Ionicons name="create-outline" size={16} color="#0a1421" />
                </TouchableOpacity>
              </View>

              <View style={styles.info}>
                <Text style={styles.label}>Full Name</Text>
                <Text style={styles.staticText}>{userData.name}</Text>

                <Text style={styles.label}>Email Address</Text>
                <Text style={styles.staticText}>{userData.email}</Text>

                <Text style={styles.label}>Currency</Text>
                <Text style={styles.staticText}>{currency}</Text>
              </View>
            </View>
          </Animated.View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.sectionBody}>
              <ProfileOption
                iconName="lock-closed-outline"
                title="Change Password"
                onPress={() => setIsChangePasswordVisible(true)}
              />
              <ProfileOption
                iconName="wallet-outline"
                title="Linked Accounts"
                onPress={() => Alert.alert("Linked Accounts", "Feature coming soon!")}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.sectionBody}>
              <CurrencySetting />
              <ProfileOption
                iconName="notifications-outline"
                title="Notifications"
                onPress={() => Alert.alert("Notifications", "Coming soon!")}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support & About</Text>
            <View style={styles.sectionBody}>
              <ProfileOption
                iconName="help-circle-outline"
                title="Help & FAQ"
                onPress={() => navigation.navigate("Help")}
              />
              <ProfileOption
                iconName="document-text-outline"
                title="Terms & Privacy"
                onPress={() => navigation.navigate("Terms")}
              />
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <EditProfile
        isVisible={isEditProfileVisible}
        onClose={() => setIsEditProfileVisible(false)}
        initialName={userData.name}
        userEmail={userData.email}
        onProfileUpdated={(newName) => setUserData((prev) => ({ ...prev, name: newName }))}
      />

      <ChangePassword
        isVisible={isChangePasswordVisible}
        onClose={() => setIsChangePasswordVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a1421" },
  contentWrapper: { flex: 1, padding: 20, justifyContent: "space-between" },
  scrollContent: { paddingBottom: 100 },
  editableCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: "center",
  },
  avatarContainer: { position: "relative", marginBottom: 20 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#FFD700",
  },
  avatarEditButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFD700",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#0a1421",
  },
  info: { width: "100%" },
  label: { color: "#ccc", fontSize: 14, marginBottom: 5, marginTop: 10 },
  staticText: {
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFD700",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 215, 0, 0.1)",
    paddingBottom: 4,
    marginLeft: 5,
  },
  sectionBody: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  optionTitle: { fontSize: 16, color: "#fff", flex: 1, fontWeight: "500" },
  optionDetail: { fontSize: 14, color: "#aaa", marginRight: 10 },
  destructiveText: { color: "#FF4D4D" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff4d4d",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
});
