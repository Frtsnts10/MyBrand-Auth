// app/(protected)/dashboard/layout.tsx
// Dashboard-specific metadata only – layout/nav is in parent (protected)/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | MyBrand",
  description: "Overview and analytics for your MyBrand account.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
