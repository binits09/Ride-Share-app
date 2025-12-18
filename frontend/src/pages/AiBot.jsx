import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import { useToast } from "../utils/useToast";

const AiBot = () => {
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { token } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  const examplePrompts = [
    {
      title: "How to book a ride?",
      prompt: "How do I book a ride on Rebu Ride?",
    },
    {
      title: "Become a driver",
      prompt: "How can I become a driver for Rebu Ride?",
    },
    {
      title: "Payment methods",
      prompt: "What payment methods are available on Rebu Ride?",
    },
    {
      title: "Safety tips",
      prompt: "What are the safety features and tips for using Rebu Ride?",
    },
    {
      title: "Pricing",
      prompt: "How is the fare calculated on Rebu Ride?",
    },
    {
      title: "Driver requirements",
      prompt: "What are the requirements to become a driver on Rebu Ride?",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      type: "user",
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:6200/api/ai/ai-chat",
        { message: input.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const aiMessage = {
        type: "ai",
        text: response.data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to get AI response";
      showToast(errorMsg, "error");
      
      // Add error message to chat
      const errorMessage = {
        type: "ai",
        text: `Sorry, I encountered an error: ${errorMsg}. Please try again or check your message.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleExamplePrompt = (prompt) => {
    setInput(prompt);
  };

  const sendExamplePrompt = async (prompt) => {
    setInput("");

    const userMessage = {
      type: "user",
      text: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:6200/api/ai/ai-chat",
        { message: prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const aiMessage = {
        type: "ai",
        text: response.data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to get AI response";
      showToast(errorMsg, "error");
      
      const errorMessage = {
        type: "ai",
        text: `Sorry, I encountered an error: ${errorMsg}. Please try again or check your message.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Assistant</h1>
              <p className="text-sm text-blue-100">Always here to help</p>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  } rounded-2xl px-5 py-3 shadow-md`}
                >
                  {message.type === "ai" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-gray-600">
                        AI Assistant
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.type === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Show example prompts only if no user messages */}
            {messages.length === 1 && !loading && (
              <div className="mt-8">
                <p className="text-center text-gray-500 text-sm mb-4 font-medium">
                  Try asking me about:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {examplePrompts.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendExamplePrompt(example.prompt)}
                      disabled={loading}
                      className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all text-left group disabled:opacity-50"
                    >
                      <p className="text-sm font-semibold text-blue-900 group-hover:text-blue-700">
                        {example.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {example.prompt}
                      </p>
                      <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[75%] bg-gray-100 rounded-2xl px-5 py-3 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      AI is typing...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Send
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AiBot;
