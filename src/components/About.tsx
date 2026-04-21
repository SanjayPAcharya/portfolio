import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaReact, FaNodeJs, FaPython, FaDatabase, FaAws, FaAngular, FaDocker } from 'react-icons/fa';
import { SiFlutter } from 'react-icons/si';

const skills = [
  { name: 'Angular',         icon: <FaAngular  className="w-5 h-5" />, color: 'from-red-500 to-pink-500'   },
  { name: 'React',           icon: <FaReact    className="w-5 h-5" />, color: 'from-cyan-400 to-blue-500'  },
  { name: 'Flutter',         icon: <SiFlutter  className="w-5 h-5" />, color: 'from-sky-400 to-cyan-500'   },
  { name: 'Node.js',         icon: <FaNodeJs   className="w-5 h-5" />, color: 'from-green-400 to-emerald-500'},
  { name: 'Python / Django', icon: <FaPython   className="w-5 h-5" />, color: 'from-yellow-400 to-amber-500'},
  { name: 'SQL / NoSQL',     icon: <FaDatabase className="w-5 h-5" />, color: 'from-violet-400 to-purple-500'},
  { name: 'AWS Cloud',       icon: <FaAws      className="w-5 h-5" />, color: 'from-orange-400 to-yellow-500'},
  { name: 'CI / CD',         icon: <FaDocker   className="w-5 h-5" />, color: 'from-blue-400 to-indigo-500' },
];

const whatIDo = [
  {
    gradient: 'from-violet-600 to-blue-600',
    title: 'Frontend Development',
    desc: 'Crafting responsive, interactive UIs with modern frameworks and clean UX.',
  },
  {
    gradient: 'from-pink-500 to-rose-600',
    title: 'Backend Development',
    desc: 'Robust APIs and server-side apps using Node.js, Python, and scalable databases.',
  },
  {
    gradient: 'from-cyan-500 to-teal-500',
    title: 'DevOps & Cloud',
    desc: 'CI/CD pipelines, AWS infrastructure, containerisation, and observability.',
  },
  {
    gradient: 'from-amber-400 to-orange-500',
    title: 'AI / LLM Integration',
    desc: 'Agentic AI workflows, LLM-powered features, and GenAI product delivery.',
  },
];

const stats = [
  { value: '8+',  label: 'Years Experience' },
  { value: '50+', label: 'Projects Shipped'  },
  { value: '3',   label: 'Cloud Certs'       },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const blobY1 = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const blobY2 = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  return (
    <section ref={sectionRef} id="about" className="relative py-28 bg-[#08080F] overflow-hidden">
      {/* Parallax blobs */}
      <motion.div style={{ y: blobY1 }} className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-700/15 rounded-full blur-[140px] pointer-events-none" />
      <motion.div style={{ y: blobY2 }} className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-700/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-xs font-medium text-violet-400/70 tracking-[0.25em] uppercase mb-3">
            — About Me —
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl font-bold gradient-text mb-5">
            Who I Am
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            Full-Stack Engineer with 8+ years building software that balances performance, simplicity, and usability. I transform ideas into scalable systems through clean code and thoughtful design.
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-3 gap-4 mb-16"
        >
          {stats.map(s => (
            <motion.div key={s.label} variants={fadeUp} className="glass rounded-2xl p-5 text-center">
              <p className="font-display text-3xl md:text-4xl font-bold gradient-text mb-1">{s.value}</p>
              <p className="text-xs text-slate-500 tracking-wide">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Two-column */}
        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* Left — Skills */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          >
            <motion.h3 variants={fadeUp} className="font-display text-xl font-semibold text-white mb-6">
              Tech Stack
            </motion.h3>
            <div className="grid grid-cols-2 gap-3">
              {skills.map(skill => (
                <motion.div
                  key={skill.name}
                  variants={fadeUp}
                  className="glass rounded-xl p-4 flex items-center gap-3 group hover:bg-white/[0.08] transition-colors duration-200"
                >
                  <span
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-white bg-gradient-to-br ${skill.color} flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}
                  >
                    {skill.icon}
                  </span>
                  <span className="text-sm text-slate-300 font-medium">{skill.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — What I Do */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h3 variants={fadeUp} className="font-display text-xl font-semibold text-white mb-6">
              What I Do
            </motion.h3>
            <div className="space-y-4">
              {whatIDo.map(item => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="glass rounded-xl p-5 flex items-start gap-4 hover:bg-white/[0.07] transition-colors duration-200 group"
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 bg-gradient-to-br ${item.gradient} group-hover:scale-125 transition-transform duration-200`}
                  />
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
