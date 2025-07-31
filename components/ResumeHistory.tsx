'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import jsPDF from 'jspdf';

interface Resume {
  _id: string;
  userId: string;
  originalResume: string;
  tailoredResume: string;
  createdAt: string;
}

export default function ResumeHistory() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch('/api/resumes');
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch resumes');
        }
        setResumes(data.resumes);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [toast]);

  const handleDownloadPDF = (resume: Resume) => {
    const pdf = new jsPDF();
    pdf.text(resume.tailoredResume, 10, 10);
    pdf.save(`tailored-resume-${resume._id}.pdf`);
  };

  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-space-grotesk gradient-text">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500/80 to-violet-600/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <i className="ri-history-line text-white w-4 h-4 flex items-center justify-center"></i>
          </div>
          Resume History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="h-16 bg-purple-500/20 rounded animate-pulse"></div>
            <div className="h-16 bg-purple-500/20 rounded animate-pulse"></div>
            <div className="h-16 bg-purple-500/20 rounded animate-pulse"></div>
          </div>
        ) : resumes.length > 0 ? (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div key={resume._id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-lg hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert(resume.originalResume)}
                    >
                      Original
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert(resume.tailoredResume)}
                    >
                      Tailored
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPDF(resume)}
                    >
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">You haven't generated any resumes yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
