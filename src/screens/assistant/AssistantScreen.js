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
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../../ThemeProvider";
import {
  apiClient,
  getErrorMessage,
  getRecoverySteps,
} from "../../services/apiClient";

// Constants
const STORAGE_KEY = "@aldaleel_chat_history";
const DEBOUNCE_DELAY = 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

// Initial system message
const initialMessages = [
  {
    id: 1,
    role: "system",
    content:
      "Welcome! Ready to adjust your travel plan? Let me know how I can help!",
    timestamp: new Date().toISOString(),
    metadata: {
      type: "welcome",
    },
  },
];

/**
 * @typedef {Object} ChatScreenState
 * @property {Array<Object>} messages - Array of chat messages
 * @property {string} userInput - Current user input
 * @property {boolean} isLoading - Loading state
 * @property {Object|null} conversation - Current conversation
 * @property {string|null} error - Error message
 * @property {number} retryCount - Number of retry attempts
 * @property {Array<string>} offlineMessages - Messages to process when back online
 */

class ChatScreen extends React.Component {
  /** @type {React.RefObject<ScrollView>} */
  scrollViewRef = React.createRef();
  /** @type {NodeJS.Timeout|null} */
  debounceTimeout = null;

  constructor(props) {
    super(props);
    this.state = {
      messages: initialMessages,
      userInput: "",
      isLoading: false,
      conversation: null,
      error: null,
      retryCount: 0,
      offlineMessages: [],
    };
  }

  componentDidMount() {
    this.loadChatHistory();
  }

  componentWillUnmount() {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
  }

  // Load chat history from storage
  loadChatHistory = async () => {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEY);
      if (history) {
        const { messages, conversation } = JSON.parse(history);
        this.setState({
          messages: messages || initialMessages,
          conversation: conversation || null,
        });
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  // Save chat history to storage
  saveChatHistory = async () => {
    try {
      const { messages, conversation } = this.state;
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          messages,
          conversation,
        })
      );
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };

  // Navigation handlers
  handleBack = () => {
    this.props.navigation.goBack();
  };

  handleHome = () => {
    this.props.navigation.navigate("Home");
  };

  // Scroll to bottom of chat
  scrollToBottom = () => {
    if (this.scrollViewRef.current) {
      this.scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  /**
   * @param {string} text - The new input text
   */
  handleInputChange = (text) => {
    this.setState({ userInput: text });
  };

  /**
   * @param {string} message - The message to send
   * @param {string} context - The conversation context
   * @returns {Promise<Object>} The response from the API
   */
  sendMessage = async (message, context) => {
    try {
      const response = await apiClient.sendChatMessage(message, context);
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  // Handle sending messages with debouncing
  handleSend = () => {
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(async () => {
      const { userInput, messages, offlineMessages, conversation } = this.state;
      if (!userInput.trim()) return;

      // Create user message
      const userMessage = {
        id: messages.length + 1,
        role: "user",
        content: userInput,
        timestamp: new Date().toISOString(),
      };

      this.setState(
        {
          messages: [...messages, userMessage],
          userInput: "",
          isLoading: true,
          error: null,
        },
        this.scrollToBottom
      );

      try {
        // Get AI response using our API client
        const response = await this.sendMessage(
          userInput,
          conversation?.context || "general"
        );

        this.setState(
          (prevState) => ({
            messages: [
              ...prevState.messages,
              {
                id: prevState.messages.length + 2,
                ...response.data.message,
              },
            ],
            conversation: response.data.conversation,
            isLoading: false,
            retryCount: 0,
          }),
          () => {
            this.scrollToBottom();
            this.saveChatHistory();
          }
        );

        // Process any offline messages
        if (offlineMessages.length > 0) {
          this.processOfflineMessages();
        }
      } catch (error) {
        // Handle error and show recovery UI
        const errorMessage = {
          id: messages.length + 2,
          role: "system",
          content: getErrorMessage(error),
          timestamp: new Date().toISOString(),
          metadata: {
            type: "error",
            error: error.message,
          },
        };

        // Store message for offline processing if needed
        if (!navigator.onLine) {
          this.setState((prevState) => ({
            offlineMessages: [...prevState.offlineMessages, userInput],
          }));
        }

        this.setState(
          {
            messages: [...messages, errorMessage],
            isLoading: false,
            error: error.message,
            retryCount: this.state.retryCount + 1,
          },
          () => {
            this.scrollToBottom();
            this.saveChatHistory();
          }
        );

        // Show error alert with recovery options
        Alert.alert("Error", getErrorMessage(error), [
          {
            text: "Try Again",
            onPress: () => this.retryLastMessage(),
          },
          {
            text: "OK",
            style: "cancel",
          },
        ]);
      }
    }, DEBOUNCE_DELAY);
  };

  // Retry last failed message
  retryLastMessage = () => {
    const { messages } = this.state;
    const lastUserMessage = messages.filter((m) => m.role === "user").pop();
    if (lastUserMessage) {
      this.setState(
        {
          userInput: lastUserMessage.content,
        },
        this.handleSend
      );
    }
  };

  // Process offline messages when back online
  processOfflineMessages = async () => {
    const { offlineMessages } = this.state;
    for (const message of offlineMessages) {
      try {
        const response = await this.sendMessage(message);
        this.setState((prevState) => ({
          messages: [
            ...prevState.messages,
            {
              id: prevState.messages.length + 1,
              ...response.data.message,
            },
          ],
        }));
      } catch (error) {
        console.error("Error processing offline message:", error);
      }
    }
    this.setState({ offlineMessages: [] });
  };
  render() {
    const { messages, isLoading, error } = this.state;
    const { isDarkMode, colors } = this.props.theme;

    return (
      <SafeAreaView
        className={`flex-1 ${
          isDarkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        {/* Header */}
        <View
          className={`flex-row items-center justify-between px-5 pt-2.5 pb-3 ${
            isDarkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-gray-50 border-gray-200"
          } mb-5`}
        >
          <TouchableOpacity
            className={` w-[50px] h-[50px] rounded-full ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-50 border-gray-200"
            } justify-center items-center`}
            onPress={this.handleBack}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={isDarkMode ? "#fff" : "#111"}
            />
          </TouchableOpacity>

          <View className="flex-1 items-center">
            <Text
              className={`text-xl font-bold ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Al-Daleel AI
            </Text>
          </View>

          <TouchableOpacity
            className={` w-[50px] h-[50px] rounded-full ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-50 border-gray-200"
            } justify-center items-center`}
            onPress={this.handleHome}
          >
            <Ionicons
              name="home"
              size={20}
              color={isDarkMode ? "#fff" : "#111"}
            />
          </TouchableOpacity>
        </View>

        {/* Chat Messages */}
        <ScrollView
          ref={this.scrollViewRef}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: 20 }}
          onContentSizeChange={this.scrollToBottom}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 max-w-[80%] ${
                message.role === "user" ? "self-end ml-auto" : "self-start "
              }`}
            >
              <View
                className={`rounded-2xl p-3 ${
                  message.role === "user"
                    ? "bg-blue-500"
                    : message.metadata?.type === "error"
                    ? isDarkMode
                      ? "bg-red-900"
                      : "bg-red-100"
                    : isDarkMode
                    ? "bg-gray-800"
                    : "bg-gray-100"
                }`}
              >
                <Text
                  className={`text-base ${
                    message.role === "user"
                      ? "text-white"
                      : message.metadata?.type === "error"
                      ? isDarkMode
                        ? "text-red-200"
                        : "text-red-800"
                      : isDarkMode
                      ? "text-gray-200"
                      : "text-gray-800"
                  }`}
                >
                  {message.content}
                </Text>
              </View>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          ))}

          {isLoading && (
            <View className="self-start mb-4">
              <View className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-3">
                <ActivityIndicator color={colors.primary} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View
          className={`px-3 p-3 rounded-s-xl ${
            isDarkMode
              ? "bg-gray-800 border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <View className="flex-row items-center">
            <TextInput
              className={`flex-1 ${
                isDarkMode
                  ? "bg-gray-200 border-gray-600"
                  : "bg-gray-100 border-gray-200"
              } rounded-2xl px-4 py-3 mr-2 text-gray-900 dark:text-white`}
              placeholder="Type your message"
              placeholderTextColor={colors.placeholder}
              value={this.state.userInput}
              onChangeText={this.handleInputChange}
              onSubmitEditing={this.handleSend}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={this.handleSend}
              disabled={isLoading || !this.state.userInput.trim()}
              className={`p-3 rounded-full bg-blue-600 ${
                isLoading || !this.state.userInput.trim()
                  ? "opacity-50"
                  : "opacity-100"
              }`}
            >
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {error && (
            <TouchableOpacity
              onPress={this.retryLastMessage}
              className="mt-2 self-center"
            >
              <Text className="text-blue-500 dark:text-blue-400">
                Tap to retry
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

// Wrap component with theme
export default function ThemedChatScreen(props) {
  const theme = useTheme();
  return <ChatScreen {...props} theme={theme} />;
}
