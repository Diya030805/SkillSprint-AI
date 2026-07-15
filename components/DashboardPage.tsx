"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Flame, 
  Trophy, 
  Target, 
  BookOpen, 
  MessageSquare, 
  Award, 
  ArrowRight, 
  Plus, 
  Check, 
  Clock, 
  Compass, 
  FileText, 
  Code,
  TrendingUp,
  X,
  AlertCircle
} from "lucide-react";

interface DashboardPageProps {
  user: any;
  onNavigateTab: (tab: string) => void;
  isDarkMode: boolean;
}

export default function DashboardPage({ user, onNavigateTab, isDarkMode }: DashboardPageProps) {
  const [weeklyGoals, setWeeklyGoals] = useState<any[]>([
    { id: 1, text: "Finish 'Next.js 15 Server Action' quiz", checked: true },
    { id: 2, text: "Synthesize full portfolio layout in portfolio builder", checked: false },
    { id: 3, text: "Perform recruiter optimization audit on experience resume section", checked: false },
  ]);
  const [newGoalText, setNewGoalText] = useState("");
  const [showAddGoal, setShowAddGoal] = useState(false);

  const [skills, setSkills] = useState<any[]>([
    { name: "TypeScript", progress: 85, level: "Advanced" },
    { name: "Next.js 15", progress: 60, level: "Intermediate" },
    { name: "Tailwind CSS", progress: 95, level: "Advanced" },
    { name: "Gemini API SDK", progress: 40, level: "Beginner" },
  ]);

  const [recentActivities, setRecentActivities] = useState<any[]>([
    { id: 1, type: "quiz", title: "Completed React Server Components Quiz", time: "2 hours ago", metric: "Score: 100%" },
    { id: 2, type: "roadmap", title: "Generated AI Career Blueprint for Full-Stack Architect", time: "1 day ago", metric: "Paced: 6 Months" },
    { id: 3, type: "resume", title: "Optimized Project Description section with AI Suggestions", time: "2 days ago", metric: "Impact: Improved" },
  ]);

  const handleToggleGoal = (id: number) => {
    setWeeklyGoals(
      weeklyGoals.map((g) => (g.id === id ? { ...g, checked: !g.checked } : g))
    );
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    setWeeklyGoals([
      ...weeklyGoals,
      { id: Date.now(), text: newGoalText, checked: false },
    ]);
    setNewGoalText("");
    setShowAddGoal(false);
  };

  return (
    <div id="dashboard-page" className="space-y-6">
      
      {/* Welcome Card & Key Highlights */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-md shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border border-zinc-200/80 shadow-md'}`}>
        <div className="absolute top-0 right-0 w-[240px] h-[240px] bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-widest">
            Sprint Status: Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">{user?.name || "Scholar"}</span>!
          </h1>
          <p className="text-xs text-zinc-400 max-w-md">
            You&apos;re accelerating beautifully. Your personalized roadmaps and AI mentor are calibrated and ready to deploy.
          </p>
        </div>

        {/* Streak Stats Widget */}
        <div className="flex items-center gap-4 relative z-10 shrink-0">
          <div className={`px-4 py-3 rounded-xl border flex items-center gap-3 transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border border-zinc-200/60'}`}>
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <Flame className="w-5.5 h-5.5 text-orange-500 animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-medium">Daily Streak</div>
              <div className="text-lg font-extrabold font-mono">12 Days</div>
            </div>
          </div>

          <div className={`px-4 py-3 rounded-xl border flex items-center gap-3 transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border border-zinc-200/60'}`}>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Trophy className="w-5.5 h-5.5 text-amber-500" />
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-medium">XP Earned</div>
              <div className="text-lg font-extrabold font-mono">4,850</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Core Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Rings & Skill Metrics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Overview */}
          <div className={`p-6 rounded-3xl border backdrop-blur-md shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/50 border border-zinc-200/80 shadow-sm'}`}>
            <h3 className="text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" /> Current Sprint Metrics
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Pie/Circle indicator */}
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" fill="transparent" stroke={isDarkMode ? "#18181b" : "#f4f4f5"} strokeWidth="8" />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      fill="transparent" 
                      stroke="url(#gradient)" 
                      strokeWidth="8" 
                      strokeDasharray="251.2" 
                      strokeDashoffset="100.48" // 60% progress
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-lg font-extrabold font-mono">60%</span>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">Overall</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold">Milestone 1 Complete</div>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    You have finished Foundations & Grid Layout assignments. High-caliber performance recorded.
                  </p>
                </div>
              </div>

              {/* Progress metrics list */}
              <div className="space-y-3 border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-6 border-zinc-800">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Courses completed</span>
                    <span className="font-semibold text-zinc-200">3 / 5</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-950 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Coding Quizzes Aced</span>
                    <span className="font-semibold text-zinc-200">8 / 12</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-950 overflow-hidden">
                    <div className="h-full bg-pink-500 rounded-full" style={{ width: "66.6%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Progress */}
          <div className={`p-6 rounded-3xl border backdrop-blur-md shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/50 border border-zinc-200/80 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" /> Active Skill Tree Status
              </h3>
              <button 
                onClick={() => onNavigateTab("profile")} 
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                View certificates
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((skill, idx) => (
                <div key={idx} className={`p-4 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-zinc-900/5 border-zinc-100'}`}>
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <span className="text-xs font-bold">{skill.name}</span>
                      <p className="text-[10px] text-zinc-500">{skill.level}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-400">{skill.progress}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-zinc-900 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${idx % 2 === 0 ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-gradient-to-r from-purple-500 to-pink-500"}`}
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Columns: Goals & Quick Tasks */}
        <div className="space-y-6">
          
          {/* Weekly Goals Card */}
          <div className={`p-6 rounded-3xl border backdrop-blur-md shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/50 border border-zinc-200/80 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold tracking-tight flex items-center gap-2">
                <Target className="w-4 h-4 text-pink-400" /> Weekly Objectives
              </h3>
              <button 
                onClick={() => setShowAddGoal(!showAddGoal)}
                className={`p-1 rounded-lg border transition-all ${isDarkMode ? 'border-white/10 hover:bg-white/5 text-zinc-400' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-600'}`}
              >
                {showAddGoal ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showAddGoal && (
              <form onSubmit={handleAddGoal} className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  placeholder="Type new objective..." 
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  className={`flex-1 px-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-zinc-500' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'}`}
                  required
                />
                <button type="submit" className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs">
                  Add
                </button>
              </form>
            )}

            <div className="space-y-2.5">
              {weeklyGoals.map((g) => (
                <div 
                  key={g.id} 
                  onClick={() => handleToggleGoal(g.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${g.checked ? 'opacity-50 border-zinc-800/40' : 'hover:bg-white/10'} ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-zinc-50 border-zinc-100'}`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${g.checked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-zinc-700'}`}>
                    {g.checked && <Check className="w-3 h-3" />}
                  </div>
                  <span className={`text-xs ${g.checked ? "line-through text-zinc-500" : ""}`}>{g.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className={`p-6 rounded-3xl border backdrop-blur-md shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/50 border border-zinc-200/80 shadow-sm'}`}>
            <h3 className="text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Instant Actions
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onNavigateTab("roadmap")}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 hover:scale-[1.02] ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/40 border border-zinc-200 hover:bg-zinc-100'}`}
              >
                <Compass className="w-5 h-5 text-indigo-400" />
                <span className="text-[10px] font-bold">New Roadmap</span>
              </button>

              <button 
                onClick={() => onNavigateTab("chat")}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 hover:scale-[1.02] ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/40 border border-zinc-200 hover:bg-zinc-100'}`}
              >
                <MessageSquare className="w-5 h-5 text-pink-400" />
                <span className="text-[10px] font-bold">Ask Mentor</span>
              </button>

              <button 
                onClick={() => onNavigateTab("practice")}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 hover:scale-[1.02] ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/40 border border-zinc-200 hover:bg-zinc-100'}`}
              >
                <Code className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-bold">Quiz Practice</span>
              </button>

              <button 
                onClick={() => onNavigateTab("resume")}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 hover:scale-[1.02] ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/40 border border-zinc-200 hover:bg-zinc-100'}`}
              >
                <FileText className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] font-bold">Optimize CV</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Activity Timeline Widget */}
      <div className={`p-6 rounded-3xl border backdrop-blur-md shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/50 border border-zinc-200/80 shadow-sm'}`}>
        <h3 className="text-sm font-bold tracking-tight mb-5 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" /> Activity History Log
        </h3>
        
        <div className="relative border-l border-zinc-800 pl-6 space-y-6">
          {recentActivities.map((act, idx) => (
            <div key={act.id} className="relative">
              {/* Dot marker */}
              <div className="absolute top-1.5 -left-[30px] w-3 h-3 rounded-full bg-indigo-500 border-2 border-zinc-950" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h4 className="text-xs font-bold">{act.title}</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{act.time}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 sm:self-center self-start">
                  {act.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
