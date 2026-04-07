// app/(protected)/layout.tsx
import { AuthGuard } from "@/components/auth-guard";
import { Navbar } from "@/components/navbar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 md:py-8">
          {children}
        </main>
        <footer className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MyBrand. All rights reserved.
        </footer>
      </div>
    </AuthGuard>
  );
}
