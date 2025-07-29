'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Briefcase, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface JobDescriptionInputProps {
  onJobAnalyzed: (jobData: { title: string; company: string; content: string; requirements: string[] }) => void
}

export default function JobDescriptionInput({ onJobAnalyzed }: JobDescriptionInputProps) {
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [description, setDescription] = useState('')
  const [analyzing, setAnalyzing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!jobTitle.trim() || !description.trim()) {
      toast.error('Please fill in the job title and description')
      return
    }

    setAnalyzing(true)
    try {
      const response = await fetch('/api/job/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: jobTitle,
          company: company || 'Not specified',
          content: description
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze job description')
      }

      const jobData = await response.json()
      onJobAnalyzed(jobData)
      toast.success('Job description analyzed successfully!')
    } catch (error) {
      toast.error('Failed to analyze job description. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Job Description</CardTitle>
        <CardDescription>
          Enter the job details to get tailored resume suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                placeholder="e.g., Senior Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                disabled={analyzing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                placeholder="e.g., Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={analyzing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Paste the complete job description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
              className="min-h-[250px]"
              required
              disabled={analyzing}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={analyzing || !jobTitle.trim() || !description.trim()}
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Job Description...
              </>
            ) : (
              <>
                <Briefcase className="w-4 h-4 mr-2" />
                Analyze & Get Suggestions
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}