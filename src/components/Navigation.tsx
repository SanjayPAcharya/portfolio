import React, { useState, useEffect } from 'react';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  // { href: '#skills', label: 'Skills' },
  // { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const screenHeight = window.innerHeight - 15;
      setIsScrolled(scrollTop > screenHeight);

      // Close mobile menu when scrolling begins
      if (mobileOpen) {
        setMobileOpen(false);
      }


      // Clear previous timeout
      clearTimeout(scrollTimeout);

      // Debounce the section detection
      scrollTimeout = setTimeout(() => {
        // Determine active section based on current scroll position
        const sections = ['home', 'about', /* 'skills', */ /* 'projects', */ 'contact'];
        let currentSection = 'home';

        // Check each section from bottom to top for more accurate detection
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = document.getElementById(sections[i]);
          if (section) {
            const rect = section.getBoundingClientRect();
            // If section is significantly in the viewport (with stricter offset)
            if (rect.top <= 80 && rect.bottom > 120) {
              currentSection = sections[i];
              break;
            }
          }
        }

        // Only default to home when actually at the very top
        if (scrollTop < 50) {
          currentSection = 'home';
        }

        // Update active section only after scroll has settled
        setActiveSection(currentSection);
      }, 150); // 150ms debounce delay
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    function handleScroll() {
      if (window.innerWidth < 768) {
        setMobileOpen(false);
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${mobileOpen
      ? 'bg-white shadow-sm'
      : isScrolled
        ? 'bg-white shadow-sm'
        : 'bg-gradient-to-b from-white/25 via-white/10 to-transparent backdrop-blur-md'
      }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className={`text-2xl font-bold transition-colors duration-300 ${mobileOpen || isScrolled ? 'text-gray-800' : 'text-white'}`}></div>
          <div className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`relative transition-colors duration-300 group ${mobileOpen || isScrolled
                  ? activeSection === link.href.substring(1) && document.getElementById(link.href.substring(1))
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-blue-600'
                  : activeSection === link.href.substring(1) && document.getElementById(link.href.substring(1))
                    ? 'text-white font-medium'
                    : 'text-white/90 hover:text-white'
                  }`}
                onClick={e => handleNavClick(e, link.href)}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-current transition-all duration-300 ${activeSection === link.href.substring(1) && document.getElementById(link.href.substring(1))
                  ? 'w-full'
                  : 'w-0 group-hover:w-full'
                  }`}></span>
              </a>
            ))}
          </div>
          <button
            className={`md:hidden transition-all duration-300 ${mobileOpen ? 'text-gray-800' : isScrolled ? 'text-gray-800' : 'text-white'}`}
            onClick={() => setMobileOpen(m => !m)}
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-6 h-6">
              <span className={`absolute top-0 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2.5' : 'rotate-0 translate-y-0'
                }`}></span>
              <span className={`absolute top-2.5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
              <span className={`absolute top-5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 translate-y-[-10px]' : 'rotate-0 translate-y-0'
                }`}></span>
            </div>
          </button>
        </div>
      </div>
      <div className={`md:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className="px-4 py-2 space-y-2">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative block py-2 transition-all duration-300 group transform ${mobileOpen
                ? 'translate-x-0 opacity-100'
                : 'translate-x-4 opacity-0'
                } ${activeSection === link.href.substring(1) && document.getElementById(link.href.substring(1))
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-blue-600'
                }`}
              style={{ transitionDelay: mobileOpen ? `${index * 100}ms` : '0ms' }}
              onClick={e => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
