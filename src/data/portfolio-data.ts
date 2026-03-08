import type { Skill, Experience, Project, Education, SocialLink, CertificateLink } from "../types/portfolio"

export const skills: Skill[] = [
  { name: "React", level: 95, category: "Frontend" },
  { name: "TypeScript", level: 90, category: "Frontend" },
  { name: "JavaScript (ES6+)", level: 95, category: "Frontend" },
  { name: "Next.js", level: 85, category: "Frontend" },
  { name: "Tailwind CSS", level: 95, category: "Frontend" },
  { name: "Material UI", level: 80, category: "Frontend" },
  { name: "Redux", level: 80, category: "Frontend" },
  { name: "HTML/CSS", level: 95, category: "Frontend" },
  { name: "Node.js", level: 85, category: "Backend" },
  { name: "Express.js", level: 80, category: "Backend" },
  { name: "PostgreSQL", level: 85, category: "Backend" },
  { name: "MongoDB", level: 75, category: "Backend" },
  { name: "SQL", level: 80, category: "Backend" },
  { name: "Socket.io", level: 75, category: "Backend" },
  { name: "Docker", level: 80, category: "DevOps" },
  { name: "AWS (EC2/S3/RDS)", level: 75, category: "DevOps" },
  { name: "Git", level: 90, category: "Tools" },
  { name: "GitHub", level: 90, category: "Tools" },
  { name: "Postman", level: 85, category: "Tools" },
  { name: "NPM", level: 85, category: "Tools" },
]

export const experiences: Experience[] = [
  {
    id: "secure-access-tech",
    company: "Secure Access Tech Pvt Ltd",
    role: "Full Stack Developer",
    duration: "Present",
    startDate: "2025-06",
    endDate: "Present",
    description:
      "Leading full-stack development initiatives for security-driven enterprise products, building scalable systems and cloud-ready web applications.",
    achievements: [
      "Architected microservices serving 10K+ daily active users across distributed infrastructure",
      "Integrated OAuth 2.0 and JWT authentication reducing access vulnerabilities by ~40%",
      "Improved database/API performance, reducing average load times by over 60%",
      "Led technical reviews and mentored junior developers on scalable design practices",
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "MongoDB", "AWS", "Docker", "Git"],
  },
  {
    id: "shypbuddy-india",
    company: "Shypbuddy India Pvt Ltd",
    role: "Full Stack Developer",
    duration: "6 months",
    startDate: "2024-12",
    endDate: "2025-06",
    description:
      "Built logistics automation systems enabling real-time shipment visibility and simplified operational workflows.",
    achievements: [
      "Developed real-time tracking dashboard with WebSockets powering live movement updates",
      "Created REST APIs serving 50K+ requests/day with 99.9% uptime",
      "Integrated FedEx & DHL APIs for automated rate and delivery calculations",
      "Implemented automated testing suite achieving ~85% coverage",
    ],
    technologies: ["React", "Node.js", "Express", "MongoDB", "Redis", "Git"],
  },
  {
    id: "vigrous-healthcare",
    company: "Vigrous Healthcare Pvt Ltd",
    role: "Full Stack Developer",
    duration: "7 months",
    startDate: "2024-05",
    endDate: "2024-12",
    description:
      "Contributed to development of secure healthcare management solutions with compliance-focused data handling and rich UI workflows.",
    achievements: [
      "Built secure patient management system with RBAC roles & restricted data access",
      "Implemented HIPAA-aligned encryption flows for API and data storage",
      "Designed responsive appointment booking system reducing booking time by ~50%",
      "Collaborated with medical teams to design workflow-optimized UI layouts",
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "JWT", "Tailwind CSS", "Git"],
  },
  {
    id: "dakshit-tech",
    company: "Dakshit Technologies Pvt Ltd",
    role: "Web Developer",
    duration: "1 year",
    startDate: "2023-05",
    endDate: "2024-05",
    description:
      "Delivered responsive web solutions and e-commerce systems while practicing Agile SDLC and production deployments.",
    achievements: [
      "Developed 5+ e-commerce portals with integrated payments and cart flows",
      "Implemented custom CMS tools improving content publishing efficiency",
      "Improved SEO score resulting in ~200% increase in organic traffic for multiple clients",
      "Participated in sprints, standups, and collaborative release planning",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Git"],
  },
]

export const projects: Project[] = [
  {
    id: "realtime-notes",
    title: "Realtime-Notes Application",
    description:
      "Comprehensive note lifecycle management with real-time sync via Socket.io. Features JWT authentication, bcrypt hashing, input validation, Helmet.js security headers, searchable dashboard, and user profile management.",
    technologies: ["Next.js", "Material UI", "Node.js", "Express.js", "MongoDB", "React-Query", "Socket.io"],
    githubUrl: "https://github.com/pintu544/notes-application",
    liveUrl: "https://notes-taking-applications.netlify.app",
    featured: true,
  },
  {
    id: "blog-platform",
    title: "Full-Stack Blog Platform",
    description:
      "JWT-secured MERN blogging system with robust authentication, CRUD publishing, categories, search functionality, and user profile pages. Token-based auth with local storage for seamless sessions.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "JWT", "bcrypt"],
    githubUrl: "https://github.com/pintu544/Blog-App-Backend-Node",
    liveUrl: "https://my-blog-app-testing.netlify.app",
    featured: true,
  },
  {
    id: "ai-fusion",
    title: "AI Chat Fusion Platform",
    description:
      "Unified interface to interact with multiple AI models simultaneously with local chat history, syntax highlighting, and different query modes.",
    technologies: ["React", "Express", "MongoDB", "Tailwind", "Node.js"],
    liveUrl: "https://multi-ais-chat.netlify.app",
    featured: true,
  },
  {
    id: "portfolio-tracker",
    title: "Real-Time Stock Portfolio Tracker",
    description:
      "Dashboard providing live stock metrics, profit/loss analysis, sector insights, auto data refresh and investment performance analytics.",
    technologies: ["TypeScript", "React", "Recharts", "TanStack Table", "Yahoo Finance API", "Lucide React"],
    githubUrl: "https://github.com/pintu544/stock_dashboard",
    liveUrl: "https://stock-dashbaord-pro.vercel.app",
    featured: true,
  },
  {
    id: "stayfinder",
    title: "StayFinder - Property Rental Platform",
    description:
      "Frontend booking platform inspired by Airbnb with searchable catalog, dynamic cards, location filters and responsive mobile-first UI.",
    technologies: ["React", "Vite", "Tailwind CSS", "JavaScript ES6"],
    githubUrl: "https://github.com/pintu544/StayFinder-frontend",
    liveUrl: "https://stayfinders.netlify.app",
    featured: true,
  },
]

export const education: Education[] = [
  {
    id: "kurukshetra-btech",
    school: "Kurukshetra University",
    degree: "B.Tech",
    field: "Computer Science and Engineering",
    duration: "2018 - 2022",
    location: "Kurukshetra, HR",
    achievements: [
      "Cum. GPA: 8.1 / 10.0",
      "Completed multiple real-world web projects",
      "Actively participated in coding events",
    ],
  },
]

export const achievements = [
  "Selected twice for Udacity Scholarship Program",
  "Completed over 12 certification courses from Udacity online platforms",
]

export const socialLinks: SocialLink[] = [
  { name: "GitHub", url: "https://github.com/pintu544", icon: "Github" },
  { name: "LinkedIn", url: "https://linkedin.com/in/pintukumar12", icon: "Linkedin" },
  { name: "Email", url: "mailto:pksharmagh4@gmail.com", icon: "Mail" },
]

export const verifiedCertificateLinks: CertificateLink[] = [
  {
    name: "AI Associate",
    provider: "DataCamp",
    url: "https://www.datacamp.com/portfolio/pksharmagh4?view=true",
    icon: "DataCamp",
  },
  {
    name: "Career Camp - Web Developer Track",
    provider: "Coding Ninjas (Oct 2021 - Dec 2023)",
    url: "https://certificate.codingninjas.com/",
    icon: "CodingNinjas",
  },
  {
    name: "Full Stack Developer",
    provider: "Udacity",
    url: "https://confirm.udacity.com/",
    icon: "Udacity",
  },
]
