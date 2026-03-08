"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GitCommit, GitPullRequest, Star, GitFork, ExternalLink } from "lucide-react";
import GitHubHeatmap from "./GitHubHeatmap";

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: {
    commits?: { message: string }[];
    action?: string;
    ref_type?: string;
  };
}

const eventIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  PushEvent: GitCommit,
  PullRequestEvent: GitPullRequest,
  WatchEvent: Star,
  ForkEvent: GitFork,
};

const eventLabels: Record<string, (e: GitHubEvent) => string> = {
  PushEvent: (e) => {
    const msg = e.payload.commits?.[0]?.message || "pushed code";
    return msg.length > 60 ? msg.slice(0, 57) + "..." : msg;
  },
  PullRequestEvent: (e) => `${e.payload.action || "opened"} a pull request`,
  WatchEvent: () => "starred",
  ForkEvent: () => "forked",
  CreateEvent: (e) => `created ${e.payload.ref_type || "repository"}`,
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function GitHubActivity() {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    fetch("https://api.github.com/users/pintu544/events/public?per_page=6")
      .then((res) => res.json())
      .then((data: GitHubEvent[]) => {
        const filtered = data
          .filter((e) => ["PushEvent", "PullRequestEvent", "WatchEvent", "ForkEvent", "CreateEvent"].includes(e.type))
          .slice(0, 6);
        setEvents(filtered);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [isInView]);

  if (!loading && events.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gray-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center justify-between"
        >
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <GitCommit className="h-5 w-5 text-green-400" />
            Recent Activity
          </h3>
          <a
            href="https://github.com/pintu544"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            View GitHub
            <ExternalLink className="h-3 w-3" />
          </a>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {events.map((event, index) => {
              const Icon = eventIcons[event.type] || GitCommit;
              const label = eventLabels[event.type]?.(event) || event.type;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/5 hover:border-white/10 transition-all duration-300"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">
                      {event.repo.name.split("/")[1] || event.repo.name}
                    </p>
                    <p className="text-sm text-gray-300 truncate">{label}</p>
                    <p className="text-[10px] text-gray-600 mt-1">
                      {timeAgo(event.created_at)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Contribution Heatmap */}
        <GitHubHeatmap />
      </div>
    </section>
  );
}
