"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { socialLinks as socialData } from "../data/portfolio-data";

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Github,
  Linkedin,
  Mail,
};

const socialLinks = socialData.map((link) => ({
  icon: iconMap[link.icon] || Mail,
  href: link.url,
  label: link.name,
}));

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative bg-gray-950 text-gray-400 border-t border-gray-800/60"
      >
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            {/* Name / Logo */}
            <div className="text-center md:text-left">
              <a href="#" className="text-xl font-bold tracking-tight text-white font-[family-name:var(--font-heading)]">
                Pintu Kumar
              </a>
              <p className="mt-1 text-sm text-gray-500">
                Full Stack Software Developer
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <MagneticButton
                  key={label}
                  as="a"
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  strength={0.3}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800/60 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                >
                  <Icon size={18} />
                </MagneticButton>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

          {/* Copyright */}
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Pintu Kumar. All rights reserved.
          </p>
        </div>
      </motion.footer>

      {/* Floating scroll-to-top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-shadow cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
