import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Navigate back to Login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Profile Screen
        </Text>
        <Text style={styles.subtitle}>
          Manage your profile settings
        </Text>
        
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6', // gray-100 equivalent
    paddingHorizontal: 24, // px-6 equivalent
  },
  contentContainer: {
    width: '100%',
    maxWidth: 384, // max-w-sm equivalent
  },
  title: {
    fontSize: 24, // text-2xl equivalent
    fontWeight: 'bold',
    color: '#1f2937', // gray-800 equivalent
    textAlign: 'center',
    marginBottom: 16, // mb-4 equivalent
  },
  subtitle: {
    color: '#4b5563', // gray-600 equivalent
    textAlign: 'center',
    marginBottom: 32, // mb-8 equivalent
  },
  logoutButton: {
    backgroundColor: '#ef4444', // red-500 equivalent
    paddingVertical: 12, // py-3 equivalent
    paddingHorizontal: 16, // px-4 equivalent
    borderRadius: 8, // rounded-lg equivalent
  },
  logoutButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600', // font-semibold equivalent
    fontSize: 18, // text-lg equivalent
  },
});
