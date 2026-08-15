"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, Clock, BookOpen, Award, BarChart3, HelpCircle, Flame, Calendar, Sparkles } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { playSound } from "@/lib/audio";

// Days and Weeks for Heatmap Grid declared outside the component to prevent re-renders and useMemo dependency warnings
const HEATMAP_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HEATMAP_WEEKS = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

// Custom tooltips inside Recharts responsive containers declared outside the component
const CustomTooltip = ({ active, payload, viewType }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-zinc-950/95 border border-zinc-800 p-2.5 rounded-xl shadow-xl text-left backdrop-blur-md">
        <p className="text-[10px] font-extrabold tracking-wide text-zinc-400 uppercase">
          {data.week} - {data.day}
        </p>
        <div className="space-y-1.5 mt-1.5">
          <p className={`text-xs font-bold flex items-center gap-1.5 ${viewType === "hours" ? "text-indigo-400" : "text-zinc-200"}`}>
            <Clock className="w-3.5 h-3.5 text-zinc-400" /> {data.hours} hrs spent
          </p>
          <p className={`text-xs font-bold flex items-center gap-1.5 ${viewType === "modules" ? "text-emerald-400" : "text-zinc-200"}`}>
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" /> {data.modules} module{data.modules !== 1 ? "s" : ""} completed
          </p>
          <p className={`text-xs font-bold flex items-center gap-1.5 ${viewType === "milestones" ? "text-amber-400" : "text-zinc-200"}`}>
            <Award className="w-3.5 h-3.5 text-zinc-400" /> {data.milestones} milestone{data.milestones !== 1 ? "s" : ""} updated
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// Custom Render Block for Heatmap cells mimicking GitHub contributions declared outside the component
const RenderCustomBlock = (props: any) => {
  const { cx, cy, payload, selectedCell, onSelect, viewType } = props;
  if (cx === undefined || cy === undefined) return null;
  
  const size = 18;
  const rx = 3.5;
  
  let fillColor = "rgba(63, 63, 70, 0.2)"; // Rest/unstarted day
  
  if (viewType === "hours") {
    if (payload.hours > 0) {
      if (payload.hours < 2.5) fillColor = "rgba(99, 102, 241, 0.25)"; // Indigo low
      else if (payload.hours < 4.5) fillColor = "rgba(99, 102, 241, 0.55)"; // Indigo medium
      else if (payload.hours < 6) fillColor = "rgba(99, 102, 241, 0.85)"; // Indigo high
      else fillColor = "rgba(236, 72, 153, 0.95)"; // Ultra Pink peak
    }
  } else if (viewType === "modules") {
    if (payload.modules > 0) {
      if (payload.modules === 1) fillColor = "rgba(56, 189, 248, 0.4)"; // Sky-400 light
      else fillColor = "rgba(16, 185, 129, 0.85)"; // Emerald-500 rich
    }
  } else if (viewType === "milestones") {
    if (payload.milestones > 0) {
      if (payload.milestones === 1) fillColor = "rgba(168, 85, 247, 0.55)"; // Purple-500 light
      else fillColor = "rgba(245, 158, 11, 0.9)"; // Amber-500 peak
    }
  }

  const isSelected = selectedCell && selectedCell.week === payload.week && selectedCell.day === payload.day;

  return (
    <rect
      x={cx - size / 2}
      y={cy - size / 2}
      width={size}
      height={size}
      rx={rx}
      ry={rx}
      fill={fillColor}
      stroke={isSelected ? (viewType === "hours" ? "#ec4899" : viewType === "modules" ? "#10b981" : "#f59e0b") : "transparent"}
      strokeWidth={1.5}
      onClick={() => {
        onSelect(payload);
      }}
      className="transition-all duration-200 cursor-pointer hover:scale-110 transform origin-center"
      style={{ outline: "none" }}
    />
  );
};

export default function AnalyticsPage() {
  const [viewType, setViewType] = useState<"hours" | "modules" | "milestones">("hours");

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

  // Deterministic contribution activity data to prevent hydration mismatches
  const heatmapData = useMemo(() => {
    const data = [];
    const seed = [
      [2.5, 4.0, 1.5, 3.0, 5.5, 2.0, 0.0], // Week 1
      [0.0, 3.5, 2.0, 4.5, 6.0, 1.0, 0.5], // Week 2
      [1.5, 2.0, 5.0, 0.0, 4.0, 3.5, 2.0], // Week 3
      [3.0, 1.0, 4.0, 2.5, 5.0, 0.0, 0.0], // Week 4
      [4.5, 3.0, 0.0, 5.5, 6.5, 2.0, 1.0], // Week 5
    ];
    for (let w = 0; w < HEATMAP_WEEKS.length; w++) {
      for (let d = 0; d < HEATMAP_DAYS.length; d++) {
        const hours = seed[w] ? seed[w][d] : 0;
        const modules = hours >= 5 ? 2 : hours >= 2.5 ? 1 : 0;
        // Deterministic milestone seeds: some high productivity days trigger milestone progress or updates
        const milestones = (w === 0 && d === 4) ? 2 : (w === 2 && d === 2) ? 1 : (w === 4 && d === 3) ? 2 : (w === 1 && d === 3) ? 1 : 0;
        
        data.push({
          week: HEATMAP_WEEKS[w],
          day: HEATMAP_DAYS[d],
          hours,
          modules,
          milestones,
          xp: Math.round(hours * 100 + modules * 150 + milestones * 200),
        });
      }
    }
    return data;
  }, []);

  // Track currently selected heatmap node details
  const [selectedCell, setSelectedCell] = useState<any>(heatmapData[18]); // default selection

  const activeLegendColors = useMemo(() => {
    if (viewType === "hours") {
      return ["bg-zinc-850/60", "bg-indigo-500/25", "bg-indigo-500/55", "bg-indigo-500/85", "bg-pink-500"];
    } else if (viewType === "modules") {
      return ["bg-zinc-850/60", "bg-sky-500/20", "bg-sky-500/50", "bg-emerald-500/60", "bg-emerald-500"];
    } else {
      return ["bg-zinc-850/60", "bg-purple-500/25", "bg-purple-500/60", "bg-amber-500/60", "bg-amber-500"];
    }
  }, [viewType]);

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

      {/* Weekly Activity Heatmap Section */}
      <div className="p-6 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md shadow-xl space-y-6 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900/40 pb-5">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Flame className="text-orange-500 w-4 h-4 animate-pulse" /> Daily Contribution Heatmap
            </h4>
            <p className="text-[11px] text-zinc-400">
              Interactive visual matrix tracking daily metrics. Toggle views to change density metrics.
            </p>
          </div>

          {/* Filtering System Tabs */}
          <div className="flex gap-1 bg-zinc-900/60 p-1.5 rounded-xl border border-zinc-900 self-start md:self-center">
            <button
              onClick={() => {
                playSound("click");
                setViewType("hours");
              }}
              className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg tracking-wider capitalize transition-all cursor-pointer ${
                viewType === "hours"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Hours Spent
            </button>
            <button
              onClick={() => {
                playSound("click");
                setViewType("modules");
              }}
              className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg tracking-wider capitalize transition-all cursor-pointer ${
                viewType === "modules"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Modules Completed
            </button>
            <button
              onClick={() => {
                playSound("click");
                setViewType("milestones");
              }}
              className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg tracking-wider capitalize transition-all cursor-pointer ${
                viewType === "milestones"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Career Milestones
            </button>
          </div>
          
          {/* Custom Heatmap Legend */}
          <div className="flex items-center gap-2 text-[10px] font-semibold text-zinc-400 self-start md:self-auto">
            <span>Less</span>
            {activeLegendColors.map((color, i) => (
              <div key={i} className={`w-3.5 h-3.5 rounded ${color} transition-all duration-350`} />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid & Info Box */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Recharts Scatter Grid Chart */}
          <div className="lg:col-span-3 h-[220px] w-full flex items-center justify-center bg-zinc-950/20 border border-zinc-900/60 rounded-2xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 15, right: 15, bottom: -10, left: -20 }}
              >
                <XAxis 
                  type="category" 
                  dataKey="week" 
                  name="Week" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: "#71717a", fontSize: 9, fontWeight: "bold" }} 
                />
                <YAxis 
                  type="category" 
                  dataKey="day" 
                  name="Day" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: "#71717a", fontSize: 9, fontWeight: "bold" }} 
                />
                <Tooltip content={<CustomTooltip viewType={viewType} />} cursor={false} />
                <Scatter 
                  name="Activity" 
                  data={heatmapData} 
                  shape={(props: any) => (
                    <RenderCustomBlock 
                      {...props} 
                      selectedCell={selectedCell} 
                      viewType={viewType}
                      onSelect={(payload: any) => {
                        playSound("click");
                        setSelectedCell(payload);
                      }} 
                    />
                  )} 
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Day Details Card */}
          <div className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 flex flex-col justify-between h-full min-h-[180px]">
            <div>
              <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest block mb-1">
                Selected Node Analysis
              </span>
              <h5 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" /> {selectedCell ? `${selectedCell.week}, ${selectedCell.day}` : "Select a cell"}
              </h5>
              
              <div className="mt-3.5 space-y-2.5">
                <div className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-all ${viewType === "hours" ? "bg-indigo-500/10 border border-indigo-500/20" : ""}`}>
                  <span className="text-zinc-500 font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-zinc-450" /> Effort:</span>
                  <span className="font-extrabold text-zinc-200 font-mono">{selectedCell ? `${selectedCell.hours} hrs` : "0.0 hrs"}</span>
                </div>
                <div className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-all ${viewType === "modules" ? "bg-emerald-500/10 border border-emerald-500/20" : ""}`}>
                  <span className="text-zinc-500 font-bold flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-zinc-450" /> Modules:</span>
                  <span className="font-extrabold text-zinc-200 font-mono">{selectedCell ? selectedCell.modules : 0} modules</span>
                </div>
                <div className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-all ${viewType === "milestones" ? "bg-purple-500/10 border border-purple-500/20" : ""}`}>
                  <span className="text-zinc-500 font-bold flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-zinc-450" /> Milestones:</span>
                  <span className="font-extrabold text-zinc-200 font-mono">{selectedCell ? selectedCell.milestones : 0} updated</span>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-900 pt-3 mt-3 flex items-center justify-between">
              <span className="text-[9px] font-bold text-zinc-500 uppercase">Velocity Level</span>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                selectedCell?.hours >= 5
                  ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                  : selectedCell?.hours >= 2.5
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : selectedCell?.hours > 0
                      ? "bg-indigo-500/5 text-indigo-300/70 border border-indigo-500/10"
                      : "bg-zinc-800 text-zinc-500"
              }`}>
                {selectedCell?.hours >= 5 ? "Ultra Focused" : selectedCell?.hours >= 2.5 ? "Productive" : selectedCell?.hours > 0 ? "Steady" : "Rest Day"}
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
