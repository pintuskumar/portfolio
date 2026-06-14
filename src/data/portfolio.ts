import {
  Database, Terminal, GitBranch, Layout, Server, Cpu, Globe,
  Award, Trophy, Star, Code, Layers,
} from "lucide-react";

export const NAV_LINKS = [
  { label: "about", href: "#about", key: "1" },
  { label: "skills", href: "#skills", key: "2" },
  { label: "experience", href: "#experience", key: "3" },
  { label: "achievements", href: "#achievements", key: "4" },
  { label: "blog", href: "#blog", key: "5" },
  { label: "projects", href: "#projects", key: "6" },
  { label: "contact", href: "#contact", key: "7" },
];

export const HERO_COMMANDS = [
  { cmd: "whoami", output: "Pintu Kumar" },
  { cmd: "cat role.txt", output: "Full Stack Developer · Backend Engineer · Frontend Architect" },
  { cmd: "pwd", output: "/india" },
];

export const PROFILE = {
  name: "Pintu Kumar",
  location: "India",
  photo: "/photo.jpg",
  linkedin: "https://linkedin.com/in/pintukumar12",
  github: "https://github.com/pintu544",
  about: "Full Stack Developer with 3+ years of experience building scalable web applications using React, TypeScript, Node.js, and PostgreSQL. Skilled in API design, secure authentication (OAuth 2.0/JWT), cloud deployment, and performance optimization for production systems across healthcare, logistics, e-commerce, and security domains.",
  followers: 500,
  connections: 500,
  projects: 5,
};

export const EDUCATION = [
  { degree: "B.Tech in Computer Science and Engineering", school: "Kurukshetra University", year: "2018 – 2022", hash: "b7c3e41" },
  { degree: "Higher Secondary (XII) — Science", school: "P.N. College, Parsa, Bihar", year: "2017", hash: "d9f2a18" },
  { degree: "Secondary (X)", school: "High School, Parsa, Bihar", year: "2015", hash: "e4b6c03" },
];

export const SKILLS = [
  { name: "React", level: 95, icon: Code, category: "Frontend", relatedProjects: ["Realtime Notes", "Blog Platform", "AI Chat Fusion", "Stock Tracker", "StayFinder"] },
  { name: "TypeScript", level: 90, icon: Code, category: "Frontend", relatedProjects: ["Stock Tracker", "Realtime Notes"] },
  { name: "JavaScript (ES6+)", level: 95, icon: Terminal, category: "Frontend", relatedProjects: ["Blog Platform", "AI Chat Fusion", "StayFinder"] },
  { name: "Next.js", level: 85, icon: Layers, category: "Frontend", relatedProjects: ["Realtime Notes"] },
  { name: "Tailwind CSS", level: 95, icon: Layout, category: "Frontend", relatedProjects: ["AI Chat Fusion", "StayFinder", "Stock Tracker"] },
  { name: "Node.js", level: 85, icon: Server, category: "Backend", relatedProjects: ["Realtime Notes", "Blog Platform", "AI Chat Fusion"] },
  { name: "Express.js", level: 80, icon: Server, category: "Backend", relatedProjects: ["Blog Platform", "AI Chat Fusion"] },
  { name: "PostgreSQL", level: 85, icon: Database, category: "Backend", relatedProjects: ["Realtime Notes"] },
  { name: "MongoDB", level: 75, icon: Database, category: "Backend", relatedProjects: ["Blog Platform", "AI Chat Fusion"] },
  { name: "REST APIs", level: 85, icon: Globe, category: "Backend", relatedProjects: ["Blog Platform", "Realtime Notes"] },
  { name: "Socket.io", level: 75, icon: Cpu, category: "Backend", relatedProjects: ["Realtime Notes", "AI Chat Fusion"] },
  { name: "Docker", level: 80, icon: Terminal, category: "DevOps", relatedProjects: ["Realtime Notes", "Blog Platform"] },
  { name: "AWS", level: 75, icon: Globe, category: "DevOps", relatedProjects: ["Realtime Notes"] },
  { name: "CI/CD", level: 70, icon: Terminal, category: "DevOps", relatedProjects: ["Realtime Notes", "Blog Platform"] },
  { name: "Git & GitHub", level: 90, icon: GitBranch, category: "Tools", relatedProjects: ["All projects"] },
  { name: "Postman", level: 85, icon: Terminal, category: "Tools", relatedProjects: ["Blog Platform", "Realtime Notes"] },
];

export const EXPERIENCE = [
  {
    position: "Full Stack Developer", company: "Secure Access Tech Pvt Ltd", duration: "Jun 2025 – Present",
    branch: "main", hash: "a1b2c3d",
    summary: "Delivered features for Chetak ERP and led full-stack development of security-driven enterprise modules. Architected microservices supporting 10K+ daily active users. Implemented OAuth 2.0 and JWT-based authentication, reducing access vulnerabilities by ~40%.",
  },
  {
    position: "Full Stack Developer", company: "Shypbuddy India Pvt Ltd", duration: "Dec 2024 – Jun 2025",
    branch: "feature/shypbuddy", hash: "e4f5g6h",
    summary: "Built core modules for ShypBuddy Shipping Aggregator to streamline shipment workflows and logistics automation. Developed real-time tracking dashboards using WebSockets. Built and optimized REST APIs serving 50K+ requests/day with 99.9% uptime.",
  },
  {
    position: "Full Stack Developer", company: "Vigrous Healthcare Pvt Ltd", duration: "May 2024 – Dec 2024",
    branch: "feature/healthcare", hash: "i7j8k9l",
    summary: "Contributed to Chikitsa.io healthcare platform with a focus on secure and compliant data workflows. Built role-based patient management workflows with restricted data access controls. Implemented HIPAA-aligned encryption patterns for API and data storage layers.",
  },
  {
    position: "Web Developer", company: "Dakshit Technologies Pvt Ltd", duration: "May 2023 – May 2024",
    branch: "feature/web-dev", hash: "m0n1o2p",
    summary: "Developed client web applications and e-commerce portals in Agile delivery environments. Delivered 5+ e-commerce portals with payment and cart functionality. Improved SEO performance, driving ~200% growth in organic traffic for multiple clients.",
  },
];

export const ACHIEVEMENTS = [
  { title: "Udacity Scholarship Program (x2)", issuer: "Udacity", year: "2022", icon: Trophy, file: "udacity_scholarship.pdf" },
  { title: "12+ Certification Courses", issuer: "Udacity & Online Platforms", year: "2022", icon: Award, file: "certifications.pdf" },
  { title: "MERN Stack Developer", issuer: "Coding Ninjas", year: "2023", icon: Award, file: "mern_cert.pdf" },
  { title: "AI Associate", issuer: "DataCamp", year: "2024", icon: Star, file: "ai_associate.pdf" },
];

export const PROJECTS = [
  {
    slug: "realtime-notes",
    title: "Realtime Notes Application",
    description: "Comprehensive note lifecycle management with real-time sync via Socket.io. Features JWT authentication, bcrypt hashing, input validation, Helmet.js security headers, searchable dashboard, and user profile management.",
    tags: ["Next.js", "Material UI", "Node.js", "Express.js", "MongoDB", "Socket.io"],
    category: "Web",
    github: "https://github.com/pintu544/notes-application",
    live: "https://notes-taking-applications.netlify.app",
    featured: true,
    role: "Full-stack Developer",
    duration: "3 months",
    longDescription: "A full-featured note-taking application with real-time synchronization built on Socket.io. The backend uses Node.js and Express with MongoDB for persistence, JWT authentication, bcrypt password hashing, and Helmet.js security headers. The frontend is built with Next.js and Material UI, featuring a searchable dashboard, user profile management, and live updates across connected clients.",
    problem: "Users needed a secure, real-time note-taking app that syncs instantly across devices while maintaining data privacy and strong authentication.",
    approach: "Built a Node.js + Express backend with MongoDB, layered with JWT auth and Socket.io for real-time sync. The Next.js frontend uses React-Query for data fetching and Material UI for a polished, accessible interface. Security hardening includes bcrypt hashing, input validation, and Helmet.js headers.",
    techDecisions: [
      { tech: "Next.js", reason: "SSR and file-based routing for fast, SEO-friendly pages." },
      { tech: "Socket.io", reason: "Bidirectional real-time sync with minimal latency." },
      { tech: "MongoDB", reason: "Flexible schema for varied note structures." },
      { tech: "React-Query", reason: "Efficient caching and background refetching for note data." },
    ],
    outcomes: [
      "Real-time sync across devices with sub-200ms latency.",
      "JWT + bcrypt authentication with zero security incidents.",
      "Searchable dashboard handling 1000+ notes per user.",
    ],
    metrics: [
      { label: "sync latency", value: "<200ms" },
      { label: "auth security", value: "JWT+bcrypt" },
      { label: "notes per user", value: "1000+" },
    ],
    screenshots: [
      { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=75&auto=format", alt: "Notes dashboard overview", caption: "Dashboard — searchable notes at a glance." },
      { src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=75&auto=format", alt: "Real-time editing", caption: "Real-time collaborative editing." },
      { src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=75&auto=format", alt: "User profile management", caption: "User profile and settings." },
    ],
  },
  {
    slug: "blog-platform",
    title: "Full-Stack Blog Platform",
    description: "JWT-secured MERN blogging system with robust authentication, CRUD publishing, categories, search functionality, and user profile pages.",
    tags: ["React", "Node.js", "Express", "MongoDB", "JWT", "bcrypt"],
    category: "Web",
    github: "https://github.com/pintu544/Blog-App-Backend-Node",
    live: "https://my-blog-app-testing.netlify.app",
    featured: true,
    role: "Full-stack Developer",
    duration: "2 months",
    longDescription: "A full-featured MERN stack blogging platform with JWT-based authentication. Supports CRUD operations for blog posts, category-based organization, full-text search, and user profile pages. Token-based auth with local storage provides seamless session management across page reloads.",
    problem: "Content creators needed a simple, self-hosted blogging platform with secure authentication and organized content management without relying on third-party services.",
    approach: "Built a Node.js + Express API with MongoDB for post storage and JWT for auth. The React frontend provides a rich editing experience with category tagging, search, and responsive post rendering. Bcrypt secures all passwords and sensitive data.",
    techDecisions: [
      { tech: "MongoDB", reason: "Flexible document model for varied blog post structures." },
      { tech: "JWT", reason: "Stateless authentication scales without session stores." },
      { tech: "React", reason: "Component-based UI for reusable blog widgets." },
      { tech: "Express", reason: "Lightweight routing and middleware for the REST API." },
    ],
    outcomes: [
      "Full CRUD with JWT auth and zero data leaks.",
      "Category-based search reduced content discovery time by ~60%.",
      "Token-based sessions survived page reloads seamlessly.",
    ],
    metrics: [
      { label: "auth method", value: "JWT" },
      { label: "search speed", value: "+60%" },
      { label: "uptime", value: "99.9%" },
    ],
    screenshots: [
      { src: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=75&auto=format", alt: "Blog platform homepage", caption: "Homepage with featured posts." },
      { src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=900&q=75&auto=format", alt: "Blog editor", caption: "Rich text editor for publishing." },
    ],
  },
  {
    slug: "ai-chat-fusion",
    title: "AI Chat Fusion Platform",
    description: "Unified interface to interact with multiple AI models simultaneously with local chat history, syntax highlighting, and different query modes.",
    tags: ["React", "Express", "MongoDB", "Tailwind", "Node.js"],
    category: "Web",
    github: "",
    live: "https://multi-ais-chats.netlify.app",
    featured: true,
    role: "Full-stack Developer",
    duration: "2 months",
    longDescription: "A unified chat interface that lets users interact with multiple AI models side-by-side. Features include local chat history persistence, syntax highlighting for code responses, different query modes (compare, cascade, parallel), and a clean Tailwind-styled UI.",
    problem: "Developers often switch between ChatGPT, Claude, and other AI tools to compare responses. No single interface allowed side-by-side comparison or unified history.",
    approach: "Built a React frontend with Tailwind for a clean, responsive UI. The Express backend proxies requests to multiple AI APIs with a unified interface. MongoDB stores chat history locally, and syntax highlighting makes code responses readable.",
    techDecisions: [
      { tech: "React", reason: "Component model handles multiple chat panels efficiently." },
      { tech: "Express", reason: "Simple proxy layer to unify multiple AI API endpoints." },
      { tech: "MongoDB", reason: "Flexible storage for varied chat message formats." },
      { tech: "Tailwind", reason: "Rapid UI iteration for the multi-panel layout." },
    ],
    outcomes: [
      "Side-by-side AI comparison reduced decision time by ~50%.",
      "Local history persists across sessions without accounts.",
      "Syntax highlighting improved code readability in responses.",
    ],
    metrics: [
      { label: "AI models", value: "3+" },
      { label: "query modes", value: "3" },
      { label: "response time", value: "<2s" },
    ],
    screenshots: [
      { src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=75&auto=format", alt: "AI Chat Fusion multi-model interface", caption: "Multi-model chat interface." },
      { src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=75&auto=format", alt: "Code syntax highlighting", caption: "Syntax-highlighted code responses." },
    ],
  },
  {
    slug: "stock-portfolio-tracker",
    title: "Real-Time Stock Portfolio Tracker",
    description: "Dashboard providing live stock metrics, profit/loss analysis, sector insights, auto data refresh and investment performance analytics.",
    tags: ["TypeScript", "React", "Recharts", "TanStack Table", "Yahoo Finance API"],
    category: "Data",
    github: "https://github.com/pintu544/stock_dashboard",
    live: "https://stock-dashbaord-pro.vercel.app",
    featured: true,
    role: "Frontend Engineer",
    duration: "6 weeks",
    longDescription: "A real-time stock portfolio dashboard built with TypeScript and React. Features include live stock metrics via Yahoo Finance API, profit/loss analysis with interactive Recharts visualizations, sector-wise insights, auto-refreshing data, and comprehensive investment performance analytics using TanStack Table.",
    problem: "Investors needed a single dashboard to track portfolio performance in real-time without switching between brokerage apps and financial sites.",
    approach: "Built a TypeScript + React app pulling live data from Yahoo Finance API. Recharts renders interactive charts for P/L analysis, while TanStack Table provides sortable, filterable stock listings. Auto-refresh keeps data current without manual intervention.",
    techDecisions: [
      { tech: "TypeScript", reason: "Type safety for financial data structures prevents costly bugs." },
      { tech: "Recharts", reason: "React-native charting with smooth real-time updates." },
      { tech: "TanStack Table", reason: "Headless table logic for complex stock listings." },
      { tech: "Yahoo Finance", reason: "Free, reliable API for real-time market data." },
    ],
    outcomes: [
      "Real-time portfolio updates every 30 seconds.",
      "P/L visualization helped users make faster trade decisions.",
      "Sector insights exposed concentration risks automatically.",
    ],
    metrics: [
      { label: "refresh interval", value: "30s" },
      { label: "stocks tracked", value: "100+" },
      { label: "chart types", value: "5" },
    ],
    screenshots: [
      { src: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&q=75&auto=format", alt: "Stock dashboard overview", caption: "Portfolio overview with live metrics." },
      { src: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=900&q=75&auto=format", alt: "P/L analysis charts", caption: "Profit/loss analysis with Recharts." },
    ],
  },
  {
    slug: "stayfinder",
    title: "StayFinder — Property Rental Platform",
    description: "Frontend booking platform inspired by Airbnb with searchable catalog, dynamic cards, location filters and responsive mobile-first UI.",
    tags: ["React", "Vite", "Tailwind CSS", "JavaScript ES6"],
    category: "Web",
    github: "https://github.com/pintu544/StayFinder-frontend",
    live: "https://stayfinders.netlify.app",
    featured: false,
    role: "Frontend Developer",
    duration: "6 weeks",
    longDescription: "A frontend property rental platform inspired by Airbnb. Built with React and Vite for fast development, featuring a searchable property catalog, dynamic card layouts, location-based filtering, and a responsive mobile-first UI styled with Tailwind CSS.",
    problem: "Users browsing rental properties needed a fast, filterable, mobile-friendly interface to discover and compare stays without the overhead of a full backend.",
    approach: "Built a React + Vite frontend consuming a property data API. Tailwind CSS powers the responsive, mobile-first design. Location filters and search reduce the catalog to relevant results instantly. Dynamic cards show key property info at a glance.",
    techDecisions: [
      { tech: "Vite", reason: "Sub-second HMR and fast builds for rapid iteration." },
      { tech: "React", reason: "Component reuse for property cards and filters." },
      { tech: "Tailwind", reason: "Utility-first CSS for responsive mobile-first layout." },
    ],
    outcomes: [
      "Searchable catalog with instant filter results.",
      "Mobile-first responsive design across all breakpoints.",
      "Sub-2s initial page load with Vite optimization.",
    ],
    metrics: [
      { label: "page load", value: "<2s" },
      { label: "properties", value: "50+" },
      { label: "filter types", value: "4" },
    ],
    screenshots: [
      { src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=75&auto=format", alt: "StayFinder property listing", caption: "Property catalog with dynamic cards." },
      { src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=75&auto=format", alt: "StayFinder mobile view", caption: "Mobile-first responsive layout." },
    ],
  },
];

export const TESTIMONIALS = [
  { name: "Senior Lead", role: "Tech Lead @ Secure Access Tech", text: "Pintu architected microservices that handle 10K+ daily users flawlessly. His OAuth 2.0 implementation reduced our access vulnerabilities significantly.", avatar: "SL" },
  { name: "Project Manager", role: "PM @ Shypbuddy India", text: "His real-time tracking dashboards transformed our logistics operations. The WebSocket integration was seamless and the API reliability was outstanding.", avatar: "PM" },
  { name: "Tech Lead", role: "Lead Developer @ Vigrous Healthcare", text: "Pintu's HIPAA-aligned encryption patterns and role-based access controls set a new standard for our healthcare platform's security posture.", avatar: "TL" },
];

export const BRANCH_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  main: { text: "text-terminal-green", bg: "bg-terminal-green/10", border: "border-terminal-green/30" },
  "feature/shypbuddy": { text: "text-terminal-blue", bg: "bg-terminal-blue/10", border: "border-terminal-blue/30" },
  "feature/healthcare": { text: "text-terminal-purple", bg: "bg-terminal-purple/10", border: "border-terminal-purple/30" },
  "feature/web-dev": { text: "text-terminal-yellow", bg: "bg-terminal-yellow/10", border: "border-terminal-yellow/30" },
};

export const LEARNING_ITEMS = [
  "GraphQL", "Kubernetes", "Terraform", "Redis", "Rust", "WebSockets",
  "Next.js 14", "tRPC", "Prisma", "Microservices", "System Design", "OAuth 2.0",
];

export const KONAMI_CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export const BLOG_POSTS = [
  {
    title: "Building Scalable REST APIs with Node.js and Express — A Production Guide",
    date: "2024-11-15",
    readingTime: "7 min read",
    tags: ["Node.js", "Express", "API"],
    excerpt: "A comprehensive guide to building production-ready REST APIs with proper error handling, rate limiting, authentication, and deployment strategies.",
  },
  {
    title: "Real-Time Features with Socket.io — From Chat Apps to Live Dashboards",
    date: "2024-09-22",
    readingTime: "5 min read",
    tags: ["Socket.io", "WebSocket", "React"],
    excerpt: "How I implemented real-time synchronization across multiple applications using Socket.io, from note-taking apps to live tracking dashboards.",
  },
  {
    title: "JWT Authentication Best Practices in MERN Stack Applications",
    date: "2024-07-10",
    readingTime: "6 min read",
    tags: ["JWT", "Security", "MongoDB"],
    excerpt: "Token-based auth done right — refresh tokens, secure storage, revocation strategies, and common pitfalls I've encountered across multiple MERN projects.",
  },
  {
    title: "From E-Commerce to Healthcare — Lessons from 4 Full-Stack Roles",
    date: "2024-03-05",
    readingTime: "8 min read",
    tags: ["Career", "Full-Stack", "Lessons"],
    excerpt: "What I learned building web apps across e-commerce, healthcare, logistics, and enterprise security domains — patterns that transfer and gotchas that don't.",
  },
];

// Motion variants
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  }),
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const pageLoad = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};
