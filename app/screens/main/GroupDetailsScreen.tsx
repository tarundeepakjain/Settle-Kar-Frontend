// screens/GroupDetails.tsx
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Balances from "../../components/Balances";
import GroupName from "../../components/GroupName";
import TabButton from "../../components/TabButton";

export default function GroupDetails({ route }: { route: any }) {
  const [activeTab, setActiveTab] = useState<"Expenses" | "Balances">("Expenses");
  const { group } = route.params; // group is the selected group (Family or Friends)

  return (
    <View style={styles.container}>
      {/* Group Header */}
      <GroupName name={group.name} />

      {/* Top Navigation Tabs */}
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
          <FlatList
          data={group.expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            // Get member name for paidBy
            const paidByMember = group.members.find((m: any) => m.id === item.paidById);
        
            // Get names of members in splitBetweenIds
            const splitNames = item.splitBetweenIds
              ?.map((id: string) => group.members.find((m: any) => m.id === id)?.name || "")
              .join(", ");
        
            return (
              <View style={styles.card}>
                <Text style={styles.title}>{item.title}</Text>
                <Text>Amount: ₹{item.amount}</Text>
                <Text>Paid by: {paidByMember?.name}</Text>
                <Text>Split between: {splitNames}</Text>
              </View>
            );
          }}
        />
        
        ) : (
          <Balances groups={group} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  card: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
});
