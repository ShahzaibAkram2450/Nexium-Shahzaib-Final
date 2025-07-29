
import type { Metadata } from "next";
import { Inter, Space_Grotesk, Pacifico } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import 'remixicon/fonts/remixicon.css';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
});

export const metadata: Metadata = {
  title: "ResumeAI - AI-Powered Resume Tailoring",
  description: "Tailor your resume for any job with AI-powered suggestions. Upload your resume, add job requirements, and get personalized recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${pacifico.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
