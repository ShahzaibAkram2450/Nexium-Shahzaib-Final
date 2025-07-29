"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/components/Dashboard";
import ResumeUpload from "@/components/ResumeUpload";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import ResumeSuggestions from "@/components/ResumeSuggestions";
import ResumeEditor from "@/components/ResumeEditor";
import type {
  Resume,
  ResumeContent,
  ResumeSuggestions as SuggestionsType,
} from "@/types/resume";
import { toast } from "sonner";

type AppState = "dashboard" | "upload" | "job-input" | "suggestions" | "editor";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [appState, setAppState] = useState<AppState>("dashboard");
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [resumeContent, setResumeContent] = useState<ResumeContent | null>(
    null
  );
  const [jobDescription, setJobDescription] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<SuggestionsType | null>(null);
  const [resumeTitle, setResumeTitle] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleNewResume = () => {
    setCurrentResume(null);
    setResumeContent(null);
    setJobDescription(null);
    setSuggestions(null);
    setResumeTitle("");
    setAppState("upload");
  };

  const handleOpenResume = (resume: Resume) => {
    setCurrentResume(resume);
    setResumeContent(resume.content);
    setResumeTitle(resume.title);
    setAppState("editor");
  };

  const handleResumeProcessed = async (content: string, title: string) => {
    console.log("🔄 Processing resume:", {
      title,
      contentLength: content.length,
    });

    try {
      const parsedContent: ResumeContent = JSON.parse(content);
      setResumeContent(parsedContent);
      setResumeTitle(title);

      console.log("📤 Sending POST request to /api/resumes");

      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          title,
          content: parsedContent,
          originalContent: content,
        }),
      });

      console.log("📡 POST Response status:", response.status);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error("❌ POST API Error:", errorData);
        } catch (parseError) {
          console.error("❌ Failed to parse POST error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const { resume } = await response.json();
      console.log("✅ Resume saved successfully:", resume);
      setCurrentResume(resume);
      setAppState("job-input");
    } catch (error) {
      console.error("🔥 Error processing resume:", error);

      // Fallback: create basic content structure
      const basicContent: ResumeContent = {
        personalInfo: {
          name: "Unknown",
          email: "",
          phone: "",
          location: "",
        },
        summary: content.slice(0, 200) + "...",
        experience: [],
        education: [],
        skills: [],
      };

      setResumeContent(basicContent);
      setResumeTitle(title);

      try {
        console.log("🔄 Attempting fallback save with basic content");

        const response = await fetch("/api/resumes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({
            title,
            content: basicContent,
            originalContent: content,
          }),
        });

        if (response.ok) {
          const { resume } = await response.json();
          console.log("✅ Fallback save successful:", resume);
          setCurrentResume(resume);
          setAppState("job-input");
        } else {
          throw new Error("Fallback save also failed");
        }
      } catch (saveError) {
        console.error("🔥 Fallback save error:", saveError);
        toast.error("Failed to save resume. Please try again.");
      }
    }
  };

  const handleJobAnalyzed = async (jobData: any) => {
    setJobDescription(jobData);

    try {
      console.log("🔄 Analyzing job and generating suggestions");

      const response = await fetch("/api/resume/tailor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          resumeContent,
          jobDescription: jobData,
        }),
      });

      console.log("📡 Tailor Response status:", response.status);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error("❌ Tailor API Error:", errorData);
        } catch (parseError) {
          console.error(
            "❌ Failed to parse tailor error response:",
            parseError
          );
        }
        throw new Error(errorMessage);
      }

      const suggestionsData = await response.json();
      console.log("✅ Suggestions generated successfully");
      setSuggestions(suggestionsData);
      setAppState("suggestions");
    } catch (error) {
      console.error("🔥 Error generating suggestions:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to generate AI suggestions: ${errorMessage}`);
    }
  };

  const handleApplySuggestion = (type: string, content: any) => {
    if (!resumeContent) return;

    console.log("🔄 Applying suggestion:", { type, content });

    switch (type) {
      case "summary":
        setResumeContent((prev) =>
          prev ? { ...prev, summary: content } : null
        );
        break;
      case "skills":
        setResumeContent((prev) =>
          prev
            ? {
                ...prev,
                skills: [...prev.skills, content].filter(
                  (skill, index, arr) => arr.indexOf(skill) === index
                ),
              }
            : null
        );
        break;
      case "experience":
        // Add experience handling logic here if needed
        break;
    }
  };

  const handleSaveResume = async (content: ResumeContent) => {
    if (!currentResume) {
      toast.error("No resume selected to save");
      return;
    }

    try {
      console.log("🔄 Saving resume:", currentResume.id);

      const response = await fetch(`/api/resumes/${currentResume.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({ content }),
      });

      console.log("📡 PUT Response status:", response.status);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error("❌ PUT API Error:", errorData);
        } catch (parseError) {
          console.error("❌ Failed to parse PUT error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      console.log("✅ Resume saved successfully");
      setResumeContent(content);
      toast.success("Resume saved successfully!");
    } catch (error) {
      console.error("🔥 Error saving resume:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to save resume: ${errorMessage}`);
      throw error;
    }
  };

  const renderCurrentState = () => {
    switch (appState) {
      case "dashboard":
        return (
          <Dashboard
            onNewResume={handleNewResume}
            onOpenResume={handleOpenResume}
          />
        );
      case "upload":
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
              <div className="mb-4">
                <button
                  onClick={() => setAppState("dashboard")}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                  ← Back to Dashboard
                </button>
              </div>
              <ResumeUpload onResumeProcessed={handleResumeProcessed} />
            </div>
          </div>
        );
      case "job-input":
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
              <div className="mb-4">
                <button
                  onClick={() => setAppState("dashboard")}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                  ← Back to Dashboard
                </button>
              </div>
              <JobDescriptionInput onJobAnalyzed={handleJobAnalyzed} />
            </div>
          </div>
        );
      case "suggestions":
        return suggestions ? (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
              <div className="mb-6">
                <button
                  onClick={() => setAppState("dashboard")}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4">
                  ← Back to Dashboard
                </button>
                <div className="text-center">
                  <h1 className="text-3xl font-bold">
                    AI-Powered Resume Suggestions
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Review and apply the suggestions below to optimize your
                    resume
                  </p>
                </div>
              </div>
              <ResumeSuggestions
                suggestions={suggestions}
                onApplySuggestion={handleApplySuggestion}
              />
              <div className="mt-8 text-center">
                <button
                  onClick={() => setAppState("editor")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Resume
                </button>
              </div>
            </div>
          </div>
        ) : null;
      case "editor":
        return resumeContent ? (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
              <div className="mb-4">
                <button
                  onClick={() => setAppState("dashboard")}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                  ← Back to Dashboard
                </button>
              </div>
              <ResumeEditor
                initialContent={resumeContent}
                resumeTitle={resumeTitle}
                onSave={handleSaveResume}
              />
            </div>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return renderCurrentState();
}
