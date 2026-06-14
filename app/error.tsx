"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Home, RefreshCw, Mail, Copy } from "lucide-react";
import { Button } from "@heroui/button";

// Why: Friendly UI, quick actions, optional diagnostics in dev.
export default function ErrorPage({
  error,
  reset,
}: {
  error: (Error & { digest?: string }) | any;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Replace with Sentry/LogRocket/etc.
    console.error("App error boundary:", error);
  }, [error]);

  const errorId = useMemo(
    () => error?.digest ?? globalThis.crypto?.randomUUID?.() ?? "unknown",
    [error]
  );
  const isDev = process.env.NODE_ENV !== "production";

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(String(errorId));
    } catch {}
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="max-w-xl w-full rounded-2xl border border-foreground/10 bg-white/70 dark:bg-black/30 p-6 md:p-8 text-center">
        <div className="mx-auto mb-4 grid place-items-center size-12 rounded-full bg-red-500/10 text-red-600">
          <AlertTriangle className="size-6" />
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Something went wrong
        </h1>
        <p className="mt-2 text-foreground/70">
          An unexpected error occurred. You can retry or go back to the
          dashboard.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            variant="bordered"
            startContent={<RefreshCw className="size-4" />}>
            Try again
          </Button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2">
            <Home className="size-4" />
            Go to dashboard
          </Link>
          <a
            href={`mailto:support@mybrand.dev?subject=Error%20${encodeURIComponent(String(errorId))}&body=Please%20describe%20what%20you%20were%20doing.%0AError%20ID:%20${encodeURIComponent(String(errorId))}`}
            className="inline-flex items-center gap-2 rounded-lg border border-foreground/10 px-4 py-2 hover:bg-foreground/5">
            <Mail className="size-4" />
            Report issue
          </a>
        </div>

        <div className="mt-6 text-xs text-foreground/60">
          <span>Error ID:</span>
          <code className="mx-2 rounded bg-foreground/10 px-1.5 py-0.5">
            {String(errorId)}
          </code>
          <Button
            size="sm"
            variant="light"
            onClick={copyId}
            startContent={<Copy className="size-3" />}>
            Copy
          </Button>
        </div>

        {isDev && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer select-none text-sm text-foreground/80">
              Details (dev only)
            </summary>
            <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-foreground/5 p-3 text-xs leading-relaxed">
              {String(error?.stack ?? error?.message ?? error)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
