// components/navbar.tsx
"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { Menu, X, User2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// mock auth

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

type Props = { onLogout?: () => Promise<void> | void };

type NavItem = { href: string; label: string };

// mock auth

const DEFAULT_AVATAR_DATA_URL =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
  <rect width='64' height='64' rx='32' fill='white'/>
  <g fill='rgb(200,200,200)'>
    <circle cx='32' cy='26' r='12'/>
    <path d='M8 56c4-12 16-18 24-18s20 6 24 18' />
  </g>
</svg>`);

function ProfileAvatar({ src, alt }: { src?: string | null; alt?: string }) {
  const hasSrc = typeof src === "string" && src.length > 0;
  return (
    <div className="size-8 md:size-9 rounded-full border border-foreground/10 overflow-hidden bg-foreground/10 grid place-items-center">
      {hasSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src as string}
          alt={alt ?? "Avatar"}
          className="w-full h-full object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={DEFAULT_AVATAR_DATA_URL}
          alt="Blank avatar"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}

export const Navbar: React.FC<Props> = ({ onLogout }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const isAuth = window.localStorage.getItem("mock_session") === "true";
    if (isAuth) {
      setEmail("demo@example.com");
      setName("Demo User");
      setAvatarUrl(null);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleLogout = async () => {
    try {
      window.localStorage.removeItem("mock_session");
      await onLogout?.();
    } finally {
      if (!onLogout) window.location.href = "/";
    }
  };

  const ProfileChip = useMemo(
    () => (
      <NextLink
        href="/profile"
        title={name ?? "Profile"}
        className="hidden md:inline-flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-foreground/10 hover:bg-foreground/5 max-w-[220px]">
        <ProfileAvatar src={avatarUrl} alt="Profile" />
        <span className="truncate text-sm font-medium">
          {name ?? "Profile"}
        </span>
      </NextLink>
    ),
    [avatarUrl, name]
  );

  return (
    <>
      <HeroUINavbar 
        maxWidth="full" 
        position="sticky" 
        classNames={{ 
          base: "bg-white/60 dark:bg-black/60 border-b border-foreground/10",
          wrapper: "px-4 md:px-6" 
        }}
        style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      >
        
        <NavbarContent justify="start" className="basis-1/3 md:hidden">
          <Button
            isIconOnly
            variant="light"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </Button>
        </NavbarContent>

        <NavbarContent justify="center" className="basis-1/3 hidden md:flex" />

        {/* Right: theme + profile chip (md+) + logout */}
        <NavbarContent justify="end" className="basis-1/3 gap-2 hidden md:flex">
          <NavbarItem>{ProfileChip}</NavbarItem>
          <NavbarItem><ThemeSwitch /></NavbarItem>
          <NavbarItem>
            <Button
              variant="bordered"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 md:hidden"
            role="dialog"
            aria-modal="true">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r border-foreground/10 shadow-xl">
              <div className="h-20 px-4 flex items-center justify-between border-b border-foreground/10">
                <NextLink
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 min-w-0 -ml-2 px-2 py-2 rounded-md hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-foreground/20">
                  <ProfileAvatar src={avatarUrl} alt="Profile" />
                  <div className="min-w-0 leading-tight">
                    <div className="font-medium truncate">{name ?? "—"}</div>
                    <div className="text-xs text-foreground/60 truncate">
                      {email ?? "—"}
                    </div>
                  </div>
                </NextLink>
                <Button
                  isIconOnly
                  variant="light"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}>
                  <X className="size-5" />
                </Button>
              </div>

              <nav className="flex h-[calc(100%-5rem)] flex-col">
                <ul className="flex flex-col flex-1 overflow-y-auto p-2">
                  {(siteConfig.navItems as NavItem[]).map((item) => {
                    const active = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <NextLink
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={clsx(
                            "block px-4 py-3 rounded-md",
                            active
                              ? "bg-foreground/10 text-primary"
                              : "hover:bg-foreground/5"
                          )}>
                          {item.label}
                        </NextLink>
                      </li>
                    );
                  })}
                </ul>

                <div className="border-t border-foreground/10 p-4 flex items-center justify-between">
                  <ThemeSwitch />
                  <Button
                    variant="bordered"
                    size="sm"
                    onClick={() => {
                      setOpen(false);
                      void handleLogout();
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
