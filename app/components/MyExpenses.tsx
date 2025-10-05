import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface MyExpensesProps {
  expenses: any[];
  currentUserId: string;
}

export default function MyExpenses({ expenses, currentUserId }: MyExpensesProps) {
  // Calculate total amount the user owes after splitting
  let totalOwed = 0;
  
  expenses.forEach(expense => {
    if (expense.splitBetweenIds && expense.splitBetweenIds.includes(currentUserId)) {
      const splitAmount = expense.amount / expense.splitBetweenIds.length;
      totalOwed += splitAmount;
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Expenses</Text>
      <Text style={styles.amount}>₹{totalOwed.toFixed(2)}</Text>
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
    color: "#2e86de",
  },
});
