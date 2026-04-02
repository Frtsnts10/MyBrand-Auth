// store/auth-store.ts
import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  view: "login" | "signup" | "reset" | "update" | "checkEmail";
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setView: (view: AuthState["view"]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  view: "login",
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setView: (view) => set({ view }),
}));
