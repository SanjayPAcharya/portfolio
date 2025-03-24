import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import SocialLink from './SocialLink';

export default function Hero() {
  return (
    <header className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] -z-10" />
      <div className="container mx-auto px-4 py-16 md:py-32 text-center transform transition-all duration-700 opacity-0 translate-y-4 animate-fade-in">
        <div className="relative z-10 bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-xl mx-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-4 md:mb-6 animate-slide-up">
            John Developer
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 md:mb-8 animate-slide-up-delay">
            Full Stack Software Engineer
          </p>
          <div className="flex justify-center gap-6">
            <SocialLink href="https://github.com" icon={<Github className="w-6 h-6 sm:w-8 sm:h-8" />} />
            <SocialLink href="https://linkedin.com" icon={<Linkedin className="w-6 h-6 sm:w-8 sm:h-8" />} />
            <SocialLink href="mailto:john@example.com" icon={<Mail className="w-6 h-6 sm:w-8 sm:h-8" />} />
          </div>
        </div>
      </div>
    </header>
  );
}