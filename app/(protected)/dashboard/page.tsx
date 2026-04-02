// app/(protected)/dashboard/page.tsx
"use client";

import React from "react";
import { TrendingUp, Users, DollarSign, Activity, Download, Plus } from "lucide-react";
import {
  LineChart,
  Line,
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

const chartData = [
  { month: "Jan", value: 220 },
  { month: "Feb", value: 260 },
  { month: "Mar", value: 210 },
  { month: "Apr", value: 300 },
  { month: "May", value: 340 },
  { month: "Jun", value: 390 },
];

const stats = [
  { title: "Revenue", value: "$42,340", Icon: DollarSign, delta: "+12%", trend: "up" as const },
  { title: "Active Users", value: "8,120", Icon: Users, delta: "+3.1%", trend: "up" as const },
  { title: "Bounce Rate", value: "27%", Icon: Activity, delta: "-1.8%", trend: "down" as const },
  { title: "Growth", value: "+5.7%", Icon: TrendingUp, delta: "+0.4%", trend: "up" as const },
];

const customers = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: "Alex Johnson",
  email: `alex${i + 1}@mail.com`,
  spend: (4000 + (i + 1) * 137).toLocaleString(),
  status: "Active",
}));

function StatCard({
  title,
  value,
  Icon,
  delta,
  trend,
  index,
}: {
  title: string;
  value: string;
  Icon: React.ComponentType<any>;
  delta?: string;
  trend?: "up" | "down";
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-2">{value}</p>
          {delta && (
            <p className={`text-xs font-medium flex items-center gap-1 ${trend === "down" ? "text-red-500" : "text-emerald-500"}`}>
              {trend === "down" ? "↓" : "↑"} {delta} vs last month
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Overview</h1>
          <p className="text-muted-foreground mt-1">Snapshot of your product metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="gradient" size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> New Report
          </Button>
        </div>
      </motion.header>

      {/* Stat cards */}
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={s.title} {...s} index={i} />
        ))}
      </section>

      {/* Charts row */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="xl:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Monthly Performance</CardTitle>
              <select className="px-2 py-1 rounded-md bg-muted text-sm border border-border text-foreground">
                <option>Last 6 months</option>
                <option>Last 12 months</option>
              </select>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ left: 0, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Users className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">User {i} signed up</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Table */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Top Customers</CardTitle>
            <Button variant="outline" size="sm">View all</Button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-t border-border text-left bg-muted/40">
                  <th className="px-6 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">Spend</th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-3 font-medium">{c.name}</td>
                    <td className="px-6 py-3 text-muted-foreground">{c.email}</td>
                    <td className="px-6 py-3">${c.spend}</td>
                    <td className="px-6 py-3">
                      <Badge variant="success">Active</Badge>
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
