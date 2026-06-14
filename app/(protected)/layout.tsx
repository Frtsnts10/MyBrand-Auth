"use client";

import React from "react";
import { AuthGuard } from "@/components/auth-guard";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-600/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-cyan-300/20 dark:bg-cyan-700/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
        </div>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-4 md:p-6 flex flex-col min-h-0">{children}</main>
          <footer className="w-full flex items-center justify-center py-3 text-sm text-foreground/60">
            © {new Date().getFullYear()} MyBrand. All rights reserved.
          </footer>
        </div>
      </div>
    </AuthGuard>
  );
}
