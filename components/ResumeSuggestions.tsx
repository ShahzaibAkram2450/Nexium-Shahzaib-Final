"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Copy, Edit, Target, Lightbulb } from "lucide-react";
import { ResumeSuggestions as SuggestionsType } from "@/types/resume";
import { toast } from "sonner";

// Accept both the old and new suggestions shape
interface ResumeSuggestionsProps {
  suggestions: SuggestionsType | { suggestions: string[] };
  onApplySuggestion?: (type: string, content: any) => void;
}

export default function ResumeSuggestions({
  suggestions,
  onApplySuggestion,
}: ResumeSuggestionsProps) {
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(
    new Set()
  );

  const handleApplySuggestion = (
    type: string,
    content: any,
    suggestionId: string
  ) => {
    onApplySuggestion?.(type, content);
    setAppliedSuggestions(
      (prev) => new Set(Array.from(prev).concat(suggestionId))
    );
    toast.success("Suggestion applied to your resume!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  // Type guard for new suggestions shape
  const isSimpleSuggestions = (s: any): s is { suggestions: string[] } =>
    Array.isArray(s.suggestions);
  const hasMatchScore = (s: any): s is SuggestionsType =>
    typeof s.matchScore === "number";
  const hasExperience = (s: any): s is SuggestionsType =>
    Array.isArray(s.experience);
  const hasSkills = (s: any): s is SuggestionsType => Array.isArray(s.skills);
  const hasKeywords = (s: any): s is SuggestionsType =>
    Array.isArray(s.keywords);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Match Score */}
      {hasMatchScore(suggestions) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Resume Match Analysis</span>
              </CardTitle>
              <Badge
                className={`px-3 py-1 ${getMatchScoreColor(
                  suggestions.matchScore
                )}`}>
                {suggestions.matchScore}% Match
              </Badge>
            </div>
          </CardHeader>
        </Card>
      )}

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
              <CardDescription>
                AI-generated tailored resume improvement suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isSimpleSuggestions(suggestions) &&
              suggestions.suggestions.length > 0 ? (
                <ul className="list-disc pl-6 space-y-2">
                  {suggestions.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm leading-relaxed">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No suggestions available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Experience Section Improvements</CardTitle>
              <CardDescription>
                Tailored descriptions that highlight relevant experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasExperience(suggestions) &&
                suggestions.experience.map(
                  (expSuggestion: any, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">Experience {index + 1}</Badge>
                        <span className="text-sm text-gray-600">
                          {expSuggestion.reasoning}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {expSuggestion.suggestedDescription.map(
                          (desc: string, descIndex: number) => (
                            <div
                              key={descIndex}
                              className="flex items-start space-x-2 text-sm">
                              <span className="text-gray-400 mt-1">•</span>
                              <span className="flex-1">{desc}</span>
                            </div>
                          )
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={
                            appliedSuggestions.has(`exp-${index}`)
                              ? "secondary"
                              : "default"
                          }
                          onClick={() =>
                            handleApplySuggestion(
                              "experience",
                              expSuggestion,
                              `exp-${index}`
                            )
                          }
                          disabled={appliedSuggestions.has(`exp-${index}`)}>
                          {appliedSuggestions.has(`exp-${index}`) ? (
                            <>
                              <Check className="w-3 h-3 mr-1" /> Applied
                            </>
                          ) : (
                            <>
                              <Edit className="w-3 h-3 mr-1" /> Apply
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            copyToClipboard(
                              expSuggestion.suggestedDescription.join("\n• ")
                            )
                          }>
                          <Copy className="w-3 h-3 mr-1" /> Copy
                        </Button>
                      </div>
                    </div>
                  )
                )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills Optimization</CardTitle>
              <CardDescription>
                Recommended skills to add or emphasize based on job requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {hasSkills(suggestions) &&
                  suggestions.skills.map((skill: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() =>
                        handleApplySuggestion("skills", skill, `skill-${index}`)
                      }>
                      <Lightbulb className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Important Keywords</CardTitle>
              <CardDescription>
                Key terms from the job description to incorporate into your
                resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="flex flex-wrap gap-2">
                  {hasKeywords(suggestions) &&
                    suggestions.keywords.map(
                      (keyword: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => copyToClipboard(keyword)}>
                          {keyword}
                        </Badge>
                      )
                    )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
