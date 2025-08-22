import React from 'react';
import { Text, View } from 'react-native';

export default function GroupsScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-2xl font-bold text-gray-800">Groups Screen</Text>
      <Text className="text-gray-600 mt-2">Manage your groups here</Text>
    </View>
  );
}
