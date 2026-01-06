"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

type Purchase = {
  id: number;
  purchase_date: number;
  purchase_month: string;
  purchase_year: number;
  province: string | null;
  contact: string | null;
  status: string;
  last_digits: string | null;
  shipping_address: string | null;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
  };
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    discounted_price: number;
    is_available: boolean;
    status: string;
    category: string | null;
    sku: string | null;
    stock: number | null;
    image_url: string;
  };
};

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#E6A8A8",
  },
};

interface RevenueChartProps {
  purchases: Purchase[];
}

export function RevenueChart({ purchases }: RevenueChartProps) {
  const [chartData, setChartData] = useState<Array<{ month: string; revenue: number }>>([]);

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      try {
        const res = await fetch("/api/purchase/stats");
        if (!res.ok) throw new Error("no-stats");
        const json = await res.json();

        // expect { bar_chart: [{ purchase_month, purchase_year, total }] }
        if (json?.bar_chart && Array.isArray(json.bar_chart)) {
          const d = json.bar_chart
            .map((r: any) => ({ month: `${r.purchase_month} ${r.purchase_year}`, revenue: Number(r.total) }))
            .slice(-6);
          if (mounted) setChartData(d);
          return;
        }
      } catch {}

      // fallback to purchases aggregation
      const monthlyData: { [key: string]: number } = {};
      purchases.forEach((purchase) => {
        const monthKey = `${purchase.purchase_month} ${purchase.purchase_year}`;
        const amount = purchase.product?.discounted_price || purchase.product?.price || 0;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + amount;
      });
      const fallback = Object.entries(monthlyData)
        .map(([month, revenue]) => ({ month, revenue: Math.round(revenue * 100) / 100 }))
        .slice(-6);
      if (mounted) setChartData(fallback);
    }

    loadStats();
    return () => {
      mounted = false;
    };
  }, [purchases]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Revenue by month from your purchases</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="#E6A8A8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
