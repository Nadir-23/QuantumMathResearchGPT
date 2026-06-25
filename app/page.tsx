"use client";

import { useState, useRef, useEffect } from "react";
import ChatContainer from "./components/ChatContainer";
import ChatInput from "./components/ChatInput";
import { useChat } from "./lib/useChat";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { sendMessage } = useChat();

  useEffect(() => {
    // Generate new conversation ID on mount
    setConversationId(Date.now().toString());
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage(message, conversationId);

      // Add assistant response to chat
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: response.answer,
        role: "assistant",
        timestamp: new Date(),
        debug: response.debug,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content:
          error instanceof Error
            ? error.message
            : "An error occurred. Please try again.",
        role: "assistant",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-purple-500/30 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                QuantumMathResearchGPT
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Multi-agent AI for Mathematics, Quantum Physics &amp; Research
              </p>
            </div>
            <div className="text-xs text-gray-500">
              Conversation ID: {conversationId.slice(0, 8)}...
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-96 text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">🧮</div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome to QuantumMathResearchGPT
                </h2>
                <p className="text-gray-400 max-w-md mx-auto mb-6">
                  Ask me about mathematics, quantum physics, quantum computing,
                  or scientific research. I can solve equations, simulate
                  quantum circuits, and search the latest research papers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {[
                  {
                    icon: "📐",
                    title: "Mathematics",
                    desc: "Solve equations & simplify expressions",
                  },
                  {
                    icon: "⚛️",
                    title: "Quantum Physics",
                    desc: "Schrödinger equation & quantum mechanics",
                  },
                  {
                    icon: "🔌",
                    title: "Quantum Computing",
                    desc: "Build & simulate quantum circuits",
                  },
                  {
                    icon: "📚",
                    title: "Research",
                    desc: "Search arXiv & summarize papers",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <p className="font-semibold text-sm text-white">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ChatContainer messages={messages} />
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-purple-500/30 bg-black/40 backdrop-blur-md sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder="Ask about mathematics, quantum physics, quantum computing, or research..."
          />
        </div>
      </div>
    </div>
  );
}
