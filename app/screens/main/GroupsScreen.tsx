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
import API from '../../services/api';
import { jwtDecode} from "jwt-decode";
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
interface MyJwtPayload {
  name: string;
  email: string;
  id: string;
  exp?: number;
}
export default function GroupsScreen() {
  const navigation = useNavigation<any>(); // type as needed
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");

 const getUserFromToken = async () => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) return null;

    const decoded = jwtDecode<MyJwtPayload>(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
 const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) return null;

      const response = await fetch("https://settlekar.onrender.com/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        console.warn("Failed to refresh access token");
        return null;
      }

      const data = await response.json();
      await AsyncStorage.setItem("accessToken", data.accessToken);
      console.log("🔄 Access token refreshed successfully!");
      return data.accessToken;
    } catch (err) {
      console.error("Error refreshing token:", err);
      return null;
    }
  };

  // 🔹 Verify token expiry
  const isTokenExpired = (decoded: MyJwtPayload) => {
    if (!decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  };

const fetchGroups = async (): Promise<Group[] | undefined> => {
  try {
    let token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      Alert.alert("No token found. Please log in again.");
      return;
    }
    let decoded = jwtDecode<MyJwtPayload>(token);
    
          while(isTokenExpired(decoded)) {
            console.log("⚠️ Access token expired, refreshing...");
            const newToken = await refreshAccessToken();
            if (!newToken) {
              console.log("❌ Failed to refresh token, logging out...");
              
              return;
            }
            token = newToken;
            decoded = jwtDecode<MyJwtPayload>(token);
          }
  
    const response = await fetch("https://settlekar.onrender.com/group/my-groups", {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    let data;
    try {
      data = await response.json();
    } catch {
      console.error("⚠️ Response was not JSON:", response);
      Alert.alert("Server error", "Invalid server response");
      return;
    }

    if (response.ok) {
      console.log("✅ Groups fetched:", data);
      return data as Group[];
    } else {
      console.error("❌ Failed to fetch groups. Full response:", data);
      Alert.alert(
        "Error",
        data.message || data.error || `Failed to fetch groups (${response.status})`
      );
      return;
    }
  } catch (err: any) {
    console.error("💥 Network or fetch error:", err);
    Alert.alert("Error", err.message || "Network error while fetching groups");
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
  const user = await getUserFromToken();

      const response = await fetch("https://settlekar.onrender.com/group/new", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newGroupName, description: newGroupDesc,members:[user?.id],createdBy:user?.id }),
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
