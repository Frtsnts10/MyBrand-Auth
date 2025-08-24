// app/dashboard/layout.tsx
import clsx from "clsx";
import { Metadata } from "next";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "MyBrand | Dashboard",
  description: "Overview and analytics",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Why: Segment layout cannot include <html>; we mirror your RootLayout styles here.
  return (
    <div
      className={clsx(
        "min-h-screen text-foreground bg-background font-sans antialiased",
        fontSans.variable
      )}>
      <div className="relative flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
        <footer className="w-full flex items-center justify-center py-3 text-sm text-foreground/60">
          © {new Date().getFullYear()} MyBrand. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
