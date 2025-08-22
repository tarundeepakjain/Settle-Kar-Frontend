import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = () => {
    // Navigate to MainTabs after successful login
    navigation.replace('MainTabs');
  };

  const handleSignup = () => {
    // Navigate to Signup screen
    navigation.navigate('Signup');
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 px-6">
      <View className="w-full max-w-sm">
        <Text className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome to SettleKar
        </Text>
        
        <View className="space-y-4">
          <TextInput
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            placeholder="Enter Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            placeholder="Enter Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity
            className="bg-blue-500 py-3 px-4 rounded-lg mt-6"
            onPress={handleLogin}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3 px-4 rounded-lg"
            onPress={handleSignup}
          >
            <Text className="text-blue-500 text-center font-semibold text-lg">
              Don't have an account? Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
