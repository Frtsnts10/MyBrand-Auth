import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyBrand | Dashboard",
  description: "Overview and analytics",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
