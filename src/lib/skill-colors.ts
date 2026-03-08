/**
 * Shared category color/gradient maps used by Skills.tsx and SkillGlobe.tsx.
 */

/** Tailwind gradient pairs for progress bars and highlights. */
export const categoryGradients: Record<string, string> = {
  Frontend: "from-blue-500 to-cyan-400",
  Backend: "from-green-500 to-emerald-400",
  DevOps: "from-orange-500 to-amber-400",
  Tools: "from-purple-500 to-violet-400",
};

/** Tailwind accent text color per category. */
export const categoryAccentText: Record<string, string> = {
  Frontend: "text-blue-400",
  Backend: "text-green-400",
  DevOps: "text-orange-400",
  Tools: "text-purple-400",
};

/** Tailwind ring color per category (used on skill cards). */
export const categoryRing: Record<string, string> = {
  Frontend: "ring-blue-500/30",
  Backend: "ring-green-500/30",
  DevOps: "ring-orange-500/30",
  Tools: "ring-purple-500/30",
};

/** Tailwind shadow/glow color per category. */
export const categoryGlow: Record<string, string> = {
  Frontend: "shadow-blue-500/20",
  Backend: "shadow-green-500/20",
  DevOps: "shadow-orange-500/20",
  Tools: "shadow-purple-500/20",
};

/** Hex colors per category (used in the 3D skill globe). */
export const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "#60a5fa",
  Backend: "#4ade80",
  DevOps: "#fb923c",
  Tools: "#a78bfa",
};
