// app/(protected)/dashboard/page.tsx
"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const chartData = [
  { month: "Jan", revenue: 3200, users: 80 },
  { month: "Feb", revenue: 4800, users: 120 },
  { month: "Mar", revenue: 3900, users: 95 },
  { month: "Apr", revenue: 6100, users: 160 },
  { month: "May", revenue: 7200, users: 210 },
  { month: "Jun", revenue: 8400, users: 275 },
  { month: "Jul", revenue: 9100, users: 310 },
];

const stats = [
  {
    title: "Total Revenue",
    value: "$42,340",
    Icon: DollarSign,
    delta: "+12.5%",
    trend: "up" as const,
    sub: "vs last month",
    color: "text-emerald-500",
  },
  {
    title: "Active Users",
    value: "8,120",
    Icon: Users,
    delta: "+3.1%",
    trend: "up" as const,
    sub: "vs last month",
    color: "text-blue-500",
  },
  {
    title: "Bounce Rate",
    value: "27%",
    Icon: Activity,
    delta: "-1.8%",
    trend: "down" as const,
    sub: "vs last month",
    color: "text-red-500",
  },
  {
    title: "Growth Rate",
    value: "+5.7%",
    Icon: TrendingUp,
    delta: "+0.4%",
    trend: "up" as const,
    sub: "this quarter",
    color: "text-purple-500",
  },
];

const customers = [
  { id: 1, name: "Alex Johnson", email: "alex@mail.com", spend: "$4,137", status: "Active", joined: "Jan 2025" },
  { id: 2, name: "Maria Garcia", email: "maria@mail.com", spend: "$3,890", status: "Active", joined: "Feb 2025" },
  { id: 3, name: "James Lee", email: "james@mail.com", spend: "$3,241", status: "Active", joined: "Feb 2025" },
  { id: 4, name: "Sophie Turner", email: "sophie@mail.com", spend: "$2,975", status: "Inactive", joined: "Mar 2025" },
  { id: 5, name: "Liam Chen", email: "liam@mail.com", spend: "$2,810", status: "Active", joined: "Mar 2025" },
];

const activity = [
  { id: 1, label: "New user signed up", time: "2m ago", type: "user" },
  { id: 2, label: "Report generated", time: "15m ago", type: "report" },
  { id: 3, label: "Payment received: $549", time: "1h ago", type: "payment" },
  { id: 4, label: "New user signed up", time: "2h ago", type: "user" },
  { id: 5, label: "System updated to v16.2", time: "5h ago", type: "system" },
];

const activityColors: Record<string, string> = {
  user: "bg-blue-500/10 text-blue-500",
  report: "bg-purple-500/10 text-purple-500",
  payment: "bg-emerald-500/10 text-emerald-500",
  system: "bg-amber-500/10 text-amber-500",
};
const activityIcons: Record<string, React.ComponentType<any>> = {
  user: Users,
  report: TrendingUp,
  payment: DollarSign,
  system: RefreshCw,
};

function StatCard({
  title, value, Icon, delta, trend, sub, color, index,
}: {
  title: string; value: string; Icon: React.ComponentType<any>;
  delta?: string; trend?: "up" | "down"; sub?: string; color: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <div className={cn("w-9 h-9 rounded-xl bg-muted flex items-center justify-center")}>
              <Icon className={cn("w-4 h-4", color)} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold mb-2">{value}</p>
          {delta && (
            <div className="flex items-center gap-1.5">
              {trend === "up"
                ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                : <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
              }
              <span className={`text-xs font-semibold ${trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
                {delta}
              </span>
              {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [chartRange, setChartRange] = useState("6m");

  const handleExport = () => {
    toast({ title: "Export started", description: "Your CSV will download shortly." });
  };

  const handleNewReport = () => {
    toast({ title: "New report", description: "Report creation coming soon!" });
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Snapshot of your business metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            variant="gradient"
            size="sm"
            className="gap-1.5"
            onClick={handleNewReport}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Report</span>
          </Button>
        </div>
      </motion.header>

      {/* Stat cards */}
      <section className="grid gap-3 sm:gap-4 grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={s.title} {...s} index={i} />
        ))}
      </section>

      {/* Charts row */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Area chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="xl:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 gap-2">
              <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
              <div className="flex items-center gap-1">
                {["3m", "6m", "1y"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setChartRange(r)}
                    className={cn(
                      "px-2.5 py-1 text-xs rounded-md transition-colors",
                      chartRange === r
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="h-56 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ left: -20, right: 8, top: 4 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))",
                        fontSize: "12px",
                      }}
                      formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      fill="url(#colorRevenue)"
                      dot={false}
                      activeDot={{ r: 5, fill: "hsl(var(--primary))" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {activity.map((a) => {
                  const Icon = activityIcons[a.type] ?? Activity;
                  return (
                    <li key={a.id} className="flex items-start gap-3">
                      <div className={cn("shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5", activityColors[a.type])}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">{a.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Customers table */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Top Customers</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast({ title: "View all", description: "Customer management coming soon!" })}
            >
              View all
            </Button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-t border-border text-left bg-muted/40">
                  <th className="px-4 sm:px-6 py-3 font-medium text-muted-foreground whitespace-nowrap">Customer</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-muted-foreground hidden sm:table-cell whitespace-nowrap">Joined</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-muted-foreground whitespace-nowrap">Spend</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-muted-foreground whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 sm:px-6 py-3">
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                      {c.joined}
                    </td>
                    <td className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">{c.spend}</td>
                    <td className="px-4 sm:px-6 py-3">
                      <Badge variant={c.status === "Active" ? "success" : "secondary"}>
                        {c.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}
