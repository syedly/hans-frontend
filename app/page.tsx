import { StatsCards } from "@/components/stats-cards";
import { RecentOrders } from "@/components/recent-orders";
import { RevenueChart } from "@/components/revenue-chart";
import { ProvinceChart } from "@/components/province-chart";
import { InventoryTable } from "@/components/inventory-table";

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to Hans Beauty Order Management System
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart />
        <ProvinceChart />
      </div>

      <RecentOrders />

      <InventoryTable />
    </>
  );
}
