import React from 'react';
import Section from './Section';

export default function About() {
  return (
    <Section id="about" title="About Me" className="bg-white/90 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto">
        <div className="relative w-48 h-48 mx-auto mb-8 group">
          <img
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300"
            alt="Profile"
            className="rounded-full object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 shadow-xl"
          />
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">
          I'm a passionate software engineer with 5+ years of experience building web applications
          and scalable systems. I specialize in React, Node.js, and cloud technologies, focusing
          on creating efficient and user-friendly solutions.
        </p>
      </div>
    </Section>
  );
}