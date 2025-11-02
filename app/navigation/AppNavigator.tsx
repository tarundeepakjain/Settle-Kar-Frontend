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
const SKIP_AUTH = false;

// A map to store the base icon name for each route
const tabIconBaseMap: { [key: string]: string } = {
  Home: "home",
  Groups: "people",
  Expenses: "cash",
  Transactions: "swap-horizontal",
  Profile: "person",
};

// Bottom Tabs Navigator
function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // Use the map to get the base icon name, defaulting to 'home'
          const iconBase = tabIconBaseMap[route.name] ?? "home";
          // Append '-outline' if the tab is not focused
          const iconName = (
            focused ? iconBase : `${iconBase}-outline`
          ) as keyof typeof Ionicons.glyphMap;

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
      {/* REMOVED: options={{ tabBarLabel: "..." }}
        WHY: The 'name' prop is used as the default label,
             so this prop was redundant.
      */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Groups" component={GroupsScreen} />
      <Tab.Screen name="Expenses" component={ExpensesScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main App Stack Navigator
export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={SKIP_AUTH ? "MainTabs" : "Login"}
      // REMOVED: screenOptions={{ headerShown: true }}
      // WHY: This is the default for Native Stack, so it's not needed.
    >
      {/* Auth Screens (Grouped for clarity) */}
      {!SKIP_AUTH && (
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Group>
      )}

      {/* Main App */}
      <Stack.Group>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }} // hide header for tabs
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="Currency" component={CurrencyScreen} />
        <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
      </Stack.Group>
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
