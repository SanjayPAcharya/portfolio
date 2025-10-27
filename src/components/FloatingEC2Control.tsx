import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import EC2ControlInline from './EC2ControlInline';

type Pos = { x: number; y: number };
const STORAGE_KEY = 'ec2pill-pos-v1';

export default function FloatingEC2Control() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef<Pos>({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    const margin = 24;

    // Ensure the element has layout before measuring
    const measure = () => {
      const w = el.offsetWidth || 0;
      const h = el.offsetHeight || 0;

      const defaultX = Math.max(0, window.innerWidth - w - margin);
      const defaultY = Math.max(0, window.innerHeight - h - margin);

      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Pos;
          const x = Math.min(Math.max(0, parsed.x), Math.max(0, window.innerWidth - w));
          const y = Math.min(Math.max(0, parsed.y), Math.max(0, window.innerHeight - h));
          setPos({ x, y });
          return;
        } catch {}
      }
      setPos({ x: defaultX, y: defaultY });
    };

    // next frame to ensure DOM painted
    requestAnimationFrame(measure);
  }, [mounted]);

  useEffect(() => {
    const onResize = () => {
      const el = wrapperRef.current;
      if (!el) return;
      setPos((p) => ({
        x: Math.min(Math.max(0, p.x), Math.max(0, window.innerWidth - el.offsetWidth)),
        y: Math.min(Math.max(0, p.y), Math.max(0, window.innerHeight - el.offsetHeight)),
      }));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const setPosAnimated = (next: Pos) => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => setPos(next));
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, textarea, select')) return;

    const el = wrapperRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    const rect = el.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setDragging(true);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragging) return;
    const el = wrapperRef.current;
    if (!el) return;

    const nextX = e.clientX - dragOffset.current.x;
    const nextY = e.clientY - dragOffset.current.y;

    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;

    setPosAnimated({
      x: Math.min(Math.max(0, nextX), Math.max(0, maxX)),
      y: Math.min(Math.max(0, nextY), Math.max(0, maxY)),
    });
  };

  const endDrag = (e?: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    if (e) {
      const el = wrapperRef.current;
      if (el) el.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pos)); } catch {}
  };

  const pill = (
    <div
      ref={wrapperRef}
      role="dialog"
      aria-label="EC2 Control"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="fixed z-[9999] select-none left-0 top-0"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        touchAction: 'none',
      }}
    >
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur border border-gray-200 rounded-full shadow-md p-1 pr-2">
        <div aria-label="Drag handle" title="Drag"
             className="cursor-move rounded-full border border-gray-200 bg-gray-50 h-6 w-6 grid place-items-center text-xs text-gray-500">
          ☰
        </div>
        <EC2ControlInline />
      </div>
    </div>
  );

  // On the server or before mount, render nothing; on client, portal to body.
  if (!mounted) return null;
  return createPortal(pill, document.body);
}
