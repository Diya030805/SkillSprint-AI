"use client";

import React, { useState, useEffect } from "react";
import LandingPage from "@/components/LandingPage";
import AuthPage from "@/components/AuthPage";
import DashboardPage from "@/components/DashboardPage";
import RoadmapPage from "@/components/RoadmapPage";
import ChatMentorPage from "@/components/ChatMentorPage";
import LearningHubPage from "@/components/LearningHubPage";
import PracticeZonePage from "@/components/PracticeZonePage";
import ResumeBuilderPage from "@/components/ResumeBuilderPage";
import PortfolioBuilderPage from "@/components/PortfolioBuilderPage";
import AnalyticsPage from "@/components/AnalyticsPage";
import ProfilePage from "@/components/ProfilePage";
import PremiumPage from "@/components/PremiumPage";
import SettingsPage from "@/components/SettingsPage";
import NotFoundPage from "@/components/NotFoundPage";
import NotificationCenter from "@/components/NotificationCenter";

import { 
  Sparkles, 
  LayoutDashboard, 
  Compass, 
  MessageSquare, 
  BookOpen, 
  Code, 
  FileText, 
  Layers, 
  TrendingUp, 
  User, 
  Settings, 
  Crown, 
  LogOut, 
  Menu, 
  X, 
  Clock,
  Heart,
  HelpCircle,
  Shield,
  Zap
} from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("skillsprint_session");
      if (session) {
        try {
          return JSON.parse(session);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });

  const [view, setView] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("skillsprint_session");
      if (session) {
        return "dashboard";
      }
    }
    return "landing";
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [utcTime, setUtcTime] = useState<string>("");

  // Hydrate user session from localStorage
  useEffect(() => {
    // Tick UTC clock
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (newUser: any) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("skillsprint_session");
    setUser(null);
    setView("landing");
    setMobileSidebarOpen(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleUpgradeComplete = () => {
    if (user) {
      const upgradedUser = { ...user, isPremium: true };
      localStorage.setItem("skillsprint_session", JSON.stringify(upgradedUser));
      setUser(upgradedUser);
    }
  };

  // Sidebar link items
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "roadmap", label: "AI Career Roadmap", icon: <Compass className="w-4 h-4" /> },
    { id: "chat", label: "AI Chat Mentor", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "learning", label: "Learning Hub", icon: <BookOpen className="w-4 h-4" /> },
    { id: "practice", label: "Practice Zone", icon: <Code className="w-4 h-4" /> },
    { id: "resume", label: "Resume Builder", icon: <FileText className="w-4 h-4" /> },
    { id: "portfolio", label: "Portfolio Builder", icon: <Layers className="w-4 h-4" /> },
    { id: "analytics", label: "Analytics", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "premium", label: "Premium Upgrade", icon: <Crown className="w-4 h-4 text-amber-500" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  // Helper to render the active tab panel
  const renderActiveTab = () => {
    switch (view) {
      case "dashboard":
        return <DashboardPage user={user} onNavigateTab={(tab) => setView(tab)} isDarkMode={isDarkMode} />;
      case "roadmap":
        return <RoadmapPage isDarkMode={isDarkMode} />;
      case "chat":
        return <ChatMentorPage isDarkMode={isDarkMode} />;
      case "learning":
        return <LearningHubPage />;
      case "practice":
        return <PracticeZonePage isDarkMode={isDarkMode} />;
      case "resume":
        return <ResumeBuilderPage />;
      case "portfolio":
        return <PortfolioBuilderPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "profile":
        return <ProfilePage />;
      case "premium":
        return <PremiumPage onUpgradeComplete={handleUpgradeComplete} />;
      case "settings":
        return <SettingsPage />;
      default:
        return <NotFoundPage onGoHome={() => setView(user ? "dashboard" : "landing")} />;
    }
  };

  // Render Landing and Auth forms if not authenticated
  if (!user) {
    if (view === "landing") {
      return (
        <LandingPage 
          onNavigate={(target) => setView(target)} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
        />
      );
    }
    if (view === "signin" || view === "signup") {
      return (
        <AuthPage 
          initialView={view} 
          onNavigate={(target) => setView(target)} 
          onLogin={handleLogin} 
          isDarkMode={isDarkMode} 
        />
      );
    }
  }

  // Render Premium Dashboard Environment
  return (
    <div id="dashboard-shell" className={`min-h-screen font-sans flex transition-colors duration-300 relative overflow-hidden ${isDarkMode ? "bg-[#09090b] text-zinc-100" : "bg-[#f8f9fa] text-zinc-900"}`}>
      
      {/* Background Mesh Gradients */}
      {isDarkMode ? (
        <>
          <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-emerald-600/8 rounded-full blur-[120px] pointer-events-none z-0" />
        </>
      ) : (
        <>
          <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
        </>
      )}

      {/* Desktop Sidebar (Permanent left sidebar) */}
      <aside className={`hidden lg:flex flex-col justify-between w-64 border-r shrink-0 z-30 transition-all duration-300 ${isDarkMode ? 'bg-black/20 backdrop-blur-xl border-white/5' : 'bg-white/40 backdrop-blur-xl border-zinc-200'}`}>
        <div className="space-y-6 py-6 px-4">
          
          {/* Logo element */}
          <div className="flex items-center space-x-2.5 cursor-pointer px-2" onClick={() => setView("dashboard")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-sans font-extrabold tracking-tight text-lg bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
              SkillSprint AI
            </span>
          </div>

          {/* Sidebar Link Lists */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all ${
                    isActive 
                      ? isDarkMode ? "bg-white/10 text-white border border-white/10" : "bg-zinc-900/10 text-zinc-900 border border-zinc-900/5"
                      : isDarkMode ? "text-zinc-400 hover:text-zinc-100 hover:bg-white/5" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-900/5"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile details badge & Theme togglers */}
        <div className={`p-4 border-t space-y-4 ${isDarkMode ? 'border-white/5' : 'border-zinc-200'}`}>
          <div className="flex items-center justify-between text-xs px-2 text-zinc-500">
            <span>Theme Mode</span>
            <button 
              onClick={toggleTheme}
              className={`p-1.5 rounded border transition-all ${isDarkMode ? 'border-white/10 hover:bg-white/5 text-zinc-400' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-600'}`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>

          <div className={`flex items-center justify-between gap-3 p-2 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-zinc-900/5 border-zinc-900/5'}`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-extrabold text-white shrink-0">
                {user?.name?.[0]?.toUpperCase() || "S"}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold block truncate text-zinc-300">{user?.name || "Scholar"}</span>
                {user?.isPremium ? (
                  <span className="text-[8px] font-extrabold text-amber-400 tracking-wider">PREMIUM</span>
                ) : (
                  <span className="text-[8px] font-extrabold text-zinc-500 tracking-wider">BASIC ACCOUNT</span>
                )}
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className={`p-1.5 rounded-md transition-all focus:outline-none shrink-0 ${isDarkMode ? 'text-zinc-500 hover:text-red-400 hover:bg-white/5' : 'text-zinc-500 hover:text-red-600 hover:bg-zinc-100'}`}
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar Navigation */}
      {mobileSidebarOpen && (
        <>
          {/* Mobile Back curtain */}
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
          
          <aside className={`fixed inset-y-0 left-0 w-64 p-6 flex flex-col justify-between z-50 lg:hidden border-r transition-all duration-300 ${isDarkMode ? 'bg-black/80 backdrop-blur-xl border-white/10 text-white' : 'bg-white/80 backdrop-blur-xl border-zinc-200 text-zinc-900'}`}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className={`font-extrabold text-lg ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>SkillSprint AI</span>
                </div>
                <button onClick={() => setMobileSidebarOpen(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = view === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setView(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all ${
                        isActive 
                          ? isDarkMode ? "bg-white/10 text-white border border-white/10" : "bg-zinc-900/10 text-zinc-900 border border-zinc-900/5"
                          : isDarkMode ? "text-zinc-400 hover:text-zinc-100 hover:bg-white/5" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-900/5"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
                <span>Theme Mode</span>
                <button onClick={toggleTheme} className={`p-1 border rounded ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
                  {isDarkMode ? "☀️" : "🌙"}
                </button>
              </div>

              <div className={`flex items-center justify-between gap-3 p-2 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-zinc-900/5 border-zinc-900/5'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-xs font-extrabold text-white">
                    {user?.name?.[0]?.toUpperCase() || "S"}
                  </div>
                  <div>
                    <span className={`text-[11px] font-bold block ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>{user?.name || "Scholar"}</span>
                    <span className="text-[8px] font-extrabold text-zinc-500 uppercase">BASIC</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="text-zinc-500 hover:text-red-400">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        {/* Top Header navbar bar */}
        <header className={`h-16 border-b flex items-center justify-between px-6 shrink-0 relative z-30 transition-all duration-300 ${isDarkMode ? 'border-white/5 bg-black/10 backdrop-blur-md' : 'bg-white/20 border-zinc-200/60 backdrop-blur-md'}`}>
          <div className="flex items-center space-x-3">
            {/* Hamburger trigger for mobile */}
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-lg border text-zinc-400 hover:text-white ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* active clock widget */}
            <div className="hidden sm:flex items-center space-x-2 text-xs text-zinc-500 font-mono">
              <Clock className="w-4 h-4" />
              <span>{utcTime || "Tick-tock..."}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Premium Upgrade prompt button if not premium */}
            {!user?.isPremium && (
              <button 
                onClick={() => setView("premium")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-[10px] font-extrabold hover:opacity-95 shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" /> UPGRADE TO PREMIUM
              </button>
            )}

            {/* Slide down Notification dropdown widget */}
            <NotificationCenter />
          </div>
        </header>

        {/* Central tab viewport content */}
        <main className="flex-1 overflow-y-auto p-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {renderActiveTab()}
          </div>
        </main>
      </div>

    </div>
  );
}
