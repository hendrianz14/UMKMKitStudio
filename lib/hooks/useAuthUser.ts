"use client";

import { useAuth } from "@/components/AuthProvider";

export function useAuthUser() {
  return useAuth();
}
