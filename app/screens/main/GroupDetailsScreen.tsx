import AddExpenseModal from "../../components/AddExpenseModal";
import { TouchableOpacity, Text, View, FlatList, StyleSheet, Animated, Easing } from "react-native";
import React, { useEffect, useState, useRef } from "react";
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

  const fluidAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(fluidAnimation, {
        toValue: 1,
        duration: 25000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  }, [fluidAnimation]);

  const getAnimatedStyle = (start: number, end: number) => ({
    transform: [
      {
        translateX: fluidAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [start, end],
        }),
      },
      {
        translateY: fluidAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [end, start],
        }),
      },
      {
        scale: fluidAnimation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.2, 1],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      {/* Background with fluid motion */}
      <View style={styles.background}>
        <Animated.View style={[styles.fluidBlob, styles.blob1, getAnimatedStyle(0, 100)]} />
        <Animated.View style={[styles.fluidBlob, styles.blob2, getAnimatedStyle(100, -50)]} />
        <Animated.View style={[styles.fluidBlob, styles.blob3, getAnimatedStyle(-50, 150)]} />
      </View>

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
                const paidByMember = group.members.find((m: any) => m.id === item.paidById);
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
    backgroundColor: '#0a1421',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  fluidBlob: {
    position: 'absolute',
    borderRadius: 500,
  },
  blob1: {
    width: 350,
    height: 350,
    backgroundColor: 'rgba(46, 134, 222, 0.2)',
    top: -50,
    left: -50,
  },
  blob2: {
    width: 400,
    height: 400,
    backgroundColor: 'rgba(230, 126, 34, 0.1)',
    bottom: -100,
    right: -100,
  },
  blob3: {
    width: 500,
    height: 500,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: '30%',
    left: '10%',
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    flex: 1,
    padding: 20,
    position: 'relative',
    zIndex: 1,
  },
  card: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    color: "#fff",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#2e86de",
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
