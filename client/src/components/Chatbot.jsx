import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000", {
  path: "/ws/socket.io",
});

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("bot_reply", (data) => {
      setMessages((prev) => [...prev, { sender: "bot", text: data.message }]);
    });
    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    socket.emit("user_message", { message: input });
    setInput("");
  };

  return (
    <div className="max-w-md mx-auto p-4 h-[80vh] flex flex-col dark:bg-white/10 dark:text-white">
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-xl max-w-[75%] ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 rounded-l-xl p-2 border dark:bg-gray-800 dark:border-gray-700"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-4 rounded-r-xl"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
