import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Member {
  id: string;
  name: string;
}

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (expense: any) => void;
  members: Member[];
}

export default function AddExpenseModal({
  visible,
  onClose,
  onSave,
  members,
}: AddExpenseModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [paidById, setPaidById] = useState("");
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    members.map((m) => m.id)
  );
  const [newPersonName, setNewPersonName] = useState("");

  // select who paid
  const selectMember = (member: Member) => {
    setPaidBy(member.name);
    setPaidById(member.id);
    setShowMemberPicker(false);
  };

  // toggle who is in the split
  const toggleParticipant = (id: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : [...prev, id]
    );
  };

  // add new person to the split (not in group)
  const addNewPerson = () => {
    if (!newPersonName.trim()) return;
    const newMember = {
      id: `temp_${Date.now()}`,
      name: newPersonName.trim(),
    };
    members.push(newMember); // temporary addition
    setSelectedParticipants([...selectedParticipants, newMember.id]);
    setNewPersonName("");
  };

  const handleSave = () => {
    if (!title || !amount || !paidBy || selectedParticipants.length === 0)
      return;

    onSave({
      id: Date.now().toString(),
      title,
      amount: parseFloat(amount),
      paidById,
      splitBetweenIds: selectedParticipants,
    });

    // Reset all fields
    setTitle("");
    setAmount("");
    setPaidBy("");
    setPaidById("");
    setSelectedParticipants(members.map((m) => m.id));
    setShowMemberPicker(false);
    onClose();
  };

  const renderMember = ({ item }: { item: Member }) => (
    <TouchableOpacity
      style={[
        styles.memberItem,
        selectedParticipants.includes(item.id) && { backgroundColor: "#e0ffe0" },
      ]}
      onPress={() => toggleParticipant(item.id)}
    >
      <Text style={styles.memberName}>{item.name}</Text>
      {selectedParticipants.includes(item.id) && (
        <Ionicons name="checkmark" size={18} color="green" />
      )}
    </TouchableOpacity>
  );

  const renderPayer = ({ item }: { item: Member }) => (
    <TouchableOpacity
      style={styles.memberItem}
      onPress={() => selectMember(item)}
    >
      <Text style={styles.memberName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>Add Expense</Text>

          {/* Title */}
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          {/* Amount */}
          <TextInput
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          {/* Who paid */}
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowMemberPicker(true)}
          >
            <Text style={paidBy ? styles.pickerText : styles.pickerPlaceholder}>
              {paidBy || "Select who paid"}
            </Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>

          {showMemberPicker && (
            <View style={styles.memberPicker}>
              <FlatList
                data={members}
                renderItem={renderPayer}
                keyExtractor={(item) => item.id}
                style={styles.memberList}
                showsVerticalScrollIndicator={false}
              />
              <TouchableOpacity
                style={styles.cancelPicker}
                onPress={() => setShowMemberPicker(false)}
              >
                <Text style={styles.cancelPickerText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Split between */}
          <Text style={styles.splitLabel}>Split Between:</Text>
          <FlatList
            data={members}
            renderItem={renderMember}
            keyExtractor={(item) => item.id}
            style={styles.memberList}
            showsVerticalScrollIndicator={false}
          />

          {/* Add new participant */}
          <View style={styles.addPersonRow}>
            <TextInput
              placeholder="Add new person (optional)"
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              value={newPersonName}
              onChangeText={setNewPersonName}
            />
            <TouchableOpacity
              onPress={addNewPerson}
              style={[styles.button, styles.save]}
            >
              <Text style={styles.btnText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Action buttons */}
          <View style={styles.row}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, styles.cancel]}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.button, styles.save]}
            >
              <Text style={styles.btnText}>Save</Text>
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
  },
  pickerPlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  pickerArrow: {
    fontSize: 12,
    color: "#666",
  },
  memberPicker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    maxHeight: 150,
  },
  memberList: {
    maxHeight: 120,
  },
  memberItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberName: {
    fontSize: 16,
    color: "#333",
  },
  cancelPicker: {
    padding: 12,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  cancelPickerText: {
    color: "#666",
    fontSize: 16,
  },
  splitLabel: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 6,
  },
  addPersonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancel: {
    backgroundColor: "#f87171",
  },
  save: {
    backgroundColor: "#34d399",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
