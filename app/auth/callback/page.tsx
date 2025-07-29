
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export default function AuthCallback() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: "Authentication Error",
            description: "There was a problem signing you in. Please try again.",
            variant: "destructive",
          });
          router.push('/auth');
          return;
        }

        if (data?.session) {
          toast({
            title: "Welcome!",
            description: "You've been signed in successfully.",
          });
          router.push('/dashboard');
        } else {
          router.push('/auth');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        router.push('/auth');
      }
    };

    handleAuthCallback();
  }, [router, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e10] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="text-center relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-2xl max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500/80 to-violet-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg border border-purple-400/20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
          <h2 className="text-2xl font-bold font-space-grotesk gradient-text mb-4">Signing you in...</h2>
          <p className="text-gray-300 leading-relaxed">Please wait while we complete your authentication.</p>
          
          <div className="mt-6 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
