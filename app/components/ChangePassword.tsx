import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface ChangePasswordProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ChangePassword({ isVisible, onClose }: ChangePasswordProps) {
  const navigation = useNavigation<any>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // ⭐️ FIX: Guard clause to prevent rendering anything when not visible
  if (!isVisible) {
      return null;
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      return Alert.alert("Validation", "New password and confirmation do not match.");
    }
    if (newPassword.length < 6) {
        return Alert.alert("Validation", "Password must be at least 6 characters.");
    }
    if (!currentPassword) {
        return Alert.alert("Validation", "Please enter your current password.");
    }

    setIsSaving(true);

    // ⚠️ TODO: Implement actual API call (POST /auth/change-password)
    try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) return Alert.alert("Error", "Authentication required.");

        // Simulation
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        Alert.alert("Success", "Password changed successfully. You will be logged out to re-authenticate.", [
            {
                text: "OK",
                onPress: async () => {
                    // Force logout is common practice after password change
                    await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
                    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
                }
            }
        ]);

    } catch (error) {
        console.error("Password change error:", error);
        Alert.alert("Error", "Password change failed. Check current password or try again.");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={modalStyles.modalOverlay}>
            <View style={modalStyles.card}>
                <View style={modalStyles.header}>
                    <Text style={modalStyles.headerTitle}>Change Password</Text>
                    <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                        <Ionicons name="close" size={24} color="#ccc" />
                    </TouchableOpacity>
                </View>

                <Text style={modalStyles.label}>Current Password</Text>
                <TextInput
                    style={modalStyles.input}
                    placeholder="Current Password"
                    placeholderTextColor="#666"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                    editable={!isSaving}
                />
                
                <Text style={modalStyles.label}>New Password</Text>
                <TextInput
                    style={modalStyles.input}
                    placeholder="New Password (min 6 chars)"
                    placeholderTextColor="#666"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    editable={!isSaving}
                />
                
                <Text style={modalStyles.label}>Confirm New Password</Text>
                <TextInput
                    style={modalStyles.input}
                    placeholder="Confirm New Password"
                    placeholderTextColor="#666"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    editable={!isSaving}
                />
                
                <TouchableOpacity
                    style={[modalStyles.saveButton, isSaving && modalStyles.saveButtonDisabled]}
                    onPress={handleChangePassword}
                    disabled={isSaving}
                    activeOpacity={0.8}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#0a1421" />
                    ) : (
                        <Text style={modalStyles.saveButtonText}>Update Password</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: "#1a2332",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,215,0,0.1)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
    },
    closeButton: {
        padding: 5,
    },
    label: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
      backgroundColor: "rgba(255,255,255,0.1)",
      color: "#fff",
      padding: 12,
      borderRadius: 8,
      marginBottom: 10,
      fontSize: 16,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
    },
    saveButton: {
      backgroundColor: "#FFD700",
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 20,
    },
    saveButtonDisabled: {
      opacity: 0.7,
    },
    saveButtonText: {
      color: "#0a1421",
      fontSize: 16,
      fontWeight: "700",
    },
});