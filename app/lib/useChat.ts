import { useState } from "react";

interface ChatResponse {
  conversation_id: string;
  answer: string;
  debug: Record<string, any>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function useChat() {
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = async (
    message: string,
    conversationId: string
  ): Promise<ChatResponse> => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_message: message,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `API Error: ${response.statusText}`
        );
      }

      const data: ChatResponse = await response.json();
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  };

  return { sendMessage, error };
}
