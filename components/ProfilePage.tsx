"use client";

import React, { useState } from "react";
import { User, Award, Plus, X, Shield, Mail, Sparkles } from "lucide-react";

export default function ProfilePage() {
  const [bio, setBio] = useState("Aspiring Software Architect seeking to master full-stack pipelines, type-safe databases, and clean SaaS layout spacing principles.");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState(["React Server Components", "TypeScript Types", "PostgreSQL", "Next.js 15"]);

  const certificates = [
    { title: "Personalized Roadmap: Full-Stack Architect", issuer: "SprintSkill AI Board", date: "June 2026", hash: "SSA-9482-AD3" },
    { title: "HTML Semantic & Grid Layout Competence", issuer: "SprintSkill AI Board", date: "May 2026", hash: "SSA-1029-BC2" }
  ];

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.trim() || skills.includes(skillInput.trim())) return;
    setSkills([...skills, skillInput.trim()]);
    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  return (
    <div id="profile-page" className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-lg font-bold tracking-tight">Your Professional Profile</h2>
        <p className="text-xs text-zinc-400">Manage your technical biographical metadata, skill tags, and digital credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Biography Form (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md shadow-xl space-y-4 text-left">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">METADATA DETAILS</span>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shrink-0 font-extrabold text-white text-lg">
                  JD
                </div>
                <div>
                  <h4 className="text-sm font-bold">John Doe</h4>
                  <p className="text-[11px] text-zinc-500 flex items-center gap-1"><Mail className="w-3 h-3" /> diyaghosh030805@gmail.com</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-widest">Biographical Summary</label>
                <textarea 
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border bg-zinc-950 border-zinc-900 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-normal resize-none"
                />
              </div>
            </div>
          </div>

          {/* Interactive Skills tag management */}
          <div className="p-5 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md shadow-xl space-y-4 text-left">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">INTERACTIVE SKILL BADGES</span>
            
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Add custom skill (e.g. Docker, Rust)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border bg-zinc-950 border-zinc-900 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button type="submit" className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold">
                Add
              </button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((s) => (
                <span 
                  key={s} 
                  className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-zinc-950 border border-zinc-800 text-zinc-300 flex items-center gap-1.5"
                >
                  {s}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSkill(s)} 
                    className="text-zinc-500 hover:text-red-400 focus:outline-none"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Certified Credentials list (Col span 1) */}
        <div className="space-y-6">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">CERTIFIED CREDENTIALS</span>
          
          <div className="space-y-4">
            {certificates.map((cert, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-4 text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none" />
                <div className="space-y-2 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <h5 className="text-xs font-bold leading-snug">{cert.title}</h5>
                  <p className="text-[10px] text-zinc-500">{cert.issuer} • {cert.date}</p>
                </div>

                <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between text-[9px] font-mono text-zinc-500 relative z-10">
                  <span>SHA-256 HASH</span>
                  <span className="font-bold text-zinc-400">{cert.hash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
