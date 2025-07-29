"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Email is already in use. Please log in.");
        } else {
          toast.error("Sign-up failed. Please try again.");
        }
      } else {
        toast.success("Sign-up successful! Please log in.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error("Login failed. Please check your credentials.");
      } else {
        toast.success("Login successful! Redirecting...");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-4">Resume Tailor</h1>
        <p className="text-center text-gray-600 mb-6">
          AI-powered resume optimization for your dream job
        </p>
        <h2 className="text-xl font-semibold text-center mb-4">
          Sign in to Resume Tailor
        </h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-4 w-full rounded"
        />
        <button
          onClick={handleSignUp}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-2">
          Sign Up
        </button>
        <button
          onClick={handleLogin}
          className="bg-gray-800 text-white px-4 py-2 rounded w-full flex items-center justify-center">
          {isLoggingIn ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Logging in...
            </>
          ) : (
            <>Log In</>
          )}
        </button>
      </div>
    </div>
  );
}
