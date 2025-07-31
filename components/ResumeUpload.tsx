"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface ResumeUploadProps {
  onResumeUploaded: (content: string) => void;
}

export default function ResumeUpload({ onResumeUploaded }: ResumeUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    if (!file) return;

    const isPDF = file.type === "application/pdf";
    const isTXT = file.name.toLowerCase().endsWith(".txt");

    if (!isPDF && !isTXT) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or TXT file.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      let content = "";

      if (isPDF) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/parse-pdf", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to parse PDF");
        content = data.text;
      } else {
        content = await file.text();
      }

      if (!content.trim()) throw new Error("No text content found in the file");

      onResumeUploaded(content);

      toast({
        title: "Success!",
        description: "Resume uploaded and processed successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to process resume",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-space-grotesk gradient-text">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500/80 to-violet-600/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <i className="ri-upload-2-line text-white w-4 h-4 flex items-center justify-center"></i>
          </div>
          Upload Your Resume
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
            dragActive
              ? "border-purple-500/50 bg-purple-500/5 backdrop-blur-sm"
              : "border-white/20 hover:border-purple-500/30 bg-white/5 backdrop-blur-sm"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
          aria-label="Resume upload dropzone">
          <input
            id="file-upload"
            type="file"
            accept=".pdf, .txt"
            onChange={handleChange}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/80 to-violet-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-purple-400/20">
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
              </div>
              <p className="text-gray-300 font-medium text-lg">
                Processing your resume...
              </p>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/80 to-violet-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-purple-400/20">
                <i className="ri-file-upload-line text-white text-3xl w-8 h-8 flex items-center justify-center"></i>
              </div>
              <div>
                <p className="text-xl font-semibold text-white mb-2">
                  Drop your resume here
                </p>
                <p className="text-gray-300 mb-2">or click to browse</p>
                <p className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10 inline-block">
                  Supports PDF and TXT files
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
