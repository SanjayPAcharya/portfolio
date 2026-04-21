import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProjectCard from './ProjectCard';
import EC2ControlInline from './EC2ControlInline';
interface Project {
  title: string;
  description: string;
  github?: string;
  demo?: string;
  isDemoLive?: boolean;
  needServer?: boolean;
  tags?: string[];
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: 'Live Dashboard using SSE',
    description:
      'Real-time dashboard powered by Server-Sent Events — streaming live data from a Node.js backend to a React UI without polling. Persistent connections, event parsing, and live UI updates at scale.',
    github: 'https://github.com/SanjayPAcharya/sse-realtime-app',
    demo: 'https://sse.sanjaykumarp.info',
    isDemoLive: true,
    needServer: true,
    tags: ['SSE', 'React', 'Node.js', 'AWS EC2'],
    featured: true,
  },
  {
    title: 'Compression / Decompression',
    description:
      'Browser-based tool to compress and decompress JSON objects with live size comparison.',
    github: 'https://github.com/SanjayPAcharya/compress-decompress-json',
    demo: 'http://compress-decompress.s3-website-us-east-1.amazonaws.com',
    isDemoLive: true,
    needServer: false,
    tags: ['React', 'TypeScript', 'AWS S3'],
    featured: false,
  },
];

export default function Projects(): JSX.Element {
  const [isServerRunning, setIsServerRunning] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const blobY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  return (
    <section ref={sectionRef} id="projects" className="relative py-28 bg-[#08080F] overflow-hidden">
      <motion.div
        style={{ y: blobY }}
        className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-700/10 rounded-full blur-[150px] pointer-events-none"
      />
      <motion.div
        style={{ y: blobY }}
        className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-violet-700/12 rounded-full blur-[130px] pointer-events-none"
      />
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs font-medium text-violet-400/70 tracking-[0.25em] uppercase mb-3">
            — Work Log —
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text">Projects</h2>
            <p className="text-sm text-slate-500 tracking-wide">Experiments & shipped products</p>
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-violet-500/40 via-pink-500/20 to-transparent" />
        </motion.div>

        {/* EC2 control */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <EC2ControlInline isRunningProp={isServerRunning} onStatusChange={setIsServerRunning} />
        </motion.div>

        {/* Cards */}
        <div className="space-y-6">
          {projects.map((project, i) => {
            const effectiveIsDemoLive = Boolean(
              project.isDemoLive && (!project.needServer || isServerRunning)
            );
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
              >
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  github={project.github}
                  demo={project.demo}
                  isDemoLive={effectiveIsDemoLive}
                  needServer={project.needServer}
                  tags={project.tags}
                  featured={project.featured}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
