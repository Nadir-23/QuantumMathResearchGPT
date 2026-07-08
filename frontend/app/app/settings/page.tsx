"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Settings, Key, Brain, Globe, Bell, Moon, Save } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("gemini-2.5-flash")
  const [memory, setMemory] = useState(true)

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-white/40">Configure your scientific AI platform</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Key className="w-4 h-4" /> API Keys</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Gemini API Key</label>
            <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter your API key..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Brain className="w-4 h-4" /> Model</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Default Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none">
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
              <option value="gpt-4o">GPT-4o</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Settings className="w-4 h-4" /> General</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/70">Conversation Memory</div>
              <div className="text-xs text-white/30">Remember context across messages</div>
            </div>
            <button onClick={() => setMemory(!memory)} className={`w-10 h-5 rounded-full transition-colors ${memory ? "bg-blue-500" : "bg-white/10"}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${memory ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/70">Language</div>
              <div className="text-xs text-white/30">Interface language</div>
            </div>
            <span className="text-sm text-white/50">English</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
      </div>
    </div>
  )
}
