"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
  placeholder = "Type your message...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(
        textareaRef.current.scrollHeight,
        200
      ) + "px";
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey && !isLoading) {
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className="input-field resize-none disabled:opacity-50 disabled:cursor-not-allowed max-h-32"
          />
          <div className="absolute bottom-3 right-3 text-xs text-muted pointer-events-none hidden sm:block">
            <kbd className="px-2.5 py-1 bg-card border border-border rounded-md text-muted-light font-mono text-xs">Ctrl+Enter</kbd>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="btn-primary flex-shrink-0 h-11 w-11 p-0 flex items-center justify-center"
          title={isLoading ? "Generating response..." : "Send message"}
        >
          {isLoading ? (
            <Loader size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </form>
  );
}
