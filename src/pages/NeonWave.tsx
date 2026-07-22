import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';

const BG = '#0A0114';
const PANEL = 'rgba(20, 6, 38, 0.6)';
const TEXT = '#EDE9FF';
const MUTED = '#9A8FC4';
const PINK = '#FF2D95';
const CYAN = '#05D9E8';
const PURPLE = '#9D4EDD';
const ORANGE = '#FF6C11';

const display = { fontFamily: "'Orbitron', ui-sans-serif, sans-serif" };
const mono = { fontFamily: "'Space Mono', ui-monospace, monospace" };

const glow = (c: string, px = 12) => `0 0 ${px}px ${c}, 0 0 ${px * 2}px ${c}55`;

const STACK = [
  'Angular', 'React', 'Flutter', 'Node.js', 'Python', 'Django',
  'SQL', 'NoSQL', 'AWS', 'Docker', 'CI / CD', 'LLMs', 'AI Agents',
];

const PROJECTS = [
  {
    title: 'Live SSE Dashboard',
    year: '2025',
    accent: CYAN,
    blurb: 'Real-time dashboard streaming live data to the browser with zero polling — persistent connections and event parsing at scale.',
    tags: ['SSE', 'React', 'Node.js', 'EC2'],
    demo: 'https://sse.sanjaykumarp.info',
    source: 'https://github.com/SanjayPAcharya/sse-realtime-app',
  },
  {
    title: 'JSON Compressor',
    year: '2025',
    accent: PINK,
    blurb: 'Browser-based JSON compression / decompression with live size comparison — no server round-trips.',
    tags: ['React', 'TypeScript', 'S3'],
    demo: 'http://compress-decompress.s3-website-us-east-1.amazonaws.com',
    source: 'https://github.com/SanjayPAcharya/compress-decompress-json',
  },
  {
    title: 'PMAGENT',
    year: 'In dev',
    accent: PURPLE,
    blurb: 'An AI project-management agent — autonomous planning, ticketing, and progress tracking.',
    tags: ['AI Agent', 'LLM', 'AWS'],
  },
];

const CAPABILITIES = [
  { n: '01', title: 'Frontend', desc: 'React · Angular · Flutter — responsive, interactive UIs.', accent: CYAN },
  { n: '02', title: 'Backend', desc: 'Node.js · Python · Django on SQL + NoSQL.', accent: PINK },
  { n: '03', title: 'DevOps & Cloud', desc: 'CI/CD · AWS · Docker — three cloud certs.', accent: PURPLE },
  { n: '04', title: 'AI / LLM', desc: 'Agentic workflows and LLM-powered features.', accent: ORANGE },
];

const STATS = [
  { v: '08+', l: 'Years' },
  { v: '50+', l: 'Shipped' },
  { v: '03', l: 'Cloud certs' },
];

const SOCIAL = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sanjay-kumar-p/' },
  { label: 'GitHub', href: 'https://github.com/SanjayPAcharya' },
  { label: 'X / Twitter', href: 'https://x.com/sanjay_kumar_p' },
];

const OTHER = [
  { label: '/dev', href: '/dev' },
  { label: '/agent', href: '/agent' },
  { label: '/brutal', href: '/brutal' },
  { label: 'classic', href: '/' },
];

const reveal = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: 'easeOut' as const },
};

const STYLES = `
@keyframes nw-scroll { from { background-position: 0 0; } to { background-position: 0 40px; } }
@keyframes nw-flicker {
  0%, 19%, 21%, 23%, 100% { opacity: 1; }
  20%, 22% { opacity: 0.72; }
}
.nw-grid {
  position: absolute; left: 50%; bottom: 0;
  width: 260%; height: 55vh;
  transform: translateX(-50%) perspective(340px) rotateX(62deg);
  transform-origin: bottom center;
  background-image:
    linear-gradient(to right, rgba(157,78,221,0.55) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(5,217,232,0.45) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: nw-scroll 1.4s linear infinite;
  mask-image: linear-gradient(to top, #000 20%, transparent 90%);
  -webkit-mask-image: linear-gradient(to top, #000 20%, transparent 90%);
  pointer-events: none;
}
.nw-scan {
  position: fixed; inset: 0; z-index: 40; pointer-events: none;
  background: repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0, rgba(0,0,0,0) 2px, rgba(0,0,0,0.14) 3px, rgba(0,0,0,0) 4px);
  mix-blend-mode: overlay;
}
.nw-flicker { animation: nw-flicker 4.5s infinite; }
`;

export default function NeonWave() {
  const [form, setForm] = useState({ name: '', email: '', description: '' });
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');
  const { post, loading } = useApi();

  useEffect(() => {
    document.title = 'Sanjay Kumar P — Neon';
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setFormError('Name and a valid email are required.');
      return;
    }
    try {
      await post('contacts', form);
      setSent(true);
      setForm({ name: '', email: '', description: '' });
    } catch {
      setFormError('Transmission failed — reach me on LinkedIn instead.');
    }
  };

  const inputStyle = {
    background: 'rgba(10,1,20,0.6)',
    border: `1px solid ${PURPLE}66`,
    color: TEXT,
    ...mono,
  } as const;

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: BG, color: TEXT }}>
      <style>{STYLES}</style>
      <div className="nw-scan" />

      {/* Hero backdrop: sun + grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            top: '4%', width: 'min(70vw, 460px)', height: 'min(70vw, 460px)',
            background: `radial-gradient(circle at 50% 40%, ${ORANGE}, ${PINK} 55%, ${PURPLE} 80%)`,
            filter: 'blur(2px)',
            boxShadow: `0 0 120px ${PINK}88`,
            opacity: 0.85,
          }}
        />
        <div className="nw-grid" />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 0%, transparent 40%, ${BG} 78%)` }} />
      </div>

      {/* Nav */}
      <header className="relative z-50 border-b" style={{ borderColor: `${PURPLE}44`, background: 'rgba(10,1,20,0.55)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between text-xs" style={mono}>
          <a href="#top" className="font-bold tracking-[0.25em] uppercase" style={{ ...display, color: CYAN, textShadow: glow(CYAN, 8) }}>
            SANJAY_P
          </a>
          <nav className="flex items-center gap-3 sm:gap-4 uppercase tracking-wider">
            {OTHER.map((o, i) => (
              <a key={o.href} href={o.href} className="transition-colors hover:text-white" style={{ color: [CYAN, PINK, PURPLE, MUTED][i] }}>
                {o.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="top" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <section className="pt-24 pb-24 text-center">
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm tracking-[0.4em] uppercase mb-6" style={{ color: CYAN, ...mono }}
          >
            ◄ Full-stack + AI Engineer ►
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="nw-flicker font-black uppercase leading-[0.95] tracking-tight"
            style={{
              fontSize: 'clamp(2.6rem, 10vw, 7rem)',
              ...display,
              color: '#fff',
              textShadow: `0 0 8px #fff, 0 0 24px ${PINK}, 0 0 48px ${PINK}, 0 4px 0 ${PURPLE}`,
            }}
          >
            Sanjay Kumar P
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-xl mx-auto mt-8 text-sm sm:text-base leading-relaxed" style={{ color: MUTED, ...mono }}
          >
            Eight-plus years in the code trenches — now taming AI to ship
            smarter, faster, better. Scalable systems, clean code, neon nights.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-3 mt-10">
            <a href="#work" className="px-6 py-3 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105" style={{ ...mono, color: BG, background: CYAN, boxShadow: glow(CYAN, 10) }}>
              View work ▸
            </a>
            <a href="#contact" className="px-6 py-3 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105" style={{ ...mono, color: PINK, border: `1px solid ${PINK}`, boxShadow: glow(PINK, 8) }}>
              Get in touch
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16">
            {STATS.map((s, i) => (
              <div key={s.l} className="py-4 rounded-lg" style={{ background: PANEL, border: `1px solid ${[CYAN, PINK, PURPLE][i]}55` }}>
                <p className="font-black" style={{ fontSize: 'clamp(1.6rem,5vw,2.5rem)', ...display, color: [CYAN, PINK, PURPLE][i], textShadow: glow([CYAN, PINK, PURPLE][i], 8) }}>{s.v}</p>
                <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: MUTED, ...mono }}>{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stack marquee */}
        <section className="pb-20">
          <div className="overflow-hidden border-y py-3" style={{ borderColor: `${PURPLE}44` }}>
            <motion.div className="flex whitespace-nowrap" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 26, ease: 'linear', repeat: Infinity }}>
              {[...STACK, ...STACK].map((s, i) => (
                <span key={`${s}-${i}`} className="text-sm uppercase tracking-[0.2em] px-5 flex items-center gap-5" style={{ color: TEXT, ...mono }}>
                  {s}<span style={{ color: CYAN, textShadow: glow(CYAN, 6) }}>✦</span>
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Work */}
        <section id="work" className="pb-24">
          <h2 className="font-black uppercase tracking-widest text-center mb-12" style={{ fontSize: 'clamp(1.6rem,5vw,2.8rem)', ...display, color: '#fff', textShadow: glow(PURPLE, 10) }}>
            Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((p) => (
              <motion.div
                {...reveal}
                key={p.title}
                whileHover={{ y: -6 }}
                className="rounded-xl p-6 flex flex-col transition-shadow"
                style={{ background: PANEL, border: `1px solid ${p.accent}66`, boxShadow: `0 0 0 1px ${p.accent}22, inset 0 0 30px ${p.accent}11` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold uppercase tracking-wide text-sm" style={{ ...display, color: p.accent, textShadow: glow(p.accent, 6) }}>{p.title}</h3>
                  <span className="text-[10px] uppercase tracking-widest" style={{ color: MUTED, ...mono }}>{p.year}</span>
                </div>
                <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: MUTED }}>{p.blurb}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags.map((t) => (
                    <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded" style={{ color: TEXT, border: `1px solid ${PURPLE}55`, ...mono }}>{t}</span>
                  ))}
                </div>
                <div className="flex gap-4 text-xs uppercase tracking-wider" style={mono}>
                  {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" style={{ color: CYAN }}>demo ▸</a>}
                  {p.source && <a href={p.source} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" style={{ color: MUTED }}>source ▸</a>}
                  {!p.demo && !p.source && <span style={{ color: MUTED }}>weights not public</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section className="pb-24">
          <h2 className="font-black uppercase tracking-widest text-center mb-12" style={{ fontSize: 'clamp(1.6rem,5vw,2.8rem)', ...display, color: '#fff', textShadow: glow(CYAN, 10) }}>
            Capabilities
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CAPABILITIES.map((c) => (
              <motion.div {...reveal} key={c.n} className="rounded-xl p-5" style={{ background: PANEL, border: `1px solid ${c.accent}55` }}>
                <span className="text-xs tracking-widest" style={{ color: c.accent, ...mono, textShadow: glow(c.accent, 6) }}>{c.n}</span>
                <h3 className="font-bold uppercase tracking-wide text-base mt-2 mb-2" style={{ ...display, color: TEXT }}>{c.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="pb-24">
          <h2 className="font-black uppercase tracking-widest text-center mb-12" style={{ fontSize: 'clamp(1.8rem,6vw,3.5rem)', ...display, color: '#fff', textShadow: glow(PINK, 12) }}>
            Open a channel
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="rounded-xl p-6" style={{ background: PANEL, border: `1px solid ${CYAN}44` }}>
              <p className="text-sm leading-relaxed mb-6" style={{ color: MUTED }}>
                Open to full-stack, AI, or cloud engagements — greenfield products,
                stubborn legacy problems, or a team that needs senior hands-on help.
              </p>
              <div className="space-y-3">
                {SOCIAL.map((s, i) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg px-4 py-3 text-sm uppercase tracking-wider transition-transform hover:translate-x-1"
                    style={{ color: [CYAN, PINK, PURPLE][i], border: `1px solid ${[CYAN, PINK, PURPLE][i]}55`, ...mono }}
                  >
                    {s.label}<span>↗</span>
                  </a>
                ))}
              </div>
            </div>

            <form onSubmit={submit} noValidate className="rounded-xl p-6 space-y-4" style={{ background: PANEL, border: `1px solid ${PINK}44` }}>
              {sent ? (
                <p className="text-sm uppercase tracking-wide leading-relaxed" style={{ ...mono, color: CYAN, textShadow: glow(CYAN, 6) }}>
                  ▸ Transmission received. Reply inbound within ~24h.
                </p>
              ) : (
                <>
                  {[
                    { key: 'name', label: 'Name', type: 'text', placeholder: 'your name' },
                    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-[10px] uppercase tracking-[0.2em] mb-1.5" style={{ color: MUTED, ...mono }}>{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={form[f.key as 'name' | 'email']}
                        onChange={(e) => setForm((v) => ({ ...v, [f.key]: e.target.value }))}
                        className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none placeholder:opacity-40"
                        style={inputStyle}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] mb-1.5" style={{ color: MUTED, ...mono }}>Message</label>
                    <textarea
                      rows={3}
                      placeholder="tell me what you're building…"
                      value={form.description}
                      onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))}
                      className="w-full rounded-lg px-3 py-2.5 text-sm focus:outline-none resize-none placeholder:opacity-40"
                      style={inputStyle}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-[1.02] disabled:opacity-50"
                    style={{ ...mono, color: BG, background: PINK, boxShadow: glow(PINK, 10) }}
                  >
                    {loading ? 'transmitting…' : 'send transmission ▸'}
                  </button>
                  {formError && <p className="text-xs uppercase tracking-wide" style={{ color: ORANGE, ...mono }}>{formError}</p>}
                </>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t" style={{ borderColor: `${PURPLE}44` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] uppercase tracking-wider" style={{ color: MUTED, ...mono }}>
          <span>© {new Date().getFullYear()} Sanjay Kumar P · neon dreams</span>
          <div className="flex gap-3">
            {OTHER.map((o, i) => (
              <a key={o.href} href={o.href} className="hover:text-white transition-colors" style={{ color: [CYAN, PINK, PURPLE, MUTED][i] }}>{o.label}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
