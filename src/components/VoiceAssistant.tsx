"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2, Volume2, X } from "lucide-react";

type State = "idle" | "recording" | "processing" | "playing" | "error";

export default function VoiceAssistant() {
  const [state, setState] = useState<State>("idle");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setErrorMsg("");

      // Check if getUserMedia is available (requires HTTPS or localhost)
      if (!navigator.mediaDevices?.getUserMedia) {
        setErrorMsg("Microphone not available (requires HTTPS)");
        setState("error");
        setTimeout(() => setState("idle"), 3000);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Find a supported mimeType
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : undefined;

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      audioChunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(audioChunks.current, {
          type: recorder.mimeType || "audio/webm",
        });
        await processAudio(audioBlob);
      };

      recorder.start();
      mediaRecorder.current = recorder;
      setState("recording");
    } catch (err) {
      const msg = err instanceof DOMException && err.name === "NotAllowedError"
        ? "Microphone access denied. Please allow microphone in browser settings."
        : "Could not access microphone";
      setErrorMsg(msg);
      setState("error");
      setTimeout(() => setState("idle"), 4000);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setState("processing");
    }
  }, []);

  const processAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const res = await fetch("/api/voice-chat", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to process voice");
      }

      const data = await res.json();
      setTranscript(data.transcript || "");
      setResponse(data.response || "");

      if (data.audioAvailable && data.audio) {
        setState("playing");
        try {
          const audioBytes = Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0));
          const blob = new Blob([audioBytes], { type: "audio/mpeg" });
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = () => {
            setState("idle");
            URL.revokeObjectURL(url);
          };
          audio.onerror = () => {
            setState("idle");
            URL.revokeObjectURL(url);
          };
          await audio.play();
        } catch {
          setState("idle");
        }
      } else {
        setState("idle");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Processing failed");
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setState("idle");
  };

  const handleMicClick = () => {
    if (state === "recording") {
      stopRecording();
    } else if (state === "playing") {
      stopPlayback();
    } else if (state === "idle" || state === "error") {
      startRecording();
    }
  };

  return (
    <>
      {/* Floating mic button */}
      <motion.button
        onClick={() => {
          if (!isOpen) setIsOpen(true);
          else handleMicClick();
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 1 }}
        className={`fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all cursor-pointer ${
          state === "recording"
            ? "bg-red-500 shadow-red-500/30 animate-pulse"
            : state === "processing"
            ? "bg-yellow-500 shadow-yellow-500/30"
            : state === "playing"
            ? "bg-green-500 shadow-green-500/30"
            : "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/30 hover:shadow-emerald-500/50"
        }`}
        aria-label="Voice assistant"
      >
        {state === "recording" ? (
          <MicOff className="h-6 w-6 text-white" />
        ) : state === "processing" ? (
          <Loader2 className="h-6 w-6 text-white animate-spin" />
        ) : state === "playing" ? (
          <Volume2 className="h-6 w-6 text-white" />
        ) : (
          <Mic className="h-6 w-6 text-white" />
        )}
      </motion.button>

      {/* Voice panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-20 left-4 sm:bottom-24 sm:left-6 z-[9998] w-80 rounded-2xl border border-white/10 bg-gray-950/95 shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-emerald-600/20 to-teal-600/20">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-white">Voice Assistant</span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  stopPlayback();
                  setState("idle");
                }}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
              {state === "idle" && !transcript && (
                <p className="text-sm text-gray-400 text-center py-4">
                  Tap the mic button and ask me anything about Pintu&apos;s portfolio!
                </p>
              )}

              {state === "recording" && (
                <div className="text-center py-4">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-red-400 rounded-full"
                        animate={{ height: [8, 24, 8] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-red-400">Listening... tap mic to stop</p>
                </div>
              )}

              {state === "processing" && (
                <div className="text-center py-4">
                  <Loader2 className="h-8 w-8 text-yellow-400 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-yellow-400">Processing your voice...</p>
                </div>
              )}

              {transcript && (
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">You said</p>
                  <p className="text-sm text-white">{transcript}</p>
                </div>
              )}

              {response && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
                  <p className="text-[10px] text-emerald-500 uppercase tracking-wider mb-1">AI Response</p>
                  <p className="text-sm text-gray-200">{response}</p>
                </div>
              )}

              {state === "playing" && (
                <p className="text-xs text-center text-green-400">Playing response...</p>
              )}

              {errorMsg && (
                <p className="text-xs text-center text-red-400">{errorMsg}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
