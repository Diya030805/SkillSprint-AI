"use client";

import React from "react";
import { TrendingUp, Clock, BookOpen, Award, BarChart3, HelpCircle, Flame } from "lucide-react";

export default function AnalyticsPage() {
  const stats = [
    { label: "Weekly Commitment", value: "18.5 hrs", desc: "Target: 15 hrs/week" },
    { label: "Quizzes Solved", value: "14 / 16", desc: "Accuracy: 92%" },
    { label: "Active Milestones", value: "2 Complete", desc: "1 in active progress" },
    { label: "XP Accrued", value: "4,850 XP", desc: "+850 this week" }
  ];

  const chartData = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 4.0 },
    { day: "Wed", hours: 1.5 },
    { day: "Thu", hours: 3.0 },
    { day: "Fri", hours: 5.5 },
    { day: "Sat", hours: 2.0 },
    { day: "Sun", hours: 0.0 }
  ];

  const maxHours = 6.0;

  return (
    <div id="analytics-page" className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-lg font-bold tracking-tight">Performance Analytics Ledger</h2>
        <p className="text-xs text-zinc-400">Deep mathematical analytics tracking technical progress, commitment targets, and milestones.</p>
      </div>

      {/* Stats Indicators bento box */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="p-5 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md shadow-xl space-y-1.5 text-left">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">{s.label}</span>
            <div className="text-xl font-extrabold font-mono text-zinc-200">{s.value}</div>
            <p className="text-[10px] text-zinc-400">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Chart and timeline split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Hours SVG Chart (Col span 2) */}
        <div className="lg:col-span-2 p-6 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-900/40">
            <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-400" /> Weekly Commitment Ledger
            </h4>
            <span className="text-[10px] font-mono text-zinc-500">HOURS LOGGED / DAY</span>
          </div>

          {/* SVG Chart */}
          <div className="relative pt-6">
            <div className="flex h-[200px] items-end justify-between px-2 gap-4">
              {chartData.map((d, idx) => {
                const heightPercent = `${(d.hours / maxHours) * 100}%`;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950 border border-zinc-800 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded absolute -translate-y-8 pointer-events-none">
                      {d.hours}h
                    </div>

                    {/* Bar representation */}
                    <div className="w-full bg-zinc-950 rounded-md overflow-hidden h-[180px] flex items-end">
                      <div 
                        className="w-full bg-gradient-to-t from-indigo-600 via-indigo-500 to-pink-500 rounded-t-sm transition-all duration-500"
                        style={{ height: heightPercent }}
                      />
                    </div>

                    <span className="text-[10px] font-mono font-semibold text-zinc-500">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Milestone Achievement timeline (Col span 1) */}
        <div className="p-6 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md shadow-xl space-y-4 text-left">
          <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-pink-500" /> Achievement Milestones
          </h4>
          
          <div className="space-y-4 pt-2">
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0 text-orange-400">
                <Flame className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold">10-Day Daily Streak Badge</h5>
                <p className="text-[10px] text-zinc-500">Unlocked yesterday</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0 text-indigo-400">
                <Clock className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold">First Milestone Cleared</h5>
                <p className="text-[10px] text-zinc-500">Certified June 2026</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0 text-purple-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold">RSC Core Quiz Aced</h5>
                <p className="text-[10px] text-zinc-500">Score: 100%</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
