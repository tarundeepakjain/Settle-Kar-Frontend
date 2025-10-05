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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const fetchTransactions = async () => {
  return Promise.resolve([
    {
      id: "t1",
      title: "Dinner",
      amount: 500,
      date: "2025-10-05",
      type: "debit",
      category: "Food",
    },
    {
      id: "t2",
      title: "Salary",
      amount: 20000,
      date: "2025-10-01",
      type: "credit",
      category: "Income",
    },
    {
      id: "t3",
      title: "Movie",
      amount: 300,
      date: "2025-09-28",
      type: "debit",
      category: "Entertainment",
    },
    {
      id: "t4",
      title: "Groceries",
      amount: 1200,
      date: "2025-09-27",
      type: "debit",
      category: "Food",
    },
    {
      id: "t5",
      title: "Freelance Work",
      amount: 5000,
      date: "2025-09-25",
      type: "credit",
      category: "Income",
    },
  ]);
};

export default function TransactionsScreen() {
  const iconFloatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Gentle floating animation loop
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

  // Fetch mock data
  useEffect(() => {
    fetchTransactions().then((res) => {
      setData(res);
      setLoading(false);

      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const getFloatStyle = (delay: number) => ({
    transform: [
      {
        translateY: iconFloatAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10], // smaller movement
        }),
      },
    ],
    opacity: 0.25, // subtle icons
  });

  const totals = data.reduce(
    (acc, item) => {
      if (item.type === "credit") acc.income += item.amount;
      else acc.expense += item.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );
  const balance = totals.income - totals.expense;

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.background}>
        <View style={styles.gradientOverlay} />

        {/* Floating Icons */}
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
            color="rgba(255, 215, 0, 0.25)"
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
            color="rgba(100, 200, 255, 0.25)"
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
            name="receipt-outline"
            size={30}
            color="rgba(150, 255, 150, 0.2)"
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
          <Ionicons name="star" size={24} color="rgba(255, 215, 0, 0.25)" />
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingIcon,
            { left: "50%", top: "15%" },
            getFloatStyle(750),
          ]}
        >
          <Ionicons
            name="trending-up-outline"
            size={26}
            color="rgba(255, 100, 200, 0.2)"
          />
        </Animated.View>

        {/* Faint Orbs */}
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

      <SafeAreaView style={styles.contentWrapper}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Transactions</Text>
          <View style={styles.titleDivider} />
          <Text style={styles.subtitle}>View your transaction history</Text>
        </View>

        {/* Balance Cards */}
        {!loading && (
          <Animated.View
            style={[styles.balanceContainer, { opacity: fadeAnim }]}
          >
            <View style={styles.balanceCard}>
              <View style={styles.balanceIconContainer}>
                <Ionicons name="trending-up" size={20} color="#96E6A1" />
              </View>
              <Text style={styles.balanceLabel}>Income</Text>
              <Text style={styles.balanceAmount}>
                ₹{totals.income.toLocaleString()}
              </Text>
            </View>

            <View style={[styles.balanceCard, styles.balanceCardCenter]}>
              <View
                style={[styles.balanceIconContainer, styles.balanceIconGold]}
              >
                <Ionicons name="wallet" size={20} color="#FFD700" />
              </View>
              <Text style={styles.balanceLabel}>Balance</Text>
              <Text style={[styles.balanceAmount, styles.balanceAmountLarge]}>
                ₹{balance.toLocaleString()}
              </Text>
            </View>

            <View style={styles.balanceCard}>
              <View
                style={[styles.balanceIconContainer, styles.balanceIconRed]}
              >
                <Ionicons name="trending-down" size={20} color="#FF6B6B" />
              </View>
              <Text style={styles.balanceLabel}>Expense</Text>
              <Text style={styles.balanceAmount}>
                ₹{totals.expense.toLocaleString()}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Transactions List */}
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>Recent Activity</Text>
          <View style={styles.listHeaderBadge}>
            <Text style={styles.listHeaderBadgeText}>{data.length}</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>Loading transactions...</Text>
          </View>
        ) : (
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Animated.View
                  style={[
                    styles.card,
                    {
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.cardIconContainer,
                      item.type === "credit"
                        ? styles.cardIconCredit
                        : styles.cardIconDebit,
                    ]}
                  >
                    <Ionicons
                      name={item.type === "credit" ? "arrow-down" : "arrow-up"}
                      size={20}
                      color={item.type === "credit" ? "#96E6A1" : "#FF6B6B"}
                    />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <View style={styles.cardMeta}>
                      <Ionicons
                        name="calendar-outline"
                        size={12}
                        color="#a0a0a0"
                      />
                      <Text style={styles.cardSubtitle}>{item.date}</Text>
                      {item.category && (
                        <>
                          <View style={styles.cardMetaDot} />
                          <Text style={styles.cardCategory}>
                            {item.category}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                  <View style={styles.cardAmountContainer}>
                    <Text
                      style={[
                        styles.amount,
                        {
                          color: item.type === "credit" ? "#96E6A1" : "#FF6B6B",
                        },
                      ]}
                    >
                      {item.type === "credit" ? "+" : "-"}₹
                      {item.amount.toLocaleString()}
                    </Text>
                    <View
                      style={[
                        styles.amountBadge,
                        item.type === "credit"
                          ? styles.amountBadgeCredit
                          : styles.amountBadgeDebit,
                      ]}
                    >
                      <Text
                        style={[
                          styles.amountBadgeText,
                          item.type === "credit"
                            ? styles.amountBadgeTextCredit
                            : styles.amountBadgeTextDebit,
                        ]}
                      >
                        {item.type === "credit" ? "IN" : "OUT"}
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              )}
            />
          </Animated.View>
        )}
      </SafeAreaView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a1421" },
  background: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  floatingIcon: { position: "absolute" },
  iconGlow: {
    ...Platform.select({
      ios: {
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  orb: { position: "absolute", borderRadius: 9999 },
  orb1: {
    width: 200,
    height: 200,
    backgroundColor: "#FFD700",
    top: "15%",
    left: "10%",
    opacity: 0.08,
  },
  orb2: {
    width: 240,
    height: 240,
    backgroundColor: "#2e86de",
    bottom: "20%",
    right: "15%",
    opacity: 0.06,
  },
  orb3: {
    width: 160,
    height: 160,
    backgroundColor: "#96E6A1",
    top: "60%",
    left: "60%",
    opacity: 0.05,
  },
  orbInner: {
    width: "100%",
    height: "100%",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    position: "relative",
    zIndex: 1,
  },
  headerSection: { alignItems: "center", marginBottom: 24 },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
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
  subtitle: { color: "#a0a0a0", fontSize: 14, letterSpacing: 0.3 },
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
  balanceIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(150,230,161,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  balanceIconGold: { backgroundColor: "rgba(255,215,0,0.2)" },
  balanceIconRed: { backgroundColor: "rgba(255,107,107,0.2)" },
  balanceLabel: {
    fontSize: 11,
    color: "#a0a0a0",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  balanceAmount: { fontSize: 16, fontWeight: "700", color: "#fff" },
  balanceAmountLarge: { fontSize: 18, color: "#FFD700" },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  listHeaderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  listHeaderBadge: {
    backgroundColor: "rgba(255,215,0,0.2)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.3)",
  },
  listHeaderBadgeText: { fontSize: 12, fontWeight: "700", color: "#FFD700" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: { color: "#a0a0a0", fontSize: 14, letterSpacing: 0.3 },
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
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardSubtitle: { color: "#a0a0a0", fontSize: 12, letterSpacing: 0.2 },
  cardMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#a0a0a0",
  },
  cardCategory: { color: "#a0a0a0", fontSize: 12, letterSpacing: 0.2 },
  cardAmountContainer: { alignItems: "flex-end" },
  amount: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  amountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  amountBadgeCredit: {
    backgroundColor: "rgba(150,230,161,0.15)",
    borderColor: "rgba(150,230,161,0.3)",
  },
  amountBadgeDebit: {
    backgroundColor: "rgba(255,107,107,0.15)",
    borderColor: "rgba(255,107,107,0.3)",
  },
  amountBadgeText: { fontSize: 9, fontWeight: "700", letterSpacing: 0.5 },
  amountBadgeTextCredit: { color: "#96E6A1" },
  amountBadgeTextDebit: { color: "#FF6B6B" },
});
