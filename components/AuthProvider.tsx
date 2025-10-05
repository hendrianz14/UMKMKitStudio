"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supaBrowser } from "@/lib/supabase-browser";
import type { User, Session } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types"; // Import Database type

type Profile = Database['public']['Tables']['profiles']['Row']; // Define Profile type

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null; // Added profile
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession: Session | null;
}) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [user, setUser] = useState<User | null>(initialSession?.user || null);
  const [profile, setProfile] = useState<Profile | null>(null); // State for profile
  const [loading, setLoading] = useState(true); // Set to true initially as we fetch profile

  useEffect(() => {
    const supabase = supaBrowser();

    const fetchProfile = async (userId: string) => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId) // Changed to user_id
        .maybeSingle();
      if (error) {
        console.error("Error fetching profile in AuthProvider:", error);
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    if (initialSession?.user) {
      fetchProfile(initialSession.user.id);
    } else {
      setLoading(false);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        if (currentSession?.user) {
          fetchProfile(currentSession.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [initialSession?.user?.id]); // Depend on initialSession.user.id to refetch profile if user changes

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ session, user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
