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
import { ordersByProvince } from "@/lib/dummy-data";

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

export function ProvinceChart() {
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
                data={ordersByProvince}
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
                {ordersByProvince.map((entry, index) => (
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
