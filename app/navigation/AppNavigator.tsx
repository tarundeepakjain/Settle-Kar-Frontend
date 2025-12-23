import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { supabase } from "../../utils/supabase";

// ⭐ Context
import { CurrencyProvider } from "../../context/CurrencyContext";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";

// Main App Screens
import CurrencyScreen from "../screens/main/CurrencyScreen";
import ExpensesScreen from "../screens/main/ExpensesScreen";
import GroupDetailsScreen from "../screens/main/GroupDetailsScreen";
import GroupsScreen from "../screens/main/GroupsScreen";
import HomeScreen from "../screens/main/HomeScreen";
import LanguageScreen from "../screens/main/LanguageScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import SettingsScreen from "../screens/main/SettingScreen";
import TransactionsScreen from "../screens/main/TransactionsScreen";
import HelpScreen from "../screens/main/HelpScreen";
import TermsScreen from "../screens/main/TermsScreen";

// Modal
import BillScannerModal from "../components/BillScannerModal";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIconBaseMap: { [key: string]: string } = {
  Home: "home",
  Groups: "people",
  Transactions: "swap-horizontal",
  Profile: "person",
};

const EmptyScanScreen = () => null;

function MainTabs() {
  const insets = useSafeAreaInsets();
  const [scannerVisible, setScannerVisible] = useState(false);

  const handleSaveBill = (billData: any) => {
    console.log("Bill saved, closing modal.", billData);
    setScannerVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0a1421" }}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const iconBase = tabIconBaseMap[route.name] ?? "home";
            const iconName = (
              focused ? iconBase : `${iconBase}-outline`
            ) as keyof typeof Ionicons.glyphMap;

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#FFD700",
          tabBarInactiveTintColor: "#a0a0a0",
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: "#1a2332",
              borderTopColor: "rgba(255, 215, 0, 0.2)",
              height: 60 + insets.bottom,
              paddingBottom: insets.bottom,
            },
          ],
          tabBarLabelStyle: styles.tabBarLabel,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Groups" component={GroupsScreen} />

        <Tab.Screen
          name="Scan"
          component={EmptyScanScreen}
          options={{
            tabBarLabel: () => null,
            tabBarButton: () => (
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => setScannerVisible(true)}
              >
                <View style={styles.scanButtonInner}>
                  <Ionicons name="scan" size={28} color="#0a1421" />
                </View>
              </TouchableOpacity>
            ),
          }}
        />

        <Tab.Screen name="Transactions" component={TransactionsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      {scannerVisible && (
        <BillScannerModal
          visible={scannerVisible}
          onClose={() => setScannerVisible(false)}
          onSaveBill={handleSaveBill}
        />
      )}
    </View>
  );
}

export default function AppNavigator() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on app start
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Listen to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null;

  return (
    <CurrencyProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Expenses" component={ExpensesScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Language" component={LanguageScreen} />
            <Stack.Screen name="Currency" component={CurrencyScreen} />
            <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
            <Stack.Screen name="Terms" component={TermsScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </CurrencyProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    paddingTop: 5,
    ...Platform.select({
      web: { position: "fixed", bottom: 0, width: "100%" },
    }),
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  scanButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    borderWidth: 4,
    borderColor: "#1a2332",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
});
