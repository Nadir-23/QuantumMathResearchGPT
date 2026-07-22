"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, Paperclip, Mic, Square, Sparkles, Copy, Check, Image, Wrench, RotateCcw } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { motion, AnimatePresence } from "framer-motion"
import { useAppStore, AgentName } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import ActiveAgentBar from "@/components/active-agent-bar"
import DerivationCard from "@/components/derivation-card"
import VerificationCard from "@/components/verification-card"

const QUICK_PROMPTS = [
  "Solve differential equation",
  "Generate Bell State",
  "Simulate Quantum Circuit",
  "Summarize Papers",
  "Integrate Symbolically",
  "Find Research Gaps",
]

const agentColors: Record<string, string> = {
  "Math Agent": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Quantum Agent": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Research Agent": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Code Agent": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Verification Agent": "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "Orchestrator": "bg-blue-500/20 text-blue-400 border-blue-500/30",
}

export default function ChatPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  const {
    conversationId, setConversationId, messages, addMessage, setMessages,
    streaming, setStreaming, streamingText, setStreamingText,
    setCurrentAgent, currentAgent, newConversation,
  } = useAppStore()
  const { accessToken } = useAuthStore()
  const [input, setInput] = useState("")
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const existing = localStorage.getItem("conversation_id")
    const cid = existing ?? crypto.randomUUID()
    localStorage.setItem("conversation_id", cid)
    setConversationId(cid)
    if (messages.length === 0) {
      addMessage({
        role: "assistant",
        text: "Welcome to **QuantumMathResearchGPT**. I'm your multi-agent scientific AI copilot.\n\nI can help with:\n- **Mathematics**: symbolic derivations, calculus, linear algebra\n- **Quantum Physics**: Schrödinger equation, operators, bra-ket notation\n- **Quantum Computing**: Qiskit circuits, Bell states, error correction\n- **Research**: ArXiv search, literature review\n- **Code Generation**: Python, Julia, MATLAB, Qiskit\n\nWhat would you like to explore?",
      })
    }
  }, [addMessage, messages.length, setConversationId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingText, streaming])

  const detectAgent = useCallback((msg: string): AgentName => {
    const lower = msg.toLowerCase()
    if (lower.includes("quantum") || lower.includes("schrödinger") || lower.includes("qubit") || lower.includes("bell state")) return "Quantum Agent"
    if (lower.includes("paper") || lower.includes("research") || lower.includes("arxiv")) return "Research Agent"
    if (lower.includes("code") || lower.includes("python") || lower.includes("qiskit")) return "Code Agent"
    if (lower.includes("verify") || lower.includes("check") || lower.includes("prove")) return "Verification Agent"
    return "Math Agent"
  }, [])

  async function sendMessage(overrideText?: string) {
    const userMessage = (overrideText ?? input).trim()
    if (!userMessage || streaming) return
    addMessage({ role: "user", text: userMessage })
    setInput("")
    setStreaming(true)
    setStreamingText("")

    const agent = detectAgent(userMessage)
    setCurrentAgent(agent)

    const start = performance.now()
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ user_message: userMessage, conversation_id: conversationId }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const contentType = res.headers.get("content-type") || ""
      const elapsed = ((performance.now() - start) / 1000).toFixed(2)

      if (contentType.includes("text/event-stream") || contentType.includes("text/plain")) {
        const reader = res.body?.getReader()
        const decoder = new TextDecoder()
        let fullText = ""
        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const chunk = decoder.decode(value, { stream: true })
            fullText += chunk
            setStreamingText(fullText)
          }
        }
        setStreamingText("")
        addMessage({
          role: "assistant", text: fullText || "(empty response)",
          agent, time: parseFloat(elapsed),
        })
      } else {
        const data = await res.json()
        addMessage({
          role: "assistant", text: data?.answer ?? "(no answer)",
          agent, time: parseFloat(elapsed),
        })
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      addMessage({ role: "assistant", text: `**Error:** ${msg}` })
    } finally {
      setStreaming(false)
      setStreamingText("")
      setCurrentAgent(null)
    }
  }

  function handleNewChat() {
    newConversation()
    addMessage({
      role: "assistant",
      text: "New conversation initialized. What would you like to explore?",
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Active Agent Bar */}
      <ActiveAgentBar />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] ${m.role === "user" ? "" : "w-full max-w-[80%]"}`}>
                {m.role === "assistant" && m.agent && (
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default" className={`text-[10px] ${agentColors[m.agent] || ""}`}>{m.agent}</Badge>
                    {m.time && <span className="text-[10px] text-white/30">{m.time}s</span>}
                  </div>
                )}
                <div className={`rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20"
                    : "bg-white/[0.03] border border-white/[0.05]"
                }`}>
                  {m.role === "assistant" ? (
                    <div className="markdown-content">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          code({ className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "")
                            const codeString = String(children).replace(/\n$/, "")
                            if (match) {
                              return (
                                <div className="relative my-3 rounded-xl overflow-hidden border border-white/[0.06]">
                                  <div className="flex items-center justify-between px-4 py-2 bg-white/[0.04] border-b border-white/[0.06]">
                                    <span className="text-[10px] font-mono text-white/40 uppercase">{match[1]}</span>
                                    <CopyButton text={codeString} />
                                  </div>
                                  <SyntaxHighlighter
                                    style={oneDark}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{ margin: 0, background: "rgba(17,24,39,0.8)", fontSize: "13px", borderRadius: 0 }}
                                  >
                                    {codeString}
                                  </SyntaxHighlighter>
                                </div>
                              )
                            }
                            return (
                              <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-[13px] font-mono text-blue-300" {...props}>
                                {children}
                              </code>
                            )
                          },
                        }}
                      >
                        {m.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <span className="whitespace-pre-wrap">{m.text}</span>
                  )}
                </div>
                {m.role === "assistant" && (
                  <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 rounded-md text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-all">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming text */}
        {streaming && streamingText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[80%]">
              {currentAgent && (
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default" className={`text-[10px] ${agentColors[currentAgent] || ""}`}>{currentAgent}</Badge>
                  <span className="text-[10px] text-white/30">streaming...</span>
                </div>
              )}
              <div className="rounded-2xl px-5 py-4 text-sm leading-relaxed bg-white/[0.03] border border-white/[0.05]">
                <div className="markdown-content streaming-cursor">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "")
                        const codeString = String(children).replace(/\n$/, "")
                        if (match) {
                          return (
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{ margin: 0, background: "rgba(17,24,39,0.8)", fontSize: "13px", borderRadius: "12px" }}
                            >
                              {codeString}
                            </SyntaxHighlighter>
                          )
                        }
                        return <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-[13px] font-mono text-blue-300" {...props}>{children}</code>
                      },
                    }}
                  >
                    {streamingText}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Typing indicator */}
        {streaming && !streamingText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl px-5 py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-xs text-white/50">Processing...</span>
                <div className="flex gap-1 ml-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 typing-dot" />
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 typing-dot" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 typing-dot" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={endRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            {QUICK_PROMPTS.map((p, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => sendMessage(p)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.06] hover:border-white/[0.1] transition-all text-left"
              >
                {p}
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        <div className="flex gap-2 items-end glass rounded-2xl p-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-white/30 hover:text-white/60">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-white/30 hover:text-white/60">
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image className="w-4 h-4" />
          </Button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={streaming}
            rows={1}
            placeholder="Ask anything in mathematics, quantum physics, symbolic computation or scientific research..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none resize-none py-2 max-h-32 min-h-[36px]"
            style={{ height: "auto" }}
            onInput={(e) => {
              e.currentTarget.style.height = "auto"
              e.currentTarget.style.height = Math.min(e.currentTarget.scrollHeight, 128) + "px"
            }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendMessage() } }}
          />
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-white/30 hover:text-white/60">
            <Mic className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-white/30 hover:text-white/60">
            <Wrench className="w-4 h-4" />
          </Button>
          {streaming ? (
            <Button size="icon" variant="destructive" className="h-9 w-9 shrink-0">
              <Square className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              disabled={!input.trim()}
              onClick={() => void sendMessage()}
              className="h-9 w-9 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center justify-center mt-2">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 text-[11px] text-white/20 hover:text-white/40 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            New conversation
          </button>
        </div>
      </div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  )
}
