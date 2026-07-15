"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Code, Sparkles, Loader2, CheckCircle, AlertTriangle, ArrowRight, HelpCircle, Trophy } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function PracticeZonePage({ isDarkMode = true }: { isDarkMode?: boolean }) {
  const [topic, setTopic] = useState("React Server Components");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  
  // Quiz active state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const predefinedTopics = [
    "React Server Components",
    "TypeScript Generics",
    "SQL Database Indexes",
    "Docker Container Networking"
  ];

  const handleStartQuiz = async (selectedTopic: string) => {
    setIsLoading(true);
    setQuestions(null);
    setCurrentIdx(0);
    setSelectedIdx(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "quiz",
          payload: { topic: selectedTopic, difficulty }
        })
      });
      const res = await response.json();
      if (res.success && Array.isArray(res.data)) {
        setQuestions(res.data);
      } else {
        // Fallback quiz cards if error
        setQuestions([
          {
            question: "In standard CSS spacing layouts, why are margin-collapsing behaviors crucial to handle?",
            options: [
              "They crash the layout renderer in Safari",
              "They cause adjacent vertical block-level elements to share margins, affecting spacing predictability",
              "They force block-level elements to align horizontally instead of vertically",
              "They automatically apply a dark theme filter"
            ],
            correctIndex: 1,
            explanation: "Adjacent vertical elements can collapse their top/bottom margins into a single spacing block. Understanding this ensures precise typography layout predictions without arbitrary spacers."
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedIdx === null || isSubmitted) return;
    
    setIsSubmitted(true);
    const q = questions![currentIdx];
    if (selectedIdx === q.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions!.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedIdx(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div id="practice-zone-page" className="space-y-6">
      
      {/* Quiz Controller Setup Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Interactive AI Quiz Sandbox</h2>
          <p className="text-xs text-zinc-400 font-sans">Generate real-time conceptual coding challenge cards using our Gemini model.</p>
        </div>

        {/* Difficulty Select dropdown */}
        <div className="flex gap-2 shrink-0">
          <select 
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
          >
            <option value="Beginner">Beginner Level</option>
            <option value="Intermediate">Intermediate Level</option>
            <option value="Advanced">Advanced Level</option>
          </select>
        </div>
      </div>

      {/* Suggested Quiz Topics Grid */}
      {!questions && !isLoading && (
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">SELECT A SUB-SYSTEM TOPIC TO CHALLENGE</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {predefinedTopics.map((top, idx) => (
              <button
                key={idx}
                onClick={() => handleStartQuiz(top)}
                className="p-5 rounded-3xl border bg-white/5 border-white/10 backdrop-blur-md shadow-xl text-left hover:border-white/20 transition-all hover:scale-[1.01] group space-y-3 focus:outline-none cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <Code className="w-4.5 h-4.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold leading-tight group-hover:text-indigo-400 transition-colors">{top}</h4>
                  <p className="text-[10px] text-zinc-500">Test {difficulty} concepts</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="p-16 text-center space-y-4 border bg-white/5 border-white/10 backdrop-blur-md shadow-xl rounded-3xl">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold">Generating Premium AI Quiz Cards</h4>
            <p className="text-[10px] text-zinc-500">Connecting to Gemini to compile technical answers...</p>
          </div>
        </div>
      )}

      {/* Active Interactive Quiz solver */}
      {questions && !isLoading && !quizFinished && (
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Progress panel */}
          <div className="flex justify-between items-center text-xs text-zinc-400 pb-3 border-b border-zinc-900">
            <span>Question <span className="font-bold text-white">{currentIdx + 1}</span> of {questions.length}</span>
            <span className="font-mono text-indigo-400">{difficulty} Difficulty</span>
          </div>

          <div className={`p-6 rounded-3xl border backdrop-blur-md shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-zinc-200'}`}>
            <h3 className="text-sm font-bold leading-relaxed text-zinc-100 mb-6 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <span>{questions[currentIdx].question}</span>
            </h3>

            {/* Answer option radio cards */}
            <div className="space-y-3">
              {questions[currentIdx].options.map((opt, idx) => {
                const isSelected = selectedIdx === idx;
                const isCorrect = idx === questions[currentIdx].correctIndex;
                
                let optionStyle = isDarkMode ? "bg-white/5 border-white/5" : "bg-zinc-50 border-zinc-100";
                
                if (isSelected) {
                  optionStyle = "border-indigo-600 bg-indigo-600/5 text-indigo-200";
                }
                
                if (isSubmitted) {
                  if (isCorrect) {
                    optionStyle = "border-emerald-600 bg-emerald-600/10 text-emerald-300";
                  } else if (isSelected) {
                    optionStyle = "border-red-600 bg-red-600/10 text-red-300";
                  } else {
                    optionStyle = "opacity-50 border-white/5 bg-white/5";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => setSelectedIdx(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-xs leading-relaxed transition-all focus:outline-none flex justify-between items-center ${optionStyle} ${!isSubmitted ? 'hover:bg-zinc-900/40 cursor-pointer' : ''}`}
                  >
                    <span>{opt}</span>
                    {isSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                    {isSubmitted && isSelected && !isCorrect && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* AI feedback Explanation drawer */}
            {isSubmitted && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-xl border leading-relaxed text-[11px] ${
                  selectedIdx === questions[currentIdx].correctIndex
                    ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-300"
                    : "bg-red-950/20 border-red-500/20 text-red-300"
                }`}
              >
                <div className="font-bold uppercase tracking-wider text-[9px] mb-1">AI Explanatory Logic</div>
                <p>{questions[currentIdx].explanation}</p>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-end gap-3">
              {!isSubmitted ? (
                <button
                  disabled={selectedIdx === null}
                  onClick={handleSubmitAnswer}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs disabled:opacity-50 transition-all cursor-pointer"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {currentIdx + 1 < questions.length ? (
                    <>
                      Next Question <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    "View Final Score"
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Quiz Complete results page */}
      {quizFinished && (
        <div className="max-w-md mx-auto p-8 border bg-white/5 border-white/10 backdrop-blur-md shadow-xl rounded-3xl text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto">
            <Trophy className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-zinc-100">Quiz Completed!</h3>
            <p className="text-xs text-zinc-400">Awesome job reinforcing key software architecture rules.</p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-[200px] mx-auto">
            <div className="text-2xl font-extrabold font-mono text-indigo-400">{score} / {questions?.length}</div>
            <span className="text-[9px] text-zinc-500 font-semibold tracking-widest uppercase">CORRECT ANSWERS</span>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setQuestions(null)}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white"
            >
              Back to Topics
            </button>
            <button
              onClick={() => handleStartQuiz(topic)}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Practice Again
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
