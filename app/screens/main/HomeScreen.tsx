import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Logo from "../../../assets/images/file.svg";

export default function HomeScreen() {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header at Top */}
      <View style={styles.header}>
        <Logo width={1000} height={450} />
        {/* <Text style={styles.title}>Settle Kar</Text> */}
      </View>

      {/* Main Content */}
      <View style={styles.body}>
        <Text style={styles.subtitle}>Welcome to SettleKar</Text>
      </View>

      {/* Floating Options */}
      {open && (
        <View style={styles.options}>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Opt 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Opt 2</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setOpen(!open)}>
        <Ionicons name={open ? "close" : "add"} size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    width: "100%",
    paddingTop: -250,   // spacing for status bar
    // paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginLeft: 10,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#4b5563",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  options: {
    position: "absolute",
    bottom: 100,
    right: 30,
    alignItems: "flex-end",
  },
  optionButton: {
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  optionText: {
    fontSize: 16,
    color: "#1f2937",
  },
});
