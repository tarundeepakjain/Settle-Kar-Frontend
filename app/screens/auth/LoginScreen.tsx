import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/utils/supabase';
import * as Linking from 'expo-linking';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigation = useNavigation<any>();
  const iconFloatAnim = useRef(new Animated.Value(0)).current;

  // 🔁 Floating animation (UNCHANGED)
  useEffect(() => {
    Animated.loop(
      Animated.timing(iconFloatAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  }, [iconFloatAnim]);

  const getFloatStyle = (delay: number) => ({
    transform: [{
      translateY: iconFloatAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -10, 0],
      }),
    }],
    // @ts-ignore
    animationDelay: `${delay}ms`,
  });

  // ✅ Supabase Email/Password Login
  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  // ✅ Functional Google Sign In
  // This triggers Supabase OAuth which syncs user_metadata (name, avatar, etc.)
  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);

    try {
      const redirectTo = Linking.createURL('/');

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      alert(error.message || 'Google Sign-In failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      {/* Animated Background Elements */}
      <View style={styles.background}>
        <Animated.View style={[styles.floatingIcon, { left: '10%', top: '25%' }, getFloatStyle(0)]}>
          <Ionicons name="wallet-outline" size={30} color="rgba(255, 255, 255, 0.3)" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { right: '15%', top: '20%' }, getFloatStyle(1000)]}>
          <Ionicons name="cash-outline" size={25} color="rgba(255, 255, 255, 0.4)" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { left: '15%', bottom: '15%' }, getFloatStyle(500)]}>
          <Ionicons name="people-outline" size={28} color="rgba(255, 255, 255, 0.35)" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { right: '10%', bottom: '30%' }, getFloatStyle(1500)]}>
          <Ionicons name="star-outline" size={20} color="rgba(255, 255, 255, 0.5)" />
        </Animated.View>

        <View style={[styles.orb, styles.orb1]} />
        <View style={[styles.orb, styles.orb2]} />
      </View>

      <SafeAreaView style={styles.contentWrapper}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="wallet" size={24} color="#FFD700" />
            </View>
            <Text style={styles.title}>SettleKar</Text>
          </View>

          <Text style={styles.description}>
            Split your expenses, not your friendships!
            {"\n"}
            <Text style={styles.joinText}>Join SettleKar today!</Text>
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your secure password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading || googleLoading}
            >
              {loading ? (
                <ActivityIndicator color="black" />
              ) : (
                <>
                  <Ionicons name="wallet-outline" size={16} color="black" style={styles.buttonIcon} />
                  <Text style={styles.loginButtonText}>Start Splitting Expenses</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              disabled={loading || googleLoading}
            >
              {googleLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={18} color="#000" style={styles.buttonIcon} />
                  <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signupText}>
                Don't have an account? <Text style={styles.signupLink}>Join the community</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1421',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  floatingIcon: {
    position: 'absolute',
  },
  orb: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  orb1: {
    width: 120,
    height: 120,
    backgroundColor: '#FFD700',
    top: '25%',
    left: '25%',
    transform: [{ translateX: -60 }, { translateY: -60 }],
  },
  orb2: {
    width: 160,
    height: 160,
    backgroundColor: '#2e86de',
    bottom: '25%',
    right: '25%',
    transform: [{ translateX: 80 }, { translateY: 80 }],
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(25, 30, 40, 0.9)',
    borderRadius: 15,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    padding: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 9999,
    marginRight: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#E0E0E0',
    marginBottom: 24,
  },
  joinText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  form: {
    gap: 15,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
  },
  inputIcon: {
    position: 'absolute',
    right: 15,
    bottom: 12,
  },
  passwordToggle: {
    position: 'absolute',
    right: 15,
    bottom: 12,
    padding: 5,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: '#9CA3AF',
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 10,
  },
  googleButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupText: {
    textAlign: 'center',
    color: '#E0E0E0',
    fontSize: 14,
    marginTop: 10,
  },
  signupLink: {
    color: '#FFD700',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});