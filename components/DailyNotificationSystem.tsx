"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bell, 
  BellRing, 
  Clock, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Volume2, 
  Compass, 
  Target, 
  X,
  Play
} from "lucide-react";
import { playSound } from "@/lib/audio";

// Helper to log user activity today
export function logUserActivity() {
  const todayStr = new Date().toISOString().split("T")[0];
  localStorage.setItem("sprintskill_last_activity_date", todayStr);
  localStorage.setItem("sprintskill_last_activity_time", new Date().toLocaleTimeString());
  
  // Dispatch custom event to notify all components of activity logging
  window.dispatchEvent(new CustomEvent("sprintskill_activity_logged", {
    detail: { date: todayStr }
  }));
}

// 1. Settings Card UI Component
interface SettingsCardProps {
  isDarkMode?: boolean;
}

export function DailyNotificationSettings({ isDarkMode = true }: SettingsCardProps) {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sprintskill_daily_notify_enabled") !== "false";
    }
    return true;
  });
  const [notifyTime, setNotifyTime] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sprintskill_daily_notify_time") || "18:00";
    }
    return "18:00";
  });
  const [hasLoggedToday, setHasLoggedToday] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const todayStr = new Date().toISOString().split("T")[0];
      const lastActivity = localStorage.getItem("sprintskill_last_activity_date");
      return lastActivity === todayStr;
    }
    return false;
  });
  const [lastLoggedTime, setLastLoggedTime] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sprintskill_last_activity_time") || "";
    }
    return "";
  });
  const [permissionStatus, setPermissionStatus] = useState<string>(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "default";
  });
  const [successMsg, setSuccessMsg] = useState<string>("");

  function checkActivityState() {
    const todayStr = new Date().toISOString().split("T")[0];
    const lastActivity = localStorage.getItem("sprintskill_last_activity_date");
    const lastTime = localStorage.getItem("sprintskill_last_activity_time") || "";
    setHasLoggedToday(lastActivity === todayStr);
    setLastLoggedTime(lastTime);
  }

  useEffect(() => {
    // Listen for activity changes
    const handleActivityChange = () => {
      checkActivityState();
    };
    window.addEventListener("sprintskill_activity_logged", handleActivityChange);
    return () => window.removeEventListener("sprintskill_activity_logged", handleActivityChange);
  }, []);

  const handleToggle = (val: boolean) => {
    setEnabled(val);
    localStorage.setItem("sprintskill_daily_notify_enabled", val ? "true" : "false");
    playSound("click");
    showSuccess(val ? "Daily reminders enabled" : "Daily reminders disabled");
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setNotifyTime(newTime);
    localStorage.setItem("sprintskill_daily_notify_time", newTime);
    showSuccess(`Notification set to ${format12Hour(newTime)}`);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const requestPermission = async () => {
    playSound("click");
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("This browser does not support HTML5 desktop notifications. The dynamic in-app notification engine will be used as a smart fallback.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      if (permission === "granted") {
        showSuccess("Browser notifications approved!");
        new Notification("SprintSkill AI", {
          body: "Push notification system integrated successfully!",
          icon: "/favicon.ico"
        });
      } else {
        alert("Permission denied. We will use elegant in-app notification slide-downs to deliver warnings and reminders safely.");
      }
    } catch (e) {
      console.error("Error requesting notification permission", e);
    }
  };

  const handleTriggerManualLog = () => {
    playSound("click");
    logUserActivity();
    showSuccess("Activity successfully logged!");
  };

  const handleClearActivity = () => {
    playSound("click");
    localStorage.removeItem("sprintskill_last_activity_date");
    localStorage.removeItem("sprintskill_last_activity_time");
    window.dispatchEvent(new CustomEvent("sprintskill_activity_logged"));
    showSuccess("Cleared today's activity log.");
  };

  const handleSimulateTimePassed = () => {
    playSound("transition");
    // Trigger the notification event manually
    window.dispatchEvent(new CustomEvent("sprintskill_simulate_notify_trigger"));
    showSuccess("Simulated notification trigger!");
  };

  const format12Hour = (timeStr: string) => {
    if (!timeStr) return "";
    const [hoursStr, minutesStr] = timeStr.split(":");
    const hours = parseInt(hoursStr, 10);
    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutesStr} ${suffix}`;
  };

  return (
    <div className={`p-6 rounded-3xl border text-left space-y-6 shadow-xl backdrop-blur-md transition-all duration-300 ${
      isDarkMode 
        ? "bg-white/5 border-white/10" 
        : "bg-white/70 border-zinc-200 shadow-md"
    }`}>
      <div className="flex items-center justify-between border-b pb-4 border-zinc-800/40">
        <div className="space-y-1">
          <h4 className="text-sm font-bold flex items-center gap-2 text-zinc-100">
            <BellRing className="text-indigo-400 w-4 h-4 animate-pulse" /> Goal Commitment Engine
          </h4>
          <p className="text-[11px] text-zinc-400">
            Intelligent scheduler that alerts you if you haven&apos;t logged any learning activity by your custom target hour.
          </p>
        </div>
        
        {/* Toggle switch */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">Status</span>
          <button
            onClick={() => handleToggle(!enabled)}
            className={`w-11 h-6 rounded-full transition-all relative ${
              enabled ? "bg-indigo-600" : "bg-zinc-850 border border-zinc-800"
            }`}
          >
            <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all ${
              enabled ? "right-0.5" : "left-0.5"
            }`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Settings Area */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-zinc-500" /> Daily Warning Time
            </label>
            <input 
              type="time" 
              value={notifyTime}
              onChange={handleTimeChange}
              disabled={!enabled}
              className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono transition-all ${
                !enabled 
                  ? "bg-zinc-900/20 border-zinc-900 text-zinc-600 cursor-not-allowed"
                  : isDarkMode 
                    ? "bg-zinc-950 border-zinc-900 text-white" 
                    : "bg-white border-zinc-200 text-zinc-900"
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-zinc-500" /> Browser Permissions
            </label>
            <div className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
              isDarkMode ? "bg-zinc-950/60 border-zinc-900" : "bg-zinc-50 border-zinc-200"
            }`}>
              <div className="space-y-0.5">
                <span className="font-bold text-zinc-300 block">HTML5 Desktop Push</span>
                <span className={`text-[10px] font-semibold uppercase ${
                  permissionStatus === "granted" 
                    ? "text-emerald-400" 
                    : permissionStatus === "denied" 
                      ? "text-red-400" 
                      : "text-amber-400"
                }`}>
                  {permissionStatus === "default" ? "Not Requested" : permissionStatus}
                </span>
              </div>
              
              {permissionStatus !== "granted" && (
                <button
                  type="button"
                  onClick={requestPermission}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold transition-all"
                >
                  Enable Browser Push
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status Monitoring & Testing Controls */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between h-full min-h-[190px] ${
          isDarkMode ? "bg-zinc-950/40 border-zinc-900" : "bg-zinc-100 border-zinc-200"
        }`}>
          <div>
            <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest block mb-2">
              Check-In Diagnostics
            </span>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs border-b border-zinc-900/60 pb-2">
                <span className="text-zinc-500 font-medium">Activity Logged Today:</span>
                <span className={`font-extrabold flex items-center gap-1 ${
                  hasLoggedToday ? "text-emerald-400" : "text-amber-500"
                }`}>
                  {hasLoggedToday ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" /> Checked In
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" /> Pending
                    </>
                  )}
                </span>
              </div>

              {hasLoggedToday && lastLoggedTime && (
                <div className="flex items-center justify-between text-xs border-b border-zinc-900/60 pb-2">
                  <span className="text-zinc-500 font-medium">Last logged time:</span>
                  <span className="font-bold text-zinc-300 font-mono">{lastLoggedTime}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs border-b border-zinc-900/60 pb-2">
                <span className="text-zinc-500 font-medium">Active Rule:</span>
                <span className="text-zinc-300 font-bold">
                  Alert at <span className="font-mono text-indigo-400">{format12Hour(notifyTime)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Simulate controls */}
          <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-zinc-900/60">
            {!hasLoggedToday ? (
              <button
                type="button"
                onClick={handleTriggerManualLog}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-all flex items-center gap-1 shadow-md shadow-emerald-600/10"
              >
                <CheckCircle className="w-3 h-3" /> Log Activity
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClearActivity}
                className="px-3 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/15 font-bold text-[10px] transition-all flex items-center gap-1"
              >
                Clear Log
              </button>
            )}

            <button
              type="button"
              onClick={handleSimulateTimePassed}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] transition-all flex items-center gap-1 shadow-md shadow-indigo-600/10 ml-auto"
            >
              <Play className="w-3 h-3" /> Run Simulator
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-center"
          >
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 2. Global Background Watcher and Custom Toast Fallback Component
interface WatcherProps {
  onNavigateTab: (tab: string) => void;
}

export function DailyNotificationWatcher({ onNavigateTab }: WatcherProps) {
  const [showInAppAlert, setShowInAppAlert] = useState<boolean>(false);
  const [alertTimeStr, setAlertTimeStr] = useState<string>("");

  function triggerNotification(todayStr: string) {
    // Update notified date to prevent multiple alerts today
    localStorage.setItem("sprintskill_last_notified_date", todayStr);

    try {
      playSound("transition");
    } catch (err) {}

    // 1. Dispatch custom event to push alert to the Bell Notification center list in real-time
    const newAlertDetails = {
      type: "streak",
      title: "Goal Commitment Warning",
      desc: "You haven't logged any progress today! Head to your dashboard or quizzes to secure your goals."
    };
    window.dispatchEvent(new CustomEvent("sprintskill_new_notification", {
      detail: newAlertDetails
    }));

    // 2. Play sound or browser alert
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("SprintSkill AI Goal Warning", {
        body: "You have not logged any activities today! Check in now to secure your streak.",
        icon: "/favicon.ico"
      });
    }

    // 3. Fallback/Complementary elegant visual slide-down modal/toast
    setAlertTimeStr(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setShowInAppAlert(true);
  }

  useEffect(() => {
    // Check state periodically (every 10 seconds is efficient and fast enough)
    const checkNotificationTime = () => {
      const savedEnabled = localStorage.getItem("sprintskill_daily_notify_enabled") !== "false";
      if (!savedEnabled) return;

      const savedTime = localStorage.getItem("sprintskill_daily_notify_time") || "18:00";
      const [targetHours, targetMinutes] = savedTime.split(":").map(Number);

      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      // Check if we have passed the scheduled target hour & minute
      const hasPassedTarget = (currentHours > targetHours) || (currentHours === targetHours && currentMinutes >= targetMinutes);

      if (hasPassedTarget) {
        const todayStr = now.toISOString().split("T")[0];
        const lastActivity = localStorage.getItem("sprintskill_last_activity_date");
        const hasLoggedToday = lastActivity === todayStr;

        // If no activity logged today, check if we've already alerted today
        if (!hasLoggedToday) {
          const lastNotifiedDate = localStorage.getItem("sprintskill_last_notified_date");
          if (lastNotifiedDate !== todayStr) {
            triggerNotification(todayStr);
          }
        }
      }
    };

    // Run immediately and setup interval
    checkNotificationTime();
    const interval = setInterval(checkNotificationTime, 10000);

    // Also listen to simulator events
    const handleSimulateEvent = () => {
      triggerNotification(new Date().toISOString().split("T")[0]);
    };
    window.addEventListener("sprintskill_simulate_notify_trigger", handleSimulateEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener("sprintskill_simulate_notify_trigger", handleSimulateEvent);
    };
  }, []);

  const handleLoggedActivityNow = () => {
    playSound("click");
    logUserActivity();
    setShowInAppAlert(false);
  };

  return (
    <AnimatePresence>
      {showInAppAlert && (
        <div className="fixed top-20 right-6 z-50 w-80 max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="p-5 rounded-2xl bg-zinc-950 border-2 border-indigo-500/40 text-left shadow-2xl space-y-4 shadow-indigo-500/10 backdrop-blur-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-amber-500 animate-bounce" />
                </div>
                <div>
                  <h5 className="text-xs font-extrabold text-zinc-100">Commitment Reminder</h5>
                  <span className="text-[8px] font-mono text-zinc-500">Scheduled: {alertTimeStr}</span>
                </div>
              </div>
              <button 
                onClick={() => setShowInAppAlert(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-md transition-all"
                aria-label="Dismiss Alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Hey! You haven&apos;t logged any learning activities today. Tap below to log activity or check off your weekly goals to maintain your daily streak!
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setShowInAppAlert(false);
                  onNavigateTab("dashboard");
                  playSound("click");
                }}
                className="flex-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] text-center transition-all cursor-pointer"
              >
                View Goals
              </button>
              
              <button
                onClick={handleLoggedActivityNow}
                className="flex-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] text-center transition-all cursor-pointer"
              >
                Log Check-In
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
