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
  ActivityIndicator,
} from "react-native";
// Note: These imports are standard for Expo apps but may show errors in web-only previewers.
// They are required for the actual mobile application build.
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ChangePassword from "../../components/ForgotPassword";
import CurrencySetting from "../../components/CurrencySetting";
import EditProfile from "../../components/EditProfile";
import { useCurrency } from "../../../context/CurrencyContext";
import { supabase } from "@/utils/supabase";

const ProfileOption = ({
  iconName,
  title,
  onPress,
  isDestructive = false,
  detail = "",
}: any) => (
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
    {detail ? <Text style={styles.optionDetail}>{detail}</Text> : null}
    <Ionicons name="chevron-forward" size={18} color="#555" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { currency } = useCurrency();

  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "loading@example.com",
    lastSignIn: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [isCurrencyVisible, setIsCurrencyVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  // ✅ Load user from Supabase
  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData({
          name: user.user_metadata?.name || user.user_metadata?.full_name || "User",
          email: user.email ?? "",
          lastSignIn: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "N/A",
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // ✅ Functional Update Username directly with Supabase
  const handleUpdateUsername = async (newName: string) => {
    if (!newName.trim()) return;
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        data: { name: newName }
      });

      if (error) throw error;
      
      setUserData(prev => ({ ...prev, name: newName }));
      
     
    } catch (error: any) {
      const msg = error.message || "Failed to update profile";
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Error", msg);
    } finally {
      setIsLoading(false);
      setIsEditProfileVisible(false);
    }
  };

  // ✅ Supabase Logout
  const handleLogout = async () => {
    const confirm = Platform.OS === 'web' 
      ? window.confirm("Are you sure you want to logout?") 
      : await new Promise((resolve) => {
          Alert.alert("Logout", "Are you sure you want to log out?", [
            { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
            { text: "Logout", onPress: () => resolve(true), style: "destructive" },
          ]);
        });

    if (!confirm) return;

    try {
      await supabase.auth.signOut();
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.contentWrapper}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
            <View style={styles.editableCard}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: `https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}` }}
                  style={styles.avatar}
                />
                <TouchableOpacity
                  style={styles.avatarEditButton}
                  onPress={() => setIsEditProfileVisible(true)}
                >
                  <Ionicons name="camera-outline" size={18} color="#0a1421" />
                </TouchableOpacity>
              </View>

              <View style={styles.info}>
                <Text style={styles.userNameText}>{userData.name}</Text>
                <Text style={styles.userEmailText}>{userData.email}</Text>
                <View style={styles.badgeRow}>
                  <View style={styles.badge}><Text style={styles.badgeText}>Verified User</Text></View>
                  <Text style={styles.lastLoginText}>Active: {userData.lastSignIn}</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Account Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security & Account</Text>
            <View style={styles.sectionBody}>
              <ProfileOption
                iconName="person-outline"
                title="Edit Username"
                onPress={() => setIsEditProfileVisible(true)}
              />
              <ProfileOption
                iconName="lock-closed-outline"
                title="Change Password"
                onPress={() => setIsChangePasswordVisible(true)}
              />
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.sectionBody}>
              <ProfileOption
                iconName="cash-outline"
                title="Default Currency"
                detail={currency}
                onPress={() => setIsCurrencyVisible(true)}
              />
              <ProfileOption
                iconName="notifications-outline"
                title="Push Notifications"
                onPress={() => {}}
              />
            </View>
          </View>

          {/* Support */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Help & Support</Text>
            <View style={styles.sectionBody}>
              <ProfileOption
                iconName="help-circle-outline"
                title="Help Center"
                onPress={() => {}}
              />
              <ProfileOption
                iconName="shield-checkmark-outline"
                title="Privacy & Terms"
                onPress={() => {}}
              />
              <ProfileOption
                iconName="information-circle-outline"
                title="App Version"
                detail="1.2.4"
                onPress={() => {}}
              />
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Modals */}
      <EditProfile
        isVisible={isEditProfileVisible}
        onClose={() => setIsEditProfileVisible(false)}
        initialName={userData.name}
        userEmail={userData.email}
        onProfileUpdated={handleUpdateUsername}
      />

      {isChangePasswordVisible && (
        <ChangePassword isVisible={isChangePasswordVisible} onClose={() => setIsChangePasswordVisible(false)} />
      )}

      {isCurrencyVisible && (
        <CurrencySetting />
      )}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a1421" },
  contentWrapper: { flex: 1, paddingHorizontal: 20 },
  scrollContent: { paddingTop: 20, paddingBottom: 120 },
  editableCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 24,
    borderRadius: 20,
    marginBottom: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.1)",
  },
  avatarContainer: { position: "relative", marginBottom: 15 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#FFD700",
    backgroundColor: "#1a2a3a",
  },
  avatarEditButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#0a1421",
  },
  info: { alignItems: "center" },
  userNameText: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 4 },
  userEmailText: { color: "#aaa", fontSize: 14, marginBottom: 15 },
  badgeRow: { flexDirection: 'row', alignItems: 'center' },
  badge: { 
    backgroundColor: 'rgba(255, 215, 0, 0.15)', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12, 
    marginRight: 10 
  },
  badgeText: { color: '#FFD700', fontSize: 11, fontWeight: '700' },
  lastLoginText: { color: '#666', fontSize: 11 },
  section: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFD700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 5,
    opacity: 0.8,
  },
  sectionBody: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  optionTitle: { fontSize: 16, color: "#fff", flex: 1, fontWeight: "500" },
  optionDetail: { fontSize: 14, color: "#FFD700", marginRight: 10, opacity: 0.7 },
  destructiveText: { color: "#FF4D4D" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff4d4d",
    paddingVertical: 15,
    borderRadius: 15,
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "700", marginLeft: 10 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  }
});