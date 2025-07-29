
'use client';

import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Link from 'next/link';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0e0e10] text-white">
      <Header />
      
      <main>
        <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial"></div>
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto animate-fade-in">
              <h1 className="text-6xl md:text-7xl font-bold font-space-grotesk mb-8 leading-tight">
                Tailor Your Resume with <span className="gradient-text">AI Power</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                Upload your resume, paste job requirements, and get personalized suggestions to make your resume stand out for every application.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/auth">
                  <Button size="lg" className="btn-glow text-lg px-10 py-4 whitespace-nowrap font-medium">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="btn-outline-glow text-lg px-10 py-4 whitespace-nowrap font-medium">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-20 animate-fade-in">
              <h2 className="text-5xl font-bold font-space-grotesk mb-6 gradient-text">
                Why Choose ResumeAI?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Our AI-powered platform helps you create targeted resumes that get noticed by employers and ATS systems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl text-center animate-slide-in-left shadow-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-purple-500/20">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/80 to-violet-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg border border-purple-400/20">
                  <i className="ri-upload-2-line text-white text-3xl w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-2xl font-semibold font-space-grotesk mb-4 text-white">Easy Upload</h3>
                <p className="text-gray-300 leading-relaxed">
                  Simply upload your existing resume in PDF or text format. Our system will parse and analyze your content instantly.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl text-center animate-fade-in shadow-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-purple-500/20" style={{animationDelay: '0.2s'}}>
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/80 to-violet-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg border border-purple-400/20">
                  <i className="ri-robot-line text-white text-3xl w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-2xl font-semibold font-space-grotesk mb-4 text-white">AI Analysis</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our advanced AI compares your resume against job requirements and identifies improvement opportunities.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl text-center animate-slide-in-right shadow-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-purple-500/20">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/80 to-violet-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg border border-purple-400/20">
                  <i className="ri-lightbulb-line text-white text-3xl w-8 h-8 flex items-center justify-center"></i>
                </div>
                <h3 className="text-2xl font-semibold font-space-grotesk mb-4 text-white">Smart Suggestions</h3>
                <p className="text-gray-300 leading-relaxed">
                  Get personalized recommendations to optimize keywords, highlight relevant experience, and improve formatting.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-violet-500/5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="animate-slide-in-left">
                <h2 className="text-5xl font-bold font-space-grotesk mb-8 gradient-text">
                  How It Works
                </h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-xl shadow-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-purple-500/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/90 to-violet-600/90 backdrop-blur-sm text-white rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-lg border border-purple-400/30">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold font-space-grotesk text-white mb-2">Upload Your Resume</h3>
                      <p className="text-gray-300 leading-relaxed">Upload your current resume in PDF or text format for analysis.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-xl shadow-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-purple-500/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/90 to-violet-600/90 backdrop-blur-sm text-white rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-lg border border-purple-400/30">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold font-space-grotesk text-white mb-2">Add Job Requirements</h3>
                      <p className="text-gray-300 leading-relaxed">Paste the job description or requirements you're targeting.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-xl shadow-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-purple-500/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/90 to-violet-600/90 backdrop-blur-sm text-white rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-lg border border-purple-400/30">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold font-space-grotesk text-white mb-2">Get AI Suggestions</h3>
                      <p className="text-gray-300 leading-relaxed">Receive personalized recommendations to tailor your resume perfectly.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:pl-8 animate-slide-in-right">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-2xl blur-xl transform rotate-6"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                    <img 
                      src="https://readdy.ai/api/search-image?query=Professional%20person%20working%20on%20laptop%20with%20resume%20documents%20on%20desk%2C%20modern%20office%20setting%2C%20clean%20workspace%2C%20business%20professional%20reviewing%20job%20applications%2C%20organized%20desk%20setup%2C%20natural%20lighting%2C%20dark%20modern%20aesthetic&width=600&height=400&seq=howit1&orientation=landscape"
                      alt="How it works"
                      className="rounded-xl shadow-2xl w-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-violet-600/10"></div>
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-16 rounded-3xl animate-fade-in shadow-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all duration-500 hover:shadow-purple-500/20">
              <h2 className="text-5xl font-bold font-space-grotesk mb-8 gradient-text">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                Join thousands of job seekers who have improved their resume success rate with our AI-powered platform.
              </p>
              <Link href="/auth">
                <Button size="lg" className="btn-glow text-lg px-12 py-4 whitespace-nowrap font-medium">
                  Start Tailoring Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-black/20 backdrop-blur-xl border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-3xl font-bold mb-4 font-pacifico gradient-text">ResumeAI</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                AI-powered resume tailoring to help you land your dream job.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold font-space-grotesk mb-6 text-white">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/auth" className="hover:text-purple-400 transition-colors">Dashboard</Link></li>
                <li><Link href="/#features" className="hover:text-purple-400 transition-colors">Features</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold font-space-grotesk mb-6 text-white">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="mailto:support@resumeai.com" className="hover:text-purple-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Help Center</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2024 ResumeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
}
