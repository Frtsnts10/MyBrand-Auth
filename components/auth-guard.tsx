// components/auth-guard.tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
// using local storage for mock auth

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

    const isAuth = window.localStorage.getItem("mock_session") === "true";
    if (!isAuth) {
      doRedirect();
    }
    setChecking(false);

    return () => {
      mounted.current = false;
    };
  }, [router, pathname, redirectTo]);

  if (checking) return fallback;
  return <>{children}</>;
}
