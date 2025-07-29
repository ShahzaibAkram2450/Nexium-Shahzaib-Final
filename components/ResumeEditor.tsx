'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Save, Download, Plus, Minus, FileText } from 'lucide-react'
import { ResumeContent, ExperienceItem } from '@/types/resume'
import { toast } from 'sonner'

interface ResumeEditorProps {
  initialContent: ResumeContent
  resumeTitle: string
  onSave: (content: ResumeContent) => Promise<void>
}

export default function ResumeEditor({ initialContent, resumeTitle, onSave }: ResumeEditorProps) {
  const [content, setContent] = useState<ResumeContent>(initialContent)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setHasChanges(JSON.stringify(content) !== JSON.stringify(initialContent))
  }, [content, initialContent])

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(content)
      setHasChanges(false)
      toast.success('Resume saved successfully!')
    } catch (error) {
      toast.error('Failed to save resume. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: [''],
      location: ''
    }
    setContent(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }))
  }

  const removeExperience = (id: string) => {
    setContent(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }))
  }

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    setContent(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const addDescriptionPoint = (experienceId: string) => {
    setContent(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === experienceId
          ? { ...exp, description: [...exp.description, ''] }
          : exp
      )
    }))
  }

  const removeDescriptionPoint = (experienceId: string, index: number) => {
    setContent(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === experienceId
          ? { ...exp, description: exp.description.filter((_, i) => i !== index) }
          : exp
      )
    }))
  }

  const updateDescriptionPoint = (experienceId: string, index: number, value: string) => {
    setContent(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === experienceId
          ? {
              ...exp,
              description: exp.description.map((desc, i) => i === index ? value : desc)
            }
          : exp
      )
    }))
  }

  const addSkill = (skill: string) => {
    if (skill.trim() && !content.skills.includes(skill.trim())) {
      setContent(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }))
    }
  }

  const removeSkill = (index: number) => {
    setContent(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{resumeTitle}</h2>
          <p className="text-gray-600">Edit and customize your resume</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
          >
            {saving ? (
              <>
                <Save className="w-4 h-4 mr-2 animate-pulse" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-6">
          <ScrollArea className="h-[600px] pr-4">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={content.personalInfo.name}
                      onChange={(e) => setContent(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, name: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={content.personalInfo.email}
                      onChange={(e) => setContent(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value }
                      }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={content.personalInfo.phone}
                      onChange={(e) => setContent(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={content.personalInfo.location}
                      onChange={(e) => setContent(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, location: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={4}
                  value={content.summary}
                  onChange={(e) => setContent(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Write a compelling professional summary..."
                />
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Experience</CardTitle>
                  <Button size="sm" onClick={addExperience}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {content.experience.map((exp) => (
                  <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Job Title"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        />
                        <Input
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeExperience(exp.id)}
                        className="ml-2"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        placeholder="Start Date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      />
                      <Input
                        placeholder="End Date"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      />
                      <Input
                        placeholder="Location"
                        value={exp.location || ''}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Job Description</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addDescriptionPoint(exp.id)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Point
                        </Button>
                      </div>
                      {exp.description.map((desc, index) => (
                        <div key={index} className="flex space-x-2">
                          <Textarea
                            rows={2}
                            placeholder="Describe your achievement or responsibility..."
                            value={desc}
                            onChange={(e) => updateDescriptionPoint(exp.id, index, e.target.value)}
                            className="flex-1"
                          />
                          {exp.description.length > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeDescriptionPoint(exp.id, index)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {content.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100 transition-colors"
                      onClick={() => removeSkill(index)}
                    >
                      {skill}
                      <Minus className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a skill..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSkill(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                  <Button
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement
                      if (input) {
                        addSkill(input.value)
                        input.value = ''
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Resume Preview</span>
              </CardTitle>
              <CardDescription>
                Live preview of your formatted resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6 text-sm">
                  {/* Header */}
                  <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold">{content.personalInfo.name}</h1>
                    <div className="text-gray-600 space-y-1">
                      <p>{content.personalInfo.email} • {content.personalInfo.phone}</p>
                      <p>{content.personalInfo.location}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Summary */}
                  {content.summary && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Professional Summary</h2>
                      <p className="text-gray-700 leading-relaxed">{content.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {content.experience.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-3">Experience</h2>
                      <div className="space-y-4">
                        {content.experience.map((exp) => (
                          <div key={exp.id} className="space-y-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{exp.position}</h3>
                                <p className="text-gray-600">{exp.company}</p>
                              </div>
                              <div className="text-right text-gray-500 text-xs">
                                <p>{exp.startDate} - {exp.endDate}</p>
                                {exp.location && <p>{exp.location}</p>}
                              </div>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                              {exp.description.filter(desc => desc.trim()).map((desc, index) => (
                                <li key={index}>{desc}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {content.skills.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {content.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}