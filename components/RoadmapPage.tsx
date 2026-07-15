"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Sparkles, BookOpen, Clock, Code, PlayCircle, Plus, Check, Loader2, Award, ArrowRight } from "lucide-react";

interface RoadmapPageProps {
  isDarkMode: boolean;
}

export default function RoadmapPage({ isDarkMode }: RoadmapPageProps) {
  const [careerGoal, setCareerGoal] = useState("Full-Stack Developer");
  const [currentSkills, setCurrentSkills] = useState("");
  const [hoursCommitment, setHoursCommitment] = useState("15");
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize with a world-class structured default roadmap matching the Vercel/Linear style
  const [roadmap, setRoadmap] = useState<any>({
    role: "Full-Stack React & Node Architect",
    description: "An industry-ready curriculum focusing on deep type systems, robust async state design, caching layers, and SEO orchestration.",
    estimatedDuration: "6 Months (15 hrs/week)",
    skillTree: [
      { name: "TypeScript Core", level: "Intermediate", description: "Generics, mapped types, and utility schemas." },
      { name: "Next.js App Router", level: "Advanced", description: "Server components, middleware, and caching strategies." },
      { name: "Postgres & Prisma", level: "Intermediate", description: "Relational constraints, joins, and transactional mutations." }
    ],
    milestones: [
      {
        id: 1,
        title: "Semantic Engineering & Spacing Systems",
        duration: "Weeks 1-4",
        description: "Perfect typography pairings, responsive grid cadence, and setting structured CSS variable palettes.",
        skillsToLearn: ["Tailwind Utility Mastery", "Flexbox/Grid Cadence", "Semantic Architecture"],
        project: {
          title: "Vercel-Inspired Content Ledger",
          description: "Build a highly interactive dashboard with a translucent sidebar, responsive bento boxes, and a light/dark theme switch."
        },
        resources: [
          { name: "Design Guidelines for SaaS Layout Spacing", type: "Document" },
          { name: "Advanced Fluid Layout Design with Grid Rules", type: "Video" }
        ],
        completed: true
      },
      {
        id: 2,
        title: "Client-Side Core Mechanics & State Design",
        duration: "Weeks 5-12",
        description: "Learn state delegation, asynchronous fetch optimization, and adding premium Framer Motion hover cues.",
        skillsToLearn: ["Custom Hooks Synthesis", "Asynchronous Mutations", "Micro-animations Design"],
        project: {
          title: "Real-time AI Chat Mentor Client",
          description: "An elegant floating prompt card featuring active speech synthesizers, typing loaders, and copy-to-clipboard blocks."
        },
        resources: [
          { name: "Mastering Client State Synchronization Mechanisms", type: "Document" }
        ],
        completed: false
      },
      {
        id: 3,
        title: "Production Scaling & Edge Pipelines",
        duration: "Weeks 13-24",
        description: "Configure server-side proxy routes, optimize code splittings, and achieve premium lighthouse ranking metrics.",
        skillsToLearn: ["Middleware Caching Rules", "SEO Optimization", "Vulnerability Auditing"],
        project: {
          title: "Next-Gen SaaS Analytics Panel",
          description: "A production-grade app with lightning-fast initial paints, strict TypeScript variables, and dynamic SVG analytics charts."
        },
        resources: [
          { name: "Edge Compilation and Dynamic Routing", type: "Video" }
        ],
        completed: false
      }
    ]
  });

  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerGoal.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "roadmap",
          payload: { 
            careerGoal, 
            currentSkills: currentSkills || "None", 
            timeCommitment: `${hoursCommitment} hours/week` 
          }
        })
      });
      const res = await response.json();
      if (res.success && res.data) {
        // Map the API results, injecting a 'completed' boolean
        const data = res.data;
        if (data.milestones) {
          data.milestones = data.milestones.map((m: any, idx: number) => ({
            ...m,
            completed: idx === 0 // Mock the first one as complete for clean initial UI
          }));
        }
        setRoadmap(data);
      }
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMilestoneCompleted = (id: number) => {
    if (!roadmap || !roadmap.milestones) return;
    setRoadmap({
      ...roadmap,
      milestones: roadmap.milestones.map((m: any) => 
        m.id === id ? { ...m, completed: !m.completed } : m
      )
    });
  };

  return (
    <div id="roadmap-page" className="space-y-8">
      
      {/* Generator Form Section */}
      <div className={`p-6 rounded-3xl border backdrop-blur-md shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border border-zinc-200/80'}`}>
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Compass className="w-4.5 h-4.5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold">Synthesize Custom AI Learning Roadmaps</h2>
            <p className="text-[11px] text-zinc-500">Unleash our Gemini-powered engine to generate structured technical paths.</p>
          </div>
        </div>

        <form onSubmit={handleGenerateRoadmap} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-wider">Aspirational Career Goal</label>
            <input 
              type="text" 
              placeholder="e.g. AI Devops Specialist, UI/UX Architect..."
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${isDarkMode ? 'bg-zinc-950/80 border-zinc-800 text-white placeholder-zinc-600' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'}`}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-wider">Current Familiar Skills</label>
            <input 
              type="text" 
              placeholder="e.g. Basic HTML, some JavaScript..."
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${isDarkMode ? 'bg-zinc-950/80 border-zinc-800 text-white placeholder-zinc-600' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'}`}
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-wider">Hrs/Week Commit</label>
              <select 
                value={hoursCommitment}
                onChange={(e) => setHoursCommitment(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${isDarkMode ? 'bg-zinc-950/80 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'}`}
              >
                <option value="10">10 hrs/week</option>
                <option value="15">15 hrs/week</option>
                <option value="25">25 hrs/week</option>
                <option value="40">40 hrs/week</option>
              </select>
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-50 h-[34px] self-end cursor-pointer shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Synthesize AI
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Main Roadmap Output Panel */}
      {roadmap && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Skill Tree Summary (Side Panel) */}
          <div className="lg:col-span-1 space-y-4">
            <div className={`p-5 rounded-3xl border sticky top-24 backdrop-blur-md shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-zinc-200'}`}>
              <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest block mb-1">Target Role blueprint</span>
              <h3 className="text-sm font-extrabold leading-tight mb-2">{roadmap.role}</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">{roadmap.description}</p>
              
              <div className="border-t border-zinc-800 pt-4 space-y-3">
                <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest block">CORE SKILL METRICS</span>
                <div className="space-y-2">
                  {roadmap.skillTree?.map((s: any, idx: number) => (
                    <div key={idx} className={`p-2.5 rounded-lg border text-[11px] transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-zinc-50 border-zinc-100'}`}>
                      <div className="font-bold">{s.name}</div>
                      <span className="text-[9px] font-medium text-indigo-400 uppercase mt-0.5 inline-block">{s.level}</span>
                      <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Path (Central panel) */}
          <div className="lg:col-span-3 space-y-6">
            <div className={`p-6 rounded-3xl border backdrop-blur-md shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-zinc-200'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-extrabold tracking-tight">Timeline Curated Track</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20 font-mono">
                  {roadmap.estimatedDuration}
                </span>
              </div>

              {/* Sequential Path Tree */}
              <div className="relative border-l border-zinc-800/80 pl-8 space-y-8 ml-3 py-1">
                {roadmap.milestones?.map((m: any, idx: number) => (
                  <div key={m.id || idx} className="relative">
                    
                    {/* Circle Node */}
                    <button 
                      onClick={() => toggleMilestoneCompleted(m.id || idx)}
                      className={`absolute top-0.5 -left-[45px] w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none ${m.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-500'}`}
                    >
                      {m.completed ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </button>

                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <h4 className={`text-xs font-bold transition-colors ${m.completed ? 'text-zinc-400 line-through' : 'text-zinc-100'}`}>{m.title}</h4>
                        <span className="text-[10px] font-mono text-pink-400 font-semibold">{m.duration}</span>
                      </div>
                      
                      <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">{m.description}</p>

                      {/* Skills listed */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {m.skillsToLearn?.map((skill: string, sIdx: number) => (
                          <span key={sIdx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-900 border border-zinc-800/60 text-zinc-400">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Capstone Project Card */}
                      {m.project && (
                        <div className={`mt-3 p-4 rounded-xl border ${m.completed ? 'border-white/5 opacity-70 bg-white/5' : 'border-white/10 bg-white/5'}`}>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                            <Code className="w-3.5 h-3.5 text-indigo-400" /> Capstone Project: {m.project.title}
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-1 leading-normal">{m.project.description}</p>
                        </div>
                      )}

                      {/* Curated Resources list */}
                      {m.resources && m.resources.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest block mb-1.5">Curated Resources</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {m.resources.map((res: any, rIdx: number) => (
                              <div key={rIdx} className={`p-2.5 rounded-lg border flex items-center justify-between text-[11px] transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-zinc-50 border-zinc-100'}`}>
                                <div className="flex items-center gap-2">
                                  <PlayCircle className="w-4 h-4 text-pink-500 shrink-0" />
                                  <span className="font-semibold text-zinc-300 truncate max-w-[150px]">{res.name}</span>
                                </div>
                                <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono">{res.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
