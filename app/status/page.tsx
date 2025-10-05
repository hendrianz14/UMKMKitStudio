export default function StatusPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-white mb-2">System Status</h1>
        <p className="text-slate-300 mb-6">All systems operational.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">API: <span className="font-semibold text-green-400">Operational</span></div>
          <div className="card p-4">Database: <span className="font-semibold text-green-400">Operational</span></div>
          <div className="card p-4">Worker: <span className="font-semibold text-green-400">Operational</span></div>
        </div>
      </div>
    </main>
  );
}
