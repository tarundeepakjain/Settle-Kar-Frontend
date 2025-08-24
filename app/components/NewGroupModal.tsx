import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, View, Button } from "react-native";

interface NewGroupModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (groupName: string) => void;
}

export default function NewGroupModal({
  visible,
  onCancel,
  onCreate,
}: NewGroupModalProps) {
  const [groupName, setGroupName] = useState("");

  const handleCreate = () => {
    if (!groupName.trim()) return;
    onCreate(groupName.trim());
    setGroupName(""); // reset input
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Enter Group Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Friends, Family, Trip"
            value={groupName}
            onChangeText={setGroupName}
          />
          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={onCancel} />
            <Button title="Create" onPress={handleCreate} />
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
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
