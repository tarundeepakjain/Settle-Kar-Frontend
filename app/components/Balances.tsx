import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Balances({ group }: { group: any }) {
  function calculateBalances(group: any) {
    const members = group.members;

    const netBalances: Record<string, number> = {};
    members.forEach((member: any) => {
      netBalances[member.id] = 0;
    });

    group.expenses.forEach((expense: any) => {
      const splitAmount = expense.amount / expense.splitBetweenIds.length;

      // Add full amount to payer
      netBalances[expense.paidById] += expense.amount;

      // Subtract split amount from each participant
      expense.splitBetweenIds.forEach((personId: string) => {
        netBalances[personId] -= splitAmount;
      });
    });

    return netBalances;
  }

  const balances = calculateBalances(group);

  return (
    <View style={styles.container}>
      {Object.entries(balances).map(([memberId, amount]) => {
        const member = group.members.find((m: any) => m.id === memberId);
        return (
          <Text key={memberId} style={styles.text}>
            {member?.name}{" "}
            {amount > 0
              ? `Gets ₹${amount.toFixed(2)}`
              : amount < 0
              ? `Owes ₹${(-amount).toFixed(2)}`
              : "is Settled"}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});
