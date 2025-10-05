import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-800 pt-8 text-slate-400">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">© {new Date().getFullYear()} UMKM KitStudio</div>
        <div className="flex gap-4 items-center">
          <Link href="/terms" className="text-sm hover:text-white">Terms</Link>
          <Link href="/privacy" className="text-sm hover:text-white">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
