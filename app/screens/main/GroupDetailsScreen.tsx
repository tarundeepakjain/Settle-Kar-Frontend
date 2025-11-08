import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddExpenseModal from "../../components/AddExpenseModal";
import GroupName from "@/app/components/GroupName";
import TabButton from "@/app/components/TabButton";
import Expenses from "@/app/components/Expenses";
import MyExpenses from "@/app/components/MyExpenses";
import TotalExpenses from "@/app/components/TotalExpenses";
import { Ionicons } from "@expo/vector-icons"; // ADDED for icons in Group Details
import { jwtDecode } from "jwt-decode";
import * as Clipboard from "expo-clipboard";
// Define the two possible tab states
type ActiveTab = "Expenses" | "Details";
type Member = {
  _id: string;
  name?: string;
};

type Group = {
  _id: string;
  name: string;
  description?: string;
  members: Member[];
  code?: string;
  inviteid:string;
  createdBy?:string;
};

interface MyJwtPayload {
  name: string;
  email: string;
  id: string;
  exp?: number;
}
export default function GroupDetails({ route }: { route: any }) {
  const { groupId } = route.params;
  const [group, setGroup] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // RENAMED state from 'Balances' to 'Details'
  const [activeTab, setActiveTab] = useState<ActiveTab>("Expenses");
  const [modalVisible, setModalVisible] = useState(false);
  const iconFloatAnim = useRef(new Animated.Value(0)).current;
 const [currentUser, setCurrentUser] = useState<any>(null);
  // Floating icon animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(iconFloatAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  }, []);
 const getUserFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return null;

      const decoded = jwtDecode<MyJwtPayload>(token);
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };
  useEffect(() => {
  const fetchUser = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) return;
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    setCurrentUser(payload);
  };
  fetchUser();
}, []);
const handleCopyInviteId = async () => {
  try {
    await Clipboard.setStringAsync(group.inviteid);
    Alert.alert("Copied!", "Invite ID copied to clipboard.");
  } catch (err) {
    console.error("Clipboard copy failed:", err);
    Alert.alert("Error", "Failed to copy invite ID.");
  }
};
  // Fetch group details
  const fetchGroupDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return Alert.alert("No token found");

      const res = await fetch(`https://settlekar.onrender.com/group/${groupId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        console.log(data);
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

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  // Handle Add Expense
  const handleAddExpense = async (expense: any) => {
    if (!expense.paidById) {
      return Alert.alert("Error", "Please select who paid the expense");
    }

    const payload = {
      desc: expense.title,
      amount: Number(expense.amount),
      paidby: expense.paidById,
      splits: expense.splitBetweenIds,
    };

    console.log("Expense payload being sent:", payload);

    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return;

      const res = await fetch(
        `https://settlekar.onrender.com/group/${groupId}/add-expense`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      console.log(
        "expense added"
      );
      const data = await res.json();
      if (!res.ok) {
        console.error("Failed to add expense:", data);
        return Alert.alert("Error", data.message || "Failed to add expense");
      }

      // ✅ Immediately show the new expense with payer name
      const newExpense = {
        ...data.expense,
        paidBy: {
          _id: data.expense.paidBy._id,
          name: data.expense.paidBy.name || "Unknown",
        },
      };

      setExpenses((prev) => [...prev, newExpense]);
      setModalVisible(false);
      Alert.alert("Success", "Expense added!");
    } catch (err) {
      console.error("Error adding expense:", err);
      Alert.alert("Error", "Failed to add expense");
    }
  };
const handleDeleteMember = async (memberid: string) => {
  Alert.alert(
    "Remove Member",
    "Are you sure you want to remove this member from the group?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("accessToken");
            if (!token) return;

            const res = await fetch(
              `https://settlekar.onrender.com/group/${groupId}/delete-member`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ memberid }),
              }
            );

            const data = await res.json();

            if (res.ok) {
              Alert.alert("Success", "Member removed successfully.");
              setGroup((prev: any) => ({
                ...prev,
                members: prev.members.filter((m: any) => m._id !== memberid),
              }));
            } else {
              Alert.alert("Error", data.message || "Failed to remove member.");
            }
          } catch (err) {
            console.error("Error removing member:", err);
            Alert.alert("Error", "Something went wrong.");
          }
        },
      },
    ]
  );
};
  const getFloatStyle = {
    transform: [
      {
        translateY: iconFloatAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -10, 0],
        }),
      },
    ],
  };

  // Render each expense
  const renderExpenseItem = ({ item }: { item: any }) => {
    const paidByMember =
      item.paidBy?.name ||
      item.paidby?.name ||
      group?.members.find(
        (m: any) => m._id === item.paidBy?._id || m._id === item.paidby
      )?.name ||
      "Unknown";

    return (
      <Expenses
        key={item._id}
        title={item.description}
        amount={item.amount}
        paidBy={paidByMember}
      />
    );
  };

  // --- UPDATED Component for Group Details ---
  const GroupDetailsInfo = () => (
    <View style={detailsStyles.detailsContainer}>
      <Text style={detailsStyles.detailHeader}>
        Group Information
      </Text>

      <View style={detailsStyles.card}>
        <View style={detailsStyles.detailRow}>
          <Ionicons name="folder-open-outline" size={20} color="#FFD700" />
          <Text style={detailsStyles.detailLabel}>Group Name:</Text>
          <Text style={detailsStyles.detailValue}>{group.name}</Text>
        </View>

        <View style={detailsStyles.detailRow}>
          <Ionicons name="document-text-outline" size={20} color="#64B5F6" />
          <Text style={detailsStyles.detailLabel}>Description:</Text>
          <Text style={detailsStyles.detailValue}>
            {group.description || "No description provided"}
          </Text>
        </View>

        <View style={[detailsStyles.detailRow, { alignItems: "center" }]}>
  <Ionicons name="qr-code-outline" size={20} color="#FFD700" />
  <Text style={detailsStyles.detailLabel}>Invite ID:</Text>

  <View style={detailsStyles.inviteRow}>
    <Text style={detailsStyles.detailValue}>{group.inviteid}</Text>

    <TouchableOpacity
      style={detailsStyles.copyButton}
      onPress={handleCopyInviteId}
    >
      <Ionicons name="copy-outline" size={18} color="#FFD700" />
    </TouchableOpacity>
  </View>
</View>
        {/* 🌟 NEW: Members List Section */}
        <View style={detailsStyles.membersList}>
  {group.members.map((member: any) => (
    <View key={member._id || member.id} style={detailsStyles.memberItem}>
      <Ionicons name="person-circle-outline" size={18} color="#e0e0e0" />

      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <Text style={detailsStyles.memberName}>
          {member.name || "Unnamed Member"}
        </Text>

        {/* 🏷️ Mark admin */}
        {member._id === group.createdBy && (
          <Text style={detailsStyles.adminTag}> (Admin)</Text>
        )}
      </View>

      {/* 🗑️ Delete button - visible only to admin */}
      {currentUser && group.createdBy === currentUser.id && member._id !== group.createdBy && (
        <TouchableOpacity
          onPress={() => handleDeleteMember(member._id)}
          style={detailsStyles.deleteMemberIcon}
        >
          <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
        </TouchableOpacity>
      )}
    </View>
  ))}
</View>
        {/* 🌟 END NEW: Members List Section */}

      </View>

      {/* Placeholder for Balances or other info you might re-add later */}
      <View style={detailsStyles.balancesPlaceholder}>
          <Text style={detailsStyles.placeholderText}>
              Financial Balances are currently not available in this view.
          </Text>
      </View>
    </View>
  );
  // --- END Component ---

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#fff"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );

  if (!group)
    return (
      <Text style={{ color: "#fff", textAlign: "center", marginTop: 50 }}>
        Group not found.
      </Text>
    );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.contentWrapper}>
        <GroupName name={group.name} />

        <View style={styles.tabRow}>
          <TabButton
            label="Expenses"
            isActive={activeTab === "Expenses"}
            onPress={() => setActiveTab("Expenses")}
          />
          {/* RENAMED Tab Label and onPress */}
          <TabButton
            label="Group Details"
            isActive={activeTab === "Details"}
            onPress={() => setActiveTab("Details")}
          />
        </View>

        <View style={styles.content}>
          {activeTab === "Expenses" ? (
            <>
              <MyExpenses expenses={expenses} currentUserId="user_1" />
              <TotalExpenses expenses={expenses} />

              <FlatList
                data={expenses}
                keyExtractor={(item, index) => item._id || index.toString()}
                renderItem={renderExpenseItem}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No expenses yet. Add one!</Text>
                }
              />

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.addButtonText}>+ Add Expense</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Renders the new GroupDetailsInfo component
            <GroupDetailsInfo />
          )}
        </View>

        <AddExpenseModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={(expense) => handleAddExpense(expense)}
          members={group.members.map((m: any) => ({
            id: m._id || m.id,
            name: m.name || "Unnamed",
          }))}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
 
  container: { flex: 1, backgroundColor: "#0a1421" },
  contentWrapper: { flex: 1 },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  content: { flex: 1, padding: 20 },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#2e86de",
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  emptyText: {
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

// --- NEW/UPDATED STYLES FOR GROUP DETAILS ---
const detailsStyles = StyleSheet.create({
   adminTag: {
  color: "#FFD700",
  fontWeight: "600",
  fontSize: 13,
  marginLeft: 4,
},

deleteMemberIcon: {
  padding: 6,
  backgroundColor: "rgba(255, 107, 107, 0.1)",
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "rgba(255,107,107,0.3)",
  marginLeft: 10,
},
inviteRow: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  flex: 1,
  justifyContent: "space-between",
},

copyButton: {
  padding: 6,
  borderRadius: 8,
  backgroundColor: "rgba(255, 215, 0, 0.1)",
  borderWidth: 1,
  borderColor: "rgba(255, 215, 0, 0.3)",
},
    detailsContainer: {
        flex: 1,
        paddingTop: 10,
        gap: 20,
    },
    detailHeader: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFD700',
        marginBottom: 10,
        textAlign: 'center',
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 15,
        padding: 20,
        gap: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#a0a0a0',
        marginLeft: 10,
        minWidth: 90,
    },
    detailValue: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
    // Styles for the new Members List
    membersListContainer: {
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    membersListHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    membersListTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#96E6A1',
    },
    membersList: {
        gap: 8,
        paddingHorizontal: 5,
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
    },
    memberName: {
        fontSize: 15,
        color: '#e0e0e0',
        fontWeight: '500',
    },
    // End Styles for the new Members List
    balancesPlaceholder: {
        marginTop: 30,
        padding: 15,
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        borderRadius: 10,
        borderLeftWidth: 3,
        borderLeftColor: 'red',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#ffcdd2',
        fontSize: 14,
        fontStyle: 'italic',
    }
});