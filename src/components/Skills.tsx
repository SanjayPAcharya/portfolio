import React from 'react';
import { Code2, Server, Database, Globe } from 'lucide-react';
import Section from './Section';
import SkillCard from './SkillCard';

const skills = [
  {
    icon: <Code2 className="w-12 h-12 text-blue-700 mb-4" />,
    title: 'Frontend',
    description: 'React, TypeScript, Tailwind CSS, Next.js',
    color: 'blue'
  },
  {
    icon: <Server className="w-12 h-12 text-green-700 mb-4" />,
    title: 'Backend',
    description: 'Node.js, Express, Python, Java',
    color: 'green'
  },
  {
    icon: <Database className="w-12 h-12 text-purple-700 mb-4" />,
    title: 'Database',
    description: 'PostgreSQL, MongoDB, Redis',
    color: 'purple'
  },
  {
    icon: <Globe className="w-12 h-12 text-indigo-700 mb-4" />,
    title: 'DevOps',
    description: 'AWS, Docker, CI/CD, Kubernetes',
    color: 'indigo'
  }
];

export default function Skills() {
  return (
    <Section id="skills" title="Skills" className="bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {skills.map((skill, index) => (
          <SkillCard
            key={skill.title}
            {...skill}
            delay={index * 100}
          />
        ))}
      </div>
    </Section>
  );
}