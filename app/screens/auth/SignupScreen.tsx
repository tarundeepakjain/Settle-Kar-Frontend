import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Animated, Easing, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth,signInWithPopup,GoogleAuthProvider } from "firebase/auth";
import { navigate } from 'expo-router/build/global-state/routing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../services/api';
export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<any>();
  const provider = new GoogleAuthProvider();
  const auth=getAuth();
  
  const iconFloatAnim = useRef(new Animated.Value(0)).current;
const handleSignup = async () => {
  try {
    const response = await fetch("https://settlekar.onrender.com/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem("accessToken", data.accessToken);
      await AsyncStorage.setItem("refreshToken", data.refreshToken);
      alert('Signup successful!');
     
      const meRes = await fetch("https://settlekar.onrender.com/auth/me", {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });
      const userData = await meRes.json();
      navigation.navigate("MainTabs");
    }
  } catch (err) {
    console.log(err);
  }
};

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
    animationDelay: `${delay}ms`,
  });

  const handleGoogleSignup = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential ? credential.accessToken : null;
        // The signed-in user info.
        const user = result.user;
        navigation.navigate('MainTabs');
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const handleBackToLogin = () => {
    // Navigate back to Login screen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Animated Background Elements */}
      <View style={styles.background}>
        {/* Stars and Floating Icons */}
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
        
        {/* Gradient Orbs */}
        <View style={[styles.orb, styles.orb1]} />
        <View style={[styles.orb, styles.orb2]} />
      </View>

      {/* Main Signup Card */}
      <SafeAreaView style={styles.contentWrapper}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="wallet" size={24} color="#FFD700" />
            </View>
            <Text style={styles.title}>Create Account</Text>
          </View>
          <Text style={styles.description}>
            Split your expenses, not your friendships!
            {"\n"}
            <Text style={styles.joinText}>Join SettleKar today!</Text>
          </Text>
          
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
            </View>
            
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
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Ionicons name="wallet-outline" size={16} color="black" style={styles.buttonIcon} />
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.signupButton} onPress={handleGoogleSignup}>
              <Ionicons name="wallet-outline" size={16} color="black" style={styles.buttonIcon} />
              <Text style={styles.signupButtonText}>SignIn With Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Login</Text>
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
    ...Platform.select({
      web: {
        paddingTop: 50,
      },
    }),
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(25, 30, 40, 0.9)',
    borderRadius: 15,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
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
    gap: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
  signupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonIcon: {
    marginRight: 8,
  },
  signupButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginText: {
    textAlign: 'center',
    color: '#E0E0E0',
    fontSize: 14,
  },
  loginLink: {
    color: '#FFD700',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
