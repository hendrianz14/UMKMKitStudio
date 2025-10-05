"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header
      style={{ height: "var(--header-h)" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all
        bg-[#0B1220]/70 backdrop-blur border-b border-white/10`}
    >
      <nav className="container h-full flex items-center justify-between">
        <Link href="/" className="font-semibold text-slate-200">
          UMKM <span className="text-[#3B82F6]">KitStudio</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <a href="#contact" className="hover:text-white">Contact</a>
          <Link href="/get-started" className="px-4 py-2 rounded-xl bg-[#3B82F6] text-white">
            Get Started
          </Link>
        </div>
        <button className="md:hidden px-3 py-1.5 rounded-lg border border-white/10">Menu</button>
      </nav>
    </header>
  );
}

