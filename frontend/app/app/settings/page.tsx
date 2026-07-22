"use client"

import { useState } from "react"
import {
  Palette,
  Key,
  Cpu,
  Database,
  Globe,
  Bell,
  Moon,
  Sun,
  ChevronRight,
  Check,
  Save,
} from "lucide-react"
import { useAppStore } from "@/lib/store"

const settingsSections = [
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "models", label: "Models", icon: Cpu },
  { id: "memory", label: "Memory", icon: Database },
  { id: "language", label: "Language", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
]

const models = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", desc: "Fast and efficient for most tasks", active: true },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", desc: "Advanced reasoning with 1M context", active: false },
  { id: "gpt-4o", name: "GPT-4o", desc: "OpenAI flagship model", active: false },
  { id: "quantummath-v4", name: "QuantumMath v4", desc: "Custom model for quantum physics", active: false },
]

const languages = ["English", "Español", "Français", "Deutsch", "中文", "日本語", "한국어", "Português", "العربية"]

const accentColors = ["#3B82F6", "#7C3AED", "#06B6D4", "#10B981", "#F59E0B", "#F43F5E"]

export default function SettingsPage() {
  const { theme, toggleTheme, selectedModel, setSelectedModel } = useAppStore()
  const [activeSection, setActiveSection] = useState("appearance")
  const [accentColor, setAccentColor] = useState("#3B82F6")
  const [apiKey, setApiKey] = useState("")
  const [memoryEnabled, setMemoryEnabled] = useState(true)
  const [contextWindow, setContextWindow] = useState("Last 50 messages")
  const [language, setLanguage] = useState("English")
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    "Simulation Complete": true,
    "New Papers Found": true,
    "Code Errors": false,
    "Weekly Summary": false,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleNotification = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
              <p className="text-sm text-white/50">Configure your platform preferences</p>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/25"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <nav className="space-y-1">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      activeSection === section.id
                        ? "bg-white/10 text-white"
                        : "text-white/40 hover:text-white/60 hover:bg-white/5"
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span>{section.label}</span>
                    <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
                  </button>
                ))}
              </nav>
            </div>

            <div className="lg:col-span-3">
              {activeSection === "appearance" && (
                <div className="p-6 rounded-2xl bg-[#111827] border border-white/[0.06] space-y-6">
                  <h3 className="text-sm font-semibold text-white">Theme</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "dark" as const, label: "Dark", icon: Moon },
                      { id: "light" as const, label: "Light", icon: Sun },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          if (theme !== t.id) toggleTheme()
                        }}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          theme === t.id
                            ? "bg-blue-500/15 border-blue-500/30 text-white"
                            : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:bg-white/[0.06]"
                        }`}
                      >
                        <t.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{t.label}</span>
                      </button>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                      Accent Colors
                    </h4>
                    <div className="flex gap-3">
                      {accentColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setAccentColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            accentColor === color
                              ? "border-white scale-110"
                              : "border-transparent hover:border-white/20"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "api-keys" && (
                <div className="p-6 rounded-2xl bg-[#111827] border border-white/[0.06] space-y-4">
                  <h3 className="text-sm font-semibold text-white">API Keys</h3>
                  {["Google Gemini", "Anthropic", "OpenAI"].map((provider) => (
                    <div key={provider} className="space-y-1">
                      <label className="text-xs text-white/40">{provider}</label>
                      <input
                        type="password"
                        placeholder={`Enter ${provider} API key`}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/[0.08] text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeSection === "models" && (
                <div className="p-6 rounded-2xl bg-[#111827] border border-white/[0.06] space-y-4">
                  <h3 className="text-sm font-semibold text-white">Active Model</h3>
                  <div className="space-y-2">
                    {models.map((model) => (
                      <div
                        key={model.id}
                        onClick={() => setSelectedModel(model.name)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedModel === model.name
                            ? "bg-blue-500/15 border-blue-500/30"
                            : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium text-white">{model.name}</div>
                          <div className="text-xs text-white/40">{model.desc}</div>
                        </div>
                        {selectedModel === model.name && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "memory" && (
                <div className="p-6 rounded-2xl bg-[#111827] border border-white/[0.06] space-y-4">
                  <h3 className="text-sm font-semibold text-white">Conversation Memory</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-white">Enable Memory</div>
                        <div className="text-xs text-white/40">
                          Remember context across conversations
                        </div>
                      </div>
                      <button
                        onClick={() => setMemoryEnabled(!memoryEnabled)}
                        className={`w-10 h-6 rounded-full transition-colors ${
                          memoryEnabled ? "bg-blue-500" : "bg-white/10"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                            memoryEnabled ? "translate-x-[18px]" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    <div>
                      <label className="text-xs text-white/40">Context Window</label>
                      <select
                        value={contextWindow}
                        onChange={(e) => setContextWindow(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/[0.08] text-white text-sm focus:outline-none mt-1"
                      >
                        <option>Last 10 messages</option>
                        <option>Last 50 messages</option>
                        <option>Last 100 messages</option>
                        <option>All messages</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "language" && (
                <div className="p-6 rounded-2xl bg-[#111827] border border-white/[0.06] space-y-4">
                  <h3 className="text-sm font-semibold text-white">Language</h3>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/[0.08] text-white text-sm focus:outline-none"
                  >
                    {languages.map((lang) => (
                      <option key={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              )}

              {activeSection === "notifications" && (
                <div className="p-6 rounded-2xl bg-[#111827] border border-white/[0.06] space-y-4">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  {Object.keys(notifications).map((item) => (
                    <div key={item} className="flex items-center justify-between py-2">
                      <span className="text-sm text-white/60">{item}</span>
                      <button
                        onClick={() => toggleNotification(item)}
                        className={`w-10 h-6 rounded-full transition-colors ${
                          notifications[item] ? "bg-blue-500" : "bg-white/10"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                            notifications[item] ? "translate-x-[18px]" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
