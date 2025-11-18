import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Chatbot.tsx
 * Finance assistant using gemini-2.5-flash-lite (cost-efficient)
 *
 * Features:
 * - Uses gemini-2.5-flash-lite as model id
 * - In-memory TTL cache for short-lived queries (e.g., gold/silver)
 * - Defensive parsing for multiple SDK response shapes
 * - Limits tokens (maxTokens) and sets low temperature for determinism
 * - Auto-scrolls to bottom when new messages arrive
 * - Prevents double requests when a request is in progress
 */

/* ---------- UI Icons ---------- */
const BotIcon = () => <Text style={{ fontSize: 22 }}>🤖</Text>;
const CloseIcon = () => <Text style={{ color: "#fff", fontSize: 18 }}>✕</Text>;

/* ---------- Types ---------- */
interface ChatbotProps {
  isChatOpen: boolean;
  onClose: () => void;
}

type Message = { sender: "AI" | "User"; text: string };

/* ---------- Simple in-memory cache with TTL ---------- */
class TTLCache<K, V> {
  private map = new Map<K, { value: V; expiresAt: number }>();
  constructor(private ttlMs = 15 * 60 * 1000) {} // default 15 minutes

  get(key: K): V | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: K, value: V) {
    this.map.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  clear() {
    this.map.clear();
  }
}
const queryCache = new TTLCache<string, string>(5 * 60 * 1000); // 5 min cache for this app

/* ---------- Component ---------- */
const Chatbot: React.FC<ChatbotProps> = ({ isChatOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView | null>(null);

  /* ---------- Model selection: flash-lite (lowest-cost 2.5 family) ---------- */
  const MODEL_ID = "gemini-2.5-flash-lite";

  /* ---------- Memoize and initialize Gemini client/model ---------- */
  const model = useMemo(() => {
    const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!key) {
      console.warn("[Gemini] EXPO_PUBLIC_GEMINI_API_KEY not set at runtime.");
      return null;
    }
    try {
      const genAI = new GoogleGenerativeAI(key);
      // If your SDK requires a different method signature, adjust here.
      return genAI.getGenerativeModel({ model: MODEL_ID });
    } catch (err) {
      console.error("[Gemini] failed to init client:", err);
      return null;
    }
  }, []);

  /* ---------- animation ---------- */
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isChatOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isChatOpen, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  /* ---------- auto-scroll to bottom on new messages ---------- */
  useEffect(() => {
    // small delay so layout completes before scrolling
    const t = setTimeout(() => {
      if (scrollRef.current && typeof (scrollRef.current as any).scrollToEnd === "function") {
        (scrollRef.current as any).scrollToEnd({ animated: true });
      }
    }, 60);
    return () => clearTimeout(t);
  }, [messages, isLoading]);

  const pushMessage = (m: Message) => setMessages((prev) => [...prev, m]);

  /* ---------- helper: robust SDK response parsing ---------- */
  const extractTextFromResult = async (result: any) => {
    try {
      // Common shapes:
      // - result.response.text() -> function
      // - result.response.text -> string
      // - result.outputText
      // - result.candidates[0].content[0].text
      // - result as string
      if (!result) return "";

      if (result?.response) {
        if (typeof result.response.text === "function") {
          return await result.response.text();
        }
        if (typeof result.response.text === "string") {
          return result.response.text;
        }
      }

      if (typeof result === "string") return result;
      if (result?.outputText) return result.outputText;
      if (result?.candidates?.[0]?.content?.[0]?.text) {
        return result.candidates[0].content[0].text;
      }

      // last-resort: stringify (trim for length)
      return JSON.stringify(result).slice(0, 2000);
    } catch (e) {
      console.warn("[Gemini] failed to parse result:", e, result);
      return "Error parsing assistant response. Check logs.";
    }
  };

  /* ---------- main ask function with caching + token limits ---------- */
  const askGemini = async (prompt: string, cacheKey?: string) => {
    // Use cache if available
    if (cacheKey) {
      const cached = queryCache.get(cacheKey);
      if (cached) {
        pushMessage({ sender: "AI", text: cached + "  \n\n_(from cache)_ " });
        return;
      }
    }

    if (!model) {
      pushMessage({
        sender: "AI",
        text: "API key not configured or Gemini client failed to initialize. Please set EXPO_PUBLIC_GEMINI_API_KEY.",
      });
      return;
    }
    if (isLoading) return; // prevent double sends

    setIsLoading(true);

    // Low-cost generator params
    const requestPayload = {
      prompt: prompt,
      // If your SDK accepts params elsewhere, adapt accordingly
      // guard: some SDKs expect an object or options param to generate/generateContent
      maxTokens: 250,
      temperature: 0.2,
      topP: 0.95,
      // If SDK supports stream: true, you may enable it — not included here for simplicity
    };

    try {
      // flexible call for variations in SDK
      let result: any;
      if (typeof (model as any).generateContent === "function") {
        // older/newer SDKs differ; some use generateContent(prompt, options)
        result = await (model as any).generateContent(requestPayload.prompt ?? prompt, {
          maxTokens: requestPayload.maxTokens,
          temperature: requestPayload.temperature,
          topP: requestPayload.topP,
        });
      } else if (typeof (model as any).generate === "function") {
        result = await (model as any).generate({
          prompt: requestPayload.prompt ?? prompt,
          maxTokens: requestPayload.maxTokens,
          temperature: requestPayload.temperature,
          topP: requestPayload.topP,
        });
      } else {
        // Try direct call
        result = await (model as any)(requestPayload);
      }

      const reply = await extractTextFromResult(result);

      // store in cache if key provided
      if (cacheKey) queryCache.set(cacheKey, reply);

      pushMessage({ sender: "AI", text: reply });
    } catch (err) {
      console.error("[Gemini] ask error:", err);
      pushMessage({ sender: "AI", text: "Sorry — could not fetch latest data. Try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- button handlers with reasonable cache keys ---------- */
  const handleSelection = (type: string) => {
    let prompt = "";
    let cacheKey: string | undefined;

    switch (type) {
      case "gold":
        prompt =
          "You are an expert Indian financial assistant. Provide the latest known gold price in India (1g, 10g, 24K) and a short market trend. Use bullet points and bold headings.";
        cacheKey = "gold_price";
        break;
      case "silver":
        prompt =
          "You are an expert Indian financial assistant. Provide the latest known silver price in India (per kg and per 100g) and a short market trend. Use bullet points and bold headings.";
        cacheKey = "silver_price";
        break;
      case "sensex":
        prompt =
          "You are an expert Indian financial assistant. Give the latest known SENSEX value and 3-4 bullet points describing today's Indian market sentiment. Use bullet points and bold headings.";
        cacheKey = "sensex_value";
        break;
      case "nifty":
        prompt =
          "You are an expert Indian financial assistant. Give the latest known NIFTY 50 value and a short Indian market summary. Use bullet points and bold headings.";
        cacheKey = "nifty_value";
        break;
      case "usd":
        prompt =
          "You are an expert Indian financial assistant. Give the latest known USD to INR exchange rate and a short India forex commentary. Use bullet points and bold headings.";
        cacheKey = "usd_inr";
        break;
      case "news":
        prompt =
          "You are an expert Indian financial assistant. Give the latest Indian finance and business news headlines (5 bullet points), with short one-line context each.";
        cacheKey = "finance_news";
        break;
      default:
        prompt = `You are an expert Indian financial assistant. Provide concise info about: ${type}.`;
    }

    pushMessage({ sender: "User", text: `Requested: ${type.toUpperCase()}` });
    askGemini(prompt, cacheKey);
  };

  /* ---------- render ---------- */
  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }], opacity: slideAnim }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BotIcon />
          <Text style={styles.headerText}>Finance Assistant</Text>
        </View>
        <TouchableOpacity onPress={onClose}>
          <CloseIcon />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={[styles.messageBubble, msg.sender === "AI" ? styles.aiBubble : styles.userBubble]}
            >
              <Text style={{ color: "#fff" }}>{msg.text}</Text>
            </View>
          ))}

          {isLoading && (
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <ActivityIndicator />
              <Text style={{ color: "#fff", marginTop: 6 }}>Fetching latest data...</Text>
            </View>
          )}
        </ScrollView>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <Text style={styles.sectionTitle}>Metals</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => handleSelection("gold")} style={styles.optionButton}>
              <Text style={styles.optionText}>Gold Price</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleSelection("silver")} style={styles.optionButton}>
              <Text style={styles.optionText}>Silver Price</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Indian Market</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => handleSelection("sensex")} style={styles.optionButton}>
              <Text style={styles.optionText}>Sensex</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleSelection("nifty")} style={styles.optionButton}>
              <Text style={styles.optionText}>Nifty</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Currency</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => handleSelection("usd")} style={styles.optionButton}>
              <Text style={styles.optionText}>USD/INR</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>News</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => handleSelection("news")} style={styles.optionButton}>
              <Text style={styles.optionText}>Finance News</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default Chatbot;

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 520,
    backgroundColor: "#1c2a38",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    zIndex: 999,
  },
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: "85%",
  },
  aiBubble: {
    backgroundColor: "#2e86de",
    alignSelf: "flex-start",
  },
  userBubble: {
    backgroundColor: "#FFD700",
    alignSelf: "flex-end",
  },
  buttonsContainer: {
    padding: 12,
    backgroundColor: "#111f2f",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  sectionTitle: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 6,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  optionButton: {
    flex: 1,
    backgroundColor: "#2e86de",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  optionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});


