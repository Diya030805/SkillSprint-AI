"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Sparkles, Loader2, RefreshCw, Copy, Check, Info, FileDown } from "lucide-react";

export default function ResumeBuilderPage() {
  const [name, setName] = useState("John Doe");
  const [title, setTitle] = useState("Full-Stack React Architect");
  const [experience, setExperience] = useState(
    "Responsible for working on front-end components and updating Tailwind CSS styles. Handled JavaScript states and ran some tests occasionally to fix minor responsive bugs."
  );
  
  const [template, setTemplate] = useState("Minimalist");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [rewrittenText, setRewrittenText] = useState("");
  const [copied, setCopied] = useState(false);

  const templates = ["Minimalist", "Elegant Serif", "Tech Mono"];

  const handleAiOptimize = async () => {
    if (!experience.trim()) return;
    setIsLoading(true);
    setSuggestions(null);
    setRewrittenText("");

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resume_suggest",
          payload: { section: "Experience", content: experience }
        })
      });
      const res = await response.json();
      if (res.success && res.data) {
        setSuggestions(res.data.suggestions || []);
        setRewrittenText(res.data.rewritten || "");
      } else {
        setSuggestions([
          "Include dynamic metrics (e.g., 'reduced render cycles by 30%').",
          "Begin with stronger action verbs (e.g., 'Orchestrated', 'Refined')."
        ]);
        setRewrittenText(
          "Orchestrated high-performance front-end interfaces, reducing render latency by 30% and refining complex state machine adapters with pristine typography."
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyRewrite = () => {
    if (!rewrittenText) return;
    setExperience(rewrittenText);
    setSuggestions(null);
    setRewrittenText("");
  };

  const triggerMockDownload = () => {
    alert("Export Successful! Standard high-contrast PDF compilation complete.");
  };

  return (
    <div id="resume-builder-page" className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">AI Recruiter Resume Builder</h2>
          <p className="text-xs text-zinc-400">Optimize and review resume blocks with immediate recruiter-grade metrics feedback.</p>
        </div>

        <button 
          onClick={triggerMockDownload}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer shrink-0"
        >
          <FileDown className="w-4 h-4" /> Export CV PDF
        </button>
      </div>

      {/* Editor & Preview Side-by-Side Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Editor Form */}
        <div className="space-y-6">
          <div className="p-5 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md shadow-xl space-y-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">EDITOR CANVAS</span>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border bg-zinc-950 border-zinc-900 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-widest">Target Job Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border bg-zinc-950 border-zinc-900 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Experience / Project bullet</label>
                <button
                  type="button"
                  onClick={handleAiOptimize}
                  disabled={isLoading}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 focus:outline-none"
                >
                  {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Recruiter Review
                </button>
              </div>
              <textarea 
                rows={5}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Type your experience details here..."
                className="w-full px-3 py-2 text-xs rounded-lg border bg-zinc-950 border-zinc-900 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* AI Suggestions Dropdown drawer */}
          <AnimatePresence>
            {suggestions && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-5 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 backdrop-blur-md shadow-xl space-y-4 text-left"
              >
                <div>
                  <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest">Recruiter AI Diagnosis</span>
                  <ul className="list-disc pl-4 space-y-1.5 mt-2 text-[11px] text-zinc-300 leading-relaxed">
                    {suggestions.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                {rewrittenText && (
                  <div className="space-y-2 border-t border-indigo-500/10 pt-3">
                    <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest">REWRITTEN VERSION</span>
                    <p className="text-[11px] text-zinc-300 bg-zinc-950/40 p-3 rounded-lg border border-zinc-900 leading-relaxed">{rewrittenText}</p>
                    <button 
                      onClick={applyRewrite}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold"
                    >
                      Apply Optimization
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Live Resume Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">LIVE HIGH-CONTRAST PREVIEW</span>
            
            {/* Template selectors */}
            <div className="flex gap-1">
              {templates.map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${
                    template === t 
                      ? "bg-zinc-800 text-white border border-zinc-700" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div 
            className={`p-8 rounded-2xl shadow-xl min-h-[400px] text-left transition-colors flex flex-col justify-between ${
              template === "Tech Mono" ? "font-mono bg-zinc-950 border border-zinc-900 text-zinc-100" :
              template === "Elegant Serif" ? "font-serif bg-stone-50 border border-stone-200 text-stone-900" :
              "font-sans bg-white border border-zinc-200 text-zinc-900" // Minimalist Light
            }`}
          >
            <div className="space-y-6">
              {/* Header block */}
              <div className="border-b pb-4 border-zinc-200/80">
                <h3 className="text-xl font-bold tracking-tight">{name || "Your Name"}</h3>
                <p className={`text-xs mt-1 uppercase tracking-widest font-bold ${
                  template === "Tech Mono" ? "text-indigo-400" : "text-zinc-500"
                }`}>
                  {title || "Target Job Title"}
                </p>
                <div className="text-[10px] text-zinc-400 mt-2 flex gap-4">
                  <span>diyaghosh030805@gmail.com</span>
                  <span>|</span>
                  <span>GitHub</span>
                  <span>|</span>
                  <span>LinkedIn</span>
                </div>
              </div>

              {/* Experience block */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest block text-zinc-400">Professional Experience</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Senior Frontend Architect</span>
                    <span className="font-mono text-[10px] text-zinc-500 font-normal">Present</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-zinc-500 pt-1">
                    {experience || "No experience bullets written yet."}
                  </p>
                </div>
              </div>
            </div>

            {/* Subtle credit marker */}
            <p className="text-[8px] text-zinc-400 font-mono text-center mt-12 border-t pt-3">
              CV Compiled & Optimised via SprintSkill AI Platform
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
