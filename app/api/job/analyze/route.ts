import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { title, company, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Analyze job description and extract requirements
    const requirements = extractRequirements(content)
    const keywords = extractKeywords(content)

    return NextResponse.json({
      title,
      company,
      content,
      requirements,
      keywords,
      analysis: {
        experienceLevel: extractExperienceLevel(content),
        industry: extractIndustry(content),
        skills: extractRequiredSkills(content)
      }
    })
  } catch (error) {
    console.error('Job analysis error:', error)
    return NextResponse.json({ error: 'Failed to analyze job description' }, { status: 500 })
  }
}

function extractRequirements(content: string): string[] {
  const requirements = []
  const lines = content.split('\n').map(line => line.trim()).filter(Boolean)
  
  let inRequirementsSection = false
  const requirementKeywords = ['requirements', 'qualifications', 'skills', 'experience', 'must have']
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase()
    
    // Check if we're entering a requirements section
    if (requirementKeywords.some(keyword => lowerLine.includes(keyword))) {
      inRequirementsSection = true
      continue
    }
    
    // Check if we're leaving the section
    if (inRequirementsSection && (
      lowerLine.includes('responsibilities') ||
      lowerLine.includes('benefits') ||
      lowerLine.includes('what we offer')
    )) {
      break
    }
    
    // Extract requirement items
    if (inRequirementsSection) {
      if (line.startsWith('•') || line.startsWith('-') || line.match(/^\d+\./)) {
        requirements.push(line.replace(/^[•\-\d\.]\s*/, '').trim())
      } else if (line.length > 10 && line.includes('experience')) {
        requirements.push(line)
      }
    }
  }
  
  return requirements
}

function extractKeywords(content: string): string[] {
  const techKeywords = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
    'TypeScript', 'HTML', 'CSS', 'Git', 'MongoDB', 'PostgreSQL', 'REST API',
    'GraphQL', 'Kubernetes', 'CI/CD', 'Agile', 'Scrum', 'Machine Learning',
    'AI', 'DevOps', 'Cloud', 'Microservices', 'Angular', 'Vue.js', 'Express'
  ]
  
  const softSkills = [
    'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
    'creative', 'detail-oriented', 'collaborative', 'self-motivated'
  ]
  
  const allKeywords = [...techKeywords, ...softSkills]
  const contentLower = content.toLowerCase()
  
  return allKeywords.filter(keyword => 
    contentLower.includes(keyword.toLowerCase())
  )
}

function extractExperienceLevel(content: string): string {
  const contentLower = content.toLowerCase()
  
  if (contentLower.includes('senior') || contentLower.includes('lead') || contentLower.includes('principal')) {
    return 'Senior'
  } else if (contentLower.includes('mid') || contentLower.includes('intermediate')) {
    return 'Mid-Level'
  } else if (contentLower.includes('junior') || contentLower.includes('entry') || contentLower.includes('associate')) {
    return 'Junior'
  }
  
  return 'Not specified'
}

function extractIndustry(content: string): string {
  const industries = {
    'fintech': ['finance', 'banking', 'payments', 'trading', 'investment'],
    'healthcare': ['medical', 'health', 'patient', 'clinical', 'pharmaceutical'],
    'ecommerce': ['retail', 'shopping', 'marketplace', 'commerce', 'store'],
    'saas': ['software', 'platform', 'cloud', 'subscription', 'enterprise'],
    'gaming': ['game', 'gaming', 'entertainment', 'mobile games'],
    'edtech': ['education', 'learning', 'student', 'academic', 'university']
  }
  
  const contentLower = content.toLowerCase()
  
  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some(keyword => contentLower.includes(keyword))) {
      return industry
    }
  }
  
  return 'Technology'
}

function extractRequiredSkills(content: string): string[] {
  const skillPatterns = [
    /(\d+\+?\s*years?\s+of\s+experience\s+with\s+[\w\s,]+)/gi,
    /(proficient\s+in\s+[\w\s,]+)/gi,
    /(experience\s+with\s+[\w\s,]+)/gi,
    /(knowledge\s+of\s+[\w\s,]+)/gi
  ]
  
  const skills: string[] = []
  
  for (const pattern of skillPatterns) {
    const matches = content.match(pattern)
    if (matches) {
      skills.push(...matches.map(match => match.trim()))
    }
  }
  
  return skills.slice(0, 10) // Limit to top 10 matches
}