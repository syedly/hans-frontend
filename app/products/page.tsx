"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";

type Product = {
  id: number;
  name: string;
  sku: string;
  category?: string | null;
  stock?: number | null;
  price: number;
  discounted_price?: number | null;
  status?: string | null;
};

const statusColors: Record<string, string> = {
  "in-stock": "bg-green-100 text-green-800 hover:bg-green-100",
  "low-stock": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  "out-of-stock": "bg-red-100 text-red-800 hover:bg-red-100",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");

        if (!res.ok) {
          console.error("API returned status:", res.status);
          setProducts([]);
          return;
        }

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Fetch failed:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <p className="text-muted-foreground">
          Manage your product inventory and pricing
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>All products with stock levels</CardDescription>
            </div>

            <Button className="bg-[#E6A8A8] hover:bg-[#D88E8E]">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-center py-8">Loading products...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Category
                    </TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="hidden md:table-cell">Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No products available or failed to load.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => {
                      const normalizedStatus =
                        product.status
                          ?.toLowerCase()
                          .replace(/\s+/g, "-") ?? "unknown";

                      const price =
                        product.discounted_price ?? product.price;

                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                          <TableCell className="hidden sm:table-cell">{product.category ?? "-"}</TableCell>
                          <TableCell>
                            <span
                              className={
                                (product.stock ?? 0) < 10
                                  ? "text-red-600 font-semibold"
                                  : ""
                              }
                            >
                              {product.stock ?? "-"}
                            </span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            ${price.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                statusColors[normalizedStatus] ||
                                "bg-gray-100 text-gray-800"
                              }
                            >
                              {product.status ?? "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
