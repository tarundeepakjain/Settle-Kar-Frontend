import React from 'react';
import { Text, View } from 'react-native';

export default function TransactionsScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-2xl font-bold text-gray-800">Transactions Screen</Text>
      <Text className="text-gray-600 mt-2">View your transaction history</Text>
    </View>
  );
}
