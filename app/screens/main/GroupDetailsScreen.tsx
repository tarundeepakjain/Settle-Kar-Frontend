// screens/GroupDetails.tsx
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import GroupName from "../../components/GroupName";
import TabButton from "../../components/TabButton";

export default function GroupDetails({route}: {route: any}) {
  const [activeTab, setActiveTab] = useState<"Expenses" | "Balances">("Expenses");
  const { group } = route.params;

  return (
    <View style={styles.container}>
      <GroupName name={group.name} />
      
      {/* Top Navigation Buttons */}
      <View style={styles.tabRow}>
        <TabButton
          label="Expenses"
          isActive={activeTab === "Expenses"}
          onPress={() => setActiveTab("Expenses")}
        />
        <TabButton
          label="Balances"
          isActive={activeTab === "Balances"}
          onPress={() => setActiveTab("Balances")}
        />
      </View>

      {/* Content Area */}
      <View style={styles.content}>
        {activeTab === "Expenses" ? (
          <Text>Expenses List Here</Text>
        ) : (
          <Text>Balances Summary Here</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
