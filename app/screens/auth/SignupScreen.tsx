import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type RootStackParamList = {
  MainTabs: undefined;
  // Add other routes here if needed
};

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleSignup = () => {
    // Navigate to MainTabs after successful signup
    navigation.navigate('MainTabs');
  };

  const handleBackToLogin = () => {
    // Navigate back to Login screen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          Create Account
        </Text>
        
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
          >
            <Text style={styles.signupButtonText}>
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleBackToLogin}
          >
            <Text style={styles.loginButtonText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
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
  formContainer: {
    width: '100%',
    maxWidth: 384, // max-w-sm equivalent
  },
  title: {
    fontSize: 30, // text-3xl equivalent
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32, // mb-8 equivalent
    color: '#1f2937', // gray-800 equivalent
  },
  form: {
    gap: 16, // space-y-4 equivalent
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db', // gray-300 equivalent
    borderRadius: 8, // rounded-lg equivalent
    paddingHorizontal: 16, // px-4 equivalent
    paddingVertical: 12, // py-3 equivalent
    color: '#1f2937', // gray-800 equivalent
  },
  signupButton: {
    backgroundColor: '#3b82f6', // blue-500 equivalent
    paddingVertical: 12, // py-3 equivalent
    paddingHorizontal: 16, // px-4 equivalent
    borderRadius: 8, // rounded-lg equivalent
    marginTop: 24, // mt-6 equivalent
  },
  signupButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600', // font-semibold equivalent
    fontSize: 18, // text-lg equivalent
  },
  loginButton: {
    paddingVertical: 12, // py-3 equivalent
    paddingHorizontal: 16, // px-4 equivalent
    borderRadius: 8, // rounded-lg equivalent
  },
  loginButtonText: {
    color: '#3b82f6', // blue-500 equivalent
    textAlign: 'center',
    fontWeight: '600', // font-semibold equivalent
    fontSize: 18, // text-lg equivalent
  },
});
