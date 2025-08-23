// screens/GroupDetails.tsx
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import Balances from "../../components/Balances";
import Expenses from "../../components/Expenses";
import GroupName from "../../components/GroupName";
import TabButton from "../../components/TabButton";

export default function GroupDetails({ route }: { route: any }) {
  const [activeTab, setActiveTab] = useState<"Expenses" | "Balances">("Expenses");
  const { group } = route.params; 

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
            const paidByMember = group.members.find((m: any) => m.id === item.paidById);
        
            const splitNames = item.splitBetweenIds
              ?.map((id: string) => group.members.find((m: any) => m.id === id)?.name || "")
              .join(", ");
        
            return (
              <Expenses 
                title={item.title}
                amount={item.amount}
                paidBy={paidByMember?.name || ''}
              />
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
    backgroundColor: "#f8fafc",
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    color: "#1e293b",
  },
});
