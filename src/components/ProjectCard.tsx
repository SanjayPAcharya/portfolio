import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  github: string;
  demo: string;
  delay: number;
}

export default function ProjectCard({ title, description, image, github, demo, delay }: ProjectCardProps) {
  return (
    <div
      className="bg-gray-50 rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative overflow-hidden group">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center gap-4">
          <a
            href={github}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={20} />
            Code
          </a>
          <a
            href={demo}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={20} />
            Demo
          </a>
        </div>
      </div>
    </div>
  );
}