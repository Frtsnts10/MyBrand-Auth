// app/(protected)/home/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  Star,
  Users,
  BarChart3,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description: "End-to-end encrypted sessions with Supabase Auth and row-level security.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    description: "Built on Next.js 16 with Turbopack — pages load in milliseconds.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Globe,
    title: "Global Ready",
    description: "Deploy anywhere on Vercel with edge functions for worldwide performance.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: BarChart3,
    title: "Rich Analytics",
    description: "Real-time charts and metrics powered by Recharts to track your growth.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const QUICK_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, desc: "View metrics & analytics" },
  { label: "Notifications", href: "#", icon: Bell, desc: "Check your notifications" },
  { label: "Team", href: "#", icon: Users, desc: "Manage team members" },
];

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [welcomed, setWelcomed] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Show welcome toast once per session
  useEffect(() => {
    if (user && !welcomed) {
      const name = user.email?.split("@")[0] ?? "there";
      const isNew = (Date.now() - new Date(user.created_at).getTime()) < 60_000;
      toast({
        title: isNew ? `Welcome to MyBrand, ${name}! 🎉` : `Welcome back, ${name}! 👋`,
        description: isNew
          ? "Your account has been created successfully."
          : "You're signed in and ready to go.",
      });
      setWelcomed(true);
    }
  }, [user, welcomed]);

  const displayName = user?.email?.split("@")[0] ?? "there";

  return (
    <div className="space-y-10">
      {/* Hero greeting */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 sm:p-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <Badge variant="outline" className="mb-3 gap-1.5 text-xs">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> Welcome home
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Hello, <span className="gradient-text capitalize">{displayName}</span> 👋
            </h1>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              You're signed in to MyBrand. Explore your dashboard, manage settings, or dive into your analytics.
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="gradient" size="lg" className="gap-2 shrink-0">
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Quick Links */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          {QUICK_LINKS.map(({ label, href, icon: Icon, desc }) => (
            <Link key={label} href={href}>
              <Card className="group hover:border-primary/40 transition-all duration-200 cursor-pointer h-full">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Feature cards */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold mb-4">What MyBrand offers</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description, color, bg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.07, duration: 0.4 }}
            >
              <Card className="h-full hover:border-primary/30 transition-colors group">
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Account info */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <Card>
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold capitalize">{displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-xs">Active</Badge>
              <span className="text-xs text-muted-foreground">
                Member since {user ? new Date(user.created_at).toLocaleDateString() : "—"}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
