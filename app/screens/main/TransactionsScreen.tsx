import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TransactionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions Screen</Text>
      <Text style={styles.subtitle}>View your transaction history</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6', // gray-100 equivalent
  },
  title: {
    fontSize: 24, // text-2xl equivalent
    fontWeight: 'bold',
    color: '#1f2937', // gray-800 equivalent
  },
  subtitle: {
    color: '#4b5563', // gray-600 equivalent
    marginTop: 8, // mt-2 equivalent
  },
});
