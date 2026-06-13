// app/dashboard/page.tsx
"use client";

import React from "react";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { month: "Jan", value: 220 },
  { month: "Feb", value: 260 },
  { month: "Mar", value: 210 },
  { month: "Apr", value: 300 },
  { month: "May", value: 340 },
  { month: "Jun", value: 390 },
];

function Stat({
  title,
  value,
  Icon,
  delta,
  trend,
}: {
  title: string;
  value: string;
  Icon: React.ComponentType<any>;
  delta?: string;
  trend?: "up" | "down";
}) {
  return (
    <div className="rounded-2xl border border-white/20 dark:border-foreground/10 p-4 md:p-5 bg-white/40 dark:bg-black/30 backdrop-blur-xl shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground/70">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="size-10 rounded-xl bg-foreground/10 flex items-center justify-center">
          <Icon className="size-5" />
        </div>
      </div>
      {delta && (
        <p
          className={`mt-3 text-sm ${trend === "down" ? "text-red-500" : "text-emerald-600"}`}>
          {delta} {trend === "down" ? "↓" : "↑"}
        </p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Overview</h1>
          <p className="text-foreground/60">Snapshot of your product metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg border border-foreground/10 hover:bg-foreground/5">
            Export
          </button>
          <button className="px-3 py-2 rounded-lg bg-foreground text-background">
            New Report
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          title="Revenue"
          value="$42,340"
          Icon={DollarSign}
          delta="+12%"
          trend="up"
        />
        <Stat
          title="Active Users"
          value="8,120"
          Icon={Users}
          delta="+3.1%"
          trend="up"
        />
        <Stat
          title="Bounce Rate"
          value="27%"
          Icon={Activity}
          delta="-1.8%"
          trend="down"
        />
        <Stat title="Growth" value="+5.7%" Icon={TrendingUp} />
      </section>

      <div className="relative mt-2">
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl">
          <div className="bg-white/60 dark:bg-background/80 backdrop-blur-2xl border border-white/20 dark:border-foreground/10 shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col items-center text-center max-w-sm">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <svg className="size-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
            <p className="text-sm text-foreground/70">
              Advanced analytics and comprehensive reports are being built. Stay tuned!
            </p>
          </div>
        </div>

        <div className="opacity-30 pointer-events-none select-none space-y-6 overflow-hidden max-h-[800px]">
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        <div className="xl:col-span-2 rounded-2xl border border-white/20 dark:border-foreground/10 p-4 md:p-6 bg-white/40 dark:bg-black/30 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Monthly Performance</h2>
            <select className="px-2 py-1 rounded-md bg-foreground/5 text-sm">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/20 dark:border-foreground/10 p-4 md:p-6 bg-white/40 dark:bg-black/30 backdrop-blur-xl shadow-sm">
          <h2 className="font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3 text-sm">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="size-2 mt-2 rounded-full bg-foreground/60" />
                <div>
                  <p className="font-medium">User {i} signed up</p>
                  <p className="text-foreground/60">A minute ago</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-white/20 dark:border-foreground/10 bg-white/40 dark:bg-black/30 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="px-4 md:px-6 py-4 flex items-center justify-between">
          <h2 className="font-semibold">Top Customers</h2>
          <button className="px-3 py-1.5 rounded-md border border-foreground/10">
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left bg-foreground/5">
                <th className="px-4 md:px-6 py-3">Name</th>
                <th className="px-4 md:px-6 py-3">Email</th>
                <th className="px-4 md:px-6 py-3">Spend</th>
                <th className="px-4 md:px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <tr key={i} className="border-t border-foreground/10">
                  <td className="px-4 md:px-6 py-3">Alex Johnson</td>
                  <td className="px-4 md:px-6 py-3">alex{i}@mail.com</td>
                  <td className="px-4 md:px-6 py-3">
                    $ {(4000 + i * 137).toLocaleString()}
                  </td>
                  <td className="px-4 md:px-6 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/15 text-emerald-600">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
        </div>
      </div>
    </div>
  );
}
