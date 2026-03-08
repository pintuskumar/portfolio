"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  GitCommit, GitPullRequest, Star, GitFork, ExternalLink,
  Github, Users, BookOpen, Activity, TrendingUp,
} from "lucide-react";
import GitHubHeatmap from "./GitHubHeatmap";

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string; url: string };
  created_at: string;
  payload: {
    commits?: { message: string }[];
    action?: string;
    ref_type?: string;
    size?: number;
  };
}

interface GitHubProfile {
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  bio: string | null;
}

const eventConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  label: (e: GitHubEvent) => string;
}> = {
  PushEvent: {
    icon: GitCommit,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10 ring-emerald-500/20",
    label: (e) => {
      const count = e.payload.size || e.payload.commits?.length || 1;
      const msg = e.payload.commits?.[0]?.message || "pushed code";
      const truncated = msg.length > 50 ? msg.slice(0, 47) + "..." : msg;
      return count > 1 ? `${count} commits: ${truncated}` : truncated;
    },
  },
  PullRequestEvent: {
    icon: GitPullRequest,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 ring-purple-500/20",
    label: (e) => `${e.payload.action || "opened"} a pull request`,
  },
  WatchEvent: {
    icon: Star,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10 ring-yellow-500/20",
    label: () => "starred repository",
  },
  ForkEvent: {
    icon: GitFork,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 ring-blue-500/20",
    label: () => "forked repository",
  },
  CreateEvent: {
    icon: Activity,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10 ring-cyan-500/20",
    label: (e) => `created ${e.payload.ref_type || "repository"}`,
  },
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function StatCard({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      whileHover={{ y: -2 }}
      className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-sm"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
        <Icon className="h-5 w-5 text-emerald-400" />
      </div>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
      </div>
    </motion.div>
  );
}

export default function GitHubActivity() {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    Promise.all([
      fetch("https://api.github.com/users/pintu544/events/public?per_page=15")
        .then((r) => r.json())
        .catch(() => []),
      fetch("https://api.github.com/users/pintu544")
        .then((r) => r.json())
        .catch(() => null),
    ]).then(([eventsData, profileData]) => {
      const filtered = (eventsData as GitHubEvent[])
        .filter((e) => Object.keys(eventConfig).includes(e.type))
        .slice(0, 10);
      setEvents(filtered);
      if (profileData && !profileData.message) setProfile(profileData);
      setLoading(false);
    });
  }, [isInView]);

  const filteredEvents = activeFilter === "all"
    ? events
    : events.filter((e) => e.type === activeFilter);

  const eventTypes = ["all", ...new Set(events.map((e) => e.type))];

  const filterLabels: Record<string, string> = {
    all: "All",
    PushEvent: "Commits",
    PullRequestEvent: "PRs",
    WatchEvent: "Stars",
    ForkEvent: "Forks",
    CreateEvent: "Created",
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gray-950 py-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-emerald-500/3 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-cyan-500/3 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
            Open Source
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            GitHub{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Activity
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            My open source contributions and coding activity
          </p>
        </motion.div>

        {/* Profile stats */}
        {profile && (
          <div className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={BookOpen} label="Repositories" value={profile.public_repos} delay={0} />
            <StatCard icon={Users} label="Followers" value={profile.followers} delay={0.1} />
            <StatCard icon={TrendingUp} label="Following" value={profile.following} delay={0.2} />
            <StatCard
              icon={GitCommit}
              label="Recent Events"
              value={events.length}
              delay={0.3}
            />
          </div>
        )}

        {/* Contribution Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-10 rounded-2xl border border-white/5 bg-white/[0.02] p-5 sm:p-6 backdrop-blur-sm"
        >
          <GitHubHeatmap />
        </motion.div>

        {/* Activity feed header with filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" />
              Recent Activity
            </h3>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {eventTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                    activeFilter === type
                      ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                      : "bg-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {filterLabels[type] || type}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Events feed */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, index) => {
                const config = eventConfig[event.type] || eventConfig.CreateEvent;
                const Icon = config.icon;
                const label = config.label(event);
                const repoName = event.repo.name.split("/")[1] || event.repo.name;

                return (
                  <motion.a
                    key={event.id}
                    href={`https://github.com/${event.repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/5 hover:border-white/10 transition-all duration-300"
                  >
                    {/* Event icon */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${config.bgColor}`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-white truncate">
                          {repoName}
                        </span>
                        <ExternalLink className="h-3 w-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                      <p className="text-sm text-gray-400 truncate leading-relaxed">
                        {label}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${config.bgColor} ${config.color}`}>
                          {filterLabels[event.type] || event.type}
                        </span>
                        <span className="text-[10px] text-gray-600">
                          {timeAgo(event.created_at)}
                        </span>
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* View GitHub CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <a
            href="https://github.com/pintu544"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
          >
            <Github className="h-5 w-5" />
            View Full GitHub Profile
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
