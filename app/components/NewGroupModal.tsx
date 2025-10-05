import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, View, Button, TouchableOpacity, FlatList, Alert } from "react-native";

interface Member {
  id: string;
  name: string;
}

interface NewGroupModalProps {
  visible: boolean;
  onCancel: () => void;
  onCreate: (groupName: string, members: Member[]) => void;
  currentUser?: { id: string; name: string };
  existingGroups?: any[];
}

export default function NewGroupModal({
  visible,
  onCancel,
  onCreate,
  currentUser = { id: "user_1", name: "You" },
  existingGroups = [],
}: NewGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<Member[]>([currentUser]);
  const [newMemberName, setNewMemberName] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);

  // Check if group name already exists
  const isGroupNameDuplicate = groupName.trim() && existingGroups.some(group => 
    group.name.toLowerCase() === groupName.trim().toLowerCase()
  );

  const generateUniqueId = () => {
    return `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addMember = () => {
    if (!newMemberName.trim()) {
      Alert.alert("Error", "Please enter a member name");
      return;
    }
    
    if (members.some(member => member.name.toLowerCase() === newMemberName.trim().toLowerCase())) {
      Alert.alert("Error", "Member already exists");
      return;
    }

    const newMember: Member = {
      id: generateUniqueId(),
      name: newMemberName.trim(),
    };
    
    setMembers([...members, newMember]);
    setNewMemberName("");
    setShowAddMember(false);
  };

  const removeMember = (memberId: string) => {
    if (memberId === currentUser.id) {
      Alert.alert("Error", "Cannot remove yourself from the group");
      return;
    }
    setMembers(members.filter(member => member.id !== memberId));
  };

  const handleCreate = () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return;
    }
    
    // Check for duplicate group name
    const trimmedGroupName = groupName.trim();
    const isDuplicate = existingGroups.some(group => 
      group.name.toLowerCase() === trimmedGroupName.toLowerCase()
    );
    
    if (isDuplicate) {
      Alert.alert("Error", "A group with this name already exists. Please choose a different name.");
      return;
    }
    
    if (members.length < 2) {
      Alert.alert("Error", "Group must have at least 2 members");
      return;
    }
    
    onCreate(trimmedGroupName, members);
    setGroupName("");
    setMembers([currentUser]);
    setNewMemberName("");
    setShowAddMember(false);
  };

  const handleCancel = () => {
    setGroupName("");
    setMembers([currentUser]);
    setNewMemberName("");
    setShowAddMember(false);
    onCancel();
  };

  const renderMember = ({ item }: { item: Member }) => (
    <View style={styles.memberItem}>
      <Text style={styles.memberName}>{item.name}</Text>
      {item.id !== currentUser.id && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeMember(item.id)}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Create New Group</Text>
          
          <Text style={styles.label}>Group Name</Text>
          <TextInput
            style={[styles.input, isGroupNameDuplicate && styles.inputError]}
            placeholder="e.g. Friends, Family, Trip"
            value={groupName}
            onChangeText={setGroupName}
          />
          {isGroupNameDuplicate && (
            <Text style={styles.errorText}>This group name already exists</Text>
          )}

          <Text style={styles.label}>Members ({members.length}) - Minimum 2 required</Text>
          <FlatList
            data={members}
            renderItem={renderMember}
            keyExtractor={(item) => item.id}
            style={styles.membersList}
            showsVerticalScrollIndicator={false}
          />

          {!showAddMember ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddMember(true)}
            >
              <Text style={styles.addButtonText}>+ Add Participants</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.addMemberContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter member name"
                value={newMemberName}
                onChangeText={setNewMemberName}
                autoFocus
              />
              <View style={styles.addMemberButtons}>
                <TouchableOpacity
                  style={[styles.smallButton, styles.cancelButton]}
                  onPress={() => {
                    setShowAddMember(false);
                    setNewMemberName("");
                  }}
                >
                  <Text style={styles.smallButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.smallButton, styles.addMemberButton]}
                  onPress={addMember}
                >
                  <Text style={styles.smallButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.createButton,
                (isGroupNameDuplicate || members.length < 2) && styles.disabledButton
              ]} 
              onPress={handleCreate}
              disabled={isGroupNameDuplicate || members.length < 2}
            >
              <Text style={[
                styles.buttonText,
                (isGroupNameDuplicate || members.length < 2) && styles.disabledButtonText
              ]}>
                Create Group
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  membersList: {
    maxHeight: 120,
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 6,
    marginBottom: 4,
  },
  memberName: {
    fontSize: 16,
    color: "#333",
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ff4444",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  addMemberContainer: {
    marginBottom: 16,
  },
  addMemberButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  smallButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: "#ff4444",
  },
  addMemberButton: {
    backgroundColor: "#34d399",
  },
  smallButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  createButton: {
    backgroundColor: "#34d399",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  inputError: {
    borderColor: "#ff4444",
    borderWidth: 2,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginTop: -12,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: "#666",
    opacity: 0.6,
  },
  disabledButtonText: {
    color: "#999",
  },
});
