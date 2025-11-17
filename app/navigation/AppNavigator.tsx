import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react"; // ⭐️ NEW: Import useState
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native"; // ⭐️ NEW: Import View, TouchableOpacity, Alert
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

// ⭐️ NEW: Import the modal
import BillScannerModal from "../components/BillScannerModal";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Toggle to bypass auth in dev
const SKIP_AUTH = false;

// A map to store the base icon name for each route
const tabIconBaseMap: { [key: string]: string } = {
  Home: "home",
  Groups: "people",
  // Expenses: "cash", // No longer needed in tab map
  Transactions: "swap-horizontal",
  Profile: "person",
};

// ⭐️ NEW: A dummy component that does nothing, used as a placeholder for the scan button
const EmptyScanScreen = () => null;

// Bottom Tabs Navigator
function MainTabs() {
  const insets = useSafeAreaInsets();

  // ⭐️ NEW: Lifted state for the scanner modal
  const [scannerVisible, setScannerVisible] = useState(false);

  // ⭐️ NEW: Lifted handler for saving the bill
  const handleSaveBill = (billData: any) => {
    // The BillScannerModal already handles the API call and success alert.
    // We just need to close the modal here.
    // In a global state setup (Context/Redux), you might dispatch an action here
    // to refresh the expenses list on the ExpensesScreen.
    console.log("Bill saved, closing modal.", billData);
    setScannerVisible(false);

    // Optional: You could show an alert here instead of in the modal
    // Alert.alert("Success", "Bill saved successfully!");
  };

  return (
    // ⭐️ NEW: Wrap in a View to allow modal to render as a sibling
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
          // ⭐️ UPDATED: Tab bar styling to match your dark theme
          tabBarActiveTintColor: "#FFD700", // Gold
          tabBarInactiveTintColor: "#a0a0a0", // Gray
          headerShown: false, // ⭐️ CHANGED: Hide headers for tab screens
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: "#1a2332", // Dark blue
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
        
        {/* ⭐️ NEW: Custom Scan Button */}
        <Tab.Screen
          name="Scan"
          component={EmptyScanScreen} // Use dummy component
          options={{
            tabBarLabel: () => null, // No text
            tabBarButton: (props) => (
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => setScannerVisible(true)} // Open modal on press
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
        
        {/* ⭐️ REMOVED: The Expenses tab is no longer here */}
        {/* <Tab.Screen name="Expenses" component={ExpensesScreen} /> */}

      </Tab.Navigator>

      {/* ⭐️ NEW: Render the modal here, over the entire Tab Navigator */}
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

// Main App Stack Navigator
export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={SKIP_AUTH ? "MainTabs" : "Login"}
    >
      {/* Auth Screens (Grouped for clarity) */}
      {!SKIP_AUTH && (
        <Stack.Group screenOptions={{ headerShown: false }}>
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
        {/* ⭐️ ADDED: ExpensesScreen is now a stack screen, not a tab */}
        <Stack.Screen name="Expenses" component={ExpensesScreen} /> 
        
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
    // backgroundColor: "white", // Replaced by inline style
    borderTopWidth: 1,
    // borderTopColor: "#e5e7eb", // Replaced by inline style
    paddingTop: 5,
    ...Platform.select({
      web: { position: "fixed", bottom: 0, width: "100%" },
    }),
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  // ⭐️ NEW: Styles for the custom scan button
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
    marginTop: -20, // Lifts the button up
    borderWidth: 4,
    borderColor: "#1a2332", // Matches new tab bar color
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
});