import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-black to-slate-900 text-white">
      {/* reserve space for fixed navbar */}
      <main className="pt-16 pb-12">{children}</main>
    </div>
  );
}
