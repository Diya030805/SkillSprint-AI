"use client";

import React, { useState, useEffect } from "react";
import { Bell, Flame, Sparkles, Award, BookOpen, X, Check, Trophy, Compass } from "lucide-react";

interface Notification {
  id: number;
  type: "streak" | "ai" | "badge" | "course" | "learning" | "milestone" | "roadmap";
  category: "learning" | "milestone" | "roadmap";
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "streak",
      category: "milestone",
      title: "Daily Goal Achievement! 🏆",
      desc: "Outstanding work! You've met your daily study goal of 30 minutes.",
      time: "Just now",
      read: false
    },
    {
      id: 2,
      type: "learning",
      category: "learning",
      title: "Focus Session Logged",
      desc: "25 minutes of deep learning logged. Keep up the high concentration!",
      time: "10 mins ago",
      read: false
    },
    {
      id: 3,
      type: "ai",
      category: "roadmap",
      title: "AI Resume Audit Complete",
      desc: "Your Senior Architect experience section rewrite has been successfully synthesized.",
      time: "2 hrs ago",
      read: false
    },
    {
      id: 4,
      type: "badge",
      category: "milestone",
      title: "New Badge Unlocked!",
      desc: "You received the 'RSC Core Explorer' certified achievement credential.",
      time: "1 day ago",
      read: true
    },
    {
      id: 5,
      type: "course",
      category: "learning",
      title: "New Course Released",
      desc: "A premium blueprint 'Google GenAI SDK Integration Patterns' is now live in the learning hub.",
      time: "2 days ago",
      read: true
    },
    {
      id: 6,
      type: "roadmap",
      category: "roadmap",
      title: "Career Roadmap Customized",
      desc: "ChatMentor has updated your Next.js Senior Developer milestone roadmap.",
      time: "3 days ago",
      read: true
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "learning" | "milestone" | "roadmap">("all");

  useEffect(() => {
    const handleNewNotification = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { type, title, desc } = customEvent.detail || {};
      
      // Map custom notification types to categories
      let category: "learning" | "milestone" | "roadmap" = "learning";
      if (type === "streak" || type === "badge" || type === "milestone") {
        category = "milestone";
      } else if (type === "ai" || type === "roadmap") {
        category = "roadmap";
      }

      const newNotify: Notification = {
        id: Date.now(),
        type: type || "learning",
        category: category,
        title: title || "New Update Received",
        desc: desc || "Check your learning dashboard for recent updates.",
        time: "Just now",
        read: false
      };
      setNotifications(prev => [newNotify, ...prev]);
      setIsOpen(true);
    };

    window.addEventListener("sprintskill_new_notification", handleNewNotification);
    return () => {
      window.removeEventListener("sprintskill_new_notification", handleNewNotification);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "streak":
      case "milestone":
        return <Trophy className="w-4 h-4 text-emerald-400" />;
      case "learning":
      case "course":
        return <BookOpen className="w-4 h-4 text-sky-400" />;
      case "ai":
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case "badge":
        return <Award className="w-4 h-4 text-amber-400" />;
      case "roadmap":
        return <Compass className="w-4 h-4 text-pink-400" />;
      default:
        return <Bell className="w-4 h-4 text-zinc-400" />;
    }
  };

  // Filter notifications based on tab
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    return n.category === activeFilter;
  });

  return (
    <div className="relative">
      
      {/* Bell Trigger button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all focus:outline-none relative cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
        )}
      </button>

      {/* Slide down card dropdown */}
      {isOpen && (
        <>
          {/* Backdrop screen lock to close */}
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-3 w-85 max-w-[340px] rounded-2xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-2xl z-40 space-y-4 text-left backdrop-blur-md">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-zinc-100">Updates & Achievements</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20 font-mono">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              
              {notifications.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="text-[9px] font-extrabold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-900">
              {(["all", "learning", "milestone", "roadmap"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 py-1 text-[9px] font-bold rounded-md capitalize transition-all cursor-pointer ${
                    activeFilter === filter
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {filter === "all" ? "All" : filter === "roadmap" ? "Roadmaps" : filter === "milestone" ? "Milestones" : "Learning"}
                </button>
              ))}
            </div>

            {/* Notification items list */}
            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
              {filteredNotifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`flex gap-3 items-start p-2.5 rounded-xl transition-all border ${
                    n.read 
                      ? "opacity-55 hover:opacity-80 bg-zinc-950/30 border-transparent" 
                      : "bg-zinc-900/40 border-zinc-900"
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex justify-between items-baseline gap-2">
                      <h5 className={`text-[11px] font-bold leading-snug ${n.read ? "text-zinc-400" : "text-zinc-100"}`}>
                        {n.title}
                      </h5>
                      <span className="text-[8px] font-mono text-zinc-500 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">{n.desc}</p>
                    
                    {!n.read && (
                      <button 
                        onClick={() => handleMarkAsRead(n.id)}
                        className="text-[9px] font-extrabold text-indigo-400 hover:text-indigo-300 mt-1.5 block cursor-pointer"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {filteredNotifications.length === 0 && (
                <div className="py-10 text-center text-zinc-600 text-xs font-medium">
                  No active alerts in this category!
                </div>
              )}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
