
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import Link from 'next/link';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);

    if (!configured) {
      setLoading(false);
      return;
    }

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.log('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (!isConfigured) return;
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log('Sign out failed:', error);
    }
  };

  return (
    <header className="border-b border-purple-500/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold font-pacifico gradient-text hover:scale-105 transition-transform duration-200">
            ResumeAI
          </Link>
          
          <nav className="flex items-center space-x-8">
            <Link href="/#features" className="nav-link text-gray-300 hover:text-white transition-colors duration-200 font-medium">
              Features
            </Link>
            
            {!isConfigured ? (
              <div className="text-amber-400 text-sm font-medium px-3 py-1 rounded-full bg-amber-500/10">
                Setup required - Check .env.local
              </div>
            ) : loading ? (
              <div className="animate-pulse bg-purple-500/20 h-8 w-20 rounded-full"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="nav-link text-gray-300 hover:text-white hover:bg-purple-500/10 whitespace-nowrap transition-all duration-200">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="btn-outline-glow whitespace-nowrap"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth">
                  <Button variant="ghost" className="nav-link text-gray-300 hover:text-white hover:bg-purple-500/10 whitespace-nowrap transition-all duration-200">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="btn-glow whitespace-nowrap">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
