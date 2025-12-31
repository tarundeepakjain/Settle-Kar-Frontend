import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { supabase } from '@/utils/supabase'
import * as Linking from 'expo-linking'

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const sendResetLink = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: Linking.createURL('/reset-password'),
    })

    setLoading(false)

    if (error) {
      Alert.alert('Error', error.message)
    } else {
      Alert.alert(
        'Check your email',
        'We sent you a password reset link'
      )
    }
  }

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>
        Reset your password
      </Text>

      <TextInput
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />

      <TouchableOpacity
        onPress={sendResetLink}
        disabled={loading}
        style={{
          backgroundColor: '#FFD700',
          padding: 14,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ fontWeight: 'bold' }}>
          Send reset link
        </Text>
      </TouchableOpacity>
    </View>
  )
}
