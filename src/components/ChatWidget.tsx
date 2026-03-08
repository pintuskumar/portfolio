"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

let messageIdCounter = 0;
function createMessage(role: "user" | "assistant", content: string): Message {
  return { id: `msg-${++messageIdCounter}`, role, content };
}

const INITIAL_MESSAGE: Message = createMessage(
  "assistant",
  "Hi! I'm Pintu's AI assistant. Ask me anything about his skills, experience, projects, or education!"
);

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = createMessage("user", input.trim());
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages
            .filter((m) => m !== INITIAL_MESSAGE)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMsg = createMessage("assistant", "");
      setMessages((prev) => [...prev, assistantMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantContent += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: assistantContent,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage("assistant", "Sorry, I couldn't process that. Please try again."),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setIsOpen(true)}
            style={{ cursor: "pointer" }}
            className="fixed bottom-20 right-4 sm:bottom-6 sm:right-20 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6" />
            {/* Pulse indicator */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-purple-500" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ cursor: "auto" }}
            className="chat-widget fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[9999] flex h-[calc(100dvh-6rem)] sm:h-[500px] w-full sm:w-[380px] sm:max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl border border-white/10 bg-gray-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl [&_*]:!cursor-auto"
          >
            {/* Header */}
            <div className="chat-header flex items-center justify-between border-b border-white/10 px-4 py-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20">
                  <Bot className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Ask about Pintu</p>
                  <p className="text-[10px] text-gray-400">AI-powered assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              data-lenis-prevent
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      msg.role === "user"
                        ? "bg-indigo-500/20"
                        : "bg-purple-500/20"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-3 w-3 text-indigo-400" />
                    ) : (
                      <Bot className="h-3 w-3 text-purple-400" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600/30 text-white"
                        : "bg-white/5 text-gray-300"
                    }`}
                  >
                    {msg.content || (
                      <span className="inline-flex items-center gap-1 text-gray-500">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Thinking...
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-white/10 px-3 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, projects..."
                disabled={isLoading}
                className="chat-input flex-1 rounded-lg bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none border border-white/10 focus:border-indigo-500/50 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white transition-all hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
