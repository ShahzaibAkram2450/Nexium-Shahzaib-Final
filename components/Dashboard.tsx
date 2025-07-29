"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Calendar,
  Target,
  User,
  LogOut,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { Resume } from "@/types/resume";
import { toast } from "sonner";

interface DashboardProps {
  onNewResume: () => void;
  onOpenResume: (resume: Resume) => void;
}

export default function Dashboard({
  onNewResume,
  onOpenResume,
}: DashboardProps) {
  const { user, signOut } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const baseUrl = window.location.origin; // Get current domain
      const response = await fetch(`${baseUrl}/api/resumes`);

      if (response.ok) {
        const data = await response.json();
        setResumes(data.resumes || []);
      } else {
        throw new Error("Failed to fetch resumes");
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast.error("Failed to sign out");
      } else {
        toast.success("Signed out successfully");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("An error occurred while signing out");
    }
  };

  const handleDeleteResume = async (resumeId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this resume? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeletingId(resumeId);

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setResumes((prev) => prev.filter((r) => r.id !== resumeId));
        toast.success("Resume deleted successfully");
      } else {
        throw new Error("Failed to delete resume");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getResumeStats = (resume: Resume) => {
    const experienceCount = resume.content?.experience?.length || 0;
    const skillsCount = resume.content?.skills?.length || 0;
    const educationCount = resume.content?.education?.length || 0;

    return { experienceCount, skillsCount, educationCount };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Resume Tailor</h1>
              <p className="text-gray-600">AI-powered resume optimization</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed border-blue-200 hover:border-blue-400"
              onClick={onNewResume}>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-600">
                  Create New Resume
                </CardTitle>
                <CardDescription>
                  Upload your resume and start optimizing for new opportunities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-100">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-green-600">AI Suggestions</CardTitle>
                <CardDescription>
                  Get tailored recommendations based on job descriptions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-100">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-purple-600">
                  Export & Share
                </CardTitle>
                <CardDescription>
                  Download optimized resumes in multiple formats
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Statistics */}
          {resumes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {resumes.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Resumes</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {resumes.reduce(
                      (acc, resume) =>
                        acc + (resume.content?.experience?.length || 0),
                      0
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Total Experiences</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {resumes.reduce(
                      (acc, resume) =>
                        acc + (resume.content?.skills?.length || 0),
                      0
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Total Skills</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {
                      resumes.filter((resume) => {
                        const updatedAt = new Date(resume.updatedAt);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return updatedAt > weekAgo;
                      }).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Updated This Week</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Resumes */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Resumes</h2>
              <Button onClick={onNewResume}>
                <Plus className="w-4 h-4 mr-2" />
                New Resume
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : resumes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((resume) => {
                  const { experienceCount, skillsCount, educationCount } =
                    getResumeStats(resume);

                  return (
                    <Card
                      key={resume.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 group hover:scale-[1.02]">
                      <CardHeader onClick={() => onOpenResume(resume)}>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg truncate pr-2">
                            {resume.title}
                          </CardTitle>
                          <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>Updated {formatDate(resume.updatedAt)}</span>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {resume.content?.summary || "No summary available"}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {experienceCount > 0 && (
                            <Badge variant="secondary">
                              {experienceCount} Experience
                              {experienceCount !== 1 ? "s" : ""}
                            </Badge>
                          )}
                          {skillsCount > 0 && (
                            <Badge variant="outline">
                              {skillsCount} Skills
                            </Badge>
                          )}
                          {educationCount > 0 && (
                            <Badge variant="outline">
                              {educationCount} Education
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenResume(resume)}
                            className="flex-1 mr-2">
                            Edit Resume
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleDeleteResume(resume.id, e)}
                            disabled={deletingId === resume.id}>
                            {deletingId === resume.id ? (
                              <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No resumes yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Get started by creating your first resume and optimizing it
                    with AI
                  </p>
                  <Button onClick={onNewResume} size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Resume
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
