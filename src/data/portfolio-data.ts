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
  { name: "REST APIs", level: 85, category: "Backend" },
  { name: "Docker", level: 80, category: "DevOps" },
  { name: "AWS (EC2/S3/RDS)", level: 75, category: "DevOps" },
  { name: "CI/CD", level: 70, category: "DevOps" },
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
      "Delivered features for Chetak ERP and led full-stack development of security-driven enterprise modules.",
    achievements: [
      "Architected microservices supporting 10K+ daily active users across distributed infrastructure",
      "Implemented OAuth 2.0 and JWT-based authentication, reducing access vulnerabilities by ~40%",
      "Improved API reliability and maintainability through modular service design and code standards",
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
      "Built core modules for ShypBuddy Shipping Aggregator to streamline shipment workflows and logistics automation.",
    achievements: [
      "Developed real-time tracking dashboards using WebSockets for live shipment updates",
      "Built and optimized REST APIs serving 50K+ requests/day with 99.9% uptime",
      "Enhanced shipment visibility and operational efficiency through automation-focused features",
      "Integrated FedEx & DHL APIs for automated rate and delivery calculations",
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
      "Contributed to Chikitsa.io healthcare platform with a focus on secure and compliant data workflows.",
    achievements: [
      "Built role-based patient management workflows with restricted data access controls",
      "Implemented HIPAA-aligned encryption patterns for API and data storage layers",
      "Delivered responsive UI components for high-usage clinical and administrative screens",
      "Designed responsive appointment booking system reducing booking time by ~50%",
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
      "Developed client web applications and e-commerce portals in Agile delivery environments.",
    achievements: [
      "Delivered 5+ e-commerce portals with payment and cart functionality",
      "Improved SEO performance, driving ~200% growth in organic traffic for multiple clients",
      "Implemented custom CMS tools improving content publishing efficiency",
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
    liveUrl: "https://multi-ais-chats.netlify.app",
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
      "Score: 81.4%",
      "Completed multiple real-world web projects",
      "Actively participated in coding events",
    ],
  },
  {
    id: "pn-college-12th",
    school: "P.N. College, Parsa, Bihar",
    degree: "12th",
    field: "Science",
    duration: "2017",
    achievements: [
      "Score: 61.6%",
    ],
  },
  {
    id: "high-school-10th",
    school: "High School, Parsa, Bihar",
    degree: "10th",
    field: "General",
    duration: "2015",
    achievements: [
      "Score: 73.6%",
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
    name: "MERN Stack Developer",
    provider: "Coding Ninjas",
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
