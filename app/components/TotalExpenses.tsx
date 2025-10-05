import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TotalExpensesProps {
  expenses: any[];
}

export default function TotalExpenses({ expenses }: TotalExpensesProps) {
  // Calculate total amount of all expenses
  const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total Expenses</Text>
      <Text style={styles.amount}>₹{totalAmount.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#34d399",
  },
});
