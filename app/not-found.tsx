import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-xl w-full rounded-2xl border border-foreground/10 bg-white/70 dark:bg-black/30 p-6 md:p-8 text-center">
        <div className="text-6xl font-bold tracking-tight">404</div>
        <h1 className="mt-2 text-2xl md:text-3xl font-semibold">
          Page not found
        </h1>
        <p className="mt-2 text-foreground/70">
          The page you’re looking for doesn’t exist or was moved.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-foreground/10 px-4 py-2 hover:bg-foreground/5">
            <ArrowLeft className="size-4" />
            Go back home
          </Link>
        </div>

        <div className="mt-6 text-sm text-foreground/60">
          Need help?{" "}
          <a
            className="underline underline-offset-4"
            href="mailto:support@mybrand.dev">
            Contact support
          </a>
        </div>
      </div>
    </main>
  );
}
