import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useApi } from '../hooks/useApi';

const BG = '#0D0D12';
const PANEL = '#13131A';
const BORDER = '#22222E';
const TEXT = '#E8E8F0';
const MUTED = '#8A8A9E';
const PURPLE = '#7F77DD';
const TEAL = '#5DCAA5';
const AMBER = '#EFB454';

const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };

interface Msg {
  id: number;
  role: 'user' | 'agent';
  text: string;
}

const ANSWERS: Record<string, string> = {
  shipped:
    "50+ projects over 8+ years. Highlights: a real-time SSE dashboard streaming live data to browsers with zero polling (it runs on a real EC2 box — check the infra panel), a browser-based JSON compression tool on S3, and PMAGENT — an AI project-management agent currently in development.",
  stack:
    "Frontend: React, Angular, Flutter. Backend: Node.js, Python/Django. Data: SQL + NoSQL. Cloud: AWS (3 certifications), Docker, CI/CD. Current focus: agentic AI workflows and LLM-powered products.",
  experience:
    "8+ years full-stack. The recent stretch is focused on AI-driven product development — agents, LLM integrations, and the infrastructure to run them reliably.",
  available:
    "Yes — open to full-stack, AI, or cloud engagements: greenfield products, stubborn legacy problems, or teams that need senior hands-on help. Typical response time is ~24 hours.",
  contact:
    "Fastest route: LinkedIn (linkedin.com/in/sanjay-kumar-p). GitHub is github.com/SanjayPAcharya, and there's a contact form on the classic site. He replies within ~24 hours.",
  fallback:
    "I'm a scripted demo (no tokens were harmed answering this). Try one of the suggested prompts — or skip the middleman and ping the human on LinkedIn.",
};

const CHIPS = [
  { label: 'what has sanjay shipped?', key: 'shipped' },
  { label: "what's his stack?", key: 'stack' },
  { label: 'how much experience?', key: 'experience' },
  { label: 'is he available?', key: 'available' },
  { label: 'how do i reach him?', key: 'contact' },
];

const matchAnswer = (q: string): string => {
  const s = q.toLowerCase();
  if (/(ship|project|built|build|work|portfolio)/.test(s)) return ANSWERS.shipped;
  if (/(stack|tech|skill|framework|language)/.test(s)) return ANSWERS.stack;
  if (/(experience|years|senior|long)/.test(s)) return ANSWERS.experience;
  if (/(available|hire|hiring|open|freelance|job)/.test(s)) return ANSWERS.available;
  if (/(contact|reach|email|linkedin|touch)/.test(s)) return ANSWERS.contact;
  return ANSWERS.fallback;
};

const TOOLS = [
  { name: 'frontend.build', desc: 'React · Angular · Flutter' },
  { name: 'backend.api', desc: 'Node.js · Python · Django' },
  { name: 'cloud.deploy', desc: 'AWS · Docker · CI/CD' },
  { name: 'ai.integrate', desc: 'LLMs · agentic workflows' },
];

const PROJECTS = [
  {
    name: 'sse-dashboard',
    status: 'live',
    desc: 'Real-time dashboard streaming server events to React with zero polling.',
    caps: ['SSE', 'Node.js', 'EC2'],
    demo: 'https://sse.sanjaykumarp.info',
    source: 'https://github.com/SanjayPAcharya/sse-realtime-app',
  },
  {
    name: 'json-compressor',
    status: 'live',
    desc: 'Browser tool compressing and decompressing JSON with live size diffs.',
    caps: ['React', 'TypeScript', 'S3'],
    demo: 'http://compress-decompress.s3-website-us-east-1.amazonaws.com',
    source: 'https://github.com/SanjayPAcharya/compress-decompress-json',
  },
  {
    name: 'pmagent',
    status: 'training',
    desc: 'AI project-management agent — autonomous planning, ticketing, tracking.',
    caps: ['AI Agent', 'LLM', 'AWS'],
  },
];

interface EC2Response {
  state: string;
  public_ip?: string;
}

function Led({ color, pulse = false }: { color: string; pulse?: boolean }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${pulse ? 'animate-pulse' : ''}`}
      style={{ background: color }}
    />
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border" style={{ background: PANEL, borderColor: BORDER }}>
      <div className="px-4 py-2.5 border-b text-[11px] tracking-[0.2em] uppercase" style={{ borderColor: BORDER, color: MUTED, ...mono }}>
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function AgentConsole() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [input, setInput] = useState('');

  const [demoState, setDemoState] = useState<'checking' | 'online' | 'offline' | 'unreachable'>('checking');
  const [demoIp, setDemoIp] = useState<string | null>(null);
  const { post: postCheck } = useApi<EC2Response>();
  const { post: postStart, loading: starting } = useApi<EC2Response>();

  const timerRef = useRef<number | null>(null);
  const didCheckRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    document.title = 'sanjay.agent — console';
  }, []);

  const streamAgent = (full: string) => {
    setStreaming(true);
    const id = ++idRef.current;
    setMessages(m => [...m, { id, role: 'agent', text: '' }]);
    let i = 0;
    timerRef.current = window.setInterval(() => {
      i += 3;
      setMessages(m => m.map(msg => (msg.id === id ? { ...msg, text: full.slice(0, i) } : msg)));
      if (i >= full.length) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        setStreaming(false);
      }
    }, 18);
  };

  // Greeting: reset + restart so a strict-mode remount can't strand a cleared interval
  useEffect(() => {
    setMessages([]);
    setStreaming(false);
    streamAgent(
      "hi — i'm the portfolio agent for Sanjay Kumar P, full-stack engineer (8+ yrs) currently taming AI. ask me anything about his work, or poke the live infrastructure on the right."
    );
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (didCheckRef.current) return;
    didCheckRef.current = true;

    (async () => {
      try {
        const data = await postCheck(
          import.meta.env.VITE_EC2_START_ENDPOINT,
          { isUP: true },
          { 'x-custom-auth': import.meta.env.VITE_EC2_SECRET_KEY }
        );
        if (data.state === 'running') {
          setDemoState('online');
          setDemoIp(data.public_ip ?? null);
        } else {
          setDemoState('offline');
        }
      } catch {
        setDemoState('unreachable');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const ask = (question: string, answer: string) => {
    if (streaming) return;
    setMessages(m => [...m, { id: ++idRef.current, role: 'user', text: question }]);
    window.setTimeout(() => streamAgent(answer), 250);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || streaming) return;
    setInput('');
    ask(q, matchAnswer(q));
  };

  const startDemo = async () => {
    setDemoState('checking');
    try {
      const data = await postStart(
        import.meta.env.VITE_EC2_START_ENDPOINT,
        {},
        { 'x-custom-auth': import.meta.env.VITE_EC2_SECRET_KEY }
      );
      setDemoState('online');
      setDemoIp(data.public_ip ?? null);
    } catch {
      setDemoState('unreachable');
    }
  };

  const demoLed =
    demoState === 'online' ? TEAL : demoState === 'checking' ? PURPLE : demoState === 'offline' ? AMBER : '#E24B4A';

  return (
    <div className="min-h-screen" style={{ background: BG, color: TEXT }}>
      {/* Status bar */}
      <header className="border-b sticky top-0 z-50" style={{ borderColor: BORDER, background: BG }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between text-xs" style={mono}>
          <div className="flex items-center gap-2.5">
            <Led color={TEAL} pulse />
            <span className="font-medium">sanjay<span style={{ color: PURPLE }}>.agent</span></span>
            <span className="hidden sm:inline" style={{ color: MUTED }}>v2.0 · uptime 8y+</span>
          </div>
          <div className="flex items-center gap-4" style={{ color: MUTED }}>
            <a href="/dev" className="hover:text-white transition-colors">/dev</a>
            <a href="/" className="hover:text-white transition-colors">/classic</a>
            <a
              href="https://www.linkedin.com/in/sanjay-kumar-p/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              style={{ color: TEAL }}
            >
              open session with human ↗
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Chat */}
          <div className="rounded-lg border overflow-hidden" style={{ background: PANEL, borderColor: BORDER }}>
            <div
              className="px-4 py-2.5 border-b flex items-center justify-between text-[11px]"
              style={{ borderColor: BORDER, color: MUTED, ...mono }}
            >
              <span>session — visitor@sanjaykumarp.info</span>
              <span className="flex items-center gap-1.5">
                <Led color={streaming ? PURPLE : TEAL} pulse={streaming} />
                {streaming ? 'streaming' : 'idle'}
              </span>
            </div>

            <div ref={scrollRef} className="h-[380px] overflow-y-auto p-4 space-y-4">
              {messages.map(m =>
                m.role === 'user' ? (
                  <div key={m.id} className="flex justify-end">
                    <div
                      className="max-w-[85%] rounded-lg rounded-br-none px-3.5 py-2 text-sm"
                      style={{ background: 'rgba(127,119,221,0.18)', border: `1px solid ${PURPLE}44` }}
                    >
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="flex gap-3">
                    <span className="text-xs pt-1 flex-shrink-0" style={{ color: TEAL, ...mono }}>
                      agent▸
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: TEXT }}>
                      {m.text}
                      {streaming && m.id === idRef.current && (
                        <span className="inline-block w-2 h-4 ml-0.5 align-middle animate-pulse" style={{ background: TEAL }} />
                      )}
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {CHIPS.map(c => (
                <button
                  key={c.key}
                  onClick={() => ask(c.label, ANSWERS[c.key])}
                  disabled={streaming}
                  className="text-xs rounded-full px-3 py-1.5 border transition-colors disabled:opacity-40 hover:border-[#7F77DD]"
                  style={{ borderColor: BORDER, color: MUTED, ...mono }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="border-t flex items-center" style={{ borderColor: BORDER }}>
              <span className="pl-4 text-sm" style={{ color: PURPLE, ...mono }}>❯</span>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="ask about sanjay's work…"
                className="flex-1 bg-transparent px-3 py-3.5 text-sm focus:outline-none placeholder:opacity-40"
                style={mono}
              />
              <button
                type="submit"
                disabled={streaming || !input.trim()}
                className="px-4 text-xs uppercase tracking-wider disabled:opacity-30"
                style={{ color: TEAL, ...mono }}
              >
                send
              </button>
            </form>
          </div>

          {/* Side panels */}
          <div className="space-y-6">
            <Panel title="live infrastructure">
              <div className="space-y-3 text-sm" style={mono}>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 min-w-0">
                    <Led color={demoLed} pulse={demoState === 'checking'} />
                    <span className="truncate">sse-demo.ec2</span>
                  </span>
                  <span className="text-xs" style={{ color: MUTED }}>
                    {demoState === 'checking' && 'probing…'}
                    {demoState === 'online' && (demoIp ?? 'running')}
                    {demoState === 'offline' && 'stopped'}
                    {demoState === 'unreachable' && 'no reply'}
                  </span>
                </div>

                {demoState === 'offline' && (
                  <button
                    onClick={startDemo}
                    disabled={starting}
                    className="w-full text-xs uppercase tracking-widest border rounded px-3 py-2 transition-colors hover:border-[#5DCAA5] disabled:opacity-40"
                    style={{ borderColor: BORDER, color: TEAL }}
                  >
                    {starting ? 'booting…' : '▶ boot this server'}
                  </button>
                )}
                {demoState === 'online' && (
                  <a
                    href="https://sse.sanjaykumarp.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center w-full text-xs uppercase tracking-widest border rounded px-3 py-2 transition-colors hover:border-[#5DCAA5]"
                    style={{ borderColor: BORDER, color: TEAL }}
                  >
                    open live demo ↗
                  </a>
                )}
                {demoState === 'unreachable' && (
                  <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
                    control plane only answers the production origin — a real
                    server, really firewalled.
                  </p>
                )}

                <div className="flex items-center justify-between gap-2 pt-2 border-t" style={{ borderColor: BORDER }}>
                  <span className="flex items-center gap-2">
                    <Led color={TEAL} />
                    <span>portfolio.web</span>
                  </span>
                  <span className="text-xs" style={{ color: MUTED }}>serving</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <Led color={TEAL} />
                    <span>api.gateway</span>
                  </span>
                  <span className="text-xs" style={{ color: MUTED }}>lambda</span>
                </div>
              </div>
            </Panel>

            <Panel title="tool registry">
              <div className="space-y-3">
                {TOOLS.map(t => (
                  <div key={t.name} className="text-sm">
                    <p style={{ color: PURPLE, ...mono }}>{t.name}()</p>
                    <p className="text-xs" style={{ color: MUTED }}>{t.desc}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="runtime stats">
              <div className="grid grid-cols-3 gap-2 text-center" style={mono}>
                {[
                  { v: '8y+', l: 'exp' },
                  { v: '50+', l: 'ships' },
                  { v: '3', l: 'certs' },
                ].map(s => (
                  <div key={s.l}>
                    <p className="text-xl font-medium" style={{ color: TEAL }}>{s.v}</p>
                    <p className="text-[10px] uppercase tracking-widest" style={{ color: MUTED }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        {/* Model cards */}
        <section>
          <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: MUTED, ...mono }}>
            deployed models — projects
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROJECTS.map(p => (
              <div
                key={p.name}
                className="rounded-lg border p-4 flex flex-col gap-3 transition-colors hover:border-[#7F77DD]"
                style={{ background: PANEL, borderColor: BORDER }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium" style={{ color: TEXT, ...mono }}>{p.name}</span>
                  <span
                    className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border flex items-center gap-1.5"
                    style={{
                      borderColor: p.status === 'live' ? `${TEAL}55` : `${AMBER}55`,
                      color: p.status === 'live' ? TEAL : AMBER,
                    }}
                  >
                    <Led color={p.status === 'live' ? TEAL : AMBER} />
                    {p.status}
                  </span>
                </div>
                <p className="text-sm leading-relaxed flex-1" style={{ color: MUTED }}>{p.desc}</p>
                <p className="text-[11px]" style={{ color: PURPLE, ...mono }}>
                  [{p.caps.join(', ')}]
                </p>
                <div className="flex gap-4 text-xs" style={mono}>
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" style={{ color: TEAL }}>
                      demo ↗
                    </a>
                  )}
                  {p.source && (
                    <a href={p.source} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" style={{ color: MUTED }}>
                      source ↗
                    </a>
                  )}
                  {!p.demo && !p.source && <span style={{ color: MUTED }}>weights not public</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t" style={{ borderColor: BORDER }}>
        <div
          className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]"
          style={{ color: MUTED, ...mono }}
        >
          <span>© {new Date().getFullYear()} sanjay kumar p · this console is a design demo — the infra is real</span>
          <span className="flex items-center gap-1.5">
            <Led color={TEAL} pulse />
            accepting new sessions
          </span>
        </div>
      </footer>
    </div>
  );
}
