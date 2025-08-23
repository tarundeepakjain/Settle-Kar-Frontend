import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Balances({ groups }: { groups: any }) {

  function calculateBalances(group: any) {
    const members = group.members;
  
    // Step 1: Initialize everyone with balance = 0
    const netBalances: Record<string, number> = {};
    members.forEach((member: any) => {
      netBalances[member.id] = 0;
    });
  
    // Step 2: Loop over expenses and calculate
    group.expenses.forEach((expense: any) => {
      const splitAmount = expense.amount / expense.splitBetweenIds.length;
  
      // The person who paid gets credited
      netBalances[expense.paidById] += expense.amount;
  
      // Each person in splitBetweenIds owes their share
      expense.splitBetweenIds.forEach((personId: string) => {
        netBalances[personId] -= splitAmount;
      });
    });
  
    return netBalances;
  }

  const balances = calculateBalances(groups); // pass selected group

  return (
    <View style={styles.container}>
      {Object.entries(balances).map(([memberId, amount]) => {
        const member = groups.members.find((m: any) => m.id === memberId);
        return (
          <Text key={memberId} style={styles.text}>
            {member?.name} {amount > 0 ? `Gets ₹${amount.toFixed(2)}` : `Owes ₹${-amount.toFixed(2)}`}
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
