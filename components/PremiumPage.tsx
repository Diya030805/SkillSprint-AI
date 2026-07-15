"use client";

import React, { useState } from "react";
import { Sparkles, Check, Zap, Shield, Crown } from "lucide-react";

interface PremiumPageProps {
  onUpgradeComplete: () => void;
}

export default function PremiumPage({ onUpgradeComplete }: PremiumPageProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const price = billingCycle === "monthly" ? 19 : 149;

  const benefits = [
    "Unlimited personalized AI roadmaps across any career specialty",
    "Unlimited 24/7 AI Chat Mentor tokens",
    "Priority access to advanced coding quiz modules",
    "Instant PDF resume downloads and custom recruiter layouts",
    "Live portfolio theme hosting & unlimited custom projects",
    "Verifiable digital achievement certificate badges"
  ];

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowCheckoutModal(false);
      onUpgradeComplete();
      alert("Upgrade Successful! Welcome to SprintSkill AI Premium.");
    }, 1500);
  };

  return (
    <div id="premium-page" className="max-w-4xl mx-auto space-y-8 relative">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500/10 to-pink-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
          <Crown className="w-4 h-4 text-amber-400" /> Unlock VIP Sprint privileges
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
          Accelerate with Sprint Premium
        </h2>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          Equip yourself with the ultimate technical growth engine. Clear custom paths and interview technical concepts efficiently.
        </p>
      </div>

      {/* billing toggle */}
      <div className="flex justify-center">
        <div className="bg-zinc-900/60 border border-zinc-800 p-1 rounded-xl flex items-center">
          <button 
            onClick={() => setBillingCycle("monthly")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              billingCycle === "monthly" ? "bg-zinc-800 text-white" : "text-zinc-500"
            }`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setBillingCycle("yearly")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              billingCycle === "yearly" ? "bg-zinc-800 text-white" : "text-zinc-500"
            }`}
          >
            Yearly (Save ~35%)
          </button>
        </div>
      </div>

      {/* Benefits checklist and pricing box split */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        
        {/* Benefits List (Col span 3) */}
        <div className="md:col-span-3 p-6 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md shadow-xl text-left space-y-4">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">PREMIUM FEATURES INCLUDED</span>
          
          <ul className="space-y-3.5">
            {benefits.map((b, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-normal">
                <span className="w-4.5 h-4.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 font-bold">
                  ✓
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing & Checkout trigger Box (Col span 2) */}
        <div className="md:col-span-2 p-6 rounded-3xl border border-indigo-500/20 bg-white/5 backdrop-blur-md shadow-xl flex flex-col justify-between text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full" />
          
          <div className="space-y-4 py-4">
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest block">SUBSCRIBE RATE</span>
            <div className="flex items-baseline justify-center space-x-1.5">
              <span className="text-5xl font-extrabold tracking-tight font-mono text-zinc-100">${price}</span>
              <span className="text-xs text-zinc-500">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
            </div>
            <p className="text-[10px] text-zinc-400 px-4">
              Cancel or change your subscription at any time with a single click. No hidden contracts.
            </p>
          </div>

          <button 
            onClick={() => setShowCheckoutModal(true)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/15 transition-all cursor-pointer"
          >
            Upgrade Account Instantly
          </button>
        </div>

      </div>

      {/* Checkout Modal Mockup */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-6 text-left relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full pointer-events-none" />
            
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" /> Premium Checkout Workspace
              </h4>
              <p className="text-[10px] text-zinc-500">Enter mock details to test payment validation loops.</p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-wider">Card Number</label>
                <input 
                  type="text" 
                  placeholder="4111 2222 3333 4444" 
                  className="w-full px-3 py-2 text-xs rounded-lg border bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-wider">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    className="w-full px-3 py-2 text-xs rounded-lg border bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-wider">Security CVC</label>
                  <input 
                    type="text" 
                    placeholder="123" 
                    className="w-full px-3 py-2 text-xs rounded-lg border bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowCheckoutModal(false)}
                  className="flex-1 py-2 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
                >
                  {isProcessing ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Authorize Pay"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
