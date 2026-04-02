// components/auth-guard.tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

type Props = {
  children: ReactNode;
  redirectTo?: string;
};

export function AuthGuard({ children, redirectTo = "/" }: Props) {
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

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!mounted.current) return;
      if (!session) doRedirect();
      setChecking(false);
    });

    return () => {
      mounted.current = false;
      listener.subscription.unsubscribe();
    };
  }, [router, pathname, redirectTo]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 glass-dark rounded-2xl px-6 py-4">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground text-sm">Verifying session…</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
