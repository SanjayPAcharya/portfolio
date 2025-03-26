import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import SocialLink from './SocialLink';

export default function Hero() {
  return (
    <header className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Sanjay Kumar P</h1>
      <p className="text-lg text-gray-600 mb-4">Software Engineer</p>
      <div className="flex gap-4 mb-8">
        <SocialLink href="https://github.com" icon={<Github className="w-6 h-6" />} />
        <SocialLink href="https://linkedin.com" icon={<Linkedin className="w-6 h-6" />} />
        <SocialLink href="mailto:sanjay@example.com" icon={<Mail className="w-6 h-6" />} />
      </div>
      <section className="max-w-2xl text-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">About Me</h2>
        <div className="relative w-48 h-48 mx-auto mb-8 group">
          <img
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300"
            alt="Profile"
            className="rounded-full object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 shadow-xl"
          />
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>
        <p>
          I am a passionate Full Stack Software Engineer with experience in building scalable web applications and
          crafting intuitive user interfaces. I enjoy solving complex problems and continuously learning new
          technologies to improve my craft.
        </p>
      </section>
    </header>
  );
}