"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  debug?: Record<string, any>;
  isError?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [showDebug, setShowDebug] = useState(false);
  const isUser = message.role === "user";
  const isError = message.isError || false;

  // Simple markdown-like parsing for better formatting
  const formatContent = (content: string) => {
    // Split by code blocks
    const parts = content.split(/```[\s\S]*?```|```([\s\S]*?)```/);

    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        // Code block
        return (
          <pre key={idx} className="bg-slate-900 text-slate-100 p-3 rounded my-2 overflow-x-auto text-sm">
            <code>{part}</code>
          </pre>
        );
      }

      // Parse equations and formatting
      return (
        <div key={idx} className="whitespace-pre-wrap">
          {part
            .split(/(\*\*.*?\*\*|\$\$.*?\$\$|\$.*?\$|__.*?__|_.*?_|`.*?`)/g)
            .map((segment, i) => {
              if (segment.startsWith("$$") && segment.endsWith("$$")) {
                // Block math
                return (
                  <div key={i} className="math-block my-2">
                    {segment.slice(2, -2)}
                  </div>
                );
              }
              if (segment.startsWith("$") && segment.endsWith("$")) {
                // Inline math
                return (
                  <span key={i} className="math-inline">
                    {segment.slice(1, -1)}
                  </span>
                );
              }
              if (segment.startsWith("**") && segment.endsWith("**")) {
                // Bold
                return (
                  <strong key={i} className="font-semibold">
                    {segment.slice(2, -2)}
                  </strong>
                );
              }
              if (segment.startsWith("__") && segment.endsWith("__")) {
                // Bold alternative
                return (
                  <strong key={i} className="font-semibold">
                    {segment.slice(2, -2)}
                  </strong>
                );
              }
              if (segment.startsWith("_") && segment.endsWith("_")) {
                // Italic
                return (
                  <em key={i} className="italic">
                    {segment.slice(1, -1)}
                  </em>
                );
              }
              if (segment.startsWith("`") && segment.endsWith("`")) {
                // Inline code
                return (
                  <code key={i} className="bg-slate-700 text-slate-100 px-1 py-0.5 rounded text-sm font-mono">
                    {segment.slice(1, -1)}
                  </code>
                );
              }

              return segment;
            })}
        </div>
      );
    });
  };

  return (
    <div className={`chat-message ${isUser ? "user" : ""}`}>
      <div
        className={`message-content ${
          isError
            ? "bg-red-500/20 border-red-500/50 text-red-100"
            : isUser
              ? "user"
              : "assistant"
        }`}
      >
        <div className="text-sm leading-relaxed">{formatContent(message.content)}</div>

        {/* Debug Info */}
        {message.debug && Object.keys(message.debug).length > 0 && (
          <div className="mt-3 border-t border-current/20 pt-2">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs opacity-60 hover:opacity-100 flex items-center gap-1"
            >
              <ChevronDown
                size={14}
                className={`transition-transform ${showDebug ? "rotate-180" : ""}`}
              />
              Debug Info
            </button>

            {showDebug && (
              <div className="mt-2 text-xs opacity-75 font-mono bg-black/30 p-2 rounded max-h-48 overflow-y-auto">
                <pre>{JSON.stringify(message.debug, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
