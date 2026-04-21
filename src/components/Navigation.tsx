import React, { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '#home',     label: 'Home'     },
  { href: '#about',    label: 'About'    },
  { href: '#projects', label: 'Projects' },
  { href: '#contact',  label: 'Contact'  },
];

export default function Navigation() {
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [isScrolled,    setIsScrolled]    = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollPct,     setScrollPct]     = useState(0);

  useEffect(() => {
    let debounce: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      const y     = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(total > 0 ? (y / total) * 100 : 0);
      setIsScrolled(y > 40);
      if (mobileOpen) setMobileOpen(false);

      clearTimeout(debounce);
      debounce = setTimeout(() => {
        if (y < 50) { setActiveSection('home'); return; }
        const ids = ['home', 'about', 'projects', 'contact'];
        for (let i = ids.length - 1; i >= 0; i--) {
          const el = document.getElementById(ids[i]);
          if (el) {
            const r = el.getBoundingClientRect();
            if (r.top <= 80 && r.bottom > 100) { setActiveSection(ids[i]); break; }
          }
        }
      }, 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(debounce); };
  }, [mobileOpen]);

  const goto = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-400 ${
      isScrolled || mobileOpen
        ? 'glass border-b border-white/[0.06] shadow-[0_4px_40px_rgba(0,0,0,0.5)]'
        : 'bg-transparent'
    }`}>
      {/* Scroll progress bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] transition-[width] duration-150"
        style={{
          width: `${scrollPct}%`,
          background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #22D3EE)',
          boxShadow: '0 0 8px rgba(139,92,246,0.6)',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">

          {/* Logo */}
          <a
            href="#home"
            onClick={e => goto(e, '#home')}
            className="font-display font-black text-xl gradient-text tracking-wide"
          >
            SK<span className="text-violet-400/60">.</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => {
              const active = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={e => goto(e, link.href)}
                  className={`relative font-medium text-sm transition-colors duration-200 group ${
                    active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300"
                    style={{
                      width: active ? '100%' : '0%',
                      background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
                    }}
                  />
                  {!active && (
                    <span
                      className="absolute -bottom-1 left-0 h-[2px] rounded-full w-0 group-hover:w-full transition-all duration-300 opacity-40"
                      style={{ background: 'linear-gradient(90deg, #8B5CF6, #EC4899)' }}
                    />
                  )}
                </a>
              );
            })}

            <a
              href="#contact"
              onClick={e => goto(e, '#contact')}
              className="px-5 py-2 rounded-full font-semibold text-sm text-white transition-all duration-300 hover:opacity-90 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                boxShadow: '0 0 20px rgba(139,92,246,0.4)',
              }}
            >
              Hire Me
            </a>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden text-slate-400 hover:text-white transition-colors p-1"
            onClick={() => setMobileOpen(m => !m)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-5">
              <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 origin-center ${mobileOpen ? 'top-2.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute top-2.5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 origin-center ${mobileOpen ? 'top-2.5 -rotate-45' : 'top-5'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-4 space-y-1 border-t border-white/[0.06]">
          {NAV_LINKS.map((link, i) => {
            const active = activeSection === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={e => goto(e, link.href)}
                className={`flex items-center gap-3 py-3 px-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  active ? 'text-white bg-white/[0.06]' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                } ${mobileOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                style={{ transitionDelay: mobileOpen ? `${i * 40}ms` : '0ms' }}
              >
                {active && (
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
                  />
                )}
                {link.label}
              </a>
            );
          })}
          <div className="pt-2">
            <a
              href="#contact"
              onClick={e => goto(e, '#contact')}
              className="inline-flex px-6 py-2.5 rounded-full font-semibold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
            >
              Hire Me
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
