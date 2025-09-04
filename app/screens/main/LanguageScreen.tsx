import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LanguageScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Language</Text>
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
