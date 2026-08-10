"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Sparkles, Loader2, RefreshCw, Copy, Check, Info, FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import { playSound } from "@/lib/audio";

export default function ResumeBuilderPage() {
  const [name, setName] = useState("John Doe");
  const [title, setTitle] = useState("Full-Stack React Architect");
  const [experience, setExperience] = useState(
    "Responsible for working on front-end components and updating Tailwind CSS styles. Handled JavaScript states and ran some tests occasionally to fix minor responsive bugs."
  );
  
  const [template, setTemplate] = useState("Minimalist");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [rewrittenText, setRewrittenText] = useState("");
  const [copied, setCopied] = useState(false);

  const templates = ["Minimalist", "Elegant Serif", "Tech Mono"];

  const handleAiOptimize = async () => {
    if (!experience.trim()) return;
    setIsLoading(true);
    setSuggestions(null);
    setRewrittenText("");

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resume_suggest",
          payload: { section: "Experience", content: experience }
        })
      });
      const res = await response.json();
      if (res.success && res.data) {
        setSuggestions(res.data.suggestions || []);
        setRewrittenText(res.data.rewritten || "");
      } else {
        setSuggestions([
          "Include dynamic metrics (e.g., 'reduced render cycles by 30%').",
          "Begin with stronger action verbs (e.g., 'Orchestrated', 'Refined')."
        ]);
        setRewrittenText(
          "Orchestrated high-performance front-end interfaces, reducing render latency by 30% and refining complex state machine adapters with pristine typography."
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyRewrite = () => {
    if (!rewrittenText) return;
    setExperience(rewrittenText);
    setSuggestions(null);
    setRewrittenText("");
  };

  const exportToPdf = () => {
    playSound("transition");
    setIsExporting(true);

    try {
      // Configuration based on current template
      let fontName = "helvetica";
      let primaryColor = { r: 31, g: 41, b: 55 }; // Dark charcoal
      let accentColor = { r: 79, g: 70, b: 229 }; // Indigo accent
      let bodyColor = { r: 75, g: 85, b: 99 }; // Muted gray

      if (template === "Elegant Serif") {
        fontName = "times";
        primaryColor = { r: 41, g: 37, b: 36 }; // Espresso
        accentColor = { r: 120, g: 113, b: 108 }; // Stone
        bodyColor = { r: 87, g: 83, b: 78 };
      } else if (template === "Tech Mono") {
        fontName = "courier";
        primaryColor = { r: 9, g: 9, b: 11 }; // Near black
        accentColor = { r: 99, g: 102, b: 241 }; // Purple/Indigo
        bodyColor = { r: 113, g: 113, b: 122 };
      }

      // Create jsPDF instance
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Page dimensions & margins
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2; // 170mm

      let yPos = margin;

      // Helper to draw horizontal line
      const drawDivider = (y: number, colorRGB: { r: number; g: number; b: number }, height: number = 0.2) => {
        doc.setDrawColor(colorRGB.r, colorRGB.g, colorRGB.b);
        doc.setLineWidth(height);
        doc.line(margin, y, margin + contentWidth, y);
      };

      // Name
      doc.setFont(fontName, "bold");
      doc.setFontSize(22);
      doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
      doc.text(name || "John Doe", margin, yPos);
      yPos += 7;

      // Target Job Title
      doc.setFont(fontName, "bold");
      doc.setFontSize(11);
      doc.setTextColor(accentColor.r, accentColor.g, accentColor.b);
      doc.text((title || "Full-Stack React Architect").toUpperCase(), margin, yPos);
      yPos += 5;

      // Contact Details
      doc.setFont(fontName, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(140, 140, 140);
      const contactInfo = "diyaghosh030805@gmail.com  |  GitHub  |  LinkedIn  |  SprintSkill Certified";
      doc.text(contactInfo, margin, yPos);
      yPos += 4;

      // Under-header divider
      yPos += 2;
      drawDivider(yPos, accentColor, 0.5);
      yPos += 8;

      // Section Header: Professional Experience
      doc.setFont(fontName, "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(accentColor.r, accentColor.g, accentColor.b);
      doc.text("PROFESSIONAL EXPERIENCE", margin, yPos);
      yPos += 5.5;

      // Job Title & Date Row
      doc.setFont(fontName, "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
      doc.text("Senior Frontend Architect", margin, yPos);
      
      doc.setFont(fontName, "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(120, 120, 120);
      doc.text("Present", margin + contentWidth, yPos, { align: "right" });
      yPos += 5.5;

      // Wrapped Experience bullet
      doc.setFont(fontName, "normal");
      doc.setFontSize(9);
      doc.setTextColor(bodyColor.r, bodyColor.g, bodyColor.b);
      
      const wrappedText = doc.splitTextToSize(experience || "No experience bullets written yet.", contentWidth);
      doc.text(wrappedText, margin, yPos);
      
      const textLinesCount = wrappedText.length;
      yPos += textLinesCount * 4.5 + 8;

      // Footer
      const footerY = pageHeight - margin;
      drawDivider(footerY - 6, { r: 230, g: 230, b: 230 }, 0.2);

      doc.setFont(fontName, "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(150, 150, 150);
      doc.text("CV Compiled & Optimised via SprintSkill AI Platform", pageWidth / 2, footerY - 2, { align: "center" });

      // Save PDF
      const fileName = `${(name || "Resume").trim().replace(/\s+/g, "_")}_CV.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Something went wrong compiling the PDF. Please try again.");
    } finally {
      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    }
  };

  return (
    <div id="resume-builder-page" className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">AI Recruiter Resume Builder</h2>
          <p className="text-xs text-zinc-400">Optimize and review resume blocks with immediate recruiter-grade metrics feedback.</p>
        </div>

        <button 
          onClick={exportToPdf}
          disabled={isExporting}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer shrink-0"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Compiling PDF...
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" /> Export CV PDF
            </>
          )}
        </button>
      </div>

      {/* Editor & Preview Side-by-Side Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Editor Form */}
        <div className="space-y-6">
          <div className="p-5 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md shadow-xl space-y-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">EDITOR CANVAS</span>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border bg-zinc-950 border-zinc-900 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-widest">Target Job Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border bg-zinc-950 border-zinc-900 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Experience / Project bullet</label>
                <button
                  type="button"
                  onClick={handleAiOptimize}
                  disabled={isLoading}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 focus:outline-none"
                >
                  {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Recruiter Review
                </button>
              </div>
              <textarea 
                rows={5}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Type your experience details here..."
                className="w-full px-3 py-2 text-xs rounded-lg border bg-zinc-950 border-zinc-900 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-none"
              />
            </div>
          </div>

          {/* AI Suggestions Dropdown drawer */}
          <AnimatePresence>
            {suggestions && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-5 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 backdrop-blur-md shadow-xl space-y-4 text-left"
              >
                <div>
                  <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest">Recruiter AI Diagnosis</span>
                  <ul className="list-disc pl-4 space-y-1.5 mt-2 text-[11px] text-zinc-300 leading-relaxed">
                    {suggestions.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                {rewrittenText && (
                  <div className="space-y-2 border-t border-indigo-500/10 pt-3">
                    <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest">REWRITTEN VERSION</span>
                    <p className="text-[11px] text-zinc-300 bg-zinc-950/40 p-3 rounded-lg border border-zinc-900 leading-relaxed">{rewrittenText}</p>
                    <button 
                      onClick={applyRewrite}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold"
                    >
                      Apply Optimization
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Live Resume Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">LIVE HIGH-CONTRAST PREVIEW</span>
            
            {/* Template selectors */}
            <div className="flex gap-1">
              {templates.map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${
                    template === t 
                      ? "bg-zinc-800 text-white border border-zinc-700" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div 
            className={`p-8 rounded-2xl shadow-xl min-h-[400px] text-left transition-colors flex flex-col justify-between ${
              template === "Tech Mono" ? "font-mono bg-zinc-950 border border-zinc-900 text-zinc-100" :
              template === "Elegant Serif" ? "font-serif bg-stone-50 border border-stone-200 text-stone-900" :
              "font-sans bg-white border border-zinc-200 text-zinc-900" // Minimalist Light
            }`}
          >
            <div className="space-y-6">
              {/* Header block */}
              <div className="border-b pb-4 border-zinc-200/80">
                <h3 className="text-xl font-bold tracking-tight">{name || "Your Name"}</h3>
                <p className={`text-xs mt-1 uppercase tracking-widest font-bold ${
                  template === "Tech Mono" ? "text-indigo-400" : "text-zinc-500"
                }`}>
                  {title || "Target Job Title"}
                </p>
                <div className="text-[10px] text-zinc-400 mt-2 flex gap-4">
                  <span>diyaghosh030805@gmail.com</span>
                  <span>|</span>
                  <span>GitHub</span>
                  <span>|</span>
                  <span>LinkedIn</span>
                </div>
              </div>

              {/* Experience block */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest block text-zinc-400">Professional Experience</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Senior Frontend Architect</span>
                    <span className="font-mono text-[10px] text-zinc-500 font-normal">Present</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-zinc-500 pt-1">
                    {experience || "No experience bullets written yet."}
                  </p>
                </div>
              </div>
            </div>

            {/* Subtle credit marker */}
            <p className="text-[8px] text-zinc-400 font-mono text-center mt-12 border-t pt-3">
              CV Compiled & Optimised via SprintSkill AI Platform
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
