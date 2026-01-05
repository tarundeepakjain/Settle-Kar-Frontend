import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserDetails,getAccessToken } from "@/helper/auth";
import type { User } from "@supabase/supabase-js";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (result?: any) => void;
};

export default function PersonalExpenseModal({
  visible,
  onClose,
  onSuccess,
}: Props) {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getUserDetails();
      setUser(currentUser);
    };

    loadUser();
  }, []);

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    if (!title.trim() || !amount.trim()) {
      Alert.alert("Validation", "Please enter a title and amount");
      return;
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Validation", "Enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const token = await getAccessToken();
      if (!token) {
        Alert.alert("Error", "Session expired. Please login again.");
        return;
      }

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL!}/transaction/add-personal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            description: title.trim(),
            amount: numericAmount,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data?.error || "Failed to add expense");
        return;
      }

      onSuccess?.(data);
      setTitle("");
      setAmount("");
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.heading}>Add Personal Expense</Text>

          <TextInput
            placeholder="Title"
            placeholderTextColor="#aaa"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder="Amount"
            placeholderTextColor="#aaa"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, styles.cancel]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelTxt}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.save]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveTxt}>
                {loading ? "Saving..." : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "88%",
    backgroundColor: "#0a1421",
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  heading: {
    color: "#FFD700",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.07)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    color: "#fff",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancel: {
    backgroundColor: "#FF4D4D",
  },
  save: {
    backgroundColor: "#FFD700",
  },
  cancelTxt: { color: "#fff", fontWeight: "600" },
  saveTxt: { color: "#0a1421", fontWeight: "700" },
});
