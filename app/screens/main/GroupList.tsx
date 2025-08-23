import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import groups from "../../utils/groups.json"; // Import the JSON

export default function GroupList() {
    const navigation = useNavigation<any>(); // Get navigation object
  
    const handlePress = (group: any) => {
      // Navigate to "GroupDetails" screen and pass the group
      navigation.navigate("GroupDetails", { group });
    };
  
    return (
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.arrow}>{}</Text>
          </TouchableOpacity>
        )}
      />
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
});
