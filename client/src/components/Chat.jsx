import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";

const Chat = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;
  const role = storedUser?.role;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  // FETCH CHAT HISTORY
  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          console.log("Fetching chat history...");
          setIsLoading(true);

          const response = await fetch(
            "http://localhost:7000/api/chatbot/history",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
            }
          );

          const text = await response.text();
          console.log("Raw chat history response:", text);
          const data = JSON.parse(text);
          const history = data.history || data.data?.history || [];

          console.log("Parsed history:", history);

          setMessages(
            history.map((msg) => ({
              ...msg,
              timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
            }))
          );
          setError(null);
        } catch (err) {
          console.error("Error fetching chat history:", err);
          setError(err.message || "Error loading chat history");
        } finally {
          setIsLoading(false);
          console.log("Chat history loading finished.");
        }
      })();
    }
  }, [isOpen]);

  const formatAssistantMessage = (content) => {
    const lines = content.split("\n").filter(Boolean);
    const blocks = [];
    let currentList = [];

    const flushList = () => {
      if (currentList.length > 0) {
        blocks.push({ type: "list", items: currentList });
        currentList = [];
      }
    };

    lines.forEach((line) => {
      if (/^[A-Z\s!]+$/.test(line.trim()) || line.trim().endsWith(":")) {
        flushList();
        blocks.push({ type: "header", content: line.trim() });
      } else if (/^\d+(\.|:)/.test(line.trim())) {
        flushList();
        blocks.push({ type: "numbered-list-item", content: line.trim() });
      } else if (/^[-*•]\s+/.test(line.trim())) {
        currentList.push(line.trim().replace(/^[-*•]\s+/, ""));
      } else if (/^[\w\s\-]+:\s*\d+/.test(line.trim())) {
        currentList.push(line.trim());
      } else {
        flushList();
        blocks.push({ type: "paragraph", content: line.trim() });
      }
    });
    flushList();

    return (
      <div className="space-y-3 text-gray-100 text-sm">
        {blocks.map((block, i) => {
          switch (block.type) {
            case "header":
              return (
                <h4
                  key={i}
                  className="text-lg font-semibold border-b border-yellow-400 pb-1"
                >
                  {block.content}
                </h4>
              );
            case "numbered-list-item":
              return (
                <p key={i} className="ml-4 list-decimal marker:text-yellow-400">
                  {block.content}
                </p>
              );
            case "list":
              return (
                <ul
                  key={i}
                  className="list-disc list-inside ml-6 space-y-1 text-gray-300"
                >
                  {block.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              );
            case "paragraph":
              return <p key={i}>{block.content}</p>;
            default:
              return <p key={i}>{block.content}</p>;
          }
        })}
      </div>
    );
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const newMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      type: "user",
      role,
      timestamp: new Date(),
    };

    console.log("User message:", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:7000/api/chatbot/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: inputMessage, role }),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Assistant response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-assistant",
          content: data.answer,
          type: "assistant",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Chat send error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
      console.log("Message send flow completed.");
    }
  };

  if (!storedUser || !["customer", "seller"].includes(role)) {
    console.warn("User not authenticated or role not allowed:", role);
    return (
      <div className="fixed bottom-6 right-6 z-50 p-4 bg-neutral-900 text-white rounded shadow">
        <p>Please log in as Customer or Seller to access the chat.</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => {
            console.log("Opening chat...");
            setIsOpen(true);
          }}
          className="flex items-center justify-center w-12 h-12 bg-gray-600 rounded-full hover:bg-neutral-800 transition-colors duration-200 shadow-lg border border-white/10"
          aria-label="Open chat"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </button>
      ) : (
        <div className="w-[500px] h-[600px] resize-x overflow-hidden bg-gray-900/90 backdrop-blur-[5px] rounded-lg shadow-xl flex flex-col">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold text-white">Shop Assistant</h3>
              <span className="ml-auto px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-400/20 rounded-full">
                Role: {role?.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            </div>
            <button
              onClick={() => {
                console.log("Closing chat...");
                setIsOpen(false);
              }}
              className="p-1 hover:bg-neutral-800 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-blue-500/15
    [&::-webkit-scrollbar-thumb]:bg-blue-500/30
    [&::-webkit-scrollbar-thumb]:rounded-full
    scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100"
          >
            {messages.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <MessageSquare className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-white">Welcome!</h3>
                <p className="text-gray-400 mt-2">
                  Ask me about your orders, products, or any shopping assistance
                  you need.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 text-sm shadow-md ${
                      message.type === "user"
                        ? role === "seller"
                          ? "bg-purple-500/10 text-white"
                          : "bg-blue-500/10 text-white"
                        : "bg-neutral-800 border border-white/10 text-gray-100"
                    }`}
                  >
                    {message.type === "user" && (
                      <div className="mb-1 text-xs font-semibold text-yellow-300">
                        {role?.charAt(0).toUpperCase() + role.slice(1)}
                      </div>
                    )}
                    {message.type === "assistant" ? (
                      formatAssistantMessage(message.content)
                    ) : (
                      <p>{message.content}</p>
                    )}
                    <p
                      className={`text-xs mt-1 ${
                        message.type === "user"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp instanceof Date
                        ? message.timestamp.toLocaleTimeString()
                        : new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin mr-2" />
                <span className="text-sm text-gray-400">
                  Assistant is typing...
                </span>
              </div>
            )}
            {error && (
              <div className="p-3 mb-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-neutral-800"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => {
                  console.log("Input updated:", e.target.value);
                  setInputMessage(e.target.value);
                }}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-neutral-800 text-white border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;
