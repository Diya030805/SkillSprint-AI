"use client";

import React from "react";
import { Compass, ArrowLeft } from "lucide-react";

interface NotFoundProps {
  onGoHome: () => void;
}

export default function NotFoundPage({ onGoHome }: NotFoundProps) {
  return (
    <div id="not-found-page" className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-6">
      
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
        <Compass className="w-7 h-7 animate-spin" style={{ animationDuration: "10s" }} />
      </div>

      <div className="space-y-2 max-w-sm">
        <h3 className="text-lg font-bold text-zinc-100">Coordinate Out of Bound (404)</h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          The milestone or path you are trying to query doesn&apos;t exist yet, or was archived during dynamic routing. Let&apos;s redirect you back to active ground.
        </p>
      </div>

      <button 
        onClick={onGoHome}
        className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Base
      </button>

    </div>
  );
}
