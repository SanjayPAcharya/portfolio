import React from "react";
import { ExternalLink, Github } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  github?: string;
  demo?: string;
  delay?: number;
  isDemoLive?: boolean; // computed by parent
  needServer?: boolean;
}

export default function ProjectCard({
  title,
  description,
  image,
  github,
  demo,
  delay = 0,
  isDemoLive = false,
  needServer=false
}: ProjectCardProps): JSX.Element {
  const isDemoEnabled = !needServer || (needServer && isDemoLive);
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-md
            ${isDemoEnabled ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          {isDemoEnabled ? "Live" : "Offline"}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col justify-between min-h-[180px]">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 mt-4">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Github size={16} />
              Code
            </a>
          )}

          {/* Demo button is disabled when not live */}
          <a
            href={isDemoEnabled ? (demo ?? "#") : undefined}
            target={isDemoEnabled ? "_blank" : undefined}
            rel={isDemoEnabled ? "noopener noreferrer" : undefined}
            aria-disabled={!isDemoEnabled}
            onClick={(e) => {
              if (!isDemoEnabled) e.preventDefault();
            }}
            className={`inline-flex items-center gap-2 text-sm font-medium rounded-full px-3 py-1.5 transition-all
              ${isDemoEnabled
                ? "bg-white text-blue-600 hover:text-blue-800 border border-blue-100 shadow-sm"
                : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-80"}`}
          >
            <ExternalLink size={16} />
            Demo
          </a>
        </div>
      </div>
    </div>
  );
}
