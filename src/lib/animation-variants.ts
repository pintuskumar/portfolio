import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion animation variants used across multiple components.
 *
 * Extracted from: About, Experience, Education, Hero, Contact
 */

// ---------------------------------------------------------------------------
// Container variants – stagger children into view
// Used in: About, Experience, Education, Contact, Hero
// ---------------------------------------------------------------------------

/**
 * Factory for container variants with configurable stagger and delay.
 */
export function createContainerVariants(
  staggerChildren = 0.15,
  delayChildren = 0.2,
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren, delayChildren },
    },
  };
}

/** Default container – stagger 0.15, delay 0.2 (About, Contact) */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// ---------------------------------------------------------------------------
// Item variants – simple fade-up
// Used in: About, Contact (identical definitions)
// ---------------------------------------------------------------------------

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

// ---------------------------------------------------------------------------
// Fade-up variants with a custom delay parameter
// Used in: Hero (greeting badge, typing role, tagline, CTAs, social links)
// ---------------------------------------------------------------------------

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  }),
};

// ---------------------------------------------------------------------------
// Card variants with spring physics
// Used in: Education (cardVariants), Experience (cardVariants – same spring config)
// ---------------------------------------------------------------------------

/** Spring config shared by Experience and Education card animations. */
const springTransition = {
  type: "spring" as const,
  stiffness: 60,
  damping: 16,
  duration: 0.8,
} as const;

/** Vertical card entrance – fade + slide up (Education) */
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

/**
 * Directional card entrance – fade + slide from left or right (Experience).
 * Returns a Variants-compatible object; call with "left" or "right".
 */
export const directionalCardVariants = (direction: "left" | "right"): Variants => ({
  hidden: {
    opacity: 0,
    x: direction === "left" ? -80 : 80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: springTransition,
  },
});
