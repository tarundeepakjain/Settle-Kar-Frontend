import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";

export default function TermsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a1421" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Terms & Conditions</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          These Terms govern the use of the SettleKar mobile application. By using the app,
          you agree to all the conditions listed below.
        </Text>

        <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
        <Text style={styles.text}>
          Users must provide accurate information and must not misuse the platform.
        </Text>

        <Text style={styles.sectionTitle}>3. Privacy & Security</Text>
        <Text style={styles.text}>
          All personal data is stored securely. We do not share user data with third parties.
        </Text>

        <Text style={styles.sectionTitle}>4. Payments</Text>
        <Text style={styles.text}>
          SettleKar does not process payments. It only facilitates tracking of shared expenses.
        </Text>

        <Text style={styles.sectionTitle}>5. Liability</Text>
        <Text style={styles.text}>
          SettleKar is not responsible for financial disputes between users.
        </Text>

        <Text style={styles.sectionTitle}>6. Contact</Text>
        <Text style={styles.text}>For support, email: legal@settlekar.com</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { color: "#FFD700", fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  sectionTitle: { color: "#fff", fontSize: 18, marginTop: 20, fontWeight: "600" },
  text: { color: "#ccc", marginTop: 8, fontSize: 15, lineHeight: 22 },
});
