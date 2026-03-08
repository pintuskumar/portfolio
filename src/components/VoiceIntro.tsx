"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Loader2 } from "lucide-react";

export default function VoiceIntro() {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = async () => {
    // If playing, stop
    if (state === "playing" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState("idle");
      return;
    }

    if (state === "loading") return;

    setState("loading");

    try {
      // If we already have the audio loaded, just replay
      if (audioRef.current?.src) {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setState("playing");
        return;
      }

      const res = await fetch("/api/voice-intro");
      if (!res.ok) throw new Error("Failed to load audio");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.addEventListener("ended", () => setState("idle"));
      audio.addEventListener("error", () => setState("error"));

      await audio.play();
      setState("playing");
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="group relative inline-flex items-center gap-2 px-5 py-4 rounded-xl border border-slate-600 text-slate-300 font-semibold hover:border-purple-500/50 hover:text-white hover:bg-purple-500/10 transition-all duration-300 cursor-pointer"
      title={state === "playing" ? "Stop intro" : "Listen to voice intro"}
    >
      {state === "loading" ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : state === "playing" ? (
        <>
          <VolumeX className="w-5 h-5" />
          {/* Sound wave animation */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [1, 2, 1] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
                className="w-0.5 h-3 bg-purple-400 rounded-full origin-center"
              />
            ))}
          </div>
        </>
      ) : state === "error" ? (
        <span className="text-sm text-red-400">Unavailable</span>
      ) : (
        <>
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Hear My Intro</span>
        </>
      )}
    </motion.button>
  );
}
