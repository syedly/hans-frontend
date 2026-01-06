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

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  shipped: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  delivered: "bg-green-100 text-green-800 hover:bg-green-100",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
};

interface RecentOrdersProps {
  purchases: Purchase[];
}

export function RecentOrders({ purchases }: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest orders from your customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Province</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No orders available
                  </TableCell>
                </TableRow>
              ) : (
                purchases.map((purchase) => {
                  const displayStatus =
                    (statusColors[purchase.status as keyof typeof statusColors]
                      ? purchase.status
                      : "pending") as keyof typeof statusColors;
                  const total =
                    purchase.product?.discounted_price ||
                    purchase.product?.price ||
                    0;

                  return (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">
                        #{purchase.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {purchase.user?.username || "N/A"}
                          </span>
                          <span className="text-xs text-muted-foreground hidden lg:inline">
                            {purchase.user?.email || "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {purchase.province || "-"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {purchase.purchase_month} {purchase.purchase_date},{" "}
                        {purchase.purchase_year}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[displayStatus]}>
                          {purchase.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${total.toFixed(2)}
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
