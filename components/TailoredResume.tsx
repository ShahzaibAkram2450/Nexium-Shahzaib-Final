'use client';

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface TailoredResumeProps {
  tailoredResume: string;
  loading: boolean;
  onGenerateResume: () => void;
  canGenerate: boolean;
}

export default function TailoredResume({
  tailoredResume,
  loading,
  onGenerateResume,
  canGenerate,
}: TailoredResumeProps) {
  const { toast } = useToast();
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    const input = resumeRef.current;
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save("tailored-resume.pdf");
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tailoredResume);
    toast({
      title: "Copied to clipboard!",
    });
  };

  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl font-space-grotesk gradient-text">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500/80 to-violet-600/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <i className="ri-file-edit-line text-white w-4 h-4 flex items-center justify-center"></i>
            </div>
            Tailored Resume
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Button
              onClick={onGenerateResume}
              disabled={!canGenerate || loading}
              className="whitespace-nowrap font-medium"
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Generating...
                </>
              ) : (
                <>
                  <i className="ri-magic-line mr-2"></i>
                  Generate Resume
                </>
              )}
            </Button>
            {tailoredResume && (
              <>
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="whitespace-nowrap font-medium"
                >
                  <i className="ri-file-copy-line mr-2"></i>
                  Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadPDF}
                  className="whitespace-nowrap font-medium"
                >
                  <i className="ri-download-2-line mr-2"></i>
                  Download PDF
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="h-8 bg-purple-500/20 rounded animate-pulse"></div>
            <div className="h-4 bg-purple-500/20 rounded animate-pulse w-2/3"></div>
            <div className="h-4 bg-purple-500/20 rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-purple-500/20 rounded animate-pulse w-3/4"></div>
          </div>
        ) : tailoredResume ? (
          <div ref={resumeRef} className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed p-4 bg-gray-900 rounded-md">
            {tailoredResume}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/80 to-violet-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-purple-400/20">
              <i className="ri-robot-line text-white text-4xl w-10 h-10 flex items-center justify-center"></i>
            </div>
            <h3 className="text-xl font-semibold font-space-grotesk text-white mb-3">Ready for AI Magic?</h3>
            <p className="text-gray-400 leading-relaxed max-w-md mx-auto">Upload your resume and add job requirements to get a new resume tailored by AI.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
