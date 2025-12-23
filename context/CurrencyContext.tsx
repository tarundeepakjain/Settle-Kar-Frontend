import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CurrencyContextType {
  currency: string;
  symbol: string;
  setCurrency: (c: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "INR",
  symbol: "₹",
  setCurrency: () => {},
});

export const CurrencyProvider = ({ children }: any) => {
  const [currency, setCurrencyState] = useState("INR");
  const [symbol, setSymbol] = useState("₹");

  const currencySymbols: any = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    JPY: "¥",
  };

  useEffect(() => {
    const loadCurrency = async () => {
      const saved = await AsyncStorage.getItem("currency");
      if (saved) {
        setCurrencyState(saved);
        setSymbol(currencySymbols[saved]);
      }
    };
    loadCurrency();
  }, []);

  const setCurrency = async (c: string) => {
    await AsyncStorage.setItem("currency", c);
    setCurrencyState(c);
    setSymbol(currencySymbols[c]);
  };

  return (
    <CurrencyContext.Provider value={{ currency, symbol, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
