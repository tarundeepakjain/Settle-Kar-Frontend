import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GroupDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { group } = route.params as { group: any };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{group?.name || 'Group Details'}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Group Name</Text>
          <Text style={styles.value}>{group?.name || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.label}>Group ID</Text>
          <Text style={styles.value}>{group?.id || 'N/A'}</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.label}>Members</Text>
          <Text style={styles.value}>{group?.members?.length || 0} members</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    marginRight: 20,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backButtonText: {
    fontSize: 17,
    color: '#3b82f6',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    letterSpacing: 0.5,
  },
  content: {
    padding: 24,
    paddingTop: 20,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  label: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 20,
    color: '#0f172a',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
