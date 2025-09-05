import AddExpenseModal from "../../components/AddExpenseModal";
import { TouchableOpacity, Text, View, FlatList, StyleSheet, Animated, Easing, SafeAreaView, Platform } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Balances from "@/app/components/Balances";
import GroupName from "@/app/components/GroupName";
import TabButton from "@/app/components/TabButton";
import Expenses from "@/app/components/Expenses";
import { getGroups, updateGroupExpenses } from "@/app/utils/storage";
import { Ionicons } from '@expo/vector-icons';

export default function GroupDetails({ route }: { route: any }) {
  const [activeTab, setActiveTab] = useState<"Expenses" | "Balances">("Expenses");
  const [modalVisible, setModalVisible] = useState(false);
  const [expenses, setExpenses] = useState(route.params.group.expenses || []);
  const { group } = route.params;

  const iconFloatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(iconFloatAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  }, [iconFloatAnim]);

  const getFloatStyle = (delay: number) => ({
    transform: [{
      translateY: iconFloatAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -10, 0],
      }),
    }],
    // @ts-ignore
    animationDelay: `${delay}ms`,
  });

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
      {/* Animated Background Elements */}
      <View style={styles.background}>
        <Animated.View style={[styles.floatingIcon, { left: '10%', top: '25%' }, getFloatStyle(0)]}>
          <Ionicons name="wallet-outline" size={30} color="rgba(255, 255, 255, 0.3)" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { right: '15%', top: '20%' }, getFloatStyle(1000)]}>
          <Ionicons name="cash-outline" size={25} color="rgba(255, 255, 255, 0.4)" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { left: '15%', bottom: '15%' }, getFloatStyle(500)]}>
          <Ionicons name="people-outline" size={28} color="rgba(255, 255, 255, 0.35)" />
        </Animated.View>
        <Animated.View style={[styles.floatingIcon, { right: '10%', bottom: '30%' }, getFloatStyle(1500)]}>
          <Ionicons name="star-outline" size={20} color="rgba(255, 255, 255, 0.5)" />
        </Animated.View>

        {/* Gradient Orbs */}
        <View style={[styles.orb, styles.orb1]} />
        <View style={[styles.orb, styles.orb2]} />
      </View>

      <SafeAreaView style={styles.contentWrapper}>
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
      </SafeAreaView>
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
  floatingIcon: {
    position: 'absolute',
  },
  orb: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  orb1: {
    width: 120,
    height: 120,
    backgroundColor: '#FFD700',
    top: '25%',
    left: '25%',
    transform: [{ translateX: -60 }, { translateY: -60 }],
  },
  orb2: {
    width: 160,
    height: 160,
    backgroundColor: '#2e86de',
    bottom: '25%',
    right: '25%',
    transform: [{ translateX: 80 }, { translateY: 80 }],
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
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
