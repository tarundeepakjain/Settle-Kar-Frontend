import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GroupList from './GroupList';

export default function GroupsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Groups</Text>
      </View>
      <GroupList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // gray-100 equivalent
  },
  header: {
    paddingTop: 60, // Safe area for status bar and navigation
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937', // gray-800 equivalent
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#4b5563', // gray-600 equivalent
    marginTop: 8, // mt-2 equivalent
  },
});
