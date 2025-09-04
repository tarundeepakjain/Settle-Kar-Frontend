import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CurrencyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a1421',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});
