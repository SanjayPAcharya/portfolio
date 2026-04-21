import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ParticlesBackground from './ParticlesBackground';

const roles = [
  'AI-driven Product Development',
  'Full Stack Development',
  'Cloud Architecture & DevOps (AWS)',
  'Agentic AI Workflows',
  'System Design & Scalability',
];

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const { scrollY } = useScroll();

  const blob1Y = useTransform(scrollY, [0, 700], [0, -140]);
  const blob2Y = useTransform(scrollY, [0, 700], [0, -90]);
  const blob3Y = useTransform(scrollY, [0, 700], [0, -60]);
  const contentY = useTransform(scrollY, [0, 500], [0, -70]);

  useEffect(() => {
    const text = roles[textIndex];
    const speed = isDeleting ? 18 : 55;
    let t: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex < text.length) {
      t = setTimeout(() => { setDisplayText(text.slice(0, charIndex + 1)); setCharIndex(c => c + 1); }, speed);
    } else if (isDeleting && charIndex > 0) {
      t = setTimeout(() => { setDisplayText(text.slice(0, charIndex - 1)); setCharIndex(c => c - 1); }, speed);
    } else if (!isDeleting && charIndex === text.length) {
      t = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTextIndex(i => (i + 1) % roles.length);
    }

    return () => clearTimeout(t);
  }, [charIndex, isDeleting, textIndex]);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#08080F]">
      {/* Particles */}
      <div className="absolute inset-0 z-0">
        <ParticlesBackground />
      </div>

      {/* Dot pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none z-0" />

      {/* Parallax blobs */}
      <motion.div
        style={{ y: blob1Y }}
        className="absolute top-20 left-[8%] w-80 h-80 bg-violet-600/25 rounded-full blur-[120px] pointer-events-none z-0 animate-blob"
      />
      <motion.div
        style={{ y: blob2Y }}
        className="absolute top-32 right-[8%] w-96 h-96 bg-pink-600/18 rounded-full blur-[130px] pointer-events-none z-0 animate-blob-2"
      />
      <motion.div
        style={{ y: blob3Y }}
        className="absolute bottom-16 left-[35%] w-72 h-72 bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none z-0 animate-blob-3"
      />

      {/* Main content */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        {/* Profile image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative inline-block mb-8 animate-float"
        >
          <div className="relative w-32 h-32 mx-auto">
            {/* Spinning gradient ring */}
            <div className="absolute inset-0 rounded-full p-[2px] animate-spin-slow"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #22D3EE)' }}>
              <div className="w-full h-full rounded-full bg-[#08080F]" />
            </div>
            <img
              src="/image-min.png"
              alt="Sanjay Kumar P"
              className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-full object-cover"
            />
          </div>
          {/* Pulse rings */}
          <span className="absolute inset-[-8px] rounded-full border border-violet-500/25 animate-pulse-slow" />
          <span className="absolute inset-[-18px] rounded-full border border-pink-500/15 animate-pulse-slow" style={{ animationDelay: '0.7s' }} />
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display text-5xl md:text-7xl font-bold mb-3 gradient-text tracking-tight leading-none"
        >
          Sanjay Kumar P
        </motion.h1>

        {/* Typing role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="h-8 mb-5"
        >
          <span className="text-sm md:text-base text-slate-300 font-medium">
            {displayText}
            <span className="typing-cursor text-violet-400">|</span>
          </span>
        </motion.div>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="text-slate-400 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed"
        >
          8+ years in the code trenches — now on a quest to tame AI, boost productivity, and ship smarter, faster, better.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#contact"
            onClick={scrollTo('#contact')}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #22D3EE)',
              boxShadow: '0 0 32px rgba(139,92,246,0.45)',
            }}
          >
            Get In Touch
          </a>
          <a
            href="#projects"
            onClick={scrollTo('#projects')}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-semibold text-slate-200 glass hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            View Projects
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-slate-600 text-[10px] tracking-[0.2em] font-medium">SCROLL</span>
        <div className="w-px h-10 bg-gradient-to-b from-slate-500/60 to-transparent" />
      </motion.div>
    </section>
  );
}
