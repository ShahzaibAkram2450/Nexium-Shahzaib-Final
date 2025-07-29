"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import ResumeUpload from "@/components/ResumeUpload";
import JobRequirementsInput from "@/components/JobRequirementsInput";
import SuggestionsList from "@/components/SuggestionsList";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resumeContent, setResumeContent] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      setUser(user);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleGenerateSuggestions = async () => {
    if (!resumeContent || !jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please upload your resume and add job description first.",
        variant: "destructive",
      });
      return;
    }

    setGeneratingSuggestions(true);

    try {
      const response = await fetch("/api/tailor-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeContent,
          jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate suggestions");
      }

      setSuggestions(data.suggestions);

      toast({
        title: "Success!",
        description: "AI suggestions generated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate suggestions",
        variant: "destructive",
      });
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e10]">
        <Header />
        <div className="flex items-center justify-center h-96 relative">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}></div>
      </div>

      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold font-space-grotesk gradient-text mb-4">
            Resume Tailoring Dashboard
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Upload your resume and job requirements to get AI-powered tailoring
            suggestions
          </p>
        </div>

        {/* Stacked Components */}
        <div className="flex flex-col gap-8 animate-fade-in">
          <ResumeUpload onResumeUploaded={setResumeContent} />
          <JobRequirementsInput onJobDescription={setJobDescription} />
          <SuggestionsList
            suggestions={suggestions}
            loading={generatingSuggestions}
            onGenerateSuggestions={handleGenerateSuggestions}
            canGenerate={!!resumeContent && !!jobDescription}
          />
        </div>

        {/* Resume Preview */}
        {resumeContent && (
          <div className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
            <h3 className="text-2xl font-semibold font-space-grotesk mb-6 flex items-center gap-3 gradient-text">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500/80 to-violet-600/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <i className="ri-file-text-line text-white w-4 h-4 flex items-center justify-center"></i>
              </div>
              Resume Preview
            </h3>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {resumeContent}
              </p>
            </div>
          </div>
        )}
      </main>

      <Toaster />
    </div>
  );
}
