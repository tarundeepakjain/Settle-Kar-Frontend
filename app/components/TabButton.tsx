// components/TabButton.tsx
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type TabButtonProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
};

export default function TabButton({ label, isActive, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, isActive && styles.activeButton]}
    >
      <Text style={[styles.text, isActive && styles.activeText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeButton: {
    borderBottomColor: "#007AFF",
  },
  text: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },
  activeText: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
