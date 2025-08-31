import React, { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const dummyMessages = [
  {
    id: 1,
    sender: "customer",
    name: "Aarav Mehta",
    message: "Hi, I haven’t received my order yet.",
    time: "10:02 AM",
  },
  {
    id: 2,
    sender: "admin",
    name: "You",
    message: "Hi Aarav! I’m checking on it now. Please wait a moment.",
    time: "10:03 AM",
  },
  {
    id: 3,
    sender: "customer",
    name: "Aarav Mehta",
    message: "Okay thanks!",
    time: "10:04 AM",
  },
];

const ChatSupport = () => {
  const [messages, setMessages] = useState(dummyMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "admin",
      name: "You",
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">💬 Chat Support</h2>

      {/* Chat box */}
      <div className="bg-white border border-gray-300 rounded-lg shadow p-4 h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow ${
                  msg.sender === "admin"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="font-medium mb-1">{msg.name}</p>
                <p>{msg.message}</p>
                <p className="text-[10px] text-right text-gray-500 mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="mt-4 flex gap-2 items-center">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSupport;
