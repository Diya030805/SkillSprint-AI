export function playSound(type: "click" | "transition") {
  if (typeof window === "undefined") return;

  // Check if Sound Effects are enabled in localStorage. Default is true if not set.
  const enabled = localStorage.getItem("sprintskill_sound_effects") !== "false";
  if (!enabled) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    
    if (type === "click") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      // Subtle crisp click/pop frequency sweep
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.06);
      
      gain.gain.setValueAtTime(0.06, ctx.currentTime); // Keep it quiet and premium
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === "transition") {
      // Gentle major-third dual frequency ascending sweep for transition chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc1.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.14); // E5 (Perfect fifth sweep)
      
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(554.37, ctx.currentTime); // C#5 (Major third)
      osc2.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.14); // A5 (Octave sweep)
      
      gain.gain.setValueAtTime(0.03, ctx.currentTime); // Super subtle and clean
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.16);
      osc2.stop(ctx.currentTime + 0.16);
    }
  } catch (error) {
    console.warn("Failed to play UI sound cue", error);
  }
}
