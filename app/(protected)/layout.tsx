"use client";

import React from "react";
import { AuthGuard } from "@/components/auth-guard";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Main content wrapped in AuthGuard */}
      <main className="flex-1">
        <AuthGuard>{children}</AuthGuard>
      </main>
    </div>
  );
}
