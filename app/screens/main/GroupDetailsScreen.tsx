import AddExpenseModal from "../../components/AddExpenseModal";
import { TouchableOpacity, Text, View, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Balances from "@/app/components/Balances";
import GroupName from "@/app/components/GroupName";
import TabButton from "@/app/components/TabButton";
import Expenses from "@/app/components/Expenses";
import { getGroups, updateGroupExpenses } from "@/app/utils/storage";

export default function GroupDetails({ route }: { route: any }) {
  const [activeTab, setActiveTab] = useState<"Expenses" | "Balances">("Expenses");
  const [modalVisible, setModalVisible] = useState(false);
  const [expenses, setExpenses] = useState(route.params.group.expenses || []);
  const { group } = route.params;

   useEffect(() => {
    const loadGroup = async () => {
      const groups = await getGroups();
      const current = groups.find((g: any) => g.id === group.id);
      setExpenses(current?.expenses || []);
    };
    loadGroup();
  }, [group.id]);

  const handleAddExpense = async (expense: any) => {
    console.log('expense: ', expense);
    const newExpenses = [...expenses, expense];
    setExpenses(newExpenses);
    await updateGroupExpenses(group.id, newExpenses);
  };

  return (
    <View style={styles.container}>
      <GroupName name={group.name} />

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

      <View style={styles.content}>
        {activeTab === "Expenses" ? (
          <>
            <FlatList
              data={expenses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const paidByMember = group.members.find((m: any) => m.id === item.paidById );
                return (
                  <Expenses
                    title={item.title}
                    amount={item.amount}
                    paidBy={paidByMember?.name || ""}
                  />
                );
              }}
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addButtonText}>+ Add Expense</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Balances groups={group} />
        )}
      </View>

      <AddExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddExpense}
        members={group.members}
      />
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
    fontWeight: "bold", fontSize: 18, marginBottom: 8, color: "#1e293b",
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
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
