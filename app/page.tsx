"use client";

import Section from "@/components/Section";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Page(){

  return (
    <>
            {/* HERO */}
      <Section id="hero" className="section--bleed bg-hero">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-[20ch] mx-auto">
              UMKM <span className="text-[#3B82F6]">KitStudio</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl text-slate-300 mx-auto max-w-[68ch]">
              Ubah foto produk biasa menjadi <span className="text-white">materi iklan profesional</span> dalam hitungan detik.
              Editing non-destruktif, <span className="text-white">produk asli tetap sama</span>, siap untuk Instagram, marketplace, dan website.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-[#3B82F6] text-white font-medium hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              >
                Coba sekarang
              </Link>
              <a
                href="#preview"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 border border-white/15 bg-white/5 text-slate-200 hover:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                Lihat demo
              </a>
            </div>
          </motion.div>
        </div>
      </Section>

            {/* LIVE PREVIEW */}
      {/* LIVE PREVIEW */}
      <Section id="preview" className="section--bleed">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="card p-6">
              <p className="text-slate-400 text-sm mb-2">Live preview</p>
              <div className="aspect-video rounded-xl bg-gradient-to-br from-brand-blue/30 to-brand-blue2/30"></div>
            </div>
            <div className="self-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white">AI-generated product image + template</h3>
              <p className="mt-3 text-slate-300">Non-destructive editing, keep original product, export-ready.</p>
            </div>
          </div>
        </div>
      </Section>

            {/* TESTIMONIALS */}
      {/* TESTIMONIALS */}
      <Section id="testimonials">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">“Desainnya keren dan mudah digunakan.” — Penjual Tas ABC</div>
            <div className="card p-6">“Proses cepat, hasil seperti studio.” — UMKM Kopi DEF</div>
          </div>
        </div>
      </Section>

            {/* PRICING */}
      {/* PRICING */}
      <Section id="pricing">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {name:"Free",desc:"Starter credits"},
              {name:"Pro",desc:"For power users"},
              {name:"Enterprise",desc:"Custom plans"}
            ].map((p,i)=>(
              <div key={p.name} className={`card p-6 ${i===1?"ring-1 ring-brand-blue/50":""}`}>
                <div className="text-xl text-white font-semibold">{p.name}</div>
                <p className="text-slate-400 mt-2">{p.desc}</p>
                <button className="mt-5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-brand-blue/50">Choose</button>
              </div>
            ))}
          </div>
        </div>
      </Section>

            {/* CTA + FOOTER */}
      {/* CTA + FOOTER */}
  <Section id="contact" className="section--bleed bg-hero">
    <div className="max-w-6xl mx-auto px-6 text-center">
      <h3 className="text-3xl md:text-4xl font-bold text-white">Ready to start?</h3>
      <p className="mt-2 text-slate-300">Sign up and try with starter credits.</p>
      <a href="/get-started" className="inline-block mt-6 px-6 py-3 rounded-xl bg-brand-blue text-white hover:shadow-glow">Get Started</a>
      <div className="mt-10 text-xs text-slate-500">© YEAR UMKM KitStudio • Terms • Privacy</div>
    </div>
  </Section>
    </>
  );
}
