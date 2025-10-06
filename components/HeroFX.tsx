"use client";
import { useEffect, useRef } from "react";
export default function HeroFX() {
const ref = useRef<HTMLDivElement>(null);
useEffect(() => {
const el = ref.current;
const section = el?.parentElement; // parent = <Section> (pos: relative)
if (!el || !section) return;
let raf = 0;
const onMove = (e: MouseEvent) => {
cancelAnimationFrame(raf);
raf = requestAnimationFrame(() => {
const r = section.getBoundingClientRect();
const x = ((e.clientX - r.left) / r.width) * 100;
const y = ((e.clientY - r.top) / r.height) * 100;
el.style.setProperty("--mx", `${x}%`);
el.style.setProperty("--my", `${y}%`);
});
};
window.addEventListener("mousemove", onMove);
return () => {
window.removeEventListener("mousemove", onMove);
cancelAnimationFrame(raf);
};
}, []);
return (
<div ref={ref} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
<div className="absolute -left-24 -top-24 h-[50vmin] w-[50vmin] rounded-full bg-primary/20 blur-3xl animate-float" />
<div className="absolute right-0 top-1/3 h-[40vmin] w-[40vmin] rounded-full bg-primary/10 blur-3xl animate-float-delayed" />
<div className="hero-spotlight" />
<div className="hero-grid" />
</div>
);
}
