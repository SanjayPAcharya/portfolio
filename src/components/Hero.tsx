import { useEffect, useRef, useState } from 'react';
import ParticlesBackground from './ParticlesBackground';

const typingTexts = [
  'AI-driven Product Development',
  'Full Stack (React, Angular, Node.js, Python)',
  'Cloud Architecture & DevOps (AWS Certified)',
  'Agentic AI Workflows',
  'System Design & Scalability',
  'Team Leadership & Mentoring',
  'Agile & Product Delivery Excellence'
];

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const typingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const currentText = typingTexts[textIndex];
    const typingSpeed = isDeleting ? 20 : 50;
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex < currentText.length) {
      // Typing forward
      timeout = setTimeout(() => {
        setDisplayText(currentText.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
    } 
    else if (isDeleting && charIndex > 0) {
      // Deleting backwards
      timeout = setTimeout(() => {
        setDisplayText(currentText.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, typingSpeed);
    } 
    else if (!isDeleting && charIndex === currentText.length) {
      // Pause at full text
      timeout = setTimeout(() => setIsDeleting(true), 1500);
    } 
    else if (isDeleting && charIndex === 0) {
      // Move to next word
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % typingTexts.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex]);

  return (
    <ParticlesBackground>
    <section id="home" className="gradient-bg min-h-screen flex items-center justify-center text-white">
      <div className="text-center px-4">
        <div className="w-32 h-32 mx-auto mb-8 relative flex items-center justify-center">
          <img
            src="/image-min.png"
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white/20"
            style={{ background: 'rgba(255,255,255,0)' }}
          />
          <div className="absolute inset-0 rounded-full bg-white/20" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 fade-in">Sanjay Kumar P</h1>
        <p
          className="text-base md:text-lg mb-8 fade-in typing"
          ref={typingRef}
          style={{ minHeight: 32 }}
        >
          {displayText}
          <span className="typing-cursor">|</span>
        </p>
        <p className="text-lg mb-8 max-w-2xl mx-auto fade-in">
        8+ years in the code trenches — now on a quest to tame AI, boost productivity, and ship smarter, faster, better.
        </p>
        <div className="space-x-4 fade-in">
          <a href="#contact" className="border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Get In Touch
          </a>
        </div>
      </div>
      <style>{`
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .fade-in { opacity: 0; transform: translateY(20px); animation: fadeIn 0.6s ease forwards; }
        @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
        .typing-cursor { animation: blink 1s infinite; }
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
      `}</style>
    </section>
    </ParticlesBackground>
  );
}
