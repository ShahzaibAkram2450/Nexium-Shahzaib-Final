"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Cast as Paste, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ResumeUploadProps {
  onResumeProcessed: (content: string, title: string) => void;
}

export default function ResumeUpload({ onResumeProcessed }: ResumeUploadProps) {
  const [pastedContent, setPastedContent] = useState("");
  const [processing, setProcessing] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setProcessing(true);
      try {
        const formData = new FormData();
        formData.append("resume", file);

        const response = await fetch("/api/resume/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to process resume");
        }

        const { content, title } = await response.json();
        onResumeProcessed(content, title || file.name);
        toast.success("Resume uploaded successfully!");
      } catch (error) {
        toast.error("Failed to process resume. Please try again.");
      } finally {
        setProcessing(false);
      }
    },
    [onResumeProcessed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
    multiple: false,
    disabled: processing,
  });

  const handlePasteSubmit = () => {
    if (!pastedContent.trim()) {
      toast.error("Please paste your resume content");
      return;
    }

    onResumeProcessed(pastedContent, "Pasted Resume");
    toast.success("Resume content processed successfully!");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Upload Your Resume</CardTitle>
        <CardDescription>
          Upload a file or paste your resume content to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="paste">Paste Content</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              } ${processing ? "opacity-50 cursor-not-allowed" : ""}`}>
              <input {...getInputProps()} />
              {processing ? (
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-sm text-gray-600">Processing resume...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {isDragActive
                        ? "Drop your resume here"
                        : "Drag & drop your resume here, or click to browse"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports PDF, DOC, DOCX, TXT (max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Paste className="w-4 h-4" />
                <span>Paste your resume content below</span>
              </div>
              <Textarea
                placeholder="Paste your complete resume content here..."
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                rows={12}
                className="min-h-[300px]"
              />
              <Button
                onClick={handlePasteSubmit}
                disabled={!pastedContent.trim()}
                className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Process Resume Content
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
