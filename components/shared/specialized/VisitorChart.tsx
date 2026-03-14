/**
 * Visitor Chart Component
 * Displays visitor statistics using Recharts
 */

"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getVisitorStats,
  type VisitorStats,
} from "@/actions/analytics/tracking";

interface VisitorChartProps {
  days?: number;
}

export default function VisitorChart({ days = 30 }: VisitorChartProps) {
  const [stats, setStats] = useState<{
    data: VisitorStats[];
    total: number;
    trend: { value: number; direction: "up" | "down" | "neutral" };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await getVisitorStats(days);
      if (result.success && result.data) {
        // Format dates for display
        const formattedData = result.data.chartData.map((item) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          }),
        }));

        setStats({
          data: formattedData,
          total: result.data.totalViews,
          trend: result.data.trend,
        });
      } else {
        setError(result.error || "Gagal memuat data");
      }
      setLoading(false);
    }
    fetchData();
  }, [days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-white/20 rounded-xl bg-white/5">
        <div className="text-white animate-pulse">Memuat statistik...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-white/20 rounded-xl bg-white/5">
        <div className="text-white/70 text-sm text-center">
          <p>Tidak dapat memuat data</p>
          <p className="text-xs mt-1 opacity-70">{error}</p>
        </div>
      </div>
    );
  }

  const { data, total, trend } = stats;

  return (
    <div className="w-full">
      {/* Stats Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 px-2">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <p className="text-white/80 text-sm font-medium mb-1">
            Total Tayangan Halaman
          </p>
          <h3 className="text-4xl font-bold text-white mb-2">{total}</h3>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span
              className={`px-2 py-1 rounded-md text-xs font-bold ${
                trend.direction === "up"
                  ? "bg-green-500/20 text-green-200"
                  : trend.direction === "down"
                    ? "bg-red-500/20 text-red-200"
                    : "bg-gray-500/20 text-gray-200"
              }`}
            >
              {trend.direction === "up"
                ? "↗"
                : trend.direction === "down"
                  ? "↘"
                  : "•"}{" "}
              {trend.value}%
            </span>
            <span className="text-xs text-white/60">vs {days} hari lalu</span>
          </div>
        </div>
      </div>

      {/* Area Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#fff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "none",
                borderRadius: "12px",
                padding: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                color: "#333",
              }}
              itemStyle={{ color: "#E57526", fontWeight: "bold" }}
              labelStyle={{
                color: "#666",
                marginBottom: "4px",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#fff"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorViews)"
              name="Tayangan"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
