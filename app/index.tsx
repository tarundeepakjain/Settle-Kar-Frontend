import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import AppNavigator from "./navigation/AppNavigator";
const linking = {
  prefixes: ["http://localhost:8081", "myapp://"], // your dev URL + optional deep link
  config: {
    screens: {
      Login: "login",
      Signup: "signup",
      MainTabs: {
        screens: {
          Home: "home",
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
    },
  },
};
export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
