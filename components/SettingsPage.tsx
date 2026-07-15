"use client";

import React, { useState } from "react";
import { Shield, Key, Eye, EyeOff, Check, Save } from "lucide-react";

export default function SettingsPage() {
  const [geminiKey, setGeminiKey] = useState("••••••••••••••••••••••••••••");
  const [showKey, setShowKey] = useState(false);
  const [emailNotify, setEmailNotify] = useState(true);
  const [streakRemind, setStreakRemind] = useState(true);
  const [activeTab, setActiveTab] = useState("Secrets");

  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div id="settings-page" className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-lg font-bold tracking-tight">System Configuration Settings</h2>
        <p className="text-xs text-zinc-400">Configure key secret tokens, credentials, notification preferences, and system parameters.</p>
      </div>

      {/* Settings layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation panel */}
        <div className="lg:col-span-1">
          <div className="flex flex-col gap-1">
            {["Secrets", "Preferences", "Security"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
                  activeTab === t 
                    ? "bg-zinc-800 text-white" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Contents area (Col span 3) */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md shadow-xl space-y-6 text-left">
            
            {activeTab === "Secrets" && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">API SECRET MANAGEMENT</span>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Gemini Secret API Key</span>
                    <span className="text-[10px] text-zinc-500">Injected via AI Studio env variable</span>
                  </div>
                  
                  <div className="relative">
                    <input 
                      type={showKey ? "text" : "password"} 
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      className="w-full px-3 pr-10 py-2 text-xs rounded-lg border bg-zinc-950 border-zinc-900 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowKey(!showKey)} 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-400 focus:outline-none"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-indigo-500/15 bg-indigo-500/5 text-[11px] leading-relaxed text-zinc-400">
                  <span className="font-bold text-zinc-200">How API secrets are handled:</span>
                  <p className="mt-1">
                    Your `GEMINI_API_KEY` is securely stored and injected at runtime. You do not need to enter your raw key here; our server-side API automatically proxies requests safely.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "Preferences" && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">PLATFORM PREFERENCES</span>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-900">
                    <div>
                      <span className="text-xs font-bold block text-zinc-200">Email Progress Reminders</span>
                      <p className="text-[10px] text-zinc-500">Receive weekly summaries of achievements and milestone projects.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={emailNotify} 
                      onChange={(e) => setEmailNotify(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 bg-zinc-950 border-zinc-800 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-900">
                    <div>
                      <span className="text-xs font-bold block text-zinc-200">Streak Warnings</span>
                      <p className="text-[10px] text-zinc-500">Get notified 2 hours before losing your active learning streak.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={streakRemind} 
                      onChange={(e) => setStreakRemind(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 bg-zinc-950 border-zinc-800 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Security" && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">SECURITY & ACCREDITATION</span>
                
                <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
                    <Shield className="w-4 h-4 text-emerald-500" /> Multi-factor Authentication
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    Secure your custom learning milestones and achievements by linking external OAuth structures.
                  </p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-4 border-t border-zinc-900 flex justify-end gap-3">
              <button 
                type="submit" 
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4" /> Config Saved
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Settings
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
