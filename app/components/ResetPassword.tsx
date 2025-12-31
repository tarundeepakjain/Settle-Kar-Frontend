import React, { useState,useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { supabase } from '@/utils/supabase'
import * as Linking from 'expo-linking'
export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
useEffect(() => {
  const handleDeepLink = async ({ url }: { url: string }) => {
    const { queryParams } = Linking.parse(url)

    const access_token = Array.isArray(queryParams?.access_token) ? queryParams.access_token[0] : queryParams?.access_token
    const refresh_token = Array.isArray(queryParams?.refresh_token) ? queryParams.refresh_token[0] : queryParams?.refresh_token

    if (access_token && refresh_token) {
      await supabase.auth.setSession({
        access_token,
        refresh_token,
      })
    }
  }

  // Handle cold start
  Linking.getInitialURL().then((url) => {
    if (url) handleDeepLink({ url })
  })

  // Handle app already open
  const sub = Linking.addEventListener('url', handleDeepLink)

  return () => sub.remove()
}, [])
  const updatePassword = async () => {
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    if (password !== confirm) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      Alert.alert('Error', error.message)
    } else {
      Alert.alert('Success', 'Password updated successfully')
    }
  }

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>
        Set new password
      </Text>

      <TextInput
        placeholder="New password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Confirm password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={{ borderWidth: 1, padding: 12, marginBottom: 16 }}
      />

      <TouchableOpacity
        onPress={updatePassword}
        style={{
          backgroundColor: '#FFD700',
          padding: 14,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontWeight: 'bold' }}>
          Update password
        </Text>
      </TouchableOpacity>
    </View>
  )
}
