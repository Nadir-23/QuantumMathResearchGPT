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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border-light bg-gradient-to-br from-card to-card-dark/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background font-bold">
                  Ψ
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gradient">
                  QuantumMathResearchGPT
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-light">
                Multi-agent AI for Mathematics, Quantum Physics &amp; Research
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs text-muted">ID: {conversationId.slice(0, 8)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-96 text-center space-y-8">
              <div>
                <div className="text-6xl sm:text-7xl mb-6 inline-block bg-gradient-to-br from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Ψ
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                  Explore Quantum & Math
                </h2>
                <p className="text-muted-light max-w-lg mx-auto text-base leading-relaxed">
                  Ask me about mathematics, quantum physics, quantum computing, or scientific research. I can solve equations, simulate quantum circuits, and search the latest research papers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
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
                    className="glass-card p-4 hover:border-primary/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-light">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <ChatContainer messages={messages} />
          )}

          <div ref={scrollRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border-light bg-gradient-to-t from-card to-card/50 backdrop-blur-xl sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
