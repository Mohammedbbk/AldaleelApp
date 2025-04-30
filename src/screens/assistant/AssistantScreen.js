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
import { ScrollView } from "react-native-gesture-handler";

//mock data
const initialMessages = [
  {
    id: 1,
    text: "Welcome! Ready to adjust your travel plan? Let me know how I can help!",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isUser: false,
  },
];
class ChatScreen extends React.Component {
  // Initialize with mock data
  state = {
    messages: initialMessages,
    userInput: "",
    isLoading: false,
  };
  //handelers
  handleBack = () => {
    this.props.navigation.goBack();
  };
  handleHome = () => {
    this.props.navigation.navigate("MainScreen");
  };
  handleProceed = () => {
    //TBD
  };
  // Create a ref for the ScrollView
  scrollViewRef = React.createRef();

  // Function to scroll to the bottom
  scrollToBottom = () => {
    if (this.scrollViewRef.current) {
      this.scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  handleInputChange = (text) => {
    this.setState({ userInput: text });
  };

  //Ai response handle
  getAIResponse = async (userMessage) => {
    try {
      const response = await fetch("TO_BE_ADDED", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          context: "travel_planning",
          // Include any other necessary context
        }),
      });

      const data = await response.json();
      return data.response;
    } catch (error) {
      throw new Error("Failed to get AI response");
    }
  };

  //User input handle
  handleSend = async () => {
    const { userInput, messages } = this.state;
    if (!userInput.trim()) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: userInput,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isUser: true,
    };

    this.setState(
      {
        messages: [...messages, newUserMessage],
        userInput: "",
        isLoading: true,
      },
      () => {
        // Scroll to bottom after state update
        this.scrollToBottom();
      }
    );

    // Attempt to get AI response
    try {
      const aiResponse = await this.getAIResponse(userInput);

      const newAIMessage = {
        id: messages.length + 2,
        text: aiResponse,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isUser: false,
      };

      this.setState((prevState) => ({
        messages: [...prevState.messages, newAIMessage],
        isLoading: false,
      }));
    } catch (error) {
      // Add error message to chat
      const errorMessage = {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isUser: false,
        isError: true,
      };

      this.setState((prevState) => ({
        messages: [...prevState.messages, errorMessage],
        isLoading: false,
      }));
    }
  };

  render() {
    const { messages } = this.state; // Access messages from state

    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 pt-5">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2.5 pb-3 bg-white dark:bg-gray-900">
          <View style={styles.headerButton}>
            <TouchableOpacity
              className="w-[50px] h-[50px] rounded-full bg-gray-100 dark:bg-gray-800 justify-center items-center"
              onPress={this.handleBack}
            >
              <Ionicons name="chevron-back" size={26} />
            </TouchableOpacity>
          </View>

          {/* Header Title (Centered) */}
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Al-Daleel AI
            </Text>
          </View>

          <View style={styles.headerButton}>
            <TouchableOpacity
              className="w-[50px] h-[50px] rounded-full bg-gray-100 dark:bg-gray-800 justify-center items-center"
              onPress={this.handleShare}
            >
              <Ionicons name="checkmark" size={26} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat Messages */}
        <ScrollView
          ref={this.scrollViewRef} // Attach the ref
          style={styles.chatContainer}
          contentContainerStyle={{ paddingBottom: 20 }} // Add padding to avoid overlap with input
          onContentSizeChange={() => this.scrollToBottom()} // Scroll to bottom when content size changes
          showsVerticalScrollIndicator={false}
        >
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
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message"
            placeholderTextColor="#8E8E93"
            value={this.state.userInput}
            onChangeText={this.handleInputChange}
            onSubmitEditing={this.handleSend}
          />
          <TouchableOpacity
            onPress={this.handleSend}
            disabled={this.state.isLoading}
            activeOpacity={0.8}
          >
            <Ionicons
              name="send"
              size={24}
              color={this.state.userInput.trim() ? "white" : "#B0B0B0"}
              style={[
                styles.sendButton,
                {
                  backgroundColor: this.state.userInput.trim()
                    ? "#007AFF"
                    : "#E5E5EA",
                },
              ]}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: StatusBar.currentHeight,
  },
  headerContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  titleContainer: {
    position: "absolute",
    right: "0",
    left: "0",
  },
  titleText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
    position: "absolute",
    left: 0,
    right: 0,
  },
  headerButton: { flexDirection: "row", alignItems: "center", gap: 16 },
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
    paddingHorizontal: 10,
    backgroundColor: "#F2F2F7",
    borderRadius: 15,
    fontSize: 16,
    flex: 1,
    flexWrap: 1,
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
