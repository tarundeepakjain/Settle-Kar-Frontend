import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (result?: any) => void;
};

// changed code
export default function PersonalExpenseModal({ visible, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const handleSave = async () => {
    if (!title.trim() || !amount.trim()) {
      alert("Please enter a title and amount");
      return;
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("accessToken");

      const res = await fetch("https://settlekar.onrender.com/transaction/personal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: title.trim(),
          amount: numericAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
        return;
      }

      onSuccess();
      setTitle("");
      setAmount("");
      onClose();
    } catch (error) {
      alert("Something went wrong");
      console.log(error);
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
            <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={onClose}>
              <Text style={styles.cancelTxt}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.save]} onPress={handleSave}>
              <Text style={styles.saveTxt}>Add</Text>
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
