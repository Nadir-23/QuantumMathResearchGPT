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
          <pre key={idx} className="bg-gradient-to-br from-card-dark to-background border border-border-light text-foreground p-4 rounded-lg my-3 overflow-x-auto text-sm">
            <code className="font-mono text-primary">{part}</code>
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
            ? "bg-gradient-to-br from-red-500/20 to-red-600/10 border-2 border-red-500/50 text-red-100 shadow-lg shadow-red-500/10"
            : isUser
              ? "user"
              : "assistant"
        }`}
      >
        <div className="text-sm leading-relaxed prose prose-invert max-w-none">
          {formatContent(message.content)}
        </div>

        {/* Debug Info */}
        {message.debug && Object.keys(message.debug).length > 0 && (
          <div className="mt-4 border-t border-border-light/30 pt-3">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs text-muted hover:text-muted-light flex items-center gap-1.5 transition-colors"
            >
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${showDebug ? "rotate-180" : ""}`}
              />
              Debug Information
            </button>

            {showDebug && (
              <div className="mt-3 text-xs text-muted-light font-mono bg-card/50 border border-border p-3 rounded-lg max-h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(message.debug, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
