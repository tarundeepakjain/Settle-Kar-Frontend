import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Expense = {
  _id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
};

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const iconFloatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation for icons
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

    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://<YOUR_BACKEND_URL>/expenses");
      const data = await response.json();
      setExpenses(data);

      // Fade in animation after data loads
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFloatStyle = (delay: number) => ({
    transform: [
      {
        translateY: iconFloatAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10], // subtle movement
        }),
      },
    ],
    opacity: 0.25,
  });

  // Total expenses
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Category icons
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      Food: "restaurant",
      Transport: "car",
      Entertainment: "game-controller",
      Shopping: "cart",
      Bills: "receipt",
      Health: "fitness",
      Education: "school",
      Other: "ellipsis-horizontal",
    };
    return icons[category] || "pricetag";
  };

  const renderExpense = ({ item }: { item: Expense }) => (
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
      <View style={styles.cardHeader}>
        <View style={styles.categoryContainer}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={getCategoryIcon(item.category) as any}
              size={22}
              color="#FFD700"
            />
          </View>
          <View style={styles.categoryTextContainer}>
            <Text style={styles.category}>{item.category}</Text>
            <View style={styles.dateMeta}>
              <Ionicons name="calendar-outline" size={11} color="#a0a0a0" />
              <Text style={styles.date}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>₹{item.amount.toLocaleString()}</Text>
          <View style={styles.amountBadge}>
            <Text style={styles.amountBadgeText}>EXPENSE</Text>
          </View>
        </View>
      </View>

      {item.description && (
        <View style={styles.descriptionContainer}>
          <Ionicons name="document-text-outline" size={14} color="#a0a0a0" />
          <Text style={styles.desc}>{item.description}</Text>
        </View>
      )}
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.background}>
          <View style={styles.gradientOverlay} />
          <View style={[styles.orb, styles.orb1]}>
            <View style={styles.orbInner} />
          </View>
          <View style={[styles.orb, styles.orb2]}>
            <View style={styles.orbInner} />
          </View>
        </View>

        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading expenses...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            color="rgba(255, 215, 0, 0.6)"
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
            color="rgba(255, 107, 107, 0.6)"
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
            color="rgba(150, 255, 150, 0.5)"
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
          <Ionicons name="star" size={24} color="rgba(255, 215, 0, 0.7)" />
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingIcon,
            { left: "50%", top: "15%" },
            getFloatStyle(750),
          ]}
        >
          <Ionicons
            name="trending-down-outline"
            size={26}
            color="rgba(255, 100, 100, 0.5)"
          />
        </Animated.View>

        {/* Orbs */}
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
        <View style={styles.headerSection}>
          <Text style={styles.title}>Expenses</Text>
          <View style={styles.titleDivider} />
          <Text style={styles.subtitle}>Track your spending</Text>
        </View>

        {/* Summary Card */}
        <Animated.View style={[styles.summaryCard, { opacity: fadeAnim }]}>
          <View style={styles.summaryIconContainer}>
            <Ionicons name="trending-down" size={24} color="#FF6B6B" />
          </View>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={styles.summaryAmount}>
              ₹{totalExpenses.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryBadge}>
            <Text style={styles.summaryBadgeText}>{expenses.length}</Text>
          </View>
        </Animated.View>

        <View style={styles.listHeader}>
          <Text style={styles.listHeaderText}>All Expenses</Text>
          <View style={styles.listHeaderLine} />
        </View>

        <FlatList
          data={expenses}
          keyExtractor={(item) => item._id}
          renderItem={renderExpense}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="document-outline"
                size={64}
                color="rgba(255, 255, 255, 0.2)"
              />
              <Text style={styles.emptyText}>No expenses yet</Text>
              <Text style={styles.emptySubtext}>
                Start tracking your expenses
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

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
    backgroundColor: "#FF6B6B",
    top: "15%",
    left: "10%",
    opacity: 0.08,
  },
  orb2: {
    width: 240,
    height: 240,
    backgroundColor: "#FFD700",
    bottom: "20%",
    right: "15%",
    opacity: 0.06,
  },
  orb3: {
    width: 160,
    height: 160,
    backgroundColor: "#2e86de",
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    zIndex: 2,
  },
  loadingText: { color: "#a0a0a0", fontSize: 14, letterSpacing: 0.3 },
  headerSection: { alignItems: "center", marginBottom: 24 },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
    textShadowColor: "rgba(255, 215, 0, 0.3)",
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
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.25)",
    gap: 16,
  },
  summaryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
  },
  summaryContent: { flex: 1 },
  summaryLabel: {
    fontSize: 13,
    color: "#a0a0a0",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FF6B6B",
    letterSpacing: 0.5,
  },
  summaryBadge: {
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
  },
  summaryBadgeText: { fontSize: 16, fontWeight: "700", color: "#FF6B6B" },
  listHeader: { marginBottom: 16 },
  listHeaderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  listHeaderLine: {
    height: 2,
    backgroundColor: "rgba(255, 215, 0, 0.3)",
    borderRadius: 1,
  },
  listContent: { paddingBottom: 20 },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  categoryTextContainer: { flex: 1 },
  category: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  dateMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  date: { fontSize: 12, color: "#a0a0a0", letterSpacing: 0.2 },
  amountContainer: { alignItems: "flex-end" },
  amount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF6B6B",
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  amountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "rgba(255, 107, 107, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
  },
  amountBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FF6B6B",
    letterSpacing: 0.5,
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  desc: {
    flex: 1,
    fontSize: 14,
    color: "#a0a0a0",
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.4)",
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: { fontSize: 14, color: "rgba(255, 255, 255, 0.3)" },
});
