// config/site.ts
// Dashboard-first config with simple top nav and richer meta used by pages

export type NavItem = { label: string; href: string; icon?: string };
export type MenuItem = { label: string; href: string };
export type QuickAction = {
  id: string;
  label: string;
  href: string; // internal route to start the action
  icon?: string; // lucide icon name (string), pages decide how to render
};
export type InsightCardKey =
  | "revenue"
  | "activeUsers"
  | "bounceRate"
  | "growth";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "MyBrand | Sign-In",
  description: "Make beautiful dashboards that feel like a co‑pilot.",

  /**
   * Minimal top navbar (desktop/tablet). Mobile drawer can show more items.
   */
  navItems: [
    { label: "Home", href: "/dashboard", icon: "Home" },
    { label: "POS", href: "/pos", icon: "CreditCard" },
    { label: "Products", href: "/products", icon: "Package" },   // inventory
    { label: "Customers", href: "/customers", icon: "Users" },
    { label: "Sales", href: "/sales", icon: "LineChart" },         // sales history
    { label: "Reports", href: "/reports", icon: "FileText" },     // analytics
    { label: "Team", href: "/team", icon: "Users2" }, 
  ] as NavItem[],

  /**
   * Secondary menu (mobile drawer or profile menu)
   */
  navMenuItems: [
    { label: "Profile", href: "/profile" },
    { label: "Projects", href: "/projects" },
    { label: "Team", href: "/team" },
    { label: "Calendar", href: "/calendar" },
    { label: "Settings", href: "/settings" },
    { label: "Help & Feedback", href: "/help-feedback" },
    { label: "Logout", href: "/logout" },
  ] as MenuItem[],

  /**
   * Quick actions rendered on the Overview header as primary CTAs.
   */
  quickActions: [
    {
      id: "new-report",
      label: "New Report",
      href: "/reports/new",
      icon: "FilePlus",
    },
    {
      id: "add-customer",
      label: "Add Customer",
      href: "/customers/new",
      icon: "UserPlus",
    },
    { id: "export", label: "Export", href: "/exports", icon: "Download" },
  ] as QuickAction[],

  /**
   * Which insight cards to show (order matters). Pages can map this to components.
   */
  overviewInsights: [
    "revenue",
    "activeUsers",
    "bounceRate",
    "growth",
  ] as InsightCardKey[],

  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
