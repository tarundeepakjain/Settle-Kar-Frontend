// AppNavigator.tsx
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";

// Main App Screens
import ExpensesScreen from "../screens/main/ExpensesScreen";
import GroupDetailsScreen from "../screens/main/GroupDetailsScreen";
import GroupsScreen from "../screens/main/GroupsScreen";
import HomeScreen from "../screens/main/HomeScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import TransactionsScreen from "../screens/main/TransactionsScreen";
import SettingsScreen from "../screens/main/SettingScreen";
import LanguageScreen from "../screens/main/LanguageScreen";
import CurrencyScreen from "../screens/main/CurrencyScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Toggle to bypass auth in dev
const SKIP_AUTH = true;

// Bottom Tabs Navigator
function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Groups":
              iconName = focused ? "people" : "people-outline";
              break;
            case "Expenses":
              iconName = focused ? "cash" : "cash-outline";
              break;
            case "Transactions":
              iconName = focused ? "swap-horizontal" : "swap-horizontal-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "home-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "gray",
        headerShown: true,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: "Home" }} />
      <Tab.Screen name="Groups" component={GroupsScreen} options={{ tabBarLabel: "Groups" }} />
      <Tab.Screen name="Expenses" component={ExpensesScreen} options={{ tabBarLabel: "Expenses" }} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} options={{ tabBarLabel: "Transactions" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: "Profile" }} />
    </Tab.Navigator>
  );
}

// Main App Stack Navigator
export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={SKIP_AUTH ? "MainTabs" : "Login"}
      screenOptions={{ headerShown: true }}
    >
      {/* Auth Screens */}
      {!SKIP_AUTH && <Stack.Screen name="Login" component={LoginScreen} />}
      {!SKIP_AUTH && <Stack.Screen name="Signup" component={SignupScreen} />}

      {/* Main App */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }} // hide header for tabs
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="Currency" component={CurrencyScreen} />
      <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 5,
    ...Platform.select({
      web: { position: "fixed", bottom: 0, width: "100%" },
    }),
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});
