// components/auth-guard.tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
};

export function AuthGuard({
  children,
  redirectTo = "/",
  fallback = (
    <div className="flex min-h-screen items-center justify-center text-center">
      <div className="flex items-center gap-3 animate-pulse rounded-xl border border-foreground/10 px-6 py-4">
        {/* Spinner */}
        <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
        {/* Text */}
        <span>Checking session…</span>
      </div>
    </div>
  ),
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const doRedirect = () => {
      if (pathname !== redirectTo) router.replace(redirectTo);
    };

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted.current) return;
      if (error) console.error("auth.getSession error:", error);
      if (!session) doRedirect();
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_e, session) => {
        if (!mounted.current) return;
        if (!session) doRedirect();
        setChecking(false);
      }
    );

    return () => {
      mounted.current = false;
      listener.subscription.unsubscribe();
    };
  }, [router, pathname, redirectTo]);

  if (checking) return fallback;
  return <>{children}</>;
}
