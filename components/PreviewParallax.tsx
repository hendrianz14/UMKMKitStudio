"use client";

import React, { useRef, useState, useEffect } from "react";

export default function PreviewParallax({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ transform: "translateZ(0)" });

  useEffect(() => {
    let raf = 0;
    const el = ref.current;
    if (!el) return;

    function onMove(e: MouseEvent) {
      const current = ref.current;
      if (!current) return;
      const rect = current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const tx = (x / rect.width) * 8; // translate x
        const ty = (y / rect.height) * 8; // translate y
        const rz = (x / rect.width) * -3; // rotate
        setStyle({ transform: `perspective(800px) translate3d(${tx}px, ${ty}px, 0) rotateZ(${rz}deg)` });
      });
    }

    function onLeave() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setStyle({ transform: "translateZ(0)" }));
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchstart", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchstart", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`will-change-transform ${className}`} style={style as any}>
      {children}
    </div>
  );
}
