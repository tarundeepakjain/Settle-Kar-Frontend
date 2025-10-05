import NewGroupModal from "@/app/components/NewGroupModal";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import groupsData from "../../utils/groups.json";

export default function GroupList() {
  const navigation = useNavigation<any>();
  const [groups, setGroups] = useState(groupsData);
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = (group: any) =>
    navigation.navigate("GroupDetails", { group });
  const handleAddGroup = () => setModalVisible(true);

  const handleCreateGroup = async (name: string, members: any[]) => {
    const newGroup = {
      id: Date.now().toString(),
      name,
      members,
      expenses: [],
    };
    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    await AsyncStorage.setItem("groups", JSON.stringify(updatedGroups));
    setModalVisible(false);
    navigation.navigate("GroupDetails", { group: newGroup });
  };

  useEffect(() => {
    const loadGroups = async () => {
      const saved = await AsyncStorage.getItem("groups");
      setGroups(saved ? JSON.parse(saved) : groupsData);
    };
    loadGroups();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.arrow}>&gt;</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddGroup}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      <NewGroupModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onCreate={handleCreateGroup}
        currentUser={{ id: "user_1", name: "You" }}
        existingGroups={groups}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  name: { fontSize: 18, fontWeight: "600", color: "#fff", letterSpacing: 0.5 },
  arrow: { fontSize: 20, color: "rgba(255,255,255,0.5)", fontWeight: "bold" },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#2e86de",
    borderRadius: 50,
    padding: 16,
    elevation: 6,
  },
});
