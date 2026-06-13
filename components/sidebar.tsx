"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";
import { Home, CreditCard, Package, Users, LineChart, FileText, Users2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Dancing_Script } from "next/font/google";

const scriptFont = Dancing_Script({ subsets: ["latin"] });

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="size-5" />,
  CreditCard: <CreditCard className="size-5" />,
  Package: <Package className="size-5" />,
  Users: <Users className="size-5" />,
  LineChart: <LineChart className="size-5" />,
  FileText: <FileText className="size-5" />,
  Users2: <Users2 className="size-5" />,
};

export const Sidebar = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside 
      className={clsx(
        "sticky top-0 h-screen z-40 flex flex-col border-r border-white/20 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl transition-all duration-300 shadow-sm",
        isExpanded ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="h-16 flex items-center justify-center border-b border-foreground/10 px-2 overflow-hidden">
        <NextLink href="/dashboard" className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
          {isExpanded ? (
            <p className={`text-2xl font-bold ${scriptFont.className}`}>MyBrand</p>
          ) : (
            <p className={`text-2xl font-bold ${scriptFont.className}`}>M</p>
          )}
        </NextLink>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="flex flex-col gap-2 px-2">
          {siteConfig.navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <NextLink
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap overflow-hidden",
                  active ? "bg-primary/10 text-primary" : "hover:bg-foreground/5 text-foreground/80 hover:text-foreground"
                )}
                title={!isExpanded ? item.label : undefined}
              >
                <div className="flex-shrink-0 flex items-center justify-center">
                  {item.icon && iconMap[item.icon] ? iconMap[item.icon] : <div className="size-5" />}
                </div>
                {isExpanded && <span className="font-medium text-sm">{item.label}</span>}
              </NextLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
