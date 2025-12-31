import Chatbot from "@/app/components/chatBot";
import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GroupScreen from "./GroupsScreen";
import { useNavigation } from "@react-navigation/native";
import { Path, Svg } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode, JwtPayload } from "jwt-decode";
import PersonalExpenseModal from "../../components/PersonalExpenseModal";
import { supabase } from "@/utils/supabase";

export default function HomeScreen() {
  const [open, setOpen] = useState(false);         // FAB menu
  const [chatOpen, setChatOpen] = useState(false); // Chatbot

  const iconFloatAnim = useRef(new Animated.Value(0)).current;
  const fabRotateAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(new Animated.Value(0)).current;
 const [name, setName] = useState(""); 
 const navigation = useNavigation<any>();
 const [showPersonalModal, setShowPersonalModal] = useState(false);


// Helper to refresh the access token using the refresh token.


//   try {
//     const res = await fetch("https://settlekar.onrender.com/auth/refresh", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ refreshToken }),
//     });

//     if (!res.ok) {
//       console.warn("Refresh token request failed with status:", res.status);
//       return null;
//     }

//     const json = await res.json();
//     // Accept common field names (accessToken or token)
//     const newAccessToken = json.accessToken ?? json.token ?? null;
//     if (!newAccessToken) {
//       console.warn("No access token found in refresh response:", json);
//       return null;
//     }

//     // Persist the new access token for future requests
//     await AsyncStorage.setItem("accessToken", newAccessToken);
//     return newAccessToken;
//   } catch (e) {
//     console.error("Failed to refresh access token:", e);
//     return null;
//   }
// }

//    const fetchUserData = async () => {
//   try {
//     let accessToken = await AsyncStorage.getItem("accessToken");
//     const refreshToken = await AsyncStorage.getItem("refreshToken");

//     if (!accessToken) {
//       console.warn("No access token found, user might be logged out");
//       return;
//     }

//     let response = await fetch("https://settlekar.onrender.com/auth/me", {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });

//     // Handle expired token
//     if (response.status === 401) {
//       console.log("Access token expired, refreshing...");
//       const refreshed = await refreshAccessToken(refreshToken);
//       if (!refreshed) return;
//       accessToken = refreshed;

//       response = await fetch("https://settlekar.onrender.com/auth/me", {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//     }

//     if (!response.ok) {
//       console.error("Failed to fetch user data:", response.status);
//       return;
//     }

//     const data = await response.json();
//     // ✅ Backend returns plain user object
//     const userName = data.name;
//     if (!userName) {
//       console.warn("No name found in response:", data);
//       return;
//     }

//     setName(userName);
//   } catch (err) {
//     console.error("Error fetching user data:", err);
//   }
// };



//   useEffect(() => {
//   fetchUserData();
// }, []);
supabase.auth.onAuthStateChange((event, session) => {
  // console.log(event, session?.user);
  setName(session?.user?.user_metadata?.name.trim().split(" ")[0]);
})

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
      {/* Background */}
      <View style={styles.background}>
        <View style={styles.gradientOverlay} />

        {/* Floating icons */}
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

        {/* Orbs */}
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

      {/* Content */}
      <SafeAreaView style={styles.contentWrapper}>
        <View style={styles.centeredContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBackdrop} />
            <Svg
              width={120}
              height={120}
              style={styles.logo}
              viewBox="0 0 120 120"
            >
              <Path
                d="M60 10a50 50 0 1 1 0 100a50 50 0 1 1 0-100"
                fill="#FFD700"
              />
            </Svg>
          </View>

          {/* Text */}
          <View style={styles.textContainer}>
            <Text style={styles.greeting}>Hi {name || "guest"},</Text>
            <View style={styles.divider} />
            <Text style={styles.subheader}>Welcome to SettleKar!</Text>
            <Text style={styles.tagline}>
              Split bills, share expenses, settle easy
            </Text>
          </View>
        </View>

        {/* Floating Options Menu */}
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
              onPress={() => setShowPersonalModal(true)}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="receipt" size={20} color="#FFD700" />
              </View>
              <Text style={styles.optionText}>Add Expense</Text>
            </TouchableOpacity>
            
            
            <TouchableOpacity
              style={[styles.optionButton, styles.optionButton2]}
              activeOpacity={0.8}
              onPress={() => {
                setOpen(false); // Close the FAB menu
                navigation.navigate("Groups", { openCreateGroup: true }); // Navigate and pass parameter
              }}
            >
              
              <View style={styles.optionIconContainer}>
                <Ionicons name="people" size={20} color="#64B5F6" />
              </View>
              <Text style={styles.optionText}>Create Group</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* FAB for menu */}
        <Animated.View
          style={[styles.fabContainer, { transform: [{ rotate: fabRotation }] }]}
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

        {/* NEW: Chatbot Button (bottom-left) */}
        <Animated.View style={styles.chatFabContainer}>
          <TouchableOpacity
            style={styles.chatFab}
            onPress={() => setChatOpen(true)}
            activeOpacity={0.9}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={28}
              color="#0a1421"
            />
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>

      {/* Chatbot */}
      <Chatbot isChatOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <PersonalExpenseModal
      visible={showPersonalModal}
      onClose={() => setShowPersonalModal(false)}
      onSuccess={() => {
        console.log("Personal expense added!");
        // 👉 Optional: refresh transactions here
      }}
    />

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
  },
  orb2: {
    width: 240,
    height: 240,
    backgroundColor: "#2e86de",
    bottom: "20%",
    right: "15%",
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
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  contentWrapper: {
    flex: 1,
    padding: 20,
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
  },
  logo: {
    // Removed tintColor, as it's not valid for ViewStyle
  },
  textContainer: {
    alignItems: "center",
  },
  greeting: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: "#FFD700",
    borderRadius: 2,
    marginBottom: 12,
  },
  subheader: {
    fontSize: 20,
    fontWeight: "600",
    color: "#e0e0e0",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: "#a0a0a0",
    fontStyle: "italic",
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
  },
  // 🔥 New Chatbot Button Styles
  chatFabContainer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    zIndex: 3,
  },
  chatFab: {
    backgroundColor: "#64B5F6",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
});
