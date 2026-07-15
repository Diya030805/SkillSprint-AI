"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, Bot, User, Trash2, ArrowRight, CornerDownLeft, Copy, Check, Info } from "lucide-react";

interface ChatMentorProps {
  isDarkMode: boolean;
}

export default function ChatMentorPage({ isDarkMode }: ChatMentorProps) {
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      role: "model",
      text: "Hello! I am your premium **SprintSkill AI Mentor**. How can I help accelerate your learning path, analyze a complex code concept, or review your professional career strategy today?",
      time: "Just now"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Explain Server Components simply",
    "Review my system layout spacing",
    "Suggest action verbs for my experience",
    "How do I prepare for a Staff Engineer loop?"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg = {
      id: messages.length + 1,
      role: "user",
      text: textToSend,
      time: "Just now"
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      // Create chat history context
      const historyContext = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          payload: {
            message: textToSend,
            history: historyContext
          }
        })
      });

      const res = await response.json();
      
      setIsTyping(false);
      
      const replyText = res.success && res.text 
        ? res.text 
        : "I apologize, but I encountered a communication timeout. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          role: "model",
          text: replyText,
          time: "Just now"
        }
      ]);

    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 2,
          role: "model",
          text: "I experienced a client connection timeout. Let me know if you want to try again!",
          time: "Just now"
        }
      ]);
    }
  };

  const handleCopyText = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "model",
        text: "Conversation cleared. Ready for your next career challenge!",
        time: "Just now"
      }
    ]);
  };

  // High-fidelity manual Markdown parser for the AI responses to support elegant code blocks, bold text, lists, and headers!
  const renderMarkdown = (text: string, msgId: number) => {
    const lines = text.split("\n");
    let inCodeBlock = false;
    let codeContent = "";

    return lines.map((line, idx) => {
      // Handle Code Block wrapper
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const blockText = codeContent;
          codeContent = "";
          return (
            <div key={idx} className="my-3 rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden font-mono text-xs">
              <div className="flex justify-between items-center px-4 py-1.5 border-b border-zinc-900 bg-zinc-900/60 text-zinc-500 text-[10px]">
                <span>TYPESCRIPT / CODE BLOCK</span>
                <button 
                  onClick={() => handleCopyText(blockText, msgId + idx)}
                  className="hover:text-zinc-300 flex items-center gap-1 transition-colors"
                >
                  {copiedId === msgId + idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedId === msgId + idx ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-indigo-200"><code>{blockText}</code></pre>
            </div>
          );
        } else {
          inCodeBlock = true;
          return null;
        }
      }

      if (inCodeBlock) {
        codeContent += line + "\n";
        return null;
      }

      // Handle Headers
      if (line.trim().startsWith("### ")) {
        return <h4 key={idx} className="text-sm font-extrabold text-zinc-100 mt-4 mb-2 tracking-tight">{line.replace("### ", "")}</h4>;
      }
      if (line.trim().startsWith("## ")) {
        return <h3 key={idx} className="text-base font-extrabold text-zinc-100 mt-4 mb-2 tracking-tight">{line.replace("## ", "")}</h3>;
      }

      // Handle bullet list items
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const itemText = line.replace(/^[-*]\s+/, "");
        return (
          <li key={idx} className="ml-4 list-disc text-zinc-300 text-xs leading-relaxed my-1">
            {parseInlineMarkdown(itemText)}
          </li>
        );
      }

      // Default paragraph line
      if (line.trim() === "") return <div key={idx} className="h-2" />;

      return (
        <p key={idx} className="text-zinc-300 text-xs leading-relaxed my-1.5">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Parses inline markdown e.g. **bold** and `code`
  const parseInlineMarkdown = (text: string) => {
    const parts = [];
    let currentText = text;
    let boldRegex = /\*\*(.*?)\*\*/g;
    let codeRegex = /`(.*?)`/g;

    // A simplified inline parser that matches bold and code snippets sequentially
    // Splitting by bold tags
    let match;
    let lastIndex = 0;
    
    // Convert inline code first, then bold for high fidelity
    const boldMatches = Array.from(text.matchAll(boldRegex));
    const codeMatches = Array.from(text.matchAll(codeRegex));

    // Simple replacement logic
    if (boldMatches.length === 0 && codeMatches.length === 0) {
      return text;
    }

    // High fidelity string replace array output
    let tempParts: React.ReactNode[] = [text];

    // Simple parser fallback:
    return (
      <span>
        {text.split(/(\*\*.*?\*\*|`.*?`)/g).map((chunk, cIdx) => {
          if (chunk.startsWith("**") && chunk.endsWith("**")) {
            return <strong key={cIdx} className="font-extrabold text-zinc-100">{chunk.slice(2, -2)}</strong>;
          }
          if (chunk.startsWith("`") && chunk.endsWith("`")) {
            return <code key={cIdx} className="px-1.5 py-0.5 rounded bg-zinc-900 font-mono text-[10px] border border-zinc-800 text-pink-400">{chunk.slice(1, -1)}</code>;
          }
          return chunk;
        })}
      </span>
    );
  };

  return (
    <div id="chat-mentor-page" className={`flex flex-col h-[calc(100vh-140px)] rounded-3xl border overflow-hidden relative backdrop-blur-md shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-zinc-200/80 shadow-sm'}`}>
      
      {/* Top Header Controls */}
      <div className={`px-6 py-4 border-b flex items-center justify-between z-10 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-zinc-200/60'}`}>
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold">SprintSkill AI Mentor</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-zinc-500">24/7 Premium carrier advice & system architect logic</p>
          </div>
        </div>

        <button 
          onClick={clearChat}
          className={`p-2 rounded-lg border hover:text-red-400 transition-all ${isDarkMode ? 'border-zinc-800 bg-zinc-950 text-zinc-400' : 'border-zinc-200 bg-zinc-50 text-zinc-600'}`}
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Message Output Board */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-transparent">
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Avatar left */}
                {m.role !== "user" && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0 self-start">
                    <Bot className="w-4.5 h-4.5 text-indigo-400" />
                  </div>
                )}

                <div className={`max-w-[80%] rounded-xl p-4 border text-left ${
                  m.role === "user" 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : isDarkMode ? 'bg-zinc-900/40 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'
                }`}>
                  <div className="prose prose-invert prose-xs">
                    {m.role === "user" ? (
                      <p className="text-xs leading-relaxed">{m.text}</p>
                    ) : (
                      renderMarkdown(m.text, m.id)
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-1 border-t border-zinc-800/10 text-[9px] text-zinc-500 font-mono">
                    <span>{m.time}</span>
                    {m.role !== "user" && (
                      <button 
                        onClick={() => handleCopyText(m.text, m.id)}
                        className="hover:text-zinc-300 flex items-center gap-1"
                      >
                        {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedId === m.id ? "Copied" : "Copy"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Avatar right */}
                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 self-start text-white text-xs font-bold font-sans">
                    U
                  </div>
                )}
              </motion.div>
            ))}

            {/* AI Typing Loader */}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 justify-start"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                  <Bot className="w-4.5 h-4.5 text-indigo-400" />
                </div>
                <div className={`rounded-xl p-4 border flex items-center space-x-1.5 ${isDarkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Suggested Actions & Text Input Footer */}
      <div className={`p-4 border-t ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-zinc-200/60'}`}>
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Action suggested prompt pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className={`px-3 py-1.5 rounded-full border text-[10px] font-medium transition-all ${isDarkMode ? 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white' : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'}`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Form input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }} 
            className="flex gap-2 items-center"
          >
            <input 
              type="text"
              placeholder="Ask your career mentor anything... (e.g. how do I optimize an API route?)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'}`}
            />
            <button 
              type="submit"
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* API Info Badge */}
          <p className="text-[9px] text-zinc-500 text-center flex items-center justify-center gap-1">
            <Info className="w-3 h-3 text-zinc-600" /> Connected to Gemini AI 3.5 Flash server-side.
          </p>

        </div>
      </div>

    </div>
  );
}
