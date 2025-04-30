import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
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
    this.props.navigation.replace("UserPlanScreen");
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
      // Use 10.0.2.2 to access host machine from Android emulator
      // For iOS simulator, use localhost
      const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/trips/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          context: "travel_planning",
          // Include any trip data from previous screens if available
          tripData: this.props.route.params?.tripData || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("AI response error:", errorData);
        throw new Error(errorData.message || "Failed to get AI response");
      }

      const data = await response.json();
      return data.response || "I'm sorry, I couldn't process your request at this time.";
    } catch (error) {
      console.error("Error getting AI response:", error);
      throw new Error("Failed to get AI response: " + error.message);
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
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.titleText}>Al-Daleel AI</Text>
          <View style={styles.headerButton}>
            <TouchableOpacity>
              <Ionicons
                name="chevron-back"
                size={24}
                color="#007AFF"
                onPress={this.handleBack}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="home-outline"
                size={24}
                color="#007AFF"
                onPress={this.handleHome}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerButton}>
            <TouchableOpacity>
              <Ionicons
                name="checkmark"
                size={24}
                color="#007AFF"
                onPress={this.handleShare}
              />
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
  headerButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexShrink: 1,
    padding: 8,
    gap: 20,
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
