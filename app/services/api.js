import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "https://settlekar.onrender.com",
  withCredentials: true,
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.log("❌ No refresh token found");
          await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
          return Promise.reject(error);
        }

        // 🔄 Use POST and send refresh token in body
        const res = await axios.post(
          "https://settlekar.onrender.com/auth/refresh",
          { refreshToken },
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;
        if (newToken) {
          await AsyncStorage.setItem("accessToken", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return API(originalRequest);
        } else {
          console.log("❌ No access token in refresh response");
        }
      } catch (err) {
        console.log("❌ Token refresh failed:", err.message);
        await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
