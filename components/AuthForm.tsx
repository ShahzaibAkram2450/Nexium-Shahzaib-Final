
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
      
      setEmailSent(true);
      toast({
        title: "Magic link sent!",
        description: "Check your email for the login link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendLink = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Magic link resent!",
        description: "Check your email for the new login link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e0e10] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/80 to-violet-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-purple-400/20">
              <i className="ri-mail-line text-white text-4xl w-10 h-10 flex items-center justify-center"></i>
            </div>
            <CardTitle className="text-3xl font-bold font-space-grotesk gradient-text mb-2">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              We've sent a magic login link to <span className="text-purple-400 font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center text-gray-400 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              Click the link in your email to sign in. The link will expire in 1 hour.
            </div>
            
            <div className="flex flex-col space-y-3">
              <Button 
                variant="outline"
                onClick={handleResendLink}
                disabled={loading}
                className="w-full whitespace-nowrap font-medium"
              >
                {loading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="ri-refresh-line mr-2"></i>
                    Resend Magic Link
                  </>
                )}
              </Button>
              
              <Button 
                variant="ghost"
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="w-full whitespace-nowrap font-medium text-gray-400 hover:text-white"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                Use Different Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e10] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/80 to-violet-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-purple-400/20">
            <i className="ri-magic-line text-white text-4xl w-10 h-10 flex items-center justify-center"></i>
          </div>
          <CardTitle className="text-3xl font-bold font-space-grotesk gradient-text mb-2">
            Sign In with Magic Link
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            Enter your email and we'll send you a secure login link
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleMagicLink} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-sm bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20 backdrop-blur-sm"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full whitespace-nowrap font-semibold text-lg py-3" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Sending Magic Link...
                </>
              ) : (
                <>
                  <i className="ri-send-plane-line mr-2"></i>
                  Send Magic Link
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <div className="text-sm text-gray-400 bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10">
              <i className="ri-shield-check-line mr-2 text-green-400"></i>
              No passwords needed. We'll email you a secure login link.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
