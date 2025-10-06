import React, { useEffect, useRef, useState } from "react";
import { Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// --- Simple Icons (can replace with react-native-vector-icons if you want) ---
const BotIcon = () => <Text style={{ color: "#64B5F6", fontWeight: "bold" }}>🤖</Text>;
const SendIcon = () => <Text style={{ color: "#fff", fontWeight: "bold" }}>➤</Text>;
const CloseIcon = () => <Text style={{ color: "#fff", fontWeight: "bold" }}>✕</Text>;

// --- Chatbot Component ---
interface ChatbotProps {
  isChatOpen: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isChatOpen, onClose }) => {
  const [messages, setMessages] = useState<any[]>([
    { sender: "AI", text: "Hello! I'm SettleBot. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isChatOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isChatOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "User", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = {
        sender: "AI",
        text: `Got it! You said: "${userMessage.text}". I've logged it.`,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const slideUp = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0], // slide up from bottom
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideUp }], opacity: slideAnim },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BotIcon />
          <Text style={styles.headerText}>SettleBot</Text>
        </View>
        <TouchableOpacity onPress={onClose}>
          <CloseIcon />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.messageBubble,
                msg.sender === "AI"
                  ? styles.aiBubble
                  : styles.userBubble,
              ]}
            >
              <Text style={{ color: "#fff" }}>{msg.text}</Text>
            </View>
          ))}

          {isTyping && (
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <Text style={{ color: "#fff" }}>SettleBot is typing...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Ask SettleBot..."
            placeholderTextColor="#aaa"
            value={input}
            onChangeText={setInput}
            style={styles.input}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <SendIcon />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 500,
    backgroundColor: "#1c2a38",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 999,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: "80%",
  },
  aiBubble: {
    backgroundColor: "#2e86de",
    alignSelf: "flex-start",
  },
  userBubble: {
    backgroundColor: "#FFD700",
    alignSelf: "flex-end",
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#111f2f",
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  input: {
    flex: 1,
    backgroundColor: "#2e86de",
    borderRadius: 20,
    paddingHorizontal: 16,
    color: "#fff",
    height: 42,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#FFD700",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
