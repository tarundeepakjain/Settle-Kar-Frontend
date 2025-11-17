import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
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
  const [scannerVisible, setScannerVisible] = useState(false);

  const iconFloatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // ⭐️ REMOVED: fabScaleAnim is no longer needed
  // const fabScaleAnim = useRef(new Animated.Value(1)).current;

  const fetchExpenses = useCallback(async () => {
    try {
      // ⚠️ Make sure to replace <YOUR_BACKEND_URL> with your actual API URL
      const response = await fetch("http://<YOUR_BACKEND_URL>/expenses");
      const data = await response.json();
      setExpenses(data);
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
  }, [fadeAnim]);

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

    fetchExpenses();
  }, [iconFloatAnim, fetchExpenses]);


  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

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

  // ⭐️ REMOVED: animateFab function is no longer needed here
  
  // Handle OCR success
  const handleSaveBill = (billData: any) => {
    const newExpense: Expense = {
      _id: billData.id || Date.now().toString(),
      category: billData.category || "Other",
      amount: billData.amount || 0,
      description: billData.description || "Scanned from bill",
      date: billData.timestamp || new Date().toISOString(),
    };
    console.log("Adding new expense:", newExpense);
    setExpenses([newExpense, ...expenses]);
    setScannerVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={{ color: "#a0a0a0", marginTop: 12 }}>
          Loading expenses...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.contentWrapper}>
        <Text style={styles.title}>Expenses</Text>

        {/* Total Expenses */}
        <Animated.View style={[styles.summaryCard, { opacity: fadeAnim }]}>
          <Ionicons name="trending-down" size={24} color="#FF6B6B" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={styles.summaryAmount}>
              ₹{totalExpenses.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryBadge}>
            <Text style={styles.summaryBadgeText}>{expenses.length}</Text>
          </View>
        </Animated.View>

        <FlatList
          data={expenses}
          keyExtractor={(item) => item._id}
          renderItem={renderExpense}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Ionicons
                name="document-outline"
                size={64}
                color="rgba(255,255,255,0.2)"
              />
              <Text style={{ color: "#fff", marginTop: 16 }}>
                No expenses yet
              </Text>
            </View>
          }
        />
      </SafeAreaView>

      {/* ⭐️ REMOVED: The FAB (Animated.View) that was here is now gone. */}

      {/* ⭐️ MOVED: The BillScannerModal is now controlled by the Tab Navigator */}
      {/* {scannerVisible && (
        <BillScannerModal
          visible={scannerVisible}
          onClose={() => setScannerVisible(false)}
          onSaveBill={handleSaveBill}
        />
      )} 
      */}
    </View>
  );
}

// =================== STYLES ===================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a1421" },
  contentWrapper: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFD700",
    marginBottom: 20,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,107,107,0.1)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.25)",
  },
  summaryLabel: { color: "#a0a0a0", fontSize: 12 },
  summaryAmount: { fontSize: 22, fontWeight: "700", color: "#FF6B6B" },
  summaryBadge: {
    backgroundColor: "rgba(255,107,107,0.2)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  summaryBadgeText: { color: "#FF6B6B", fontWeight: "700" },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  categoryContainer: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,215,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryTextContainer: {},
  category: { color: "#fff", fontWeight: "600" },
  dateMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  date: { fontSize: 12, color: "#a0a0a0" },
  amountContainer: { alignItems: "flex-end" },
  amount: { color: "#FF6B6B", fontWeight: "700", fontSize: 16 },
  amountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "rgba(255,107,107,0.15)",
  },
  amountBadgeText: { color: "#FF6B6B", fontWeight: "700", fontSize: 10 },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  desc: { color: "#a0a0a0", fontSize: 14, flex: 1 },
});