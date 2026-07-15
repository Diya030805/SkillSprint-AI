"use client";

import React, { useState } from "react";
import { Bell, Flame, Sparkles, Award, BookOpen, X, Check, Eye } from "lucide-react";

interface Notification {
  id: number;
  type: "streak" | "ai" | "badge" | "course";
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
      title: "Streak Target Warning!",
      desc: "Only 2 hours left to complete a coding quiz and preserve your 12-day streak.",
      time: "10 mins ago",
      read: false
    },
    {
      id: 2,
      type: "ai",
      title: "AI Optimization Complete",
      desc: "Your Senior Architect experience section rewrite has been successfully synthesized.",
      time: "2 hrs ago",
      read: false
    },
    {
      id: 3,
      type: "badge",
      title: "New Badge Unlocked!",
      desc: "You received the 'RSC Core Explorer' certified achievement credential.",
      time: "1 day ago",
      read: true
    },
    {
      id: 4,
      type: "course",
      title: "New Course uploaded",
      desc: "A premium blueprint 'Google GenAI SDK Integration Patterns' is now live in the hub.",
      time: "2 days ago",
      read: true
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);

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
        return <Flame className="w-4 h-4 text-orange-500" />;
      case "ai":
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case "badge":
        return <Award className="w-4 h-4 text-amber-500" />;
      case "course":
        return <BookOpen className="w-4 h-4 text-sky-400" />;
      default:
        return <Bell className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="relative">
      
      {/* Bell Trigger button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all focus:outline-none relative cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
        )}
      </button>

      {/* Slide down card dropdown */}
      {isOpen && (
        <>
          {/* Backdrop screen lock to close */}
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 mt-2.5 w-80 max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-xl z-40 space-y-4 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-zinc-100">Notification Center</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20 font-mono">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              
              {notifications.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="text-[9px] font-extrabold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-3.5 max-h-[260px] overflow-y-auto pr-1">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`flex gap-3 items-start p-2.5 rounded-xl transition-all relative ${
                    n.read ? "opacity-60" : "bg-zinc-900/40 border border-zinc-900"
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center shrink-0">
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex justify-between items-baseline gap-2">
                      <h5 className="text-[11px] font-bold leading-snug">{n.title}</h5>
                      <span className="text-[8px] font-mono text-zinc-500 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-normal">{n.desc}</p>
                    
                    {!n.read && (
                      <button 
                        onClick={() => handleMarkAsRead(n.id)}
                        className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 mt-1 block"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="py-8 text-center text-zinc-600 text-xs font-medium">
                  Your desk is clean. No active alerts!
                </div>
              )}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
