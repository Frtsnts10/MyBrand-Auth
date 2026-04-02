import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "MyBrand | Auth",
    template: "%s | MyBrand",
  },
  description:
    "MyBrand — your trusted platform for seamless authentication and secure access.",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0f1a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <Providers attribute="class" defaultTheme="dark" enableSystem>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
