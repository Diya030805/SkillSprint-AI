"use client";

import React, { useState } from "react";
import { Search, Play, BookOpen, Clock, Layers, Filter, CheckCircle2 } from "lucide-react";

interface Course {
  id: number;
  title: string;
  category: string;
  duration: string;
  lessons: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  desc: string;
  progress?: number;
}

export default function LearningHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Architecture", "Frontend", "Backend", "Devops"];

  const courses: Course[] = [
    {
      id: 1,
      title: "Mastering Next.js 15 App Router",
      category: "Frontend",
      duration: "6 hrs",
      lessons: 12,
      level: "Advanced",
      desc: "Deep dive into Server Components, Server Actions, streaming, and caching layers.",
      progress: 45
    },
    {
      id: 2,
      title: "Enterprise System Spacing & Visual Rhythm",
      category: "Architecture",
      duration: "3 hrs",
      lessons: 8,
      level: "Intermediate",
      desc: "Learn to perfect typographic pairing, line height proportions, and bento-grid layouts.",
      progress: 80
    },
    {
      id: 3,
      title: "Google GenAI SDK Integration Patterns",
      category: "Backend",
      duration: "4 hrs",
      lessons: 10,
      level: "Advanced",
      desc: "Architect server-side AI integrations using the official @google/genai package.",
      progress: 10
    },
    {
      id: 4,
      title: "Docker Containerization & Kubernetes Clusters",
      category: "Devops",
      duration: "8 hrs",
      lessons: 16,
      level: "Intermediate",
      desc: "Deploy, scale, and manage containerized SaaS micro-environments under heavy loads.",
      progress: 0
    },
    {
      id: 5,
      title: "TypeScript Deep Generics & Schema Validators",
      category: "Backend",
      duration: "5 hrs",
      lessons: 9,
      level: "Advanced",
      desc: "Design type-safe database adapters, complex schemas, and mapped utility layers.",
      progress: 0
    },
    {
      id: 6,
      title: "Tailwind CSS Fluid Layouts & Micro-Animations",
      category: "Frontend",
      duration: "3.5 hrs",
      lessons: 7,
      level: "Beginner",
      desc: "Design fluid screens that respond cleanly to container changes, utilizing hardware acceleration.",
      progress: 0
    }
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="learning-hub-page" className="space-y-6">
      
      {/* Top Welcome Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Curated Learning Hub</h2>
          <p className="text-xs text-zinc-400">Expand your technical execution with professional, structured core modules.</p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-xs w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            placeholder="Search courses or topics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-xs bg-white/5 border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Category Tabs list */}
      <div className="flex flex-wrap gap-2 pb-1 border-b border-zinc-900">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === cat 
                ? "bg-indigo-600 text-white" 
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Highlight/Continue Learning drawer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core continue list */}
        <div className="md:col-span-2 space-y-4">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">AVAILABLE BLUEPRINTS</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCourses.map((c) => (
              <div 
                key={c.id} 
                className="p-5 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-4 hover:border-white/20 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-indigo-400 font-bold uppercase">{c.category}</span>
                    <span className="text-zinc-500 font-semibold">{c.level}</span>
                  </div>
                  <h4 className="text-xs font-bold leading-tight group-hover:text-indigo-400 transition-colors">{c.title}</h4>
                  <p className="text-[11px] text-zinc-400 leading-normal">{c.desc}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-zinc-900">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {c.lessons} Lessons</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {c.duration}</span>
                  </div>

                  {c.progress !== undefined && c.progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] text-zinc-400 font-mono">
                        <span>Progress</span>
                        <span>{c.progress}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-zinc-950 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${c.progress}%` }} />
                      </div>
                    </div>
                  )}

                  <button className="w-full py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center gap-1">
                    <Play className="w-3 h-3 fill-current" /> {c.progress && c.progress > 0 ? "Continue Lesson" : "Start Module"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="p-12 text-center text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-2xl">
              No course blueprints match your current criteria. Let&apos;s try another category!
            </div>
          )}
        </div>

        {/* Right Side Info: Completed modules log */}
        <div className="space-y-6">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">CURRENT ACTIVE WORK</span>
          
          <div className="p-5 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md shadow-xl space-y-4">
            <h4 className="text-xs font-bold text-zinc-200">Continuous Mastery Tracking</h4>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Each course features active coding quizzes, milestone project checkpoints, and a final certified certificate block saved in your Profile.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <span className="font-bold text-zinc-300">HTML Semantic Tags</span>
                  <p className="text-[10px] text-zinc-500">Completed June 2026</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <span className="font-bold text-zinc-300">Git Rebase Flow Patterns</span>
                  <p className="text-[10px] text-zinc-500">Completed July 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
