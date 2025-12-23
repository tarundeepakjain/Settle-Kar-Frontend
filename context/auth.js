import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";
import { useNavigation } from "@react-navigation/native";

const AuthContext = createContext(null);

export  const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Load user from AsyncStorage when app starts
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const savedUser = await AsyncStorage.getItem("user");

        if (token && savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.log("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Login function (reuse your API login)
  const login = async (email, password) => {
    try {
      const response = await API.post("/auth/login", { email, password });
      const { accessToken, refreshToken, user } = response.data;

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      navigation.navigate("MainTabs");
    } catch (error) {
      console.log(error.response?.data || error.message);
      throw new Error("Invalid email or password");
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
    setUser(null);
    navigation.replace("Login");
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook for easy usage
export const useAuth = () => useContext(AuthContext);
