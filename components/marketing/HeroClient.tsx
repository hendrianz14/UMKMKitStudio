"use client";

import { useState } from "react";

export default function HeroClient() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-indigo-400 to-blue-500">UMKM KitStudio</h1>
            <p className="mt-4 text-slate-300">Automate your product content creation with beautiful templates, AI-powered generation, and simple workflows built for small businesses.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setSent(true); setTimeout(()=>setSent(false), 2000); }} className="mt-6 flex gap-2 max-w-md">
            <input type="email" placeholder="Email Anda" required value={email} onChange={(e)=>setEmail(e.target.value)} className="flex-1 rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-white" />
            <button className="rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 font-semibold">{sent ? "Terima kasih!" : "Notify me"}</button>
          </form>

          <div className="mt-6 flex gap-3 items-center">
            <div className="text-xs text-slate-400">Trusted by</div>
            <div className="h-6 w-20 bg-gradient-to-r from-slate-700 to-slate-600 rounded-md" />
            <div className="h-6 w-20 bg-gradient-to-r from-slate-700 to-slate-600 rounded-md" />
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl w-full max-w-md">
            <div className="h-64 w-full bg-gradient-to-tr from-blue-900 via-indigo-900 to-black rounded-lg" />
            <div className="mt-4 text-sm text-slate-400">Live preview of AI-generated product image and template</div>
          </div>
        </div>
      </div>
    </section>
  );
}
