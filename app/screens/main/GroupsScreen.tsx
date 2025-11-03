import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  Button,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  SafeAreaView,
  Share,
  Clipboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import { Ionicons } from "@expo/vector-icons";
// Local code generator (8-character version)
const generateGroupCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++)
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
};

// Validator for 8-character group codes
const validateGroupCode = (code: string) => /^[A-Z0-9]{8}$/.test(code);

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
};

interface MyJwtPayload {
  name: string;
  email: string;
  id: string;
  exp?: number;
}

export default function GroupsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");

  // Code feature states
  const [codeModalVisible, setCodeModalVisible] = useState(false);
  const [codeModalMode, setCodeModalMode] = useState<"generate" | "join">(
    "generate"
  );
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  // Animations
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const iconFloatAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.timing(iconFloatAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [iconFloatAnim, fadeAnim]);
  
  useEffect(() => {
    // Check if the parameter was passed from HomeScreen
    if (route.params?.openCreateGroup) {
      setModalVisible(true);

      // Clear the parameter to prevent reopening on subsequent navigations
      navigation.setParams({ openCreateGroup: undefined });
    }
  }, [route.params?.openCreateGroup, navigation]);
  
  useEffect(() => {
    if (codeModalVisible) {
      setInputCode("");
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(1);
      scaleAnim.setValue(0.9);
    }
  }, [codeModalVisible, fadeAnim, scaleAnim]);
  
  const JoinGroup = async () => {
    console.log("join grp called");

    try {
      let token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("No token found. Please log in again.");
        return;
      }

      console.log(inputCode);
      const response = await fetch(
        "https://settlekar.onrender.com:5001/group/join",
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ inviteid: inputCode })
        }
      );
      
      console.log(response.status);
      setIsJoining(true);
      
      if (!response.ok) {
        Alert.alert(
          "Invalid Code",
          "The group code you entered does not exist or has expired.",
          [{ text: "Try Again" }]

        );
        setIsJoining(false);
        console.warn("Failed to add");
        return;
      }


      // Simulate joining process
      Alert.alert(
        "Success!",
        `You have joined the group with code ${inputCode}`,);

      setIsJoining(false);
      const loadGroups = async () => {
        const data = await fetchGroups();
        if (data) setGroups(data);
        setLoading(false);
      };
      loadGroups();

    } catch (error) {
      console.error(error);
    }
  };

  const getFloatStyle = (delay: number) => ({
    transform: [
      {
        translateY: iconFloatAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -15, 0],
        }),
      },
    ],
  });

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

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) return null;

      const response = await fetch(
        "https://settlekar.onrender.com/auth/refresh",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!response.ok) {
        console.warn("Failed to refresh access token");
        return null;
      }

      const data = await response.json();
      await AsyncStorage.setItem("accessToken", data.accessToken);
      console.log("🔄 Access token refreshed successfully!");
      return data.accessToken;
    } catch (err) {
      console.error("Error refreshing token:", err);
      return null;
    }
  };

  const isTokenExpired = (decoded: MyJwtPayload) => {
    if (!decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  };

  const fetchGroups = React.useCallback(async (): Promise<
    Group[] | undefined
  > => {
    try {
      let token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("No token found. Please log in again.");
        return;
      }
      let decoded = jwtDecode<MyJwtPayload>(token);

      while (isTokenExpired(decoded)) {
        console.log("⚠️ Access token expired, refreshing...");
        const newToken = await refreshAccessToken();
        if (!newToken) {
          console.log("❌ Failed to refresh token, logging out...");
          return;
        }
        token = newToken;
        decoded = jwtDecode<MyJwtPayload>(token);
      }

      const response = await fetch(
        "https://settlekar.onrender.com/group/my-groups",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data;
      try {
        data = await response.json();
      } catch {
        console.error("⚠️ Response was not JSON:", response);
        Alert.alert("Server error", "Invalid server response");
        return;
      }

      if (response.ok) {
        console.log("✅ Groups fetched:", data);
        return data as Group[];
      } else {
        console.error("❌ Failed to fetch groups. Full response:", data);
        Alert.alert(
          "Error",
          data.message ||
          data.error ||
          `Failed to fetch groups (${response.status})`
        );
        return;
      }
    } catch (err: any) {
      console.error("💥 Network or fetch error:", err);
      Alert.alert(
        "Error",
        err.message || "Network error while fetching groups"
      );
    }
  }, []);

  const createGroup = async () => {
    try {
      if (!newGroupName.trim()) {
        Alert.alert("Group name required!");
        return;
      }

      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("No token found. Please log in again.");
        return;
      }
      const user = await getUserFromToken();

      const response = await fetch("https://settlekar.onrender.com/group/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newGroupName,
          description: newGroupDesc,
          members: [user?.id],
          createdBy: user?.id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Group created successfully!");
        const updatedGroups = await fetchGroups();
        if (updatedGroups) setGroups(updatedGroups);
        setModalVisible(false);
        setNewGroupName("");
        setNewGroupDesc("");
      } else {
        Alert.alert("Error", data.message || "Failed to create group.");
      }
    } catch (err) {
      console.error("Error creating group:", err);
      Alert.alert("Error creating group");
    }
  };

  // Code feature functions
  const handleGenerateCode = (group: Group) => {
    const code = generateGroupCode();
    setGeneratedCode(code);
    setSelectedGroup(group);
    setCodeModalMode("generate");
    setCodeModalVisible(true);

    // Update group with code in local state
    setGroups(groups.map((g) => (g._id === group._id ? { ...g, code } : g)));
  };

  const handleJoinWithCode = () => {
    setCodeModalMode("join");
    setCodeModalVisible(true);

  };

  const handleCopyCode = () => {
    if (Platform.OS === "web") {
      navigator.clipboard.writeText(generatedCode);
      Alert.alert("Copied!", "Group code copied to clipboard");
    } else {
      Clipboard.setString(generatedCode);
      Alert.alert("Copied!", "Group code copied to clipboard");
    }
  };

  const handleShareCode = async () => {
    try {
      const message = `Join my group "${selectedGroup?.name}" on SettleKar using code: ${generatedCode}`;

      if (Platform.OS === "web") {
        if (navigator.share) {
          await navigator.share({
            title: "Join Group",
            text: message,
          });
        } else {
          handleCopyCode();
        }
      } else {
        await Share.share({
          message: message,
          title: "Join Group on SettleKar",
        });
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleJoinGroup = () => {
    const trimmedCode = inputCode.trim().toUpperCase();

    if (!trimmedCode) {
      Alert.alert("Invalid Code", "Please enter a group code");
      return;
    }

    if (!validateGroupCode(trimmedCode)) {
      Alert.alert("Invalid Code", "Code must be 8 alphanumeric characters");
      return;
    }

    setIsJoining(true);

    // Simulate joining process
    setTimeout(() => {
      setIsJoining(false);

      // Simulate success/failure (80% success rate)
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        Alert.alert(
          "Success!",
          `You have joined the group with code ${trimmedCode}`,
          [
            {
              text: "OK",
              onPress: async () => {
                const updatedGroups = await fetchGroups();
                if (updatedGroups) setGroups(updatedGroups);
                setCodeModalVisible(false);
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Invalid Code",
          "The group code you entered does not exist or has expired.",
          [{ text: "Try Again" }]
        );
      }
    }, 1500);
  };

  const handleInputChange = (text: string) => {
    // const upperText = text.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setInputCode(text.slice(0, 8));
  };

  useEffect(() => {
    const loadGroups = async () => {
      const data = await fetchGroups();
      if (data) setGroups(data);
      setLoading(false);
    };
    loadGroups();
  }, [fetchGroups]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.background}>
          <View style={styles.gradientOverlay} />
          <View style={[styles.orb, styles.orb1]}>
            <View style={styles.orbInner} />
          </View>
          <View style={[styles.orb, styles.orb2]}>
            <View style={styles.orbInner} />
          </View>
        </View>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading groups...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.background}>
        <View style={styles.gradientOverlay} />

        <Animated.View
          style={[
            styles.floatingIcon,
            styles.iconGlow,
            { left: "10%", top: "25%" },
            getFloatStyle(0),
          ]}
        >
          <Ionicons
            name="people-outline"
            size={32}
            color="rgba(255, 215, 0, 0.6)"
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingIcon,
            styles.iconGlow,
            { right: "15%", top: "20%" },
            getFloatStyle(1000),
          ]}
        >
          <Ionicons
            name="qr-code-outline"
            size={28}
            color="rgba(100, 200, 255, 0.6)"
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingIcon,
            styles.iconGlow,
            { left: "15%", bottom: "20%" },
            getFloatStyle(500),
          ]}
        >
          <Ionicons
            name="share-social-outline"
            size={30}
            color="rgba(150, 255, 150, 0.5)"
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingIcon,
            styles.iconGlow,
            { right: "10%", bottom: "30%" },
            getFloatStyle(1500),
          ]}
        >
          <Ionicons name="star" size={24} color="rgba(255, 215, 0, 0.7)" />
        </Animated.View>

        <View style={[styles.orb, styles.orb1]}>
          <View style={styles.orbInner} />
        </View>
        <View style={[styles.orb, styles.orb2]}>
          <View style={styles.orbInner} />
        </View>
        <View style={[styles.orb, styles.orb3]}>
          <View style={styles.orbInner} />
        </View>
      </View>

      <SafeAreaView style={styles.contentWrapper}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Groups</Text>
          <View style={styles.titleDivider} />
          <Text style={styles.subtitle}>Manage your expense groups</Text>
        </View>

        <Button title="➕ Create Group" onPress={() => setModalVisible(true)} />

        <FlatList
          data={groups}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Animated.View style={[styles.groupCard, { opacity: fadeAnim }]}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("GroupDetails", { groupId: item._id })
                }
                activeOpacity={0.8}
              >
                <View style={styles.groupHeader}>
                  <View style={styles.groupIconContainer}>
                    <Ionicons name="people" size={24} color="#FFD700" />
                  </View>
                  
                  <View style={styles.groupInfo}>
                    {/* 🌟 CORRECTED STRUCTURE: Name and ID Row */}
                    <View style={styles.nameAndIdRow}>
                        {/* Wrapper with flex: 1 for Group Name to use available space */}
                        <View style={{ flex: 1 }}> 
                          <Text style={styles.groupName} numberOfLines={1}>
                            {item.name}
                          </Text>
                        </View>
                        {/* Invite ID Pill */}
                        <View style={styles.inviteIdPill}>
                          <Ionicons name="finger-print" size={12} color="#64B5F6" />
                          <Text style={styles.inviteIdText}>ID: {item._id}</Text>
                        </View>
                    </View>
                    {/* END CORRECTED STRUCTURE */}

                    {item.description ? (
                      <Text style={styles.groupDesc}>{item.description}</Text>
                    ) : null}
                    
                    <View style={styles.groupMeta}>
                      <Ionicons name="person" size={12} color="#a0a0a0" />
                      <Text style={styles.groupMetaText}>
                        {item.members.length} members
                      </Text>
                    </View>
                  </View>
                  
                  {item.code && (
                    <View style={styles.codeIndicator}>
                      <Ionicons name="qr-code" size={14} color="#96E6A1" />
                      <Text style={styles.codeIndicatorText}>{item.code}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="people-outline"
                size={64}
                color="rgba(255, 255, 255, 0.2)"
              />
              <Text style={styles.emptyText}>No groups found</Text>
              <Text style={styles.emptySubtext}>
                Create or join a group to get started
              </Text>
            </View>
          }
        />

        {/* Floating Join Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={handleJoinWithCode}
          activeOpacity={0.9}
        >
          <View style={styles.fabGlow} />
          <Ionicons name="enter" size={28} color="#0a1421" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Create Group Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
            padding: 20,
          }}
        >
          <View
            style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Create New Group
            </Text>
            <TextInput
              placeholder="Group Name"
              value={newGroupName}
              onChangeText={setNewGroupName}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                marginBottom: 10,
                borderRadius: 5,
              }}
            />
            <TextInput
              placeholder="Description"
              value={newGroupDesc}
              onChangeText={setNewGroupDesc}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                marginBottom: 10,
                borderRadius: 5,
              }}
            />
            <Button title="Create" onPress={createGroup} />
            <View style={{ marginTop: 10 }}>
              <Button
                title="Cancel"
                color="red"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Code Modal */}
      <Modal
        visible={codeModalVisible}
        transparent
        animationType="none"
        onRequestClose={() => setCodeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            {/* Header */}
            <View style={styles.codeModalHeader}>
              <View style={styles.headerTitleContainer}>
                <View style={styles.headerIconContainer}>
                  <Ionicons
                    name={codeModalMode === "generate" ? "qr-code" : "enter"}
                    size={24}
                    color="#FFD700"
                  />
                </View>
                <Text style={styles.headerTitle}>
                  {codeModalMode === "generate" ? "Group Code" : "Join Group"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setCodeModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.codeModalContent}>
              {codeModalMode === "generate" ? (
                <>
                  <View style={styles.infoContainer}>
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color="#64B5F6"
                    />
                    <Text style={styles.infoText}>
                      Share this code with others to invite them to{" "}
                      {selectedGroup?.name}
                    </Text>
                  </View>

                  <View style={styles.codeDisplayContainer}>
                    <Text style={styles.codeLabel}>Group Code</Text>
                    <View style={styles.codeBox}>
                      {generatedCode.split("").map((char, index) => (
                        <View key={index} style={styles.codeCharBox}>
                          <Text style={styles.codeChar}>{char}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.codeSubtext}>
                      Code expires in 24 hours
                    </Text>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={handleCopyCode}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="copy" size={20} color="#0a1421" />
                      <Text style={styles.primaryButtonText}>Copy Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={handleShareCode}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="share-social" size={20} color="#FFD700" />
                      <Text style={styles.secondaryButtonText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.infoContainer}>
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color="#64B5F6"
                    />
                    <Text style={styles.infoText}>
                      Enter the 8-character code you received to join a group
                    </Text>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Enter Code</Text>
                    <TextInput
                      style={styles.codeInput}
                      value={inputCode}
                      onChangeText={handleInputChange}
                      placeholder="XXXXXXXX"
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                      maxLength={8}
                      editable={!isJoining}
                    />
                    <Text style={styles.inputHint}>
                      {inputCode.length}/8 characters
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.joinButton,
                      (isJoining || inputCode.length !== 8) &&
                      styles.joinButtonDisabled,
                    ]}
                    onPress={JoinGroup}
                    activeOpacity={0.8}
                    disabled={isJoining || inputCode.length !== 8}
                  >
                    {isJoining ? (
                      <>
                        <Ionicons name="hourglass" size={20} color="#0a1421" />
                        <Text style={styles.joinButtonText}>Joining...</Text>
                      </>
                    ) : (
                      <>
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#0a1421"
                        />
                        <Text style={styles.joinButtonText}>Join Group</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a1421",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  floatingIcon: {
    position: "absolute",
  },
  iconGlow: {
    ...Platform.select({
      ios: {
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  orb: {
    position: "absolute",
    borderRadius: 9999,
    opacity: 0.12,
  },
  orb1: {
    width: 200,
    height: 200,
    backgroundColor: "#FFD700",
    top: "15%",
    left: "10%",
  },
  orb2: {
    width: 240,
    height: 240,
    backgroundColor: "#2e86de",
    bottom: "20%",
    right: "15%",
  },
  orb3: {
    width: 160,
    height: 160,
    backgroundColor: "#96E6A1",
    top: "60%",
    left: "60%",
    opacity: 0.08,
  },
  orbInner: {
    width: "100%",
    height: "100%",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    position: "relative",
    zIndex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    zIndex: 2,
  },
  loadingText: {
    color: "#a0a0a0",
    fontSize: 14,
    letterSpacing: 0.3,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
    textShadowColor: "rgba(255, 215, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  titleDivider: {
    width: 60,
    height: 3,
    backgroundColor: "#FFD700",
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 8,
  },
  subtitle: {
    color: "#a0a0a0",
    fontSize: 14,
    letterSpacing: 0.3,
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 16,
  },
  groupCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    gap: 16,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  groupIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  groupInfo: {
    flex: 1,
  },
  // 🌟 NEW/UPDATED STYLE: Container for Name and Invite ID
  nameAndIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 4,
    gap: 10,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
    // marginBottom: 4, // Removed since it's now in a row
  },
  // 🌟 NEW STYLE: Pill for Invite ID
  inviteIdPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(100, 200, 255, 0.1)', // Light blue background
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(100, 200, 255, 0.3)',
  },
  inviteIdText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64B5F6', // Blue text color
    letterSpacing: 0.5,
  },
  groupDesc: {
    fontSize: 13,
    color: "#a0a0a0",
    marginBottom: 4,
  },
  groupMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  groupMetaText: {
    fontSize: 12,
    color: "#a0a0a0",
    letterSpacing: 0.2,
  },
  codeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(150, 230, 161, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(150, 230, 161, 0.3)",
  },
  codeIndicatorText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#96E6A1",
    letterSpacing: 1,
  },
  groupActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
    gap: 6,
  },
  actionButtonSecondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFD700",
    letterSpacing: 0.3,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.4)",
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.3)",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#FFD700",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#FFD700",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    zIndex: 10,
  },
  fabGlow: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,215,0,0.12)",
    left: -13,
    top: -13,
    zIndex: -1,
  },

  /* Code modal styles */
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#1a2332",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.12)",
  },
  codeModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
    backgroundColor: "rgba(255,215,0,0.03)",
  },
  headerTitleContainer: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,215,0,0.12)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.2)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 8,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },

  codeModalContent: { padding: 20 },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  infoText: { color: "#a0a0a0", marginLeft: 8, flex: 1 },

  codeDisplayContainer: { alignItems: "center", marginVertical: 12 },
  codeLabel: { color: "#a0a0a0", fontSize: 12, marginBottom: 8 },
  codeBox: { flexDirection: "row", gap: 8 },
  codeCharBox: {
    width: 48,
    height: 56,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  codeChar: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
  codeSubtext: { color: "#a0a0a0", fontSize: 12, marginTop: 8 },

  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    justifyContent: "center",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  primaryButtonText: { color: "#0a1421", fontWeight: "700", marginLeft: 8 },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.2)",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  secondaryButtonText: { color: "#FFD700", fontWeight: "700", marginLeft: 8 },

  inputContainer: { marginTop: 12 },
  inputLabel: { color: "#a0a0a0", marginBottom: 8 },
  codeInput: {
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    letterSpacing: 6,
    textAlign: "center",
    fontSize: 18,
  },
  inputHint: { color: "#a0a0a0", marginTop: 6, fontSize: 12 },

  joinButton: {
    marginTop: 16,
    backgroundColor: "#96E6A1",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  joinButtonDisabled: { opacity: 0.6 },
  joinButtonText: { color: "#0a1421", fontWeight: "700" },

  /* end styles */
});