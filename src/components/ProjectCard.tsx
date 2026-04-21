import React from 'react';
import { ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  description: string;
  github?: string;
  demo?: string;
  isDemoLive?: boolean;
  needServer?: boolean;
  tags?: string[];
  featured?: boolean;
}

export default function ProjectCard({
  title,
  description,
  github,
  demo,
  isDemoLive = false,
  needServer = false,
  tags = [],
  featured = false,
}: ProjectCardProps): JSX.Element {
  const isDemoEnabled = !needServer || isDemoLive;

  if (featured) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="glass rounded-2xl overflow-hidden gradient-border group"
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-medium text-violet-400/70 tracking-[0.2em] uppercase">Featured</span>
            <span className={`text-[9px] font-semibold px-2.5 py-1 rounded-full ${
              isDemoEnabled
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-white/5 text-slate-500 border border-white/10'
            }`}>
              {isDemoEnabled ? '● Live' : '○ Offline'}
            </span>
          </div>

          <h3 className="font-display font-bold text-xl text-white mb-3 leading-snug">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{description}</p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-7">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            <a
              href={isDemoEnabled ? (demo ?? '#') : undefined}
              target={isDemoEnabled ? '_blank' : undefined}
              rel={isDemoEnabled ? 'noopener noreferrer' : undefined}
              aria-disabled={!isDemoEnabled}
              onClick={e => { if (!isDemoEnabled) e.preventDefault(); }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                isDemoEnabled
                  ? 'text-white hover:opacity-90 hover:scale-105'
                  : 'text-slate-500 bg-white/5 border border-white/10 cursor-not-allowed'
              }`}
              style={isDemoEnabled ? {
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                boxShadow: '0 0 24px rgba(139,92,246,0.4)',
              } : {}}
            >
              <ExternalLink size={13} />
              Live Demo
            </a>
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <FaGithub size={15} />
                Source
              </a>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-2xl overflow-hidden flex flex-col h-full group hover:bg-white/[0.07] transition-colors duration-300"
    >
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-white text-base">{title}</h3>
          <span className={`text-[9px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
            isDemoEnabled
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/10 text-slate-500 border border-white/10'
          }`}>
            {isDemoEnabled ? '● Live' : '○ Offline'}
          </span>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">{description}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map(tag => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pt-1">
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              <FaGithub size={13} /> Code
            </a>
          )}
          <a
            href={isDemoEnabled ? (demo ?? '#') : undefined}
            target={isDemoEnabled ? '_blank' : undefined}
            rel={isDemoEnabled ? 'noopener noreferrer' : undefined}
            aria-disabled={!isDemoEnabled}
            onClick={e => { if (!isDemoEnabled) e.preventDefault(); }}
            className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              isDemoEnabled
                ? 'text-white hover:opacity-90'
                : 'text-slate-500 bg-white/5 border border-white/10 cursor-not-allowed'
            }`}
            style={isDemoEnabled ? { background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' } : {}}
          >
            <ExternalLink size={11} /> Demo
          </a>
        </div>
      </div>
    </motion.div>
  );
}
