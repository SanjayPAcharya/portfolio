import React from 'react';

interface SkillCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

export default function SkillCard({ icon, title, description, delay }: SkillCardProps) {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-sm transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      {icon}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}