import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RevenueChart } from "@/components/revenue-chart";
import { ProvinceChart } from "@/components/province-chart";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
} from "lucide-react";

export default async function AnalyticsPage() {
  const [purchases, products, stats] = await Promise.all([
    fetch("http://localhost:3000/api/purchases", { cache: "no-store" }).then((r) => (r.ok ? r.json() : [] as any[])).catch(() => []),
    fetch("http://localhost:3000/api/products", { cache: "no-store" }).then((r) => (r.ok ? r.json() : [] as any[])).catch(() => []),
    fetch("http://localhost:3000/api/purchase/stats", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
  ]);

  const totalRevenue = (purchases || []).reduce((sum: number, p: any) => {
    const price = Number(p.product?.discounted_price ?? p.product?.price ?? 0);
    return sum + price;
  }, 0);

  const totalOrders = (purchases || []).length;
  const uniqueCustomers = new Set((purchases || []).map((p: any) => p.user?.id ?? p.user?.username)).size || 1;
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
  const returnCount = (purchases || []).filter((p: any) => (p.status || "").toLowerCase() === "returned").length;
  const returnRate = totalOrders ? (returnCount / totalOrders) * 100 : 0;

  // revenue growth: use stats.bar_chart when available, else compute from purchases monthly totals
  let revenueGrowthDisplay = "N/A";
  try {
    const bar = stats?.bar_chart ?? null;
    if (Array.isArray(bar) && bar.length >= 2) {
      const last = Number(bar[bar.length - 1].total || 0);
      const prev = Number(bar[bar.length - 2].total || 0);
      revenueGrowthDisplay = prev ? `${(((last - prev) / prev) * 100).toFixed(1)}%` : "N/A";
    } else {
      revenueGrowthDisplay = "N/A";
    }
  } catch {
    revenueGrowthDisplay = "N/A";
  }

  // top products
  const productMap: Record<string, { name: string; sales: number; revenue: number }> = {};
  (purchases || []).forEach((p: any) => {
    const prod = p.product || {};
    const id = prod.id ?? prod.name ?? "unknown";
    const price = Number(prod.discounted_price ?? prod.price ?? 0);
    if (!productMap[id]) productMap[id] = { name: prod.name || "Unknown", sales: 0, revenue: 0 };
    productMap[id].sales += 1;
    productMap[id].revenue += price;
  });

  const topProducts = Object.values(productMap).sort((a, b) => b.sales - a.sales).slice(0, 4);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Detailed insights and performance metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueGrowthDisplay}</div>
            <p className="text-xs text-muted-foreground">vs previous month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Order Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[#E6A8A8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Average order value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders per Customer</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalOrders / uniqueCustomers).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Average orders per customer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{returnRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Return rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart purchases={purchases} />
        <ProvinceChart purchases={purchases} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>Best performing products this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${product.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
