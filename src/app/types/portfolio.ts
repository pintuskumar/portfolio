export interface Skill {
  name: string
  level: number
  category: "Frontend" | "Backend" | "DevOps" | "Tools"
}

export interface Experience {
  id: string
  company: string
  role: string
  duration: string
  startDate: string
  endDate: string
  description: string
  achievements: string[]
  technologies: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured?: boolean
  image?: string
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  duration: string
  achievements?: string[]
}

export interface SocialLink {
  name: string
  url: string
  icon: string
}

export interface CertificateLink {
  name: string
  provider: string
  url: string
  icon: string
}
