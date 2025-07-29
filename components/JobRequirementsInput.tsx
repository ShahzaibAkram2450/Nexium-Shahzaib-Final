
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JobRequirementsInputProps {
  onJobDescription: (description: string) => void;
  disabled?: boolean;
}

export default function JobRequirementsInput({ onJobDescription, disabled }: JobRequirementsInputProps) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onJobDescription(description.trim());
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-space-grotesk gradient-text">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500/80 to-violet-600/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <i className="ri-briefcase-line text-white w-4 h-4 flex items-center justify-center"></i>
          </div>
          Job Requirements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Textarea
            placeholder="Paste the job description or requirements here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-32 resize-none bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20"
            disabled={disabled}
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              {description.length}/500 characters
            </span>
            <Button 
              type="submit" 
              disabled={!description.trim() || disabled}
              className="whitespace-nowrap font-medium"
            >
              <i className="ri-add-line mr-2"></i>
              Add Job Description
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
