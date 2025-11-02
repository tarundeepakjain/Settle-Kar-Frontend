import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Text } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import * as Linking from "expo-linking";

const linking = {
  // Use Linking.createURL to be more platform-agnostic
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Login: "login",
      Signup: "signup",
      MainTabs: {
        path: "/",
        screens: {
          // Home: "home", // This is false relative path
          Groups: "groups",
          Expenses: "expenses",
          Transactions: "transactions",
          Profile: "profile",
        },
      },
      Settings: "settings",
      Language: "language",
      Currency: "currency",
      GroupDetails: "group-details",
      NotFound: "*",
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <AppNavigator />
    </NavigationContainer>
  );
}
