import React from "react";

type Role = "user" | "assistant";

interface ChatMessageProps {
  role: Role;
  text: string;
}

export function ChatMessage({ role, text }: ChatMessageProps) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"} message-enter`}>
      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-5 py-4 text-sm leading-relaxed relative group transition-all duration-300 ${
          role === "user"
            ? "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20"
            : "glass hover:bg-white/5 hover:shadow-lg hover:shadow-fuchsia-500/10"
        }`}
      >
        {/* Role indicator avatar */}
        {role === "user" ? (
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-[10px] font-bold shadow-lg shadow-cyan-500/50">
            U
          </div>
        ) : (
          <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-500 flex items-center justify-center text-[10px] font-bold shadow-lg shadow-fuchsia-500/50">
            Q
          </div>
        )}

        {/* Message text */}
        <span className="relative z-10">{text}</span>

        {/* Hover glow effect */}
        <div
          className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
            role === "user"
              ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
              : "bg-gradient-to-r from-fuchsia-500/10 to-violet-500/10"
          }`}
        />
      </div>
    </div>
  );
}
