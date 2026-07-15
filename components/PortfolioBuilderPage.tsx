"use client";

import React, { useState } from "react";
import { Code, Layout, Plus, Trash2, Eye, ExternalLink, Sparkles } from "lucide-react";

interface Project {
  id: number;
  title: string;
  tech: string;
  desc: string;
}

export default function PortfolioBuilderPage() {
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, title: "Lumina AI SaaS Ledger", tech: "Next.js 15, Tailwind", desc: "A translucent analytical bento dashboard featuring real-time stream caching and custom responsive layouts." },
    { id: 2, title: "Interactive Canvas Orchestrator", tech: "TypeScript, Konva.js", desc: "A client-side multiplayer interactive sketch space with vector anchors and hardware acceleration." }
  ]);

  const [title, setTitle] = useState("");
  const [tech, setTech] = useState("");
  const [desc, setDesc] = useState("");
  const [theme, setTheme] = useState("Glassmorphic Slate");

  const themes = ["Glassmorphic Slate", "Minimalist White", "Retro Cyber"];

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tech.trim() || !desc.trim()) return;
    setProjects([...projects, { id: Date.now(), title, tech, desc }]);
    setTitle("");
    setTech("");
    setDesc("");
  };

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div id="portfolio-builder-page" className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Interactive Portfolio Theme Engine</h2>
          <p className="text-xs text-zinc-400">Select premium design presets, log your projects, and preview your live portfolio landing effortlessly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Side: Form and Project Managers (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Add Project Form */}
          <div className="p-5 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md shadow-xl space-y-4 text-left">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">LOG CUSTOM PROJECT</span>
            
            <form onSubmit={handleAddProject} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase">Project Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Lumina AI Client" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border bg-zinc-950 border-zinc-900 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase">Technologies (Tech Stack)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Next.js, Framer Motion" 
                  value={tech}
                  onChange={(e) => setTech(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border bg-zinc-950 border-zinc-900 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase">Short Description</label>
                <textarea 
                  rows={3} 
                  placeholder="A brief summary of what you engineered..." 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border bg-zinc-950 border-zinc-900 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-normal resize-none"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Log Project
              </button>
            </form>
          </div>

          {/* Active project listing */}
          <div className="p-5 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md shadow-xl space-y-4 text-left">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">CURRENT PROJECTS ({projects.length})</span>
            
            <div className="space-y-2.5">
              {projects.map((p) => (
                <div key={p.id} className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-950/60 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-zinc-200">{p.title}</h5>
                    <p className="text-[10px] text-zinc-500 font-semibold">{p.tech}</p>
                  </div>

                  <button 
                    onClick={() => handleDeleteProject(p.id)}
                    className="p-1.5 rounded-md border border-zinc-900 text-zinc-500 hover:text-red-400 hover:border-zinc-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {projects.length === 0 && (
                <p className="text-[10px] text-zinc-500 text-center py-4">No projects logged yet. Add your first one above!</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Theme Selector & Mock Layout Preview (Col span 3) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">LIVE PORTFOLIO MOCKUP PREVIEW</span>
            
            {/* Theme list */}
            <div className="flex gap-1">
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-2.5 py-1 rounded text-[9px] font-bold transition-all ${
                    theme === t 
                      ? "bg-zinc-800 text-white border border-zinc-700" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Theme preview shell container */}
          <div 
            className={`p-6 rounded-2xl min-h-[400px] border text-left flex flex-col justify-between transition-all ${
              theme === "Retro Cyber" ? "font-mono bg-black border-emerald-500/30 text-emerald-400" :
              theme === "Minimalist White" ? "font-sans bg-zinc-50 border-zinc-200 text-zinc-900 shadow-lg" :
              "font-sans bg-zinc-950 border-zinc-900 text-zinc-100" // Glassmorphic Slate
            }`}
          >
            {/* Header block mockup */}
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4 border-zinc-800/40">
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center`}>
                    <Code className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-bold">John Doe</span>
                </div>
                <div className="flex space-x-4 text-[10px] text-zinc-400">
                  <span className="hover:text-white cursor-pointer">About</span>
                  <span className="hover:text-white cursor-pointer">Projects</span>
                  <span className="hover:text-white cursor-pointer">Contact</span>
                </div>
              </div>

              {/* Hero details */}
              <div className="space-y-2">
                <h4 className={`text-xl font-extrabold tracking-tight leading-none ${
                  theme === "Retro Cyber" ? "text-emerald-300 font-mono" : ""
                }`}>
                  Architecting premium responsive client experiences
                </h4>
                <p className="text-xs text-zinc-400 max-w-md">
                  I specialize in Next.js Server Components, strict TypeScript type declarations, and micro-interactive Framer Motion grids.
                </p>
              </div>

              {/* Dynamic Projects display in selected theme */}
              <div className="space-y-3">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400">Featured Projects</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.map((p) => (
                    <div 
                      key={p.id} 
                      className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                        theme === "Retro Cyber" ? "bg-black border-emerald-500/20 hover:border-emerald-500 text-emerald-400" :
                        theme === "Minimalist White" ? "bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900" :
                        "bg-zinc-900/40 border-zinc-900 hover:border-zinc-800 text-zinc-100"
                      }`}
                    >
                      <div className="space-y-1">
                        <h6 className="text-xs font-bold flex items-center justify-between">
                          <span>{p.title}</span>
                          <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0" />
                        </h6>
                        <p className="text-[10px] text-zinc-500 font-bold">{p.tech}</p>
                        <p className="text-[10px] text-zinc-400 mt-1 leading-normal line-clamp-2">{p.desc}</p>
                      </div>
                    </div>
                  ))}

                  {projects.length === 0 && (
                    <p className="text-[10px] text-zinc-500 italic">No projects listed. Log them on the left pane to preview them live!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Mockup footer */}
            <p className="text-[8px] text-zinc-500 text-center mt-12 border-t pt-3 border-zinc-900/40 font-mono">
              Hosted live on SprintSkill Cloud Spaces
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
