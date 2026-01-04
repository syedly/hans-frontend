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
import { products } from "@/lib/dummy-data";

const statusColors = {
  "in-stock": "bg-green-100 text-green-800 hover:bg-green-100",
  "low-stock": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  "out-of-stock": "bg-red-100 text-red-800 hover:bg-red-100",
};

export function InventoryTable() {
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
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {product.sku}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {product.category}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock < 10 ? "text-red-600 font-semibold" : ""
                      }
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[product.status]}>
                      {product.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
