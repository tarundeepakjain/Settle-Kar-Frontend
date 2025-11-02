import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ExpenseProps {
  title?: string;
  amount?: number | string;
  paidBy?: string;
}

export default function Expenses({ title = "Untitled", amount = 0, paidBy = "Unknown" }: ExpenseProps) {
  // ✅ Convert safely to number
  const numericAmount = Number(amount) || 0;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Left Side (Title + Paid By) */}
        <View style={styles.leftSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.paidBy}>Paid by {paidBy}</Text>
        </View>

        {/* Right Side (Amount) */}
        <Text style={styles.amount}>₹{numericAmount.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "column",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#040101ff",
  },
  paidBy: {
    fontSize: 12,
    color: "#757575",
    marginTop: 2,
  },
  amount: {
    fontSize: 19,
    color: "#0a1005ff",
    textAlign: "right",
  },
});
