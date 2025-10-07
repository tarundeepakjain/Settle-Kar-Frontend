import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Animated, Easing, SafeAreaView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth,signInWithPopup,GoogleAuthProvider } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../services/api';
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<any>();
  const provider = new GoogleAuthProvider();
  const auth=getAuth();
  const iconFloatAnim = useRef(new Animated.Value(0)).current;
useEffect(() => {
  const verifyUser = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken") || localStorage.getItem("accessToken");
    if (accessToken) {
      console.log("accces token found");
      navigation.navigate("MainTabs"); 
    } else {
      navigation.navigate("Login");    }
  };
  verifyUser();
}, []);
const handleLogin = async () => {
  try {
    const response = await API.post('/auth/login', { email, password });
    
    const { accessToken,refreshToken, user } = response.data;
     await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    await AsyncStorage.setItem("user", JSON.stringify(user));

    alert('Login successful!');
    navigation.navigate('MainTabs');
  } catch (error) {
    if (typeof error === 'object' && error !== null) {
      const err = error as { response?: { data?: any }; message?: string };
      console.log(err.response?.data || err.message);
    } else {
      console.log(String(error));
    }
    alert('Invalid email or password');
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
    // @ts-ignore
    animationDelay: `${delay}ms`,
  });


  const handleSignup = () => {
    // Navigate to Signup screen
    navigation.navigate('Signup');
  };

  const handleGoogleLogin = () => {
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

      {/* Main Login Card */}
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
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Ionicons name="wallet-outline" size={16} color="black" style={styles.buttonIcon} />
              <Text style={styles.loginButtonText}>Start Splitting Expenses</Text>
            </TouchableOpacity>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={[styles.socialButton, styles.googleButton]} onPress={handleGoogleLogin}>
                <Ionicons name="logo-google" size={25} color="#000000ff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, styles.linkedinButton]}>
                <Ionicons name="logo-linkedin" size={25} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, styles.xButton]}>
                <Ionicons name="logo-twitter" size={25} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                <Ionicons name="logo-facebook" size={25} color="#fff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signupText}>
                Don't have an account? <Text style={styles.signupLink}>Join the community</Text>
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
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
  loginButton: {
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
  loginButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  socialButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  socialIcon: {
    width: 25,
    height: 25,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: '#E0E0E0',
  },
  googleButtonText: {
    color: '#000',
  },
  linkedinButton: {
    backgroundColor: '#0077B5',
    borderColor: '#0077B5',
  },
  xButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  signupText: {
    textAlign: 'center',
    color: '#E0E0E0',
    fontSize: 14,
  },
  signupLink: {
    color: '#FFD700',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  forgotPasswordText: {
    textAlign: 'center',
    color: '#A0A0A0',
    fontSize: 12,
    marginTop: 8,
  },
});
