import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Section, SectionHeading } from "./Section";
import { PROFILE, fadeUp } from "@/data/portfolio";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "portfolio_contact_visitor";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [messageLength, setMessageLength] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [returningVisitor, setReturningVisitor] = useState<{ name: string } | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout>();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setReturningVisitor(JSON.parse(stored));
    } catch {}
  }, []);

  // Esc to exit focus mode
  useEffect(() => {
    if (!focusMode) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocusMode(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focusMode]);

  const validate = (data: { email: string; subject: string; message: string; name: string }) => {
    const errs: Record<string, string> = {};
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "invalid email format";
    if (!data.subject.trim()) errs.subject = "subject required";
    if (data.subject.length > 200) errs.subject = "max 200 chars";
    if (!data.message.trim()) errs.message = "message body required";
    if (data.message.length > 2000) errs.message = "max 2000 chars";
    if (data.name.length > 100) errs.name = "max 100 chars";
    return errs;
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageLength(e.target.value.length);
    setIsTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setIsTyping(false), 1500);
  };

  const handleFocusIn = () => {
    setFocusMode(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current!;
    const formData = new FormData(form);
    const data = {
      name: (formData.get("name") as string || "").trim(),
      email: (formData.get("email") as string || "").trim(),
      subject: (formData.get("subject") as string || "").trim(),
      message: (formData.get("message") as string || "").trim(),
    };
    const errs = validate(data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      track("contact_validation_error", { fields: Object.keys(errs).join(",") });
      return;
    }
    setErrors({});
    setSending(true);
    track("contact_submit_attempt", { has_name: data.name.length > 0, message_length: data.message.length });
    const { error } = await supabase.from("contact_messages").insert({
      name: data.name || null, email: data.email, subject: data.subject, message: data.message,
    });
    setSending(false);
    if (error) {
      toast.error("Failed to send message. Please try again.");
      track("contact_submit_error", { code: error.code ?? "unknown" });
    } else {
      setSubmitted(true);
      setFocusMode(false);
      track("contact_submit_success");
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: data.name })); } catch {}
    }
  };

  const handleReset = () => {
    setSubmitted(false); setErrors({}); setMessageLength(0); setIsTyping(false);
    formRef.current?.reset();
  };

  return (
    <Section id="contact">
      <div className="max-w-lg mx-auto relative">
        {/* Focus mode overlay */}
        <AnimatePresence>
          {focusMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-background/70 backdrop-blur-[2px]"
              onClick={() => setFocusMode(false)}
            />
          )}
        </AnimatePresence>

        <div className={`relative ${focusMode ? "z-40" : ""}`}>
          <SectionHeading
            number="08"
            eyebrow="contact"
            title="let's talk"
            accent="talk"
            meta="mail -s 'hello'"
          />

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="terminal-window relative overflow-hidden">
                <div className="confetti-container">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="confetti-piece" style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 0.3}s`,
                      backgroundColor: `hsl(${[185, 38, 142, 270, 210][i % 5]} 70% 55%)`,
                    }} />
                  ))}
                </div>
                <div className="terminal-header">
                  <div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" />
                  <span className="text-xs text-muted-foreground font-mono ml-2">message sent</span>
                </div>
                <div className="p-8 text-center font-mono">
                  <div className="text-terminal-green text-2xl mb-2">✓</div>
                  <p className="text-foreground mb-1">Message delivered!</p>
                  <p className="text-xs text-muted-foreground mb-4">I'll get back to you soon.</p>
                  <Button onClick={handleReset} variant="outline" size="sm" className="font-mono text-xs gap-2"><Send size={12} /> Send another</Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" variants={fadeUp} custom={1} className={`terminal-window terminal-window-hover transition-shadow duration-300 ${focusMode ? "shadow-[0_0_60px_hsl(var(--primary)/0.1)] border-primary/30" : ""}`}>
                <div className="terminal-header">
                  <div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" />
                  <span className="text-xs text-muted-foreground font-mono ml-2">compose — new message</span>
                  <AnimatePresence>
                    {isTyping && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="ml-auto font-mono text-[10px] text-terminal-green flex items-center gap-1">
                        <span className="typing-dots">composing</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {focusMode && !isTyping && (
                    <span className="ml-auto font-mono text-[9px] text-muted-foreground/40">esc to exit focus</span>
                  )}
                </div>

                {returningVisitor && returningVisitor.name && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-4 pt-3 pb-0">
                    <div className="flex items-center gap-2 px-3 py-2 rounded bg-primary/5 border border-primary/10 font-mono text-xs text-primary">
                      <span>👋</span>
                      <span>Welcome back, {returningVisitor.name}!</span>
                    </div>
                  </motion.div>
                )}

                <form ref={formRef} onSubmit={handleSubmit} onFocus={handleFocusIn} className="p-4 space-y-0">
                  <div className="flex items-center border-b border-border py-2 input-focus-glow rounded-sm transition-shadow">
                    <span className="font-mono text-xs text-muted-foreground w-14">To:</span>
                    <span className="font-mono text-xs text-foreground">pintu@dev.io</span>
                  </div>
                  <div className="border-b border-border">
                    <div className="flex items-center py-2 input-focus-glow rounded-sm transition-shadow">
                      <span className="font-mono text-xs text-muted-foreground w-14">Name:</span>
                      <Input name="name" placeholder="Your name (optional)" defaultValue={returningVisitor?.name || ""}
                        className="bg-transparent border-0 h-auto py-0 px-0 font-mono text-xs focus-visible:ring-0 focus-visible:ring-offset-0" />
                    </div>
                    {errors.name && <p className="font-mono text-[10px] text-terminal-red pb-1 pl-14">⚠ {errors.name}</p>}
                  </div>
                  <div className="border-b border-border">
                    <div className="flex items-center py-2 input-focus-glow rounded-sm transition-shadow">
                      <span className="font-mono text-xs text-muted-foreground w-14">From:</span>
                      <Input name="email" placeholder="your@email.com" type="email" required className="bg-transparent border-0 h-auto py-0 px-0 font-mono text-xs focus-visible:ring-0 focus-visible:ring-offset-0" />
                    </div>
                    {errors.email && <p className="font-mono text-[10px] text-terminal-red pb-1 pl-14">⚠ {errors.email}</p>}
                  </div>
                  <div className="border-b border-border">
                    <div className="flex items-center py-2 input-focus-glow rounded-sm transition-shadow">
                      <span className="font-mono text-xs text-muted-foreground w-14">Subj:</span>
                      <Input name="subject" placeholder="Subject" required className="bg-transparent border-0 h-auto py-0 px-0 font-mono text-xs focus-visible:ring-0 focus-visible:ring-offset-0" />
                    </div>
                    {errors.subject && <p className="font-mono text-[10px] text-terminal-red pb-1 pl-14">⚠ {errors.subject}</p>}
                  </div>
                  <div>
                    <div className="input-focus-glow rounded-sm transition-shadow">
                      <Textarea name="message" placeholder="Write your message..." rows={5} required onChange={handleMessageChange}
                        className="bg-transparent border-0 font-mono text-xs resize-none mt-3 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-between">
                      {errors.message && <p className="font-mono text-[10px] text-terminal-red">⚠ {errors.message}</p>}
                      <p className={`font-mono text-[10px] ml-auto ${messageLength > 1800 ? "text-terminal-red" : "text-muted-foreground/50"}`}>{messageLength}/2000</p>
                    </div>
                  </div>
                  <div className="flex justify-end pt-3 border-t border-border mt-3">
                    <Button type="submit" disabled={sending} size="sm" variant="luxury" className="gap-2">
                      <motion.span animate={sending ? { x: [0, 5, 0], y: [0, -5, 0] } : {}} transition={{ duration: 0.5, repeat: sending ? Infinity : 0 }}>
                        <Send size={12} />
                      </motion.span>
                      {sending ? "sending..." : "send"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={fadeUp} custom={3} className="mt-6 flex justify-center gap-6">
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer"
              onClick={() => track("social_click", { network: "linkedin", surface: "contact" })}
              className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors"><Linkedin size={14} /> linkedin</a>
            <a href={PROFILE.github} target="_blank" rel="noreferrer"
              onClick={() => track("social_click", { network: "github", surface: "contact" })}
              className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"><Github size={14} /> github</a>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
