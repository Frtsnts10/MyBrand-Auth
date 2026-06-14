import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-600/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-cyan-300/20 dark:bg-cyan-700/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
      </div>
      <div className="max-w-xl w-full rounded-2xl border border-white/20 dark:border-foreground/10 bg-white/40 dark:bg-black/30 backdrop-blur-xl shadow-sm p-6 md:p-8 text-center relative z-10">
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
