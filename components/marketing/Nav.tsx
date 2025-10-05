"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const DynamicUserMenu = dynamic(() => import("./UserMenu"), { ssr: false });

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [open]);

  useEffect(() => {
    setOpen(false); // Close drawer on route change
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[1000] bg-slate-900/80 backdrop-blur border-b border-slate-700">
        <div className="container mx-auto px-6">
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="font-bold text-xl">
                <span className="text-white">UMKM</span>
                <span className="text-blue-500">KitStudio</span>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
                aria-controls="mobile-menu"
                aria-expanded={open}
                className="p-2 rounded-md bg-white/5"
              >
                {open ? (
                  // Close (X) icon
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  // Hamburger icon
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>

            <div className={`hidden md:flex items-center gap-4`}>
  <Link href="/#features" className="text-sm text-slate-300 hover:text-white">Features</Link>
  <Link href="/#pricing" className="text-sm text-slate-300 hover:text-white">Pricing</Link>
  <Link href="/#contact" className="text-sm text-slate-300 hover:text-white">Contact</Link>
  <div className="flex items-center gap-2">
    <Link href="/sign-in" className="text-sm text-slate-300 hover:text-white">Sign In</Link>
    <Link href="/sign-up" className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm">Get Started</Link>
  </div>
</div>
          </nav>
        </div>
      </header>

      {mounted && createPortal(
        <>
          {/* Mobile menu backdrop */}
          <div
            className={`md:hidden fixed inset-0 bg-black/50 transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setOpen(false)}
          />
          {/* Mobile menu drawer */}
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            className={`md:hidden fixed top-0 right-0 h-full w-64 bg-slate-900 shadow-lg transform transition-transform duration-300 ${
              open ? "translate-x-0" : "translate-x-full"
            } z-50`}
          >
            <div className="px-6 py-4 pt-16">
              <div className="flex flex-col space-y-2 mt-8">
                <Link href="/#features" className="block text-white py-2 border-b border-slate-700">Features</Link>
                <Link href="/#pricing" className="block text-white py-2 border-b border-slate-700">Pricing</Link>
                <Link href="/#contact" className="block text-white py-2 border-b border-slate-700">Contact</Link>
                <div className="pt-4">
  <div className="flex flex-col space-y-2">
    <Link href="/sign-in" className="text-white py-2">Sign In</Link>
    <Link href="/sign-up" className="px-4 py-2 rounded-md bg-blue-600 text-white text-center">Get Started</Link>
  </div>
</div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
