export default function ChangelogPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-4">Changelog</h1>
        <p className="text-slate-300">Recent updates and release notes for UMKM KitStudio.</p>

        <ul className="mt-6 space-y-4">
          <li className="card p-4">
            <div className="font-semibold">v0.3.0 — 2025-10-05</div>
            <div className="text-sm text-slate-400">Landing page redesign, parallax preview, mobile menu, SEO improvements.</div>
          </li>
          <li className="card p-4">
            <div className="font-semibold">v0.2.0 — 2025-09-20</div>
            <div className="text-sm text-slate-400">Initial marketing group and onboarding flow.</div>
          </li>
        </ul>
      </div>
    </main>
  );
}
