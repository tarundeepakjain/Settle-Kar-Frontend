import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  SafeAreaView,
  Platform,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode} from "jwt-decode";
interface MyJwtPayload {
  name: string;
  email: string;
  id: string;
  exp?: number;
}
export default function TransactionsScreen() {
  const iconFloatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Floating background animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconFloatAnim, {
          toValue: 1,
          duration: 5000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(iconFloatAnim, {
          toValue: 0,
          duration: 5000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [iconFloatAnim]);

  // ✅ Fetch real data from backend

 const getUserFromToken = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) return null;

    const decoded = jwtDecode<MyJwtPayload>(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
 const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) return null;

      const response = await fetch("https://settlekar.onrender.com/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        console.warn("Failed to refresh access token");
        return null;
      }

      const data = await response.json();
      await AsyncStorage.setItem("accessToken", data.accessToken);
      console.log("🔄 Access token refreshed successfully!");
      return data.accessToken;
    } catch (err) {
      console.error("Error refreshing token:", err);
      return null;
    }
  };

  // 🔹 Verify token expiry
  const isTokenExpired = (decoded: MyJwtPayload) => {
    if (!decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  };
    const fetchTransactions = async () => {
      try {
        let token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          Alert.alert("Session Expired", "Please log in again.");
          return;
        }
        let decoded = jwtDecode<MyJwtPayload>(token);
            
                  while(isTokenExpired(decoded)) {
                    console.log("⚠️ Access token expired, refreshing...");
                    const newToken = await refreshAccessToken();
                    if (!newToken) {
                      console.log("❌ Failed to refresh token, logging out...");
                      
                      return;
                    }
                    token = newToken;
                    decoded = jwtDecode<MyJwtPayload>(token);
                  }
          
        const res = await fetch("https://settlekar.onrender.com/auth/transaction", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Fetch failed:", res.status, res.statusText);
          throw new Error(`Server Error: ${res.status}`);
        }

        const json = await res.json();
        console.log("Transactions fetched:", json);

        if (json.transactions) {
          const mapped = json.transactions.map((t: any, i: number) => ({
            id: i.toString(),
            kind:t.type,
            title: t.title || "Unknown",
            amount: t.amount<0?t.amount*(-1):t.amount,
            date: new Date(t.date).toLocaleDateString(),
            type: t.amount < 0 ? "credit" : "debit",
            category: t.category || "General",
          }));
          setData(mapped);
        } else setData([]);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        Alert.alert("Error", "Unable to fetch transactions.");
        setData([]);
      } finally {
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }
    };
  useEffect(() => {
    fetchTransactions();
  }, []);

  const getFloatStyle = () => ({
    transform: [
      {
        translateY: iconFloatAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
    opacity: 0.25,
  });

  const totals = data.reduce(
    (acc, item) => {
      if (item.type === "credit") acc.income += item.amount;
      else acc.expense += Math.abs(item.amount);
      return acc;
    },
    { income: 0, expense: 0 }
  );
  const onRefresh = async () => {
  setRefreshing(true);
  await fetchTransactions();
  setRefreshing(false);
};
  const balance = totals.income - totals.expense;

  return (
    <View style={styles.container}>
      {/* Floating background icons */}
      <View style={styles.background}>
        <Animated.View
          style={[styles.floatingIcon, { left: "10%", top: "25%" }, getFloatStyle()]}
        >
          <Ionicons name="wallet-outline" size={32} color="rgba(255,215,0,0.25)" />
        </Animated.View>
        <Animated.View
          style={[styles.floatingIcon, { right: "15%", top: "20%" }, getFloatStyle()]}
        >
          <Ionicons name="cash-outline" size={28} color="rgba(100,200,255,0.25)" />
        </Animated.View>
        <Animated.View
          style={[styles.floatingIcon, { left: "15%", bottom: "20%" }, getFloatStyle()]}
        >
          <Ionicons name="receipt-outline" size={30} color="rgba(150,255,150,0.2)" />
        </Animated.View>
      </View>

      <SafeAreaView style={styles.contentWrapper}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Transactions</Text>
          <View style={styles.titleDivider} />
          <Text style={styles.subtitle}>Your complete history</Text>
        </View>

        {/* Totals */}
        {!loading && (
          <Animated.View style={[styles.balanceContainer, { opacity: fadeAnim }]}>
            <View style={styles.balanceCard}>
              <Ionicons name="trending-up" size={20} color="#96E6A1" />
              <Text style={styles.balanceLabel}>Income</Text>
              <Text style={styles.balanceAmount}>₹{totals.income.toLocaleString()}</Text>
            </View>

            <View style={[styles.balanceCard, styles.balanceCardCenter]}>
              <Ionicons name="wallet" size={20} color="#FFD700" />
              <Text style={styles.balanceLabel}>Balance</Text>
              <Text style={[styles.balanceAmount, styles.balanceAmountLarge]}>
                ₹{balance.toLocaleString()}
              </Text>
            </View>

            <View style={styles.balanceCard}>
              <Ionicons name="trending-down" size={20} color="#FF6B6B" />
              <Text style={styles.balanceLabel}>Expense</Text>
              <Text style={styles.balanceAmount}>₹{totals.expense.toLocaleString()}</Text>
            </View>
          </Animated.View>
        )}

        {/* List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>Loading transactions...</Text>
          </View>
        ) : data.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="document-text-outline" size={40} color="#a0a0a0" />
            <Text style={styles.loadingText}>No transactions found</Text>
          </View>
        ) : (
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
           <FlatList
  data={data}
  keyExtractor={(item) => item.id}
  contentContainerStyle={styles.listContent}
  refreshing={refreshing}       // 🔹 REQUIRED
  onRefresh={onRefresh}         // 🔹 REQUIRED
  showsVerticalScrollIndicator={false}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <View
        style={[
          styles.cardIconContainer,
          item.type === "credit"
            ? styles.cardIconCredit
            : styles.cardIconDebit,
        ]}
      >
                    <Ionicons
                      name={item.type === "debit" ? "arrow-down" : "arrow-up"}
                      size={20}
                      color={item.type === "debit" ? "#FF6B6B" : "#96E6A1"}
                    />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <View style={styles.cardMeta}>
                
                      <Text style={styles.cardSubtitle}>{item.date}</Text>
                      <Text style={styles.cardCategory}> •{item.kind}</Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.amount,
                      { color: item.type === "credit" ? "#96E6A1" : "#FF6B6B" },
                    ]}
                  >
                    {item.type === "credit"
                      ? `+₹${item.amount}`
                      : `-₹${Math.abs(item.amount)}`}
                  </Text>
                </View>
              )}
            />
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
}

// ✨ Styles (unchanged from your design)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a1421" },
  background: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
  floatingIcon: { position: "absolute" },
  contentWrapper: { flex: 1, paddingHorizontal: 20, paddingTop: 60 },
  headerSection: { alignItems: "center", marginBottom: 24 },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(255,215,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  titleDivider: {
    width: 60,
    height: 3,
    backgroundColor: "#FFD700",
    borderRadius: 2,
    marginVertical: 8,
  },
  subtitle: { color: "#a0a0a0", fontSize: 14 },
  balanceContainer: { flexDirection: "row", gap: 12, marginBottom: 24 },
  balanceCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  balanceCardCenter: {
    backgroundColor: "rgba(255,215,0,0.1)",
    borderColor: "rgba(255,215,0,0.3)",
  },
  balanceLabel: { fontSize: 11, color: "#a0a0a0", marginTop: 6 },
  balanceAmount: { fontSize: 16, fontWeight: "700", color: "#fff" },
  balanceAmountLarge: { color: "#FFD700" },
  listContent: { paddingBottom: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: 12,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  cardIconCredit: {
    backgroundColor: "rgba(150,230,161,0.15)",
    borderColor: "rgba(150,230,161,0.3)",
  },
  cardIconDebit: {
    backgroundColor: "rgba(255,107,107,0.15)",
    borderColor: "rgba(255,107,107,0.3)",
  },
  cardContent: { flex: 1 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "600", marginBottom: 4 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  cardSubtitle: { color: "#a0a0a0", fontSize: 12 },
  cardCategory: { color: "#a0a0a0", fontSize: 12 },
  amount: { fontSize: 17, fontWeight: "700" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#a0a0a0", marginTop: 10 },
});
