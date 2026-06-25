import React from "react";
import ChatMessage from "./ChatMessage";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  debug?: Record<string, any>;
  isError?: boolean;
}

interface ChatContainerProps {
  messages: Message[];
}

export default function ChatContainer({ messages }: ChatContainerProps) {
  return (
    <div className="space-y-6 py-4">
      {messages.map((message, index) => (
        <div key={message.id} className="animate-in fade-in slide-in-from-bottom-3 duration-500">
          <ChatMessage message={message} />
        </div>
      ))}
    </div>
  );
}
