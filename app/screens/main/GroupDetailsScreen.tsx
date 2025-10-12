import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Animated, Easing, StyleSheet, SafeAreaView, ActivityIndicator, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import AddExpenseModal from "../../components/AddExpenseModal";
import GroupName from "@/app/components/GroupName";
import TabButton from "@/app/components/TabButton";
import Expenses from "@/app/components/Expenses";
import MyExpenses from "@/app/components/MyExpenses";
import TotalExpenses from "@/app/components/TotalExpenses";
import Balances from "@/app/components/Balances";

export default function GroupDetails({ route }: { route: any }) {
  const { groupId } = route.params;
  const [group, setGroup] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"Expenses" | "Balances">("Expenses");
  const [modalVisible, setModalVisible] = useState(false);

  const iconFloatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(iconFloatAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
    ).start();
  }, []);

  const fetchGroupDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return Alert.alert("No token found");

      const res = await fetch(`https://settlekar.onrender.com/group/${groupId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();

      if (res.ok) {
        setGroup(data);
        setExpenses(data.expenses || []);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch group");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error fetching group");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGroupDetails(); }, [groupId]);

  const handleAddExpense = async (expense: any) => {
    // Ensure paidById is present
    if (!expense.paidById) {
      return Alert.alert("Error", "Please select who paid the expense");
    }

    const payload = {
      description: expense.title,
      amount: Number(expense.amount),
      paidById: expense.paidById, // backend expects this
      splits: expense.splits?.map((s: any) => ({ user: s.userId, amount: Number(s.amount) })) || [],
    };

    console.log("Expense payload being sent:", payload);

    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return;

      const res = await fetch(`https://settlekar.onrender.com/group/${groupId}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to add expense:", data);
        return Alert.alert("Error", data.message || "Failed to add expense");
      }

      // Add expense locally
      setExpenses([...expenses, data]);
      Alert.alert("Success", "Expense added!");
    } catch (err) {
      console.error("Error adding expense:", err);
      Alert.alert("Error", "Failed to add expense");
    }
  };

  const getFloatStyle = (delay: number) => ({
    transform: [{ translateY: iconFloatAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -10, 0] }) }],
  });

  const renderExpenseItem = ({ item }: { item: any }) => {
    const paidByMember = group?.members.find((m: any) => m._id === item.paidBy?._id);
    return <Expenses key={item._id} title={item.description} amount={item.amount} paidBy={paidByMember?.name || "Unknown"} />;
  };

  if (loading) return <ActivityIndicator size="large" color="#fff" style={{ flex: 1, justifyContent: "center" }} />;
  if (!group) return <Text style={{ color: "#fff", textAlign: "center", marginTop: 50 }}>Group not found.</Text>;

  return (
    <View style={styles.container}>
      {/* Background floating icons */}
      <View style={styles.background}>
        <Animated.View style={[styles.floatingIcon, { left: "10%", top: "25%" }, getFloatStyle(0)]}><Ionicons name="wallet-outline" size={30} color="rgba(255,255,255,0.3)" /></Animated.View>
        <Animated.View style={[styles.floatingIcon, { right: "15%", top: "20%" }, getFloatStyle(1000)]}><Ionicons name="cash-outline" size={25} color="rgba(255,255,255,0.4)" /></Animated.View>
        <Animated.View style={[styles.floatingIcon, { left: "15%", bottom: "15%" }, getFloatStyle(500)]}><Ionicons name="people-outline" size={28} color="rgba(255,255,255,0.35)" /></Animated.View>
        <Animated.View style={[styles.floatingIcon, { right: "10%", bottom: "30%" }, getFloatStyle(1500)]}><Ionicons name="star-outline" size={20} color="rgba(255,255,255,0.5)" /></Animated.View>
      </View>

      <SafeAreaView style={styles.contentWrapper}>
        <GroupName name={group.name} />

        <View style={styles.tabRow}>
          <TabButton label="Expenses" isActive={activeTab === "Expenses"} onPress={() => setActiveTab("Expenses")} />
          <TabButton label="Balances" isActive={activeTab === "Balances"} onPress={() => setActiveTab("Balances")} />
        </View>

        <View style={styles.content}>
          {activeTab === "Expenses" ? (
            <>
              <MyExpenses expenses={expenses} currentUserId="user_1" />
              <TotalExpenses expenses={expenses} />
              <FlatList data={expenses} keyExtractor={(item) => item._id} renderItem={renderExpenseItem} ListEmptyComponent={<Text style={styles.emptyText}>No expenses yet. Add one!</Text>} />
              <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Add Expense</Text>
              </TouchableOpacity>
            </>
          ) : <Balances group={group} />}
        </View>

        <AddExpenseModal visible={modalVisible} onClose={() => setModalVisible(false)} onSave={handleAddExpense} members={group.members} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a1421" },
  background: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
  floatingIcon: { position: "absolute" },
  contentWrapper: { flex: 1, position: "relative", zIndex: 1 },
  tabRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(0,0,0,0.5)" },
  content: { flex: 1, padding: 20, position: "relative", zIndex: 1 },
  addButton: { position: "absolute", right: 20, bottom: 30, backgroundColor: "#2e86de", borderRadius: 50, paddingVertical: 14, paddingHorizontal: 18, elevation: 6 },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  emptyText: { color: "rgba(255,255,255,0.6)", textAlign: "center", marginTop: 20, fontSize: 16 },
});
