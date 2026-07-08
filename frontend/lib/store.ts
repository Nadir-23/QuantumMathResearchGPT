import { create } from "zustand"

export type AgentName = "Orchestrator" | "Math Agent" | "Quantum Agent" | "Research Agent" | "Code Agent" | "Verification Agent"

export interface Message {
  role: "user" | "assistant"
  text: string
  agent?: AgentName
  time?: number
  tokens?: number
  confidence?: number
  sources?: string[]
  derivation?: string
  verification?: { check: string; passed: boolean }[]
}

interface AppState {
  theme: "dark" | "light"
  conversationId: string
  messages: Message[]
  streaming: boolean
  streamingText: string
  currentAgent: AgentName | null
  selectedModel: string
  sidebarCollapsed: boolean
  rightPanelOpen: boolean

  toggleTheme: () => void
  setConversationId: (id: string) => void
  addMessage: (msg: Message) => void
  setMessages: (msgs: Message[]) => void
  updateLastAssistantMessage: (text: string) => void
  setStreaming: (v: boolean) => void
  setStreamingText: (t: string) => void
  setCurrentAgent: (a: AgentName | null) => void
  setSelectedModel: (m: string) => void
  setSidebarCollapsed: (v: boolean) => void
  setRightPanelOpen: (v: boolean) => void
  newConversation: () => void
}

export const useAppStore = create<AppState>((set) => ({
  theme: "dark",
  conversationId: "",
  messages: [],
  streaming: false,
  streamingText: "",
  currentAgent: null,
  selectedModel: "Gemini 2.5 Flash",
  sidebarCollapsed: false,
  rightPanelOpen: true,

  toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
  setConversationId: (id) => set({ conversationId: id }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setMessages: (msgs) => set({ messages: msgs }),
  updateLastAssistantMessage: (text) =>
    set((s) => {
      const msgs = [...s.messages]
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].role === "assistant") {
          msgs[i] = { ...msgs[i], text }
          break
        }
      }
      return { messages: msgs }
    }),
  setStreaming: (v) => set({ streaming: v }),
  setStreamingText: (t) => set({ streamingText: t }),
  setCurrentAgent: (a) => set({ currentAgent: a }),
  setSelectedModel: (m) => set({ selectedModel: m }),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  setRightPanelOpen: (v) => set({ rightPanelOpen: v }),
  newConversation: () => {
    const id = crypto.randomUUID()
    localStorage.setItem("conversation_id", id)
    set({
      conversationId: id,
      messages: [],
      streaming: false,
      streamingText: "",
      currentAgent: null,
    })
  },
}))
