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
        <Link href="/sign-up" className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-medium shadow">
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
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1">
          <Link href="/dashboard" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
            Dashboard
          </Link>
          <Link href="/settings" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
            Settings
          </Link>
          <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
