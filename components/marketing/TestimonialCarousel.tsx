"use client";

import { useEffect, useState } from "react";

const items = [
  { id: 1, text: "Layanan ini menghemat waktu kami membuat katalog produk.", author: "Toko Kue XYZ" },
  { id: 2, text: "Desainnya keren dan mudah digunakan.", author: "Penjual Tas ABC" },
  { id: 3, text: "Tim support cepat membantu kami.", author: "Toko Baju QWE" },
];

export default function TestimonialCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((s) => (s + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-xl bg-slate-800 p-6">
      <p className="text-slate-200">“{items[i].text}”</p>
      <div className="mt-3 text-xs text-slate-400">— {items[i].author}</div>
    </div>
  );
}
