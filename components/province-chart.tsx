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
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
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

const COLORS = [
  "#E6A8A8",
  "#F4C2C2",
  "#D88E8E",
  "#C97A7A",
  "#B56666",
  "#A15252",
];

const chartConfig = {
  orders: {
    label: "Orders",
  },
};

interface ProvinceChartProps {
  purchases: Purchase[];
}

export function ProvinceChart({ purchases }: ProvinceChartProps) {
  const [chartData, setChartData] = useState<Array<{ province: string; orders: number }>>([]);

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      try {
        const res = await fetch("https://orghans.pythonanywhere.com/api/purchase/stats/");
        if (!res.ok) throw new Error("no-stats");
        const json = await res.json();
        if (json?.pie_chart && Array.isArray(json.pie_chart)) {
          const d = json.pie_chart.map((r: any) => ({ province: r.province || "Unknown", orders: Number(r.total) }));
          if (mounted) setChartData(d);
          return;
        }
      } catch {}

      // fallback to purchases aggregation
      const provinceData: { [key: string]: number } = {};
      purchases.forEach((purchase: any) => {
        const province = purchase.province ?? purchase.province_name ?? "Unknown";
        provinceData[province] = (provinceData[province] || 0) + 1;
      });
      const fallback = Object.entries(provinceData).map(([province, orders]) => ({ province, orders }));
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
        <CardTitle>Orders by Province</CardTitle>
        <CardDescription>Distribution across Canada</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ province, percent }) =>
                  `${province} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="orders"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
