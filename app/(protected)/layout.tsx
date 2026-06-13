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
      <div className="relative flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100/80 dark:bg-none dark:from-transparent dark:to-transparent">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-4 md:p-6">{children}</main>
          <footer className="w-full flex items-center justify-center py-3 text-sm text-foreground/60">
            © {new Date().getFullYear()} MyBrand. All rights reserved.
          </footer>
        </div>
      </div>
    </AuthGuard>
  );
}
