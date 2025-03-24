import React from 'react';

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

export default function SocialLink({ href, icon }: SocialLinkProps) {
  return (
    <a
      href={href}
      className="text-gray-600 hover:text-gray-900 transition-all duration-300 transform hover:scale-110"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
}