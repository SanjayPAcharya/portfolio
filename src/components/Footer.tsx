import React from 'react';

export default function Footer() {
  return (
    <footer className="relative bg-[#08080F] border-t border-white/[0.06] py-10 overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display font-black text-xl gradient-text tracking-wide">
            SK<span className="text-violet-400/50">.</span>
          </span>
          <p className="text-xs text-slate-600 tracking-wide">
            &copy; {new Date().getFullYear()} Sanjay Kumar P. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-500">Available for opportunities</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
