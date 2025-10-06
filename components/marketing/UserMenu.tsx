"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthUser } from "@/lib/hooks/useAuthUser";
import { supaBrowser } from "@/lib/supabase-browser";

export default function UserMenu() {
  const { user, loading } = useAuthUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = supaBrowser();
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/sign-in" className="text-sm text-slate-300 hover:text-white border border-slate-700 rounded-md px-4 py-2">
          Masuk
        </Link>
        <Link href="/sign-up" className="inline-flex items-center rounded-md bg-gradient-to-r from-white/15 to-white/5 px-4 py-2 text-sm font-medium text-white shadow">
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
        <img
          src={user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=random`}
          alt="User avatar"
          className="w-8 h-8 rounded-full"
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 min-w-[13rem] bg-slate-800 rounded-md shadow-lg py-1">
          <div className="px-4 py-3">
            <div className="text-sm text-white font-semibold">{user.user_metadata.user_name || user.email}</div>
            <div className="text-xs text-slate-400">{user.email}</div>
          </div>
          <Link href="/dashboard" className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-700">
            Dashboard
          </Link>
          <Link href="/settings" className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-700">
            Account Settings
          </Link>
          <Link href="#" className="flex items-center justify-between px-4 py-3 text-sm text-slate-300 hover:bg-slate-700">
            Create Team
            <span className="text-slate-400">+</span>
          </Link>
          <div className="my-1 border-t border-slate-700" />
          <Link href="#" className="flex items-center justify-between px-4 py-3 text-sm text-slate-300 hover:bg-slate-700">
            Command Menu
            <span className="text-xs text-slate-400">Ctrl K</span>
          </Link>
          <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-300">
            Theme
            <div className="flex items-center gap-2">
              <button className="p-1 rounded-md bg-slate-700 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-1.25-3M15 10V5a3 3 0 00-3-3H9a3 3 0 00-3 3v5m-4 0h16a1 1 0 011 1v3a1 1 0 01-1 1H2a1 1 0 01-1-1v-3a1 1 0 011-1z" />
                </svg>
              </button>
              <button className="p-1 rounded-md text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
              <button className="p-1 rounded-md text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="my-1 border-t border-slate-700" />
          <Link href="#" className="flex items-center justify-between px-4 py-3 text-sm text-slate-300 hover:bg-slate-700">
            Home Page
            <span className="text-xs text-slate-400">△</span>
          </Link>
          <button onClick={handleLogout} className="w-full text-left flex items-center justify-between px-4 py-3 text-sm text-slate-300 hover:bg-slate-700">
            Log Out
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
          <div className="p-2">
            <button className="w-full text-center rounded-md bg-gradient-to-r from-white/15 to-white/5 px-4 py-2 text-sm font-medium text-white shadow">
              Upgrade to Pro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
