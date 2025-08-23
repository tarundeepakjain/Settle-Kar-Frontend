import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './globals.css';
import AppNavigator from './navigation/AppNavigator';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
