import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
    <View className="flex-1 justify-center items-center bg-gray-100 px-6">
      <View className="w-full max-w-sm">
        <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
          Profile Screen
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Manage your profile settings
        </Text>
        
        <TouchableOpacity
          className="bg-red-500 py-3 px-4 rounded-lg"
          onPress={handleLogout}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
