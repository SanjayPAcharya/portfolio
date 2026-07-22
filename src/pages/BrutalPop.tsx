import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';

const PAPER = '#FBF7ED';
const INK = '#111111';

const BLUE = '#3B5BFF';
const PINK = '#FF5CA8';
const YELLOW = '#FFD23F';
const LIME = '#9BE564';
const PURPLE = '#B15CFF';

const display = { fontFamily: "'Space Grotesk', ui-sans-serif, sans-serif" };
const mono = { fontFamily: "'Space Mono', ui-monospace, monospace" };

const STACK = [
  'Angular', 'React', 'Flutter', 'Node.js', 'Python / Django',
  'SQL / NoSQL', 'AWS', 'Docker', 'CI / CD', 'LLMs', 'AI Agents',
];

const PROJECTS = [
  {
    title: 'Live SSE Dashboard',
    year: '2025',
    color: BLUE,
    blurb: 'Real-time dashboard streaming live data to the browser with zero polling — persistent connections and event parsing at scale.',
    tags: ['SSE', 'React', 'Node.js', 'AWS EC2'],
    demo: 'https://sse.sanjaykumarp.info',
    source: 'https://github.com/SanjayPAcharya/sse-realtime-app',
  },
  {
    title: 'JSON Compressor',
    year: '2025',
    color: PINK,
    blurb: 'Browser-based JSON compression / decompression with live size comparison — no server round-trips.',
    tags: ['React', 'TypeScript', 'AWS S3'],
    demo: 'http://compress-decompress.s3-website-us-east-1.amazonaws.com',
    source: 'https://github.com/SanjayPAcharya/compress-decompress-json',
  },
  {
    title: 'PMAGENT',
    year: 'In dev',
    color: LIME,
    blurb: 'An AI project-management agent — autonomous planning, ticketing, and progress tracking.',
    tags: ['AI Agent', 'LLM', 'AWS'],
  },
];

const CAPABILITIES = [
  { n: '01', title: 'Frontend', color: YELLOW, desc: 'Responsive, interactive UIs — React, Angular, Flutter — with clean UX.' },
  { n: '02', title: 'Backend', color: BLUE, desc: 'Robust APIs and services with Node.js and Python on SQL + NoSQL stores.' },
  { n: '03', title: 'DevOps & Cloud', color: PINK, desc: 'CI/CD, AWS infra, containers and observability — three cloud certs.' },
  { n: '04', title: 'AI / LLM', color: PURPLE, desc: 'Agentic AI workflows and LLM-powered features, delivered end to end.' },
];

const STATS = [
  { v: '08+', l: 'Years', color: YELLOW },
  { v: '50+', l: 'Shipped', color: PINK },
  { v: '03', l: 'Cloud certs', color: BLUE },
];

const SOCIAL = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sanjay-kumar-p/' },
  { label: 'GitHub', href: 'https://github.com/SanjayPAcharya' },
  { label: 'X / Twitter', href: 'https://x.com/sanjay_kumar_p' },
];

const OTHER = [
  { label: '/dev', href: '/dev' },
  { label: '/agent', href: '/agent' },
  { label: '/neon', href: '/neon' },
  { label: 'classic', href: '/' },
];

const reveal = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

const card = 'border-[3px] border-black transition-all duration-150';
const hardShadow = 'shadow-[6px_6px_0_#000] hover:shadow-[10px_10px_0_#000] hover:-translate-x-1 hover:-translate-y-1';

function Sticker({ children, color, rotate }: { children: React.ReactNode; color: string; rotate: string }) {
  return (
    <span
      className={`inline-block border-[3px] border-black px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-[3px_3px_0_#000] ${rotate}`}
      style={{ background: color, ...mono }}
    >
      {children}
    </span>
  );
}

export default function BrutalPop() {
  const [form, setForm] = useState({ name: '', email: '', description: '' });
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');
  const { post, loading } = useApi();

  useEffect(() => {
    document.title = 'Sanjay Kumar P — Bold';
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
      setFormError('Could not send right now — reach me on LinkedIn instead.');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: PAPER, color: INK }}>
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b-[3px] border-black" style={{ background: PAPER }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#top" className="text-xl font-black uppercase tracking-tight" style={display}>
            SANJAY<span style={{ color: PINK }}>*</span>
          </a>
          <nav className="hidden sm:flex items-center gap-2">
            {OTHER.map((o, i) => (
              <a
                key={o.href}
                href={o.href}
                className="border-[3px] border-black px-3 py-1 text-xs font-bold uppercase shadow-[3px_3px_0_#000] hover:-translate-y-0.5 transition-transform"
                style={{ background: [YELLOW, LIME, PINK, '#fff'][i], ...mono }}
              >
                {o.label}
              </a>
            ))}
          </nav>
          <a href="/" className="sm:hidden border-[3px] border-black px-3 py-1 text-xs font-bold uppercase shadow-[3px_3px_0_#000]" style={mono}>
            classic
          </a>
        </div>
      </header>

      <main id="top" className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <section className="pt-14 pb-16">
          <div className="flex flex-wrap gap-3 mb-8">
            <Sticker color={LIME} rotate="-rotate-2">● Available for work</Sticker>
            <Sticker color={YELLOW} rotate="rotate-1">8+ yrs shipping</Sticker>
            <Sticker color={PINK} rotate="-rotate-1">Full-stack + AI</Sticker>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-black uppercase leading-[0.85] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(3rem, 12vw, 9rem)', ...display }}
          >
            Sanjay
            <br />
            Kumar <span style={{ WebkitTextStroke: '2px #111', color: PINK }}>P.</span>
          </motion.h1>

          <div className="mt-8 grid md:grid-cols-[1.4fr_1fr] gap-6">
            <div className={`${card} bg-white p-6 shadow-[6px_6px_0_#000]`}>
              <p className="text-base sm:text-lg font-medium leading-relaxed" style={display}>
                Eight-plus years in the code trenches — now taming AI to ship
                smarter, faster, better. I turn ideas into scalable systems
                through clean code and loud, honest design.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {STATS.map((s) => (
                <div key={s.l} className={`${card} p-3 flex flex-col justify-center text-center shadow-[6px_6px_0_#000]`} style={{ background: s.color }}>
                  <span className="font-black leading-none" style={{ fontSize: 'clamp(1.6rem,4vw,2.6rem)', ...display }}>{s.v}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider mt-1" style={mono}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stack marquee */}
        <section className="pb-16">
          <div className="border-[3px] border-black overflow-hidden shadow-[6px_6px_0_#000]" style={{ background: INK }}>
            <motion.div
              className="flex whitespace-nowrap py-3"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
            >
              {[...STACK, ...STACK].map((s, i) => (
                <span key={`${s}-${i}`} className="text-sm font-bold uppercase tracking-wider px-5 flex items-center gap-5" style={{ color: PAPER, ...mono }}>
                  {s}
                  <span style={{ color: YELLOW }}>◆</span>
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Work */}
        <section id="work" className="pb-20">
          <h2 className="font-black uppercase tracking-tight mb-8" style={{ fontSize: 'clamp(2rem,6vw,3.5rem)', ...display }}>
            Selected work<span style={{ color: BLUE }}>.</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((p) => (
              <motion.div {...reveal} key={p.title} className={`${card} ${hardShadow} bg-white flex flex-col`}>
                <div className="border-b-[3px] border-black px-5 py-3 flex items-center justify-between" style={{ background: p.color }}>
                  <span className="font-black uppercase text-sm tracking-tight" style={display}>{p.title}</span>
                  <span className="text-[10px] font-bold uppercase border-2 border-black bg-white px-2 py-0.5" style={mono}>{p.year}</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-sm font-medium leading-relaxed mb-4">{p.blurb}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[10px] font-bold uppercase border-2 border-black px-2 py-0.5" style={{ background: PAPER, ...mono }}>{t}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex gap-2">
                    {p.demo && (
                      <a href={p.demo} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs font-bold uppercase border-[3px] border-black py-2 shadow-[3px_3px_0_#000] hover:-translate-y-0.5 transition-transform" style={{ background: YELLOW, ...mono }}>
                        Live ↗
                      </a>
                    )}
                    {p.source && (
                      <a href={p.source} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs font-bold uppercase border-[3px] border-black py-2 shadow-[3px_3px_0_#000] hover:-translate-y-0.5 transition-transform bg-white" style={mono}>
                        Code ↗
                      </a>
                    )}
                    {!p.demo && !p.source && (
                      <span className="flex-1 text-center text-xs font-bold uppercase border-[3px] border-black py-2 opacity-50" style={mono}>Coming soon</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section className="pb-20">
          <h2 className="font-black uppercase tracking-tight mb-8" style={{ fontSize: 'clamp(2rem,6vw,3.5rem)', ...display }}>
            What I do<span style={{ color: PINK }}>.</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAPABILITIES.map((c) => (
              <motion.div {...reveal} key={c.n} className={`${card} ${hardShadow} p-5`} style={{ background: c.color }}>
                <span className="text-2xl font-black" style={mono}>{c.n}</span>
                <h3 className="text-lg font-black uppercase tracking-tight mt-2 mb-2" style={display}>{c.title}</h3>
                <p className="text-sm font-medium leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="pb-20">
          <h2 className="font-black uppercase tracking-tight mb-8" style={{ fontSize: 'clamp(2rem,7vw,4.5rem)', ...display }}>
            Let's build<br />something<span style={{ color: LIME, WebkitTextStroke: '2px #111' }}>!</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className={`${card} bg-white p-6 shadow-[6px_6px_0_#000]`}>
              <p className="text-sm font-medium leading-relaxed mb-6">
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
                    className="flex items-center justify-between border-[3px] border-black px-4 py-3 font-bold uppercase text-sm shadow-[4px_4px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform"
                    style={{ background: [YELLOW, PINK, BLUE][i], ...mono }}
                  >
                    {s.label}
                    <span>↗</span>
                  </a>
                ))}
              </div>
            </div>

            <form onSubmit={submit} noValidate className={`${card} bg-white p-6 shadow-[6px_6px_0_#000] space-y-4`}>
              {sent ? (
                <p className="font-bold uppercase text-lg" style={display}>
                  <span style={{ background: LIME }} className="px-1">Message received!</span> I'll reply within ~24h.
                </p>
              ) : (
                <>
                  {[
                    { key: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={mono}>{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={form[f.key as 'name' | 'email']}
                        onChange={(e) => setForm((v) => ({ ...v, [f.key]: e.target.value }))}
                        className="w-full border-[3px] border-black px-3 py-2.5 text-base focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow"
                        style={{ background: PAPER, ...mono }}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={mono}>Message</label>
                    <textarea
                      rows={3}
                      placeholder="Tell me what you're building…"
                      value={form.description}
                      onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))}
                      className="w-full border-[3px] border-black px-3 py-2.5 text-base focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow resize-none"
                      style={{ background: PAPER, ...mono }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full border-[3px] border-black py-3 font-black uppercase tracking-wide text-base shadow-[5px_5px_0_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform disabled:opacity-50"
                    style={{ background: BLUE, color: '#fff', ...display }}
                  >
                    {loading ? 'Sending…' : 'Send it →'}
                  </button>
                  {formError && (
                    <p className="text-xs font-bold uppercase border-2 border-black px-2 py-1" style={{ background: PINK, ...mono }}>{formError}</p>
                  )}
                </>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t-[3px] border-black" style={{ background: INK }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: PAPER, ...mono }}>
          <span>© {new Date().getFullYear()} Sanjay Kumar P</span>
          <div className="flex gap-2">
            {OTHER.map((o, i) => (
              <a key={o.href} href={o.href} className="border-2 px-2 py-1 font-bold uppercase hover:-translate-y-0.5 transition-transform" style={{ borderColor: PAPER, color: [YELLOW, LIME, PINK, PAPER][i] }}>
                {o.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
