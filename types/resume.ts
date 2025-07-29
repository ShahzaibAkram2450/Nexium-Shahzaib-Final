export interface User {
  id: string
  email: string
  createdAt: Date
}

export interface Resume {
  id: string
  userId: string
  title: string
  content: ResumeContent
  originalContent?: string
  createdAt: Date
  updatedAt: Date
}

export interface ResumeContent {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    linkedin?: string
    portfolio?: string
  }
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: string[]
  certifications?: string[]
}

export interface ExperienceItem {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string[]
  location?: string
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
}

export interface JobDescription {
  id: string
  userId: string
  title: string
  company: string
  content: string
  requirements: string[]
  createdAt: Date
}

export interface TailoringSession {
  id: string
  userId: string
  resumeId: string
  jobDescriptionId: string
  suggestions: ResumeSuggestions
  createdAt: Date
}

export interface ResumeSuggestions {
  summary: string[]
  experience: ExperienceSuggestion[]
  skills: string[]
  keywords: string[]
  matchScore: number
}

export interface ExperienceSuggestion {
  experienceId: string
  suggestedDescription: string[]
  reasoning: string
}