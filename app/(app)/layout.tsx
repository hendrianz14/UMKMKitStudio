import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[220px_1fr]">
      <aside className="hidden md:block border-r bg-white/80 backdrop-blur">
        <nav className="sticky top-0 p-4 space-y-2">
          <div className="font-semibold mb-2">UMKM KitStudio</div>
          <ul className="space-y-1 text-sm">
            <li><Link className="hover:underline" href="/dashboard">Dashboard</Link></li>
            <li><Link className="hover:underline" href="/generate">Generate</Link></li>
            <li><Link className="hover:underline" href="/history">History</Link></li>
            <li><Link className="hover:underline" href="/settings">Settings</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="px-4 md:px-8 py-16">{children}</main>
    </div>
  );
}
