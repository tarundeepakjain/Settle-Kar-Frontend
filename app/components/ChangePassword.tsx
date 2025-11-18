import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ChangePasswordProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ChangePassword({
  isVisible,
  onClose,
}: ChangePasswordProps) {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  if (!isVisible) return null;

  // --------------------------------------------------------------------
  // SEND OTP
  // --------------------------------------------------------------------
  const handleSendOtp = async () => {
    if (!email) return Alert.alert("Validation", "Please enter your email.");

    try {
      const res = await fetch(
        "https://settlekar.onrender.com/auth/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setIsOtpSent(true);
        Alert.alert("OTP Sent", `OTP sent to ${email}`);
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Network error");
    }
  };

  // --------------------------------------------------------------------
  // VERIFY OTP
  // --------------------------------------------------------------------
  const handleVerifyOtp = async () => {
    if (!otp) return Alert.alert("Validation", "Please enter OTP.");

    try {
      const res = await fetch(
        "https://settlekar.onrender.com/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setIsOtpVerified(true);
        Alert.alert("Verified", "OTP verified successfully!");
      } else {
        Alert.alert("Error", data.message || "Invalid OTP");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Network error");
    }
  };

  // --------------------------------------------------------------------
  // CHANGE PASSWORD (only AFTER OTP verified)
  // --------------------------------------------------------------------
  const handleChangePassword = async () => {
    if (!isOtpVerified)
      return Alert.alert("Validation", "Please verify OTP first.");

    if (newPassword !== confirmPassword)
      return Alert.alert("Validation", "Passwords do not match.");

    if (newPassword.length < 6)
      return Alert.alert(
        "Validation",
        "Password must be at least 6 characters."
      );

    try {
      setIsSaving(true);

      const res = await fetch(
        "https://settlekar.onrender.com/auth/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Alert.alert(
          "Success",
          "Password changed successfully. Please login again.",
          [
            {
              text: "OK",
              onPress: async () => {
                await AsyncStorage.multiRemove([
                  "accessToken",
                  "refreshToken",
                ]);
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                });
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", data.message || "Password change failed");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Network error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Change Password</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* ---------------- EMAIL ---------------- */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="your.email@example.com"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            editable={!isOtpVerified}
          />

          {/* ---------------- OTP ---------------- */}
          <TouchableOpacity
            style={styles.sendOtpButton}
            onPress={handleSendOtp}
          >
            <Text style={styles.sendOtpText}>
              {isOtpSent ? "Resend OTP" : "Send OTP"}
            </Text>
          </TouchableOpacity>

          {isOtpSent && (
            <>
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor="#666"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
              />

              {!isOtpVerified && (
                <TouchableOpacity
                  style={styles.verifyOtpButton}
                  onPress={handleVerifyOtp}
                >
                  <Text style={styles.verifyOtpText}>Verify OTP</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* ---------------- PASSWORD ---------------- */}
          {isOtpVerified && (
            <>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#666"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#666"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </>
          )}

          {/* ---------------- SUBMIT ---------------- */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!isOtpVerified || isSaving) && { opacity: 0.5 },
            ]}
            disabled={!isOtpVerified || isSaving}
            onPress={handleChangePassword}
          >
            {isSaving ? (
              <ActivityIndicator color="#0a1421" />
            ) : (
              <Text style={styles.saveButtonText}>Update Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#1a2332",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.1)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "700" },
  closeButton: { padding: 5 },

  label: { color: "#ccc", marginTop: 12, marginBottom: 5 },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
  },

  sendOtpButton: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  sendOtpText: {
    color: "#000",
    fontWeight: "700",
  },

  verifyOtpButton: {
    backgroundColor: "#2e86de",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  verifyOtpText: {
    color: "#fff",
    fontWeight: "700",
  },

  saveButton: {
    backgroundColor: "#FFD700",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#0a1421",
    fontSize: 16,
    fontWeight: "700",
  },
});
