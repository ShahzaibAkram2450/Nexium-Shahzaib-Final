
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SuggestionsListProps {
  suggestions: string[];
  loading: boolean;
  onGenerateSuggestions: () => void;
  canGenerate: boolean;
}

export default function SuggestionsList({ 
  suggestions, 
  loading, 
  onGenerateSuggestions, 
  canGenerate 
}: SuggestionsListProps) {
  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl font-space-grotesk gradient-text">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500/80 to-violet-600/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <i className="ri-lightbulb-line text-white w-4 h-4 flex items-center justify-center"></i>
            </div>
            AI Suggestions
          </CardTitle>
          <Button
            onClick={onGenerateSuggestions}
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
                Get AI Suggestions
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-purple-500/20 rounded w-full"></div>
                    <div className="h-4 bg-purple-500/20 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-6">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500/90 to-violet-600/90 backdrop-blur-sm text-white rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg border border-purple-400/30">
                    {index + 1}
                  </div>
                  <p className="text-gray-300 leading-relaxed text-base flex-1">{suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/80 to-violet-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-purple-400/20">
              <i className="ri-robot-line text-white text-4xl w-10 h-10 flex items-center justify-center"></i>
            </div>
            <h3 className="text-xl font-semibold font-space-grotesk text-white mb-3">Ready for AI Magic?</h3>
            <p className="text-gray-400 leading-relaxed max-w-md mx-auto">Upload your resume and add job requirements to get personalized AI-powered suggestions that will make your resume stand out.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
