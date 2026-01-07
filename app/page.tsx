import { StatsCards } from "@/components/stats-cards";
import { RecentOrders } from "@/components/recent-orders";
import { RevenueChart } from "@/components/revenue-chart";
import { ProvinceChart } from "@/components/province-chart";
import { InventoryTable } from "@/components/inventory-table";

type Product = {
  id: number;
  external_id: number;
  name: string;
  description: string;
  price: number;
  discounted_price: number;
  is_available: boolean;
  status: string;
  category: string | null;
  sku: string | null;
  stock: number | null;
  image: string;
  created_at: string;
};

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

async function getPurchases(): Promise<Purchase[]> {
  try {
    const res = await fetch("https://orghans.pythonanywhere.com/api/purchases", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch purchases:", error);
    return [];
  }
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("https://orghans.pythonanywhere.com/api/products", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function Home() {
  const purchases = await getPurchases();
  const products = await getProducts();

  const totalRevenue = purchases.reduce(
    (sum, p) => sum + (p.product?.discounted_price || p.product?.price || 0),
    0
  );
  const totalOrders = purchases.length;
  const pendingOrders = purchases.filter((p) => p.status === "pending").length;

  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to Hans Beauty Order Management System
        </p>
      </div>

      <StatsCards
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        pendingOrders={pendingOrders}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart purchases={purchases} />
        <ProvinceChart purchases={purchases} />
      </div>

      <RecentOrders purchases={purchases} />

      <InventoryTable products={products} />
    </>
  );
}

