import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
    Text,
    Platform,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "@/utils/supabase";
// const handleEdit = async () => {
//   try {
//     const response = await fetch("https://settlekar.onrender.com/auth/edit", {
//       method: "PUT",
//       headers: {"Content-Type": "application/json"},
//       body: JSON.stringify({name, email}),
//     });
//     const data = await response.json();
//   } catch (error) {
//     console.error("Error editing profile:", error);
//   }
// }

interface EditProfileProps {
  isVisible: boolean;
  onClose: () => void;
  initialName: string;
  userEmail: string;
  onProfileUpdated: (newName: string) => void;
}

export default function EditProfile({
  isVisible,
  onClose,
  initialName,
  userEmail,
  onProfileUpdated,
}: EditProfileProps) {
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);


  // Reset the name when modal opens/closes
  React.useEffect(() => {
    if (isVisible) setName(initialName);
  }, [isVisible, initialName]);

  // 🔹 Prevent render when not visible
  if (!isVisible) return null;

  const handleSaveProfile = async () => {
  if (!name.trim()) {
    return Alert.alert("Validation", "Name cannot be empty.");
  }
  if (name === initialName) {
    return Alert.alert("No Change", "Name is the same as before.");
  }

  setIsSaving(true);

  try {
    const { error } = await supabase.auth.updateUser({
        data: { name: name }
      });

      if (error) throw error;      
      if (Platform.OS === 'web') {
        window.alert("Profile updated successfully!");
      } else {
        Alert.alert("Success", "Username updated successfully!");
      }
    

    onProfileUpdated(name);
    onClose();

  } catch (error) {
    console.error("Profile save error:", error);
    Alert.alert("Error", "Something went wrong.");
  } finally {
    setIsSaving(false);
  }
};


  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* Full Name Field */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
            editable={!isSaving}
          />

          {/* Email Field */}
          <Text style={styles.label}>Email Address (Cannot be changed)</Text>
          <TextInput
            style={styles.inputDisabled}
            placeholder="Email Address"
            placeholderTextColor="#666"
            value={userEmail}
            editable={false}
          />

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSaveProfile}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator color="#0a1421" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  closeButton: { padding: 5 },
  label: {
    color: "#ccc",
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
    borderColor: "rgba(255,255,255,0.08)",
  },
  inputDisabled: {
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#a0a0a0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  saveButton: {
    backgroundColor: "#FFD700",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: {
    color: "#0a1421",
    fontSize: 16,
    fontWeight: "700",
  },
});
