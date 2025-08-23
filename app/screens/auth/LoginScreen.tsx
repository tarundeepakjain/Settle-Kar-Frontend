import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          Welcome to SettleKar
        </Text>
        
        <View style={styles.form}>
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
          
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
          >
            <Text style={styles.signupButtonText}>
              Don't have an account? Sign up
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
  loginButton: {
    backgroundColor: '#3b82f6', // blue-500 equivalent
    paddingVertical: 12, // py-3 equivalent
    paddingHorizontal: 16, // px-4 equivalent
    borderRadius: 8, // rounded-lg equivalent
    marginTop: 24, // mt-6 equivalent
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600', // font-semibold equivalent
    fontSize: 18, // text-lg equivalent
  },
  signupButton: {
    paddingVertical: 12, // py-3 equivalent
    paddingHorizontal: 16, // px-4 equivalent
    borderRadius: 8, // rounded-lg equivalent
  },
  signupButtonText: {
    color: '#3b82f6', // blue-500 equivalent
    textAlign: 'center',
    fontWeight: '600', // font-semibold equivalent
    fontSize: 18, // text-lg equivalent
  },
});
