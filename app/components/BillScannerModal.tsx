import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
  Platform,
  Alert,
  Animated,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

type BillData = {
  id: string;
  imageUri?: string;
  timestamp: string;
  category?: string;
  amount?: number;
  description?: string;
  ocrText?: string;
};

type BillScannerProps = {
  visible: boolean;
  onClose: () => void;
  onSaveBill: (billData: BillData) => void;
  onOCRProcess?: (billData: BillData) => void;
};

export default function BillScannerModal({
  visible,
  onClose,
  onSaveBill,
  onOCRProcess,
}: BillScannerProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);

  const [manualCategory, setManualCategory] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualDescription, setManualDescription] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      setCapturedImage(null);
      setManualEntry(false);
      setManualCategory("");
      setManualAmount("");
      setManualDescription("");
      setIsProcessing(false);

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
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible, fadeAnim, scaleAnim]);

  // Camera permission
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to scan bills.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  // Capture / Pick image
  const openCamera = async () => {
    if (!(await requestCameraPermission())) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) setCapturedImage(result.assets?.[0]?.uri || null);
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) setCapturedImage(result.assets?.[0]?.uri || null);
  };

  // Mock OCR
  const simulateOCR = async (billData: BillData) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        billData.ocrText = `Invoice #${Math.floor(Math.random() * 10000)}`;
        billData.amount = Math.floor(Math.random() * 1000) + 100;
        billData.category = ["Food", "Transport", "Shopping", "Bills"][
          Math.floor(Math.random() * 4)
        ];
        billData.description = "Scanned from bill image";
        resolve();
      }, 1500);
    });
  };

  const saveBill = async () => {
    setIsProcessing(true);
    try {
      let billData: BillData = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };

      if (!manualEntry && capturedImage) {
        billData.imageUri = capturedImage;
        await simulateOCR(billData);
      } else {
        billData.category = manualCategory || "Other";
        billData.amount = Number(manualAmount) || 0;
        billData.description = manualDescription || "Manually added";
      }

      onSaveBill(billData);
      if (onOCRProcess) onOCRProcess(billData);

      Alert.alert("Success", "Bill saved successfully!", [
        { text: "OK", onPress: handleClose },
      ]);
    } catch (error) {
      console.error("Error saving bill:", error);
      Alert.alert("Error", "Failed to save bill");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setCapturedImage(null);
    setManualEntry(false);
    setIsProcessing(false);
    setManualCategory("");
    setManualAmount("");
    setManualDescription("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <View style={styles.headerIconContainer}>
                <Ionicons name="scan" size={24} color="#FFD700" />
              </View>
              <Text style={styles.headerTitle}>Scan Bill</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {!manualEntry ? (
              !capturedImage ? (
                <View style={styles.captureContainer}>
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name="camera"
                      size={64}
                      color="rgba(255, 215, 0, 0.3)"
                    />
                    <Text style={styles.placeholderText}>
                      Capture or upload a bill image
                    </Text>
                    <Text style={styles.placeholderSubtext}>
                      Take a clear photo of your receipt
                    </Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={openCamera}
                    >
                      <Ionicons name="camera" size={24} color="#0a1421" />
                      <Text style={styles.primaryButtonText}>Open Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={pickFromGallery}
                    >
                      <Ionicons name="images" size={24} color="#FFD700" />
                      <Text style={styles.secondaryButtonText}>
                        Choose from Gallery
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setManualEntry(true)}>
                      <Text
                        style={{
                          color: "#FFD700",
                          marginTop: 8,
                          textAlign: "center",
                        }}
                      >
                        Enter Manually
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: capturedImage }} style={styles.image} />
                  <View style={styles.previewActions}>
                    <TouchableOpacity
                      style={styles.retakeButton}
                      onPress={() => setCapturedImage(null)}
                    >
                      <Ionicons name="refresh" size={20} color="#a0a0a0" />
                      <Text style={styles.retakeButtonText}>Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.saveButton,
                        isProcessing && styles.saveButtonDisabled,
                      ]}
                      onPress={saveBill}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <ActivityIndicator size="small" color="#0a1421" />
                          <Text style={styles.saveButtonText}>
                            Processing...
                          </Text>
                        </>
                      ) : (
                        <>
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#0a1421"
                          />
                          <Text style={styles.saveButtonText}>Save Bill</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setManualEntry(true)}>
                      <Text
                        style={{
                          color: "#FFD700",
                          marginTop: 8,
                          textAlign: "center",
                        }}
                      >
                        Edit Manually
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            ) : (
              <View style={{ gap: 16 }}>
                <Text
                  style={{ color: "#FFD700", fontSize: 16, fontWeight: "700" }}
                >
                  Manual Entry
                </Text>
                <TextInput
                  placeholder="Category (Food, Transport, etc.)"
                  placeholderTextColor="#a0a0a0"
                  style={styles.input}
                  value={manualCategory}
                  onChangeText={setManualCategory}
                />
                <TextInput
                  placeholder="Amount"
                  placeholderTextColor="#a0a0a0"
                  style={styles.input}
                  keyboardType="numeric"
                  value={manualAmount}
                  onChangeText={setManualAmount}
                />
                <TextInput
                  placeholder="Description"
                  placeholderTextColor="#a0a0a0"
                  style={styles.input}
                  value={manualDescription}
                  onChangeText={setManualDescription}
                />
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    isProcessing && styles.saveButtonDisabled,
                  ]}
                  onPress={saveBill}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color="#0a1421" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Bill</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

// =================== STYLES ===================
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(10, 20, 33, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#1a2332",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
    ...Platform.select({
      ios: {
        shadowColor: "#FFD700",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
      },
      android: { elevation: 12 },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,215,0,0.05)",
  },
  headerTitleContainer: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,215,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.3)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { padding: 20 },
  captureContainer: { gap: 24 },
  placeholderContainer: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(255,215,0,0.2)",
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  placeholderSubtext: { fontSize: 13, color: "#a0a0a0", letterSpacing: 0.2 },
  actionButtons: { gap: 12 },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0a1421",
    letterSpacing: 0.3,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,215,0,0.15)",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.3)",
    gap: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFD700",
    letterSpacing: 0.3,
  },
  previewContainer: { gap: 20 },
  image: { width: "100%", height: 300, borderRadius: 16 },
  previewActions: { flexDirection: "row", gap: 12 },
  retakeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  retakeButtonText: { fontSize: 15, fontWeight: "600", color: "#a0a0a0" },
  saveButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#96E6A1",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0a1421",
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
});
