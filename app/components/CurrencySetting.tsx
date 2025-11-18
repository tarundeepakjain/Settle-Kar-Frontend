import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import {Picker} from "@react-native-picker/picker";
const availableCurrencies = [
  { label: 'USD ($)', value: 'USD' },
  { label: 'EUR (€)', value: 'EUR' },
  { label: 'INR (₹)', value: 'INR' },
];

export default function CurrencySetting() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD'); // Default to USD

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
    // ⚠️ TODO: Implement save logic here (e.g., AsyncStorage or API call)
    Alert.alert("Currency Updated", `Default currency set to ${value}.`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name="cash-outline" size={24} color="#FFD700" style={styles.icon} />
        <Text style={styles.label}>Default Currency:</Text>
        {/* Use Picker or custom component for selection */}
        <Picker
          selectedValue={selectedCurrency}
          style={styles.picker}
          onValueChange={handleCurrencyChange}
          itemStyle={styles.pickerItem}
          mode="dropdown"
        >
          {availableCurrencies.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      icon: {
        marginRight: 10,
      },
      label: {
        color: "#fff",
        fontSize: 16,
        flex: 1,
      },
      picker: {
        width: 150,
        color: '#FFD700',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
      },
      pickerItem: {
        color: '#0a1421', // Note: Styling Picker items is complex and platform-dependent
      }
});