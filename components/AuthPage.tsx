"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Mail, Lock, User, ArrowRight, ArrowLeft, Shield, Eye, EyeOff } from "lucide-react";

interface AuthPageProps {
  initialView: "signin" | "signup";
  onNavigate: (view: string) => void;
  onLogin: (user: any) => void;
  isDarkMode: boolean;
}

export default function AuthPage({ initialView, onNavigate, onLogin, isDarkMode }: AuthPageProps) {
  const [view, setView] = useState<"signin" | "signup" | "forgot">(initialView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (view === "signin") {
        if (!email.trim() || !password.trim()) {
          setError("Please fill in all credentials.");
          return;
        }
        // Save dummy user session
        const user = { email, name: email.split("@")[0] || "Scholar", isPremium: false };
        localStorage.setItem("skillsprint_session", JSON.stringify(user));
        onLogin(user);
        onNavigate("dashboard");
      } else if (view === "signup") {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setError("All fields are strictly required.");
          return;
        }
        if (password.length < 6) {
          setError("Password must contain at least 6 characters.");
          return;
        }
        const user = { email, name, isPremium: false };
        localStorage.setItem("skillsprint_session", JSON.stringify(user));
        onLogin(user);
        onNavigate("dashboard");
      } else {
        // Forgot password
        if (!email.trim()) {
          setError("Please provide your email address.");
          return;
        }
        setSuccessMsg("Reset link dispatched! Please check your inbox.");
      }
    }, 1200);
  };

  return (
    <div id="auth-page" className={`min-h-screen font-sans flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300 ${isDarkMode ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"}`}>
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-0 right-0 h-[400px] overflow-hidden pointer-events-none opacity-25 z-0">
        <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute top-[-10%] right-[20%] w-[400px] h-[400px] rounded-full bg-pink-500/20 blur-[100px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex items-center justify-center space-x-3 cursor-pointer mb-6" onClick={() => onNavigate("landing")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="font-sans font-bold tracking-tight text-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            SkillSprint AI
          </span>
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className={`py-8 px-4 sm:rounded-2xl border backdrop-blur-md space-y-6 ${isDarkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white/80 border-zinc-200'}`}>
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold tracking-tight">
              {view === "signin" && "Welcome back"}
              {view === "signup" && "Create your account"}
              {view === "forgot" && "Reset your password"}
            </h2>
            <p className="text-xs text-zinc-400">
              {view === "signin" && "Accelerate your path to master technical skills"}
              {view === "signup" && "Get fully personalized learning roadmaps today"}
              {view === "forgot" && "We'll send you instructions to regain access"}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {view === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDarkMode ? 'bg-zinc-950/80 border-zinc-800 text-white placeholder-zinc-500' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'}`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDarkMode ? 'bg-zinc-950/80 border-zinc-800 text-white placeholder-zinc-500' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'}`}
                />
              </div>
            </div>

            {view !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
                  {view === "signin" && (
                    <button
                      type="button"
                      onClick={() => setView("forgot")}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDarkMode ? 'bg-zinc-950/80 border-zinc-800 text-white placeholder-zinc-500' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400">
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md shadow-indigo-600/10 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-1.5">
                  {view === "signin" && "Sign In"}
                  {view === "signup" && "Create Account"}
                  {view === "forgot" && "Send Reset Link"}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <div className="flex items-center justify-between border-t border-zinc-800 pt-4 text-xs">
            {view === "signin" ? (
              <p className="text-zinc-400">
                Don&apos;t have an account?{" "}
                <button onClick={() => setView("signup")} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                  Sign Up
                </button>
              </p>
            ) : (
              <button onClick={() => setView("signin")} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
