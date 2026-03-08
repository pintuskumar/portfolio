"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  // Pre-compute random positions to avoid hydration mismatch
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        left: `${10 + ((i * 37 + 13) % 80)}%`,
        top: `${10 + ((i * 53 + 7) % 80)}%`,
        duration: 3 + (i % 4),
        delay: (i % 5) * 0.4,
      })),
    []
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-950 px-6">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 text-center">
        {/* Animated 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="mb-6"
        >
          <h1 className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-extrabold leading-none tracking-tighter">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              4
            </span>
            <motion.span
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="inline-block bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"
            >
              0
            </motion.span>
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              4
            </span>
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
            Page Not Found
          </h2>
          <p className="mx-auto mb-8 max-w-md text-gray-400">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
            >
              <Home className="h-4 w-4" />
              Go Home
            </motion.span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-700 px-6 py-3 font-semibold text-gray-300 hover:border-indigo-500/50 hover:text-white hover:bg-indigo-500/10 transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </motion.div>

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-indigo-400/30"
              style={{
                left: p.left,
                top: p.top,
              }}
              animate={{
                opacity: [0.2, 0.7, 0.2],
                scale: [1, 1.5, 1],
                y: [0, -20, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
