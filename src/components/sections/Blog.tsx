import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { BLOG_POSTS, fadeUp } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export function Blog() {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const closePreview = useCallback(() => setPreviewIndex(null), []);
  const trapRef = useFocusTrap<HTMLDivElement>(previewIndex !== null, closePreview);

  return (
    <Section id="blog">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          number="06"
          eyebrow="blog"
          title="writing & notes"
          accent="writing"
          meta="ls ~/blog/"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {BLOG_POSTS.map((post, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i + 1}
              className="group terminal-window terminal-window-hover block relative overflow-hidden cursor-pointer"
              onClick={() => setPreviewIndex(i)}
            >
              <div className="terminal-header">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
                <span className="text-xs text-muted-foreground font-mono ml-2">{post.date}</span>
                <span className="ml-auto text-[10px] text-muted-foreground font-mono">{post.readingTime}</span>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-mono text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {post.tags.map(tag => (
                    <span key={tag} className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                      {tag}
                    </span>
                  ))}
                  <ExternalLink size={10} className="ml-auto text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border/30">
                <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-primary to-accent transition-all duration-[1.5s] ease-out" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Article Preview Modal */}
      <AnimatePresence>
        {previewIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setPreviewIndex(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="terminal-window max-w-lg w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
              ref={trapRef}
              role="dialog"
              aria-modal="true"
              aria-label="Article preview"
            >
              <div className="terminal-header">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
                <span className="text-xs text-muted-foreground font-mono ml-2">
                  {BLOG_POSTS[previewIndex].date} · {BLOG_POSTS[previewIndex].readingTime}
                </span>
                <button onClick={() => setPreviewIndex(null)} className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
                  <X size={14} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="font-mono text-lg font-bold text-foreground leading-snug">
                  {BLOG_POSTS[previewIndex].title}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {BLOG_POSTS[previewIndex].tags.map(tag => (
                    <span key={tag} className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  {BLOG_POSTS[previewIndex].excerpt}
                </p>
                <div className="pt-4 border-t border-border flex justify-end">
                  <Button size="sm" className="font-mono text-xs gap-2" asChild>
                    <a href="#" target="_blank" rel="noreferrer">
                      <ExternalLink size={12} /> Read on Medium
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
