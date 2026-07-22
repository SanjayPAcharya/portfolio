import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';

const INK = '#111111';
const PAPER = '#FAFAF6';
const ACCENT = '#FF4D00';

const display = { fontFamily: "'Space Grotesk', ui-sans-serif, sans-serif" };

const STACK = [
  'Angular', 'React', 'Flutter', 'Node.js', 'Python / Django',
  'SQL / NoSQL', 'AWS', 'Docker', 'CI / CD', 'LLMs', 'AI Agents',
];

const WORK = [
  {
    index: '001',
    title: 'Live SSE Dashboard',
    year: '2025',
    tags: ['SSE', 'React', 'Node.js', 'AWS EC2'],
    outcome: 'Streams live data to the browser with zero polling — persistent connections, event parsing, live UI at scale.',
    demo: 'https://sse.sanjaykumarp.info',
    source: 'https://github.com/SanjayPAcharya/sse-realtime-app',
  },
  {
    index: '002',
    title: 'Compression / Decompression',
    year: '2025',
    tags: ['React', 'TypeScript', 'AWS S3'],
    outcome: 'Browser-based JSON compression tool with live size comparison — no server round-trips.',
    demo: 'http://compress-decompress.s3-website-us-east-1.amazonaws.com',
    source: 'https://github.com/SanjayPAcharya/compress-decompress-json',
  },
  {
    index: '003',
    title: 'PMAGENT',
    year: 'In development',
    tags: ['AI Agent', 'LLM', 'AWS'],
    outcome: 'An AI project-management agent — autonomous planning, ticketing, and progress tracking.',
  },
];

const CAPABILITIES = [
  {
    n: '01',
    title: 'Frontend',
    desc: 'Responsive, interactive UIs with modern frameworks and clean UX — React, Angular, Flutter.',
  },
  {
    n: '02',
    title: 'Backend',
    desc: 'Robust APIs and server-side apps with Node.js and Python, on scalable SQL and NoSQL stores.',
  },
  {
    n: '03',
    title: 'DevOps & cloud',
    desc: 'CI/CD pipelines, AWS infrastructure, containerisation, and observability — three cloud certifications.',
  },
  {
    n: '04',
    title: 'AI / LLM',
    desc: 'Agentic AI workflows, LLM-powered features, and GenAI product delivery, end to end.',
  },
];

const SOCIAL = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sanjay-kumar-p/' },
  { label: 'GitHub', href: 'https://github.com/SanjayPAcharya' },
  { label: 'X / Twitter', href: 'https://x.com/sanjay_kumar_p' },
];

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: 'easeOut' as const },
};

function Rule() {
  return <div className="h-px w-full" style={{ background: INK }} />;
}

function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 mb-10">
      <span className="text-xs font-medium tracking-[0.2em]" style={{ color: ACCENT, ...display }}>
        {n}
      </span>
      <span className="text-xs font-medium tracking-[0.25em] uppercase" style={{ color: INK, ...display }}>
        {title}
      </span>
    </div>
  );
}

export default function EditorialInk() {
  const [form, setForm] = useState({ name: '', email: '', description: '' });
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');
  const { post, loading } = useApi();

  useEffect(() => {
    document.title = 'Sanjay Kumar P — Portfolio';
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
      {/* Top bar */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: PAPER, borderColor: INK }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-14">
          <a href="#top" className="text-sm font-bold tracking-[0.15em] uppercase" style={display}>
            Sanjay Kumar P<span style={{ color: ACCENT }}>.</span>
          </a>
          <nav className="flex items-center gap-6 text-xs font-medium tracking-wider uppercase" style={display}>
            <a href="#work" className="hover:opacity-60 transition-opacity hidden sm:inline">Work</a>
            <a href="#capabilities" className="hover:opacity-60 transition-opacity hidden sm:inline">Capabilities</a>
            <a href="#contact" className="hover:opacity-60 transition-opacity">Contact</a>
            <a href="/" className="hover:opacity-60 transition-opacity" style={{ color: ACCENT }}>
              Classic ↗
            </a>
          </nav>
        </div>
      </header>

      <main id="top" className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* 01 — Hero */}
        <section className="pt-16 pb-14">
          <motion.p
            {...reveal}
            className="text-xs font-medium tracking-[0.25em] uppercase mb-8"
            style={{ color: ACCENT, ...display }}
          >
            01 / Portfolio — Full-stack + AI engineer
          </motion.p>

          <motion.h1
            {...reveal}
            className="font-bold uppercase leading-[0.9] tracking-[-0.03em] mb-10"
            style={{ fontSize: 'clamp(3.2rem, 11vw, 8.5rem)', ...display }}
          >
            Sanjay
            <br />
            Kumar P<span style={{ color: ACCENT }}>.</span>
          </motion.h1>

          <Rule />

          <motion.div {...reveal} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
            <p className="text-sm leading-relaxed sm:col-span-2" style={{ color: '#3D3D38' }}>
              Eight-plus years in the code trenches — now taming AI to ship
              smarter, faster, better. I turn ideas into scalable systems
              through clean code and thoughtful design.
            </p>
            <div className="text-sm space-y-1.5" style={display}>
              <p className="text-xs tracking-[0.2em] uppercase" style={{ color: '#6B6B66' }}>Focus</p>
              <p>AI-driven products</p>
              <p>Cloud architecture</p>
              <p>System design</p>
            </div>
            <div className="text-sm space-y-1.5" style={display}>
              <p className="text-xs tracking-[0.2em] uppercase" style={{ color: '#6B6B66' }}>Status</p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: ACCENT }} />
                Open to opportunities
              </p>
              <p style={{ color: '#6B6B66' }}>Response ~24h</p>
            </div>
          </motion.div>

          <Rule />
        </section>

        {/* Stack ticker */}
        <section className="pb-20 overflow-hidden">
          <div className="relative" style={{ borderTop: `1px solid ${INK}`, borderBottom: `1px solid ${INK}` }}>
            <motion.div
              className="flex whitespace-nowrap py-3"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
            >
              {[...STACK, ...STACK].map((s, i) => (
                <span
                  key={`${s}-${i}`}
                  className="text-sm font-medium tracking-wider uppercase px-6 flex items-center gap-6"
                  style={display}
                >
                  {s}
                  <span style={{ color: ACCENT }}>·</span>
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 02 — Selected work */}
        <section id="work" className="pb-24">
          <SectionLabel n="02" title="Selected work" />
          <Rule />
          {WORK.map(w => (
            <motion.article {...reveal} key={w.index}>
              <div
                className="group grid grid-cols-[auto_1fr] sm:grid-cols-[64px_1fr_auto] gap-x-6 gap-y-3 py-8 px-2 -mx-2 transition-colors duration-300 cursor-default"
                style={{ ['--hover' as string]: INK }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = INK;
                  e.currentTarget.style.color = PAPER;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = INK;
                }}
              >
                <span className="text-xs pt-2 tracking-widest" style={{ color: ACCENT, ...display }}>
                  {w.index}
                </span>
                <div>
                  <h3
                    className="font-bold uppercase tracking-tight leading-none mb-3"
                    style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)', ...display }}
                  >
                    {w.title}
                  </h3>
                  <p className="text-sm max-w-xl mb-3 opacity-70">{w.outcome}</p>
                  <p className="text-xs tracking-[0.15em] uppercase opacity-60" style={display}>
                    {w.tags.join(' · ')}
                  </p>
                </div>
                <div className="col-start-2 sm:col-start-3 text-left sm:text-right text-xs space-y-2 sm:pt-2" style={display}>
                  <p className="tracking-[0.15em] uppercase opacity-60">{w.year}</p>
                  {w.demo && (
                    <a
                      href={w.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block underline underline-offset-4 hover:opacity-60 transition-opacity"
                    >
                      Live ↗
                    </a>
                  )}
                  {w.source && (
                    <a
                      href={w.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block underline underline-offset-4 hover:opacity-60 transition-opacity"
                    >
                      Source ↗
                    </a>
                  )}
                </div>
              </div>
              <Rule />
            </motion.article>
          ))}
        </section>

        {/* 03 — Capabilities */}
        <section id="capabilities" className="pb-24">
          <SectionLabel n="03" title="Capabilities" />
          <Rule />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((c, i) => (
              <motion.div
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.08 }}
                key={c.n}
                className="py-8 pr-8 lg:border-r last:border-r-0"
                style={{ borderColor: '#D6D3CB' }}
              >
                <p className="text-xs tracking-widest mb-5" style={{ color: ACCENT, ...display }}>{c.n}</p>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-3" style={display}>
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#3D3D38' }}>{c.desc}</p>
              </motion.div>
            ))}
          </div>
          <Rule />
        </section>

        {/* 04 — Numbers */}
        <section className="pb-24">
          <SectionLabel n="04" title="By the numbers" />
          <Rule />
          <div className="grid grid-cols-3">
            {[
              { v: '08+', l: 'Years of experience' },
              { v: '50+', l: 'Projects shipped' },
              { v: '03', l: 'Cloud certifications' },
            ].map((s, i) => (
              <motion.div
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.08 }}
                key={s.l}
                className="py-10 text-center border-r last:border-r-0"
                style={{ borderColor: '#D6D3CB' }}
              >
                <p
                  className="font-bold leading-none mb-3"
                  style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', ...display }}
                >
                  {s.v}
                </p>
                <p className="text-xs tracking-[0.2em] uppercase" style={{ color: '#6B6B66', ...display }}>
                  {s.l}
                </p>
              </motion.div>
            ))}
          </div>
          <Rule />
        </section>

        {/* 05 — Contact */}
        <section id="contact" className="pb-20">
          <SectionLabel n="05" title="Contact" />
          <motion.h2
            {...reveal}
            className="font-bold uppercase leading-[0.95] tracking-[-0.02em] mb-12"
            style={{ fontSize: 'clamp(2.4rem, 8vw, 6rem)', ...display }}
          >
            Let's build
            <br />
            something<span style={{ color: ACCENT }}>.</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-14">
            <motion.div {...reveal}>
              <p className="text-sm leading-relaxed mb-10 max-w-md" style={{ color: '#3D3D38' }}>
                Open to full-stack, AI, or cloud engagements — greenfield
                products, stubborn legacy problems, or a team that needs
                senior hands-on experience.
              </p>
              <div className="space-y-4">
                {SOCIAL.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-baseline justify-between border-b pb-3 group max-w-md"
                    style={{ borderColor: INK }}
                  >
                    <span className="text-lg font-medium uppercase tracking-wide" style={display}>
                      {s.label}
                    </span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1" style={{ color: ACCENT }}>
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.form {...reveal} onSubmit={submit} noValidate className="space-y-8">
              {sent ? (
                <p className="text-sm leading-relaxed" style={display}>
                  <span style={{ color: ACCENT }}>Message received.</span> I'll
                  reply within ~24 hours.
                </p>
              ) : (
                <>
                  {[
                    { key: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: '#6B6B66', ...display }}>
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={form[f.key as 'name' | 'email']}
                        onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                        className="w-full bg-transparent border-b pb-2 text-base focus:outline-none placeholder:opacity-40"
                        style={{ borderColor: INK, ...display }}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={{ color: '#6B6B66', ...display }}>
                      Message
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell me what you're building…"
                      value={form.description}
                      onChange={e => setForm(v => ({ ...v, description: e.target.value }))}
                      className="w-full bg-transparent border-b pb-2 text-base focus:outline-none resize-none placeholder:opacity-40"
                      style={{ borderColor: INK, ...display }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="text-sm font-bold tracking-[0.2em] uppercase border px-8 py-4 transition-colors duration-200 disabled:opacity-50"
                    style={{ borderColor: INK, ...display }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = INK;
                      e.currentTarget.style.color = PAPER;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = INK;
                    }}
                  >
                    {loading ? 'Sending…' : 'Send message →'}
                  </button>
                  {formError && <p className="text-xs" style={{ color: ACCENT }}>{formError}</p>}
                </>
              )}
            </motion.form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: INK }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={display}>
          <span>© {new Date().getFullYear()} Sanjay Kumar P</span>
          <span style={{ color: '#6B6B66' }}>Set in Space Grotesk on paper #FAFAF6</span>
          <a href="/agent" className="hover:opacity-60 transition-opacity" style={{ color: ACCENT }}>
            Try the agent console ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
