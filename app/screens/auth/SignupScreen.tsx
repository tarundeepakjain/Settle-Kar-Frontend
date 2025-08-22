import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();

  const handleSignup = () => {
    // Navigate to MainTabs after successful signup
    navigation.replace('MainTabs');
  };

  const handleBackToLogin = () => {
    // Navigate back to Login screen
    navigation.goBack();
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 px-6">
      <View className="w-full max-w-sm">
        <Text className="text-3xl font-bold text-center mb-8 text-gray-800">
          Create Account
        </Text>
        
        <View className="space-y-4">
          <TextInput
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            placeholder="Full Name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

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

          <TextInput
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            placeholder="Confirm Password"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          
          <TouchableOpacity
            className="bg-blue-500 py-3 px-4 rounded-lg mt-6"
            onPress={handleSignup}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3 px-4 rounded-lg"
            onPress={handleBackToLogin}
          >
            <Text className="text-blue-500 text-center font-semibold text-lg">
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
