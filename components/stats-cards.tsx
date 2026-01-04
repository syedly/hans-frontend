import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, AlertTriangle } from "lucide-react";
import { dashboardStats } from "@/lib/dummy-data";

export function StatsCards() {
  const stats = [
    {
      title: "Total Revenue",
      value: `$${dashboardStats.totalRevenue.toLocaleString("en-CA", {
        minimumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      description: "+12.5% from last month",
      color: "text-[#E6A8A8]",
    },
    {
      title: "Total Orders",
      value: dashboardStats.totalOrders.toString(),
      icon: ShoppingCart,
      description: "+8 new orders today",
      color: "text-blue-600",
    },
    {
      title: "Pending Orders",
      value: dashboardStats.pendingOrders.toString(),
      icon: Package,
      description: "Requires attention",
      color: "text-amber-600",
    },
    {
      title: "Low Stock Items",
      value: dashboardStats.lowStockItems.toString(),
      icon: AlertTriangle,
      description: "Restock needed",
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
