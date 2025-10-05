"use client";

import React, { useEffect, useRef } from "react";

export default function HeroMouseGradient() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const x = e.clientX;
      const y = e.clientY;
      el.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
      el.style.opacity = '1';
    }

    function onLeave() {
      const el = ref.current;
      if (!el) return;
      el.style.opacity = '0';
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="pointer-events-none fixed -z-10 w-[600px] h-[600px] rounded-full opacity-0 transition-opacity duration-300" style={{background: 'radial-gradient(closest-side, rgba(59,130,246,0.28), transparent)'}} />
  );
}
