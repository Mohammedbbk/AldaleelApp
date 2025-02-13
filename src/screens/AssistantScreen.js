import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

//mock data
const messages = [
  {
    id: 1,
    text: "Welcome! Ready to adjust your travel plan? Let me know how I can help!",
    time: "9:34",
    isUser: false,
  },
  {
    id: 2,
    text: "I'd like to swap Chinatown for the High Line in my plan.",
    time: "9:30",
    isUser: true,
  },
  {
    id: 3,
    text: "Got it! Let's update your plan to include the High Line instead of Chinatown. Would you like any recommendations for things to do or places to eat around the High Line?",
    time: "9:34",
    isUser: false,
  },
  {
    id: 4,
    text: "No, thank you.",
    time: "9:30",
    isUser: true,
  },
  {
    id: 5,
    text: "No problem! Your change to visit the High Line instead of Chinatown is ready. Just click the check button when you're all set to update your plan!",
    time: "9:34",
    isUser: false,
  },
];

class ChatScreen extends React.Component {
  //Navigation Handlers
  handleBack = () => {
    this.props.navigation.replace("UserPlanScreen");
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons
              name="chevron-back"
              size={24}
              color="#007AFF"
              onPress={this.handleBack}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Daleel Assistant</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="checkmark" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Chat Messages */}
        <View style={styles.chatContainer}>
          <Text style={styles.dateLabel}>Today</Text>

          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.assistantMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.isUser
                    ? styles.userMessageText
                    : styles.assistantMessageText,
                ]}
              >
                {message.text}
              </Text>
              <Text
                style={[
                  message.isUser
                    ? styles.userMessageTimeText
                    : styles.assistantMessageTimeText,
                ]}
              >
                {message.time}
              </Text>
            </View>
          ))}
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message"
            placeholderTextColor="#8E8E93"
          />
          <Ionicons
            name="send"
            size={24}
            color={"white"}
            style={styles.sendButton}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  dateLabel: {
    textAlign: "center",
    color: "#8E8E93",
    fontSize: 14,
    marginBottom: 16,
  },
  messageContainer: {
    maxWidth: "75%",
    marginBottom: 16,
    padding: 12,
    borderRadius: 20,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  assistantMessageText: {
    color: "#000000",
  },
  assistantMessageTimeText: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  userMessageTimeText: {
    fontSize: 12,
    color: "#FFFFFF",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "white",
  },
  input: {
    height: 50,
    backgroundColor: "#F2F2F7",
    borderRadius: 15,
    paddingHorizontal: 16,
    fontSize: 16,
    flexGrow: 1,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 100,
    padding: 13,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
