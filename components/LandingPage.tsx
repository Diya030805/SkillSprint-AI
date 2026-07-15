"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Compass, 
  Cpu, 
  TrendingUp, 
  ArrowRight, 
  Code, 
  MessageSquare, 
  FileText, 
  ChevronRight, 
  UserCheck, 
  Zap, 
  BookOpen, 
  HelpCircle, 
  ChevronDown,
  Star,
  Shield,
  Layers
} from "lucide-react";

interface LandingPageProps {
  onNavigate: (view: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function LandingPage({ onNavigate, isDarkMode, toggleTheme }: LandingPageProps) {
  const [demoGoal, setDemoGoal] = useState("");
  const [isDemoGenerating, setIsDemoGenerating] = useState(false);
  const [demoRoadmap, setDemoRoadmap] = useState<any>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleDemoGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoGoal.trim()) return;

    setIsDemoGenerating(true);
    setDemoRoadmap(null);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "roadmap",
          payload: { careerGoal: demoGoal, currentSkills: "None", timeCommitment: "15 hours/week" }
        })
      });
      const res = await response.json();
      if (res.success && res.data) {
        setDemoRoadmap(res.data);
      } else {
        // Fallback mock roadmap in case of error
        setDemoRoadmap({
          role: demoGoal,
          description: "Premium, AI-generated curriculum tailored for your rapid success.",
          estimatedDuration: "6 Months",
          skillTree: [
            { name: "Foundations", level: "Beginner", description: "Establish essential skills." },
            { name: "Application Build", level: "Intermediate", description: "Deploy deep functional software." }
          ],
          milestones: [
            { id: 1, title: "Fundamentals & Design", duration: "Month 1", description: "Learn key architectural blocks and spacing rules." },
            { id: 2, title: "Core Architecture & Integration", duration: "Month 2-4", description: "Design responsive client engines and persistent states." }
          ]
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDemoGenerating(false);
    }
  };

  const features = [
    {
      icon: <Compass className="w-6 h-6 text-indigo-500" />,
      title: "AI Career Roadmaps",
      desc: "Instantly chart custom milestones, capstones, and skill requirements tailored precisely to your background."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-pink-500" />,
      title: "Interactive AI Chat Mentor",
      desc: "Get deep, 24/7 technical guidance, resume breakdowns, and coding assistance from our responsive model."
    },
    {
      icon: <Layers className="w-6 h-6 text-amber-500" />,
      title: "Coding & Quiz Practice",
      desc: "Hone your computer science fundamentals with dynamically generated quiz cards and direct explanation logic."
    },
    {
      icon: <FileText className="w-6 h-6 text-emerald-500" />,
      title: "Live Recruiter Resume AI",
      desc: "Evaluate resume blocks with active suggestions to maximize impact, metric conversions, and clear typography rules."
    },
    {
      icon: <Code className="w-6 h-6 text-purple-500" />,
      title: "Portfolio Theme Engine",
      desc: "Select design presets, log custom projects, and preview your premium live professional page effortlessly."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-sky-500" />,
      title: "Advanced Metric Analytics",
      desc: "Monitor custom skill lists, daily streaks, weekly priorities, and historic progress with elegant SVG widgets."
    }
  ];

  const testimonials = [
    {
      name: "Alexander Reed",
      role: "Lead Frontend Engineer at Vercel",
      avatar: "https://picsum.photos/seed/alex/100/100",
      quote: "SkillSprint AI has completely reimagined the learning path. The roadmap is incredibly specific and actionable, matching our team's hiring standards perfectly."
    },
    {
      name: "Sophia Martinez",
      role: "Career Switcher → UI Engineer at Stripe",
      avatar: "https://picsum.photos/seed/sophia/100/100",
      quote: "I went from non-technical to building high-performance client engines in under six months. The interactive chat mentor is like having a staff engineer sitting next to you."
    }
  ];

  const faqs = [
    {
      q: "How does the AI personalize my career roadmap?",
      a: "SkillSprint AI evaluates your current technical background, target job title, and weekly commitment budget. Using advanced Gemini models, it orchestrates a sequential learning flow containing specific projects, key skill metrics, and curated resource guidelines."
    },
    {
      q: "Can I connect third-party APIs or export my resume?",
      a: "Absolutely. Our fully-featured frontend enables you to refine, edit, and instantly export beautiful, high-contrast, recruiter-ready resumes in clean structural templates, as well as customize live portfolio landing themes."
    },
    {
      q: "Is there a limit to chat mentor questions?",
      a: "Free tier users receive 10 high-quality tokens daily, while Premium subscribers gain unlimited 24/7 chat interactions, certified achievement badges, and advanced system-architecture quiz modules."
    }
  ];

  return (
    <div id="landing-page" className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"}`}>
      
      {/* Dynamic Background Gradient Glows */}
      <div className="absolute top-0 left-0 right-0 h-[500px] overflow-hidden pointer-events-none opacity-30 z-0">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-pink-500/20 blur-[120px]" />
      </div>

      {/* Landing Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${isDarkMode ? 'border-zinc-900 bg-zinc-950/80' : 'border-zinc-200 bg-zinc-50/80'}">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate("landing")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-sans font-bold tracking-tight text-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              SkillSprint AI
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-zinc-100 transition-colors">Features</a>
            <a href="#demo" className="hover:text-zinc-100 transition-colors">AI Demo</a>
            <a href="#pricing" className="hover:text-zinc-100 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-zinc-100 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-all ${isDarkMode ? 'border-zinc-800 hover:bg-zinc-900 text-zinc-400' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-600'}`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <button 
              onClick={() => onNavigate("signin")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${isDarkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => onNavigate("signup")}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/10"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium border-indigo-500/20 bg-indigo-500/5 text-indigo-400">
            <Cpu className="w-3.5 h-3.5" /> Next-Generation Personalized Career Mentor
          </div>
          <h1 className="text-5xl md:text-6xl font-sans font-bold tracking-tight leading-none">
            Sprint Your Way to <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Career Mastery
            </span>
          </h1>
          <p className="text-lg text-zinc-400 font-sans max-w-xl mx-auto">
            Unlock tailored roadmap paths, custom mock quiz cards, direct resume analysis feedback, and structured portfolio themes. AI-guided growth designed for ambitious engineers.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => onNavigate("signup")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            >
              Build Your Roadmap Free <ArrowRight className="w-4 h-4" />
            </button>
            <a 
              href="#demo"
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${isDarkMode ? 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900 hover:text-white' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'}`}
            >
              Try Interactive Demo
            </a>
          </div>
        </motion.div>
      </section>

      {/* Interactive AI Demo Component */}
      <section id="demo" className="relative z-10 max-w-7xl mx-auto px-6 py-12 scroll-mt-20">
        <div className={`max-w-4xl mx-auto rounded-2xl border backdrop-blur-sm p-8 ${isDarkMode ? 'border-zinc-800 bg-zinc-900/20' : 'border-zinc-200 bg-white/60'}`}>
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Experience Personalization Live</h2>
            <p className="text-sm text-zinc-400">Type a role you aspire to master (e.g. AI Product Designer, Full-Stack Dev) and watch the platform adapt.</p>
          </div>

          <form onSubmit={handleDemoGenerate} className="flex gap-3 max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="e.g. Mobile iOS Engineer, DevOps Specialist..." 
              value={demoGoal}
              onChange={(e) => setDemoGoal(e.target.value)}
              className={`flex-1 px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDarkMode ? 'bg-zinc-950/80 border-zinc-800 text-white placeholder-zinc-500' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'}`}
              required
            />
            <button 
              type="submit" 
              disabled={isDemoGenerating}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all flex items-center gap-2 shadow-md shadow-indigo-600/10 disabled:opacity-50"
            >
              {isDemoGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate <Zap className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* AI Output Container */}
          {demoRoadmap && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-8 rounded-xl border p-6 text-left space-y-6 ${isDarkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}
            >
              <div className="flex items-start justify-between border-b pb-4 border-zinc-800">
                <div>
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">PERSONALIZED ROADMAP</span>
                  <h3 className="text-xl font-bold">{demoRoadmap.role}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{demoRoadmap.description}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  {demoRoadmap.estimatedDuration}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">CORE SKILL METRICS</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {demoRoadmap.skillTree?.map((s: any, idx: number) => (
                    <div key={idx} className={`p-3 rounded-lg border text-sm ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-indigo-400 font-medium mt-1">{s.level}</div>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">TIMELINE PATH</h4>
                <div className="space-y-4">
                  {demoRoadmap.milestones?.map((m: any, idx: number) => (
                    <div key={idx} className={`flex gap-4 p-4 rounded-xl border ${isDarkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-100'}`}>
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <span className="text-sm font-semibold">{m.title}</span>
                          <span className="text-xs font-mono text-pink-400">{m.duration}</span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{m.description}</p>
                        {m.project && (
                          <div className={`mt-3 p-3 rounded-lg border text-xs space-y-1 ${isDarkMode ? 'bg-zinc-950/60 border-zinc-900' : 'bg-zinc-50 border-zinc-200'}`}>
                            <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                              <Code className="w-3.5 h-3.5 text-pink-400" /> Milestone Project: {m.project.title}
                            </div>
                            <p className="text-zinc-400 leading-normal">{m.project.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 text-center">
                <button 
                  onClick={() => onNavigate("signup")}
                  className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 mx-auto"
                >
                  Save This Roadmap to Your Profile <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-20">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Architected for Fast Learning</h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto">Explore premium custom modules engineered to accelerate technical execution, design logic, and hiring metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => (
            <div 
              key={idx} 
              className={`p-6 rounded-2xl border hover:border-zinc-700/60 transition-all hover:scale-[1.01] duration-300 space-y-4 ${isDarkMode ? 'bg-zinc-900/20 border-zinc-900' : 'bg-white border-zinc-200 shadow-sm'}`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
                {f.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">{f.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-20">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Flexible, Objective Pricing</h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto">Accelerate your skills with a free tier or unlock advanced system metrics and limitless mentor sessions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className={`p-8 rounded-2xl border relative flex flex-col justify-between ${isDarkMode ? 'bg-zinc-900/10 border-zinc-900' : 'bg-white border-zinc-200 shadow-sm'}`}>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-400">Basic Tier</h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-extrabold tracking-tight">$0</span>
                <span className="text-xs text-zinc-500">/ forever</span>
              </div>
              <p className="text-xs text-zinc-400">Perfect for exploring personalized roadmaps and foundational quiz cards.</p>
              
              <ul className="space-y-2.5 text-xs text-zinc-400 pt-6">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500">✓</span> 1 Personalized career roadmap path
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500">✓</span> 10 Daily AI Chat Mentor responses
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500">✓</span> Basic resume template styling
                </li>
                <li className="flex items-center gap-2 text-zinc-600">
                  <span>✗</span> Advanced system-architecture quizzes
                </li>
                <li className="flex items-center gap-2 text-zinc-600">
                  <span>✗</span> Dynamic PDF exports & portfolio hosting
                </li>
              </ul>
            </div>
            <button 
              onClick={() => onNavigate("signup")}
              className={`mt-8 w-full py-2.5 rounded-lg text-xs font-semibold border transition-all ${isDarkMode ? 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900' : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'}`}
            >
              Get Started Free
            </button>
          </div>

          {/* Premium Tier */}
          <div className={`p-8 rounded-2xl border relative flex flex-col justify-between ${isDarkMode ? 'bg-zinc-900/40 border-indigo-500/40' : 'bg-indigo-50/20 border-indigo-500/40'}`}>
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-[10px] font-bold text-white tracking-widest uppercase">
              RECOMMENDED
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">Sprint Premium</h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-extrabold tracking-tight">$19</span>
                <span className="text-xs text-zinc-500">/ month</span>
              </div>
              <p className="text-xs text-zinc-400">The definitive blueprint for high-performance engineers seeking quick career pivots.</p>
              
              <ul className="space-y-2.5 text-xs text-zinc-400 pt-6">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500 font-bold">✓</span> Unlimited personalized roadmaps
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500 font-bold">✓</span> Unlimited 24/7 AI Chat Mentor tokens
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500 font-bold">✓</span> Advanced Quiz challenge models
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500 font-bold">✓</span> Premium portfolio presets & hosting
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-500 font-bold">✓</span> Priority recruiter-vetted resume optimizations
                </li>
              </ul>
            </div>
            <button 
              onClick={() => onNavigate("signup")}
              className="mt-8 w-full py-2.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-pink-500 hover:opacity-95 text-white shadow-md shadow-indigo-600/15 transition-all"
            >
              Unlock Premium Access
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((t, idx) => (
            <div 
              key={idx} 
              className={`p-6 rounded-2xl border space-y-4 ${isDarkMode ? 'bg-zinc-900/10 border-zinc-900' : 'bg-white border-zinc-200'}`}
            >
              <p className="text-xs text-zinc-400 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full object-cover border border-zinc-800" />
                <div>
                  <h4 className="text-xs font-bold">{t.name}</h4>
                  <p className="text-[11px] text-zinc-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 scroll-mt-20">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-sm text-zinc-400">Clear answers to your licensing, security, and usage questions.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className={`rounded-xl border overflow-hidden transition-all duration-200 ${isDarkMode ? 'bg-zinc-900/10 border-zinc-900' : 'bg-white border-zinc-200'}`}
              >
                <button 
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left text-sm font-medium hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-400" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-900 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center">
        <div className={`p-12 rounded-3xl border relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-tr from-indigo-950/40 to-pink-950/20 border-zinc-800' : 'bg-gradient-to-tr from-indigo-50/60 to-pink-50/40 border-zinc-200'}`}>
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative z-10 space-y-6 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">Ready to Accelerate Your Journey?</h2>
            <p className="text-sm text-zinc-400">Join thousands of software engineers, product architects, and technical analysts charting clean, custom routes with SkillSprint AI today.</p>
            <button 
              onClick={() => onNavigate("signup")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-600/10 transition-all flex items-center gap-2 mx-auto"
            >
              Claim Your Free Sprint Account <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 text-center text-xs mt-20 transition-colors ${isDarkMode ? 'border-zinc-900 text-zinc-500 bg-zinc-950' : 'border-zinc-200 text-zinc-500 bg-zinc-50'}`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-zinc-400">SkillSprint AI</span>
          </div>
          <p className="text-zinc-500">&copy; 2026 SkillSprint AI. Crafted with Apple-level aesthetic principles.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
