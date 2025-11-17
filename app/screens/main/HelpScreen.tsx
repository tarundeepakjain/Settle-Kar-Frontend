import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";

export default function HelpScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a1421" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Help & FAQ</Text>

        <Text style={styles.question}>1. How does SettleKar work?</Text>
        <Text style={styles.answer}>
          SettleKar helps you split expenses with friends, track balances, and stay stress-free.
        </Text>

        <Text style={styles.question}>2. How do I add an expense?</Text>
        <Text style={styles.answer}>
          You can add expenses from the main dashboard. Choose members, enter amount, and save.
        </Text>

        <Text style={styles.question}>3. Is my data secure?</Text>
        <Text style={styles.answer}>
          Yes. All sensitive information like passwords is fully encrypted and stored securely.
        </Text>

        <Text style={styles.question}>4. How do I change currency?</Text>
        <Text style={styles.answer}>
          You can change your app currency from the Profile → Preferences → Currency Setting.
        </Text>

        <Text style={styles.question}>5. Having issues?</Text>
        <Text style={styles.answer}>
          Contact support at: support@settlekar.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { color: "#FFD700", fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  question: { color: "#fff", fontSize: 18, marginTop: 20, fontWeight: "600" },
  answer: { color: "#ccc", marginTop: 8, fontSize: 15, lineHeight: 22 },
});
