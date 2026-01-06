"use client";

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

const statusColors: Record<string, string> = {
  "in-stock": "bg-green-100 text-green-800 hover:bg-green-100",
  "in stock": "bg-green-100 text-green-800 hover:bg-green-100",
  "low-stock": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  "low stock": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  "out-of-stock": "bg-red-100 text-red-800 hover:bg-red-100",
  "out of stock": "bg-red-100 text-red-800 hover:bg-red-100",
};

interface InventoryTableProps {
  products: Product[];
}

export function InventoryTable({ products }: InventoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Status</CardTitle>
        <CardDescription>Current stock levels for all products</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="hidden md:table-cell">SKU</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="hidden lg:table-cell">Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No products available
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const normalizedStatus = product.status?.toLowerCase() || "unknown";
                  const statusKey = Object.keys(statusColors).find(
                    (key) => key === normalizedStatus || key === product.status
                  ) || "in-stock";

                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {product.sku || "-"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {product.category || "-"}
                      </TableCell>
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
                      <TableCell className="hidden lg:table-cell">
                        ${(product.discounted_price || product.price).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            statusColors[statusKey] || "bg-gray-100 text-gray-800"
                          }
                        >
                          {product.status || "Unknown"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
