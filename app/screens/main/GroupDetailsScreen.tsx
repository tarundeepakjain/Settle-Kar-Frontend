import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Alert,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddExpenseModal from "../../components/AddExpenseModal";
import GroupName from "@/app/components/GroupName";
import TabButton from "@/app/components/TabButton";
import Expenses from "@/app/components/Expenses";
import MyExpenses from "@/app/components/MyExpenses";
import TotalExpenses from "@/app/components/TotalExpenses";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { getAccessToken } from "@/helper/auth";
import { supabase } from "@/utils/supabase";

// Added "Settlements" to ActiveTab type
type ActiveTab = "Expenses" | "Details" | "Settlements";

type Member = {
  _id: string;
  role: string,
  name?: string
};

type Group = {
  _id: string;
  name: string;
  description?: string;
  members: Member[];
  code?: string;
  inviteid: string;
  createdBy?: string;
};

export default function GroupDetails({ route }: { route: any }) {
  const { groupId } = route.params;
  const [group, setGroup] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]); // New state for backend balances
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("Expenses");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [groupSize, setGroupSize] = useState<number>(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data.user);
    };
    loadUser();
  }, []);

  const handleCopyInviteId = async () => {
    try {
      await Clipboard.setStringAsync(group.inviteid);
      Alert.alert("Copied!", "Invite ID copied to clipboard.");
    } catch (err) {
      Alert.alert("Error", "Failed to copy invite ID.");
    }
  };

  const normalizeGroups = (data: any[]): Group[] => {
    return data.map((item) => {
      const group = item.group ?? item.Groups ?? item;
      return {
        _id: group.id,
        name: group.group_name,
        description: group.description,
        inviteid: group.invite_id,
        code: group.invite_id,
        createdBy: group.created_by,
        members: (group.Group_members || []).map((m: any) => ({
          _id: m.user_id,
          role: m.role,
          name: m.Profiles?.name ?? "Unknown",
          email: m.Profiles?.email,
        })),
      };
    });
  };

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      if (!token) return;

      // Fetch Group Info
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL!}/group/fetch/${groupId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      const normalized = normalizeGroups([data]);
      setGroupSize(normalized[0].members.length);
      setGroup(normalized[0]);

      // Fetch Transactions
      const txRes = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL!}/transaction/get-group/${groupId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const txData = await txRes.json();
      setExpenses(txData.data || []);

      // NEW: Fetch Balances/Distribution from backend
      const balRes = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL!}/transaction/get-my-balances/${groupId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const balData = await balRes.json();
      setBalances(balData.balances || []); // Expecting array of { userId, name, netBalance }

    } catch (error) {
      console.error("Fetch group error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const handleAddExpense = async (expense: any) => {
    if (!expense.paidById) return Alert.alert("Error", "Please select who paid");
    const payload = {
      desc: expense.title,
      amount: Number(expense.amount),
      paidById: expense.paidById,
      splitAmong: expense.splitBetweenIds,
    };

    try {
      const token = await getAccessToken();
      if (!token) return;
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL!}/transaction/add-group/${groupSize}/${groupId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        setModalVisible(false);
        fetchGroupDetails();
        Alert.alert("Success", "Expense added!");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to add expense");
    }
  };

  const handleDeleteTransaction = (transactionId: string) => {
    Alert.alert(
      "Confirm Removal",
      "Delete this transaction permanently?",
      [
        { text: "Keep", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              console.log("Deleting transaction:", transactionId);
              setExpenses(prev => prev.filter(ex => ex._id !== transactionId));
              // Note: You should call your backend delete here to keep balances in sync
            } catch (err) {
              Alert.alert("Error", "Could not delete transaction");
            }
          } 
        }
      ]
    );
  };

  const handleDeleteMember = async (memberid: string) => {
    Alert.alert("Remove Member", "Kick this member from the group?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("accessToken");
            const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/group/${groupId}/delete-member`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ memberid }),
            });
            if (res.ok) {
              setGroup((prev: any) => ({
                ...prev,
                members: prev.members.filter((m: any) => m._id !== memberid),
              }));
            }
          } catch (err) { Alert.alert("Error", "Something went wrong."); }
        },
      },
    ]);
  };

  const renderExpenseItem = ({ item }: { item: any }) => {
    const paidByMember = item.paidBy?.name || item.paidby?.name || 
      group?.members.find((m: any) => m._id === (item.paidBy?._id || item.paidby))?.name || "Unknown";

    return (
      <View style={styles.expenseWrapper}>
        <View style={styles.expenseContent}>
          <Expenses
            key={item._id}
            title={item.description}
            amount={item.amount}
            paidBy={paidByMember}
          />
        </View>
        <TouchableOpacity 
          onPress={() => handleDeleteTransaction(item._id)}
          style={styles.deleteAction}
        >
          <Ionicons name="trash-outline" size={18} color="#FF5252" />
        </TouchableOpacity>
      </View>
    );
  };

  const SettlementDistribution = () => {
    // Find the current user's balance from the backend data
    const myData = balances.find(b => b.userId === currentUser?.id);
    console.log(myData);
    const myNetBalance = balances.reduce(
      (sum, b) => sum - Number(b.netBalance),
      0
    );

    const myBalance = myData ? myNetBalance : 0;

    return (
      <Animated.View style={[detailsStyles.detailsContainer, { opacity: fadeAnim }]}>
        <Text style={detailsStyles.sectionTitle}>Your Balance</Text>
        <View style={detailsStyles.glassCard}>
           <Text style={[
             styles.balanceAmount, 
             { color: myBalance >= 0 ? '#10B981' : '#FF5252' }
           ]}>
             {myBalance >= 0 ? `+₹${myBalance}` : `-₹${Math.abs(myBalance)}`}
           </Text>
           <Text style={styles.balanceSubtext}>
             {myBalance >= 0 ? "You are owed in total" : "You borrowed in total"}
           </Text>
        </View>

        <Text style={detailsStyles.sectionTitle}>Member Breakdown</Text>
        <View style={detailsStyles.membersStack}>
          {balances.map((item: any) => {
            if (item.userId === currentUser?.id) return null;
            return (
              <View key={item.userId} style={detailsStyles.memberCard}>
                <View style={detailsStyles.avatarCircle}>
                  <Text style={detailsStyles.avatarInitial}>{(item.name || "?")[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={detailsStyles.memberNameText}>{item.name}</Text>
                </View>
                <Text style={[
                  styles.memberBalance, 
                  { color: item.netBalance >= 0 ? '#10B981' : '#FF5252' }
                ]}>
                  {item.netBalance >= 0 ? `+${item.netBalance}` : `${item.netBalance}`}
                </Text>
              </View>
            );
          })}
        </View>
      </Animated.View>
    );
  };

  const GroupDetailsInfo = () => (
    <Animated.View style={[detailsStyles.detailsContainer, { opacity: fadeAnim }]}>
      <Text style={detailsStyles.sectionTitle}>General Info</Text>

      <View style={detailsStyles.glassCard}>
        <View style={detailsStyles.row}>
          <View style={[detailsStyles.iconBox, { backgroundColor: '#FFD70020' }]}>
            <Ionicons name="bookmark" size={18} color="#FFD700" />
          </View>
          <View style={detailsStyles.infoContent}>
            <Text style={detailsStyles.label}>Group Name</Text>
            <Text style={detailsStyles.value}>{group.name}</Text>
          </View>
        </View>

        <View style={detailsStyles.row}>
          <View style={[detailsStyles.iconBox, { backgroundColor: '#8e2de220' }]}>
            <Ionicons name="reader" size={18} color="#A78BFA" />
          </View>
          <View style={detailsStyles.infoContent}>
            <Text style={detailsStyles.label}>Description</Text>
            <Text style={detailsStyles.value}>{group.description || "No description set"}</Text>
          </View>
        </View>

        <View style={[detailsStyles.row, { borderBottomWidth: 0 }]}>
          <View style={[detailsStyles.iconBox, { backgroundColor: '#10B98120' }]}>
            <Ionicons name="key" size={18} color="#10B981" />
          </View>
          <View style={detailsStyles.infoContent}>
            <Text style={detailsStyles.label}>Invite Code</Text>
            <View style={detailsStyles.inviteBox}>
              <Text style={detailsStyles.codeText}>{group.inviteid}</Text>
              <TouchableOpacity style={detailsStyles.copyFab} onPress={handleCopyInviteId}>
                <Ionicons name="copy-outline" size={14} color="#FFD700" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <Text style={detailsStyles.sectionTitle}>Members ({group.members.length})</Text>
      <View style={detailsStyles.membersStack}>
        {group.members.map((member: any) => (
          <View key={member._id || member.id} style={detailsStyles.memberCard}>
            <View style={detailsStyles.avatarCircle}>
               <Text style={detailsStyles.avatarInitial}>{(member.name || "?")[0].toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={detailsStyles.memberNameText}>{member.name || "Unknown"}</Text>
              {member._id === group.createdBy && (
                <View style={detailsStyles.badge}>
                  <Text style={detailsStyles.badgeText}>Admin</Text>
                </View>
              )}
            </View>
            {currentUser && group.createdBy === currentUser.id && member._id !== group.createdBy && (
              <TouchableOpacity onPress={() => handleDeleteMember(member._id)} style={detailsStyles.removeBtn}>
                <Ionicons name="close-circle-outline" size={20} color="#FF5252" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading your group...</Text>
      </View>
    );
  }

  if (!group) return <View style={styles.container}><Text style={styles.emptyText}>Group not found.</Text></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <GroupName name={group.name} />

        <View style={styles.tabContainer}>
          <TabButton 
            label="Expenses" 
            isActive={activeTab === "Expenses"} 
            onPress={() => setActiveTab("Expenses")} 
          />
          <TabButton 
            label="Balances" 
            isActive={activeTab === "Settlements"} 
            onPress={() => setActiveTab("Settlements")} 
          />
          <TabButton 
            label="Settings" 
            isActive={activeTab === "Details"} 
            onPress={() => setActiveTab("Details")} 
          />
        </View>

        <View style={styles.mainContent}>
          {activeTab === "Expenses" ? (
            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
              <MyExpenses expenses={expenses} currentUserId={currentUser?.id} />
              <TotalExpenses expenses={expenses} />
              <FlatList
                data={expenses}
                contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item._id || index.toString()}
                renderItem={renderExpenseItem}
                ListEmptyComponent={<Text style={styles.emptyText}>Everything's settled. No expenses!</Text>}
              />
              <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Ionicons name="add-sharp" size={32} color="#0F0C29" />
              </TouchableOpacity>
            </Animated.View>
          ) : activeTab === "Settlements" ? (
            <SettlementDistribution />
          ) : (
            <GroupDetailsInfo />
          )}
        </View>

        <AddExpenseModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleAddExpense}
          members={group.members.map((m: any) => ({ id: m._id || m.id, name: m.name || "Unnamed" }))}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0F0C29", 
    justifyContent: 'center' 
  },
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? 40 : 10 },
  loadingText: { color: "#A78BFA", fontSize: 14, marginTop: 15, fontWeight: '500' },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 25,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  mainContent: { flex: 1, paddingHorizontal: 20, paddingTop: 15 },
  fab: {
    position: "absolute",
    right: 5,
    bottom: 30,
    backgroundColor: "#FFD700",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  expenseWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    marginBottom: 12,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  expenseContent: { flex: 1 },
  deleteAction: {
    padding: 12,
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    borderRadius: 12,
  },
  emptyText: { 
    color: "rgba(167, 139, 250, 0.4)", 
    textAlign: "center", 
    marginTop: 60, 
    fontSize: 16,
    fontStyle: 'italic'
  },
  // Added balance styles
  balanceAmount: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 10
  },
  balanceSubtext: {
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  memberBalance: {
    fontSize: 16,
    fontWeight: '700'
  }
});

const detailsStyles = StyleSheet.create({
  detailsContainer: { flex: 1, paddingVertical: 5 },
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: '800', 
    color: '#A78BFA', 
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    paddingLeft: 5
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: { flex: 1 },
  label: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' },
  value: { fontSize: 16, color: '#FFFFFF', marginTop: 4, fontWeight: '600' },
  inviteBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  codeText: { fontSize: 18, color: '#FFD700', fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  copyFab: { 
    padding: 8, 
    backgroundColor: 'rgba(255, 215, 0, 0.15)', 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)'
  },
  membersStack: { gap: 12, paddingBottom: 40 },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6D28D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  avatarInitial: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  memberNameText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  badge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  badgeText: { color: '#FFD700', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  removeBtn: { padding: 6 },
});