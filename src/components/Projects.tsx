import React from 'react';
import Section from './Section';
import ProjectCard from './ProjectCard';

const projects = [
  {
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution built with React, Node.js, and PostgreSQL',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&h=400',
    github: '#',
    demo: '#'
  },
  {
    title: 'Task Management App',
    description: 'Real-time task management application using React and WebSocket',
    image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=800&h=400',
    github: '#',
    demo: '#'
  },
  {
    title: 'AI Image Generator',
    description: 'An AI-powered image generation tool using React and OpenAI API',
    image: 'https://images.unsplash.com/photo-1547954575-855750c57bd3?auto=format&fit=crop&w=800&h=400',
    github: '#',
    demo: '#'
  }
];

export default function Projects() {
  return (
    <Section id="projects" title="Featured Projects" className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            {...project}
            delay={index * 100}
          />
        ))}
      </div>
    </Section>
  );
}