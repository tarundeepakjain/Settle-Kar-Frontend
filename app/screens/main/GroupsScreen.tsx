import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  Button,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

type Member = {
  _id: string;
  name?: string;
};

type Group = {
  _id: string;
  name: string;
  description?: string;
  members: Member[];
};

export default function GroupsScreen() {
  const navigation = useNavigation<any>(); // type as needed
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");

  const fetchGroups = async (): Promise<Group[] | undefined> => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("No token found. Please log in again.");
        return;
      }

      const response = await fetch("http://localhost:5001/group/my-groups", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) return data as Group[];
      else console.error("Failed to fetch groups:", data.message);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  const createGroup = async () => {
    try {
      if (!newGroupName.trim()) {
        Alert.alert("Group name required!");
        return;
      }

      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("No token found. Please log in again.");
        return;
      }

      const response = await fetch("http://localhost:5001/group/new", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newGroupName, description: newGroupDesc }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Group created successfully!");
        const updatedGroups = await fetchGroups();
        if (updatedGroups) setGroups(updatedGroups);
        setModalVisible(false);
        setNewGroupName("");
        setNewGroupDesc("");
      } else {
        Alert.alert("Error", data.message || "Failed to create group.");
      }
    } catch (err) {
      console.error("Error creating group:", err);
      Alert.alert("Error creating group");
    }
  };

  useEffect(() => {
    const loadGroups = async () => {
      const data = await fetchGroups();
      if (data) setGroups(data);
      setLoading(false);
    };
    loadGroups();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#000" style={{ flex: 1, justifyContent: "center" }} />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>My Groups</Text>
      <Button title="➕ Create Group" onPress={() => setModalVisible(true)} />

      <FlatList
        data={groups}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("GroupDetails", { groupId: item._id })}
            style={{
              marginVertical: 8,
              padding: 12,
              backgroundColor: "#f2f2f2",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.name}</Text>
            {item.description ? <Text style={{ color: "gray" }}>{item.description}</Text> : null}
            <Text style={{ color: "gray" }}>Members: {item.members.length}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ color: "gray", textAlign: "center", marginTop: 20 }}>No groups found.</Text>}
      />

      {/* Create Group Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", padding: 20 }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Create New Group</Text>
            <TextInput
              placeholder="Group Name"
              value={newGroupName}
              onChangeText={setNewGroupName}
              style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 }}
            />
            <TextInput
              placeholder="Description"
              value={newGroupDesc}
              onChangeText={setNewGroupDesc}
              style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 }}
            />
            <Button title="Create" onPress={createGroup} />
            <View style={{ marginTop: 10 }}>
              <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
