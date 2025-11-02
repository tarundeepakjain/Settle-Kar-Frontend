// components/JoinGroupModal.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type JoinGroupModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback to refresh groups list
};

export default function JoinGroupModal({
  visible,
  onClose,
  onSuccess,
}: JoinGroupModalProps) {
  const [inputCode, setInputCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      setInputCode("");
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible]);

  const handleInputChange = (text: string) => {
    // Auto-uppercase and limit to 8 characters
    const upperText = text.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setInputCode(upperText.slice(0, 8));
  };

  const validateCode = (code: string): boolean => {
    // Validate 8 alphanumeric characters
    const codeRegex = /^[A-Z0-9]{8}$/;
    return codeRegex.test(code);
  };

  const handleJoinGroup = async () => {
    const trimmedCode = inputCode.trim().toUpperCase();

    if (!trimmedCode) {
      Alert.alert("Invalid Code", "Please enter a group code");
      return;
    }

    if (!validateCode(trimmedCode)) {
      Alert.alert("Invalid Code", "Code must be 8 alphanumeric characters");
      return;
    }

    setIsJoining(true);

    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Authentication Error", "Please log in again.");
        setIsJoining(false);
        return;
      }

      // Call your backend API to join group with code
      const response = await fetch(
        "https://settlekar.onrender.com/group/join-by-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code: trimmedCode }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Success!",
          `You have successfully joined the group: ${
            data.groupName || "Group"
          }`,
          [
            {
              text: "OK",
              onPress: () => {
                onSuccess(); // Refresh the groups list
                onClose();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Error",
          data.message || "Invalid code or unable to join group",
          [{ text: "Try Again" }]
        );
      }
    } catch (error) {
      console.error("Error joining group:", error);
      Alert.alert(
        "Network Error",
        "Unable to connect to server. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <View style={styles.headerIconContainer}>
                <Ionicons name="enter" size={24} color="#FFD700" />
              </View>
              <Text style={styles.headerTitle}>Join Group</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.infoContainer}>
              <Ionicons name="information-circle" size={20} color="#64B5F6" />
              <Text style={styles.infoText}>
                Enter the 8-character code you received to join a group
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter Code</Text>
              <TextInput
                style={styles.codeInput}
                value={inputCode}
                onChangeText={handleInputChange}
                placeholder="XXXXXXXX"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                maxLength={8}
                autoCapitalize="characters"
                autoCorrect={false}
                editable={!isJoining}
              />
              <Text style={styles.inputHint}>
                {inputCode.length}/8 characters
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.joinButton,
                (isJoining || inputCode.length !== 8) &&
                  styles.joinButtonDisabled,
              ]}
              onPress={handleJoinGroup}
              activeOpacity={0.8}
              disabled={isJoining || inputCode.length !== 8}
            >
              {isJoining ? (
                <>
                  <ActivityIndicator size="small" color="#0a1421" />
                  <Text style={styles.joinButtonText}>Joining...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#0a1421" />
                  <Text style={styles.joinButtonText}>Join Group</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(10, 20, 33, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#1a2332",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
    ...Platform.select({
      ios: {
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(255, 215, 0, 0.05)",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 24,
    gap: 24,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(100, 181, 246, 0.1)",
    padding: 12,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(100, 181, 246, 0.2)",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#64B5F6",
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  inputContainer: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.3,
  },
  codeInput: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    fontSize: 24,
    fontWeight: "700",
    color: "#FFD700",
    textAlign: "center",
    letterSpacing: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  inputHint: {
    fontSize: 12,
    color: "#a0a0a0",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#96E6A1",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#96E6A1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  joinButtonDisabled: {
    opacity: 0.5,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0a1421",
    letterSpacing: 0.3,
  },
});
