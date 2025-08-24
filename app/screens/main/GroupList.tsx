import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import groupsData from "../../utils/groups.json";
import { Ionicons } from "@expo/vector-icons";
import NewGroupModal from "@/app/components/NewGroupModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GroupList() {
  const navigation = useNavigation<any>(); // Get navigation object
  const [groups, setGroups] = useState(groupsData);
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = (group: any) => {
    navigation.navigate("GroupDetails", { group });
  };

  const handleAddGroup = () => {
    setModalVisible(true);
  };

  const handleCreateGroup = async (name: string) => {
    const newGroup = {
      id: Date.now().toString(),
      name,
      members: [],
      expenses: [],
    };

    setGroups([...groups, newGroup]);
    await AsyncStorage.setItem("groups", JSON.stringify([...groups, newGroup]));
    setModalVisible(false);

    navigation.navigate("GroupDetails", { group: newGroup });
  };

  useEffect(() => {
    const loadGroups = async () => {
      const saved = await AsyncStorage.getItem("groups");
      if (saved) {
        setGroups(JSON.parse(saved));
      } else {
        setGroups(groupsData); // fallback to initial JSON
      }
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
          <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.arrow}>{'>'}</Text>
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  item: {
    flexDirection: "row",        // Align name and arrow horizontally
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    letterSpacing: 0.5,
  },
  arrow: {
    fontSize: 20,
    color: "rgba(0,0,0,0.3)",
    fontWeight: "bold",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#007aff", // blue-500
    borderRadius: 50,
    padding: 16,
    elevation: 6,
  },
});
