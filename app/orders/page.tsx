"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Eye, Download } from "lucide-react";
import jsPDF from "jspdf";

/* =====================
   Types
===================== */
export type Order = {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  product_name: string;
  phone?: string;
  province?: string;
  date: string;
  items: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  address: {
    street: string;
    city?: string;
    postalCode?: string;
  };
  orderItems: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
  paymentMethod?: string;
  cardLast4?: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
};

/* =====================
   Helpers
===================== */
const statusColors: Record<Order["status"], string> = {
  pending: "text-yellow-600 font-semibold",
  processing: "text-blue-600 font-semibold",
  shipped: "text-purple-600 font-semibold",
  delivered: "text-green-600 font-semibold",
  cancelled: "text-red-600 font-semibold",
};

const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

/* =====================
   Page
===================== */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  /* =====================
     Load Orders
  ===================== */
  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/purchases");
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();

        const mapped: Order[] = (Array.isArray(data) ? data : [data]).map(
          (p: any, idx: number) => {
            const product = p.product || {};
            const total = product.discounted_price ?? product.price ?? 0;

            return {
              id: String(p.id ?? idx),
              orderNumber: `#${p.id ?? idx}`,
              customer:
                p.user?.username ||
                `${p.user?.first_name ?? ""} ${p.user?.last_name ?? ""}`.trim() ||
                "Customer",
              email: p.user?.email || "",
              phone: p.contact || "",
              product_name:
                p.product_name ||
                product.name ||
                product.product_name ||
                p.product?.name ||
                p.product?.product_name ||
                "",
              province: p.province || "-",
              date: new Date().toISOString(),
              items: 1,
              status: (p.status || "pending").toLowerCase() as Order["status"],
              address: {
                street: p.shipping_address || "",
                city: "",
                postalCode: "",
              },
              orderItems: [
                {
                  id: product.id ?? 1,
                  name: product.name || p.product_name || "",
                  quantity: 1,
                  price: total,
                },
              ],
              paymentMethod: "card",
              cardLast4: p.last_digits || "0000",
              subtotal: total,
              tax: 0,
              shipping: 0,
              total: total,
            };
          }
        );

        setOrders(mapped);
      } catch (err) {
        console.error("Failed to load orders:", err);
      }
    }

    loadOrders();
  }, []);

  /* =====================
     Handlers
  ===================== */
  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(orders, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Orders List", 10, 10);

    let y = 20;
    orders.forEach((order) => {
      doc.text(
        `Order: ${order.orderNumber}, Customer: ${order.customer}, Total: $${order.total.toFixed(
          2
        )}, Status: ${capitalizeFirst(order.status)}`,
        10,
        y
      );
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });

    doc.save("orders.pdf");
  };

  /* =====================
     Render
  ===================== */
  return (
    <>
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">Manage and track all customer orders</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>Complete list of customer orders</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button className="bg-[#E6A8A8] hover:bg-[#D88E8E]" onClick={handleExportJSON}>
                <Download className="mr-2 h-4 w-4" /> Export JSON
              </Button>
              <Button className="bg-[#E6A8A8] hover:bg-[#D88E8E]" onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" /> Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden md:table-cell">Province</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="text-muted-foreground">{order.email}</TableCell>
                    <TableCell className="text-muted-foreground">{order.product_name}</TableCell>
                    <TableCell className="hidden md:table-cell">{order.province}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {new Date(order.date).toLocaleDateString("en-CA")}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{order.items}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          handleStatusChange(order.id, value as Order["status"])
                        }
                      >
                        <SelectTrigger className="w-[130px] h-8 border-none">
                          <SelectValue>
                            <span className={statusColors[order.status]}>
                              {capitalizeFirst(order.status)}
                            </span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(statusColors) as Order["status"][]).map((status) => (
                            <SelectItem key={status} value={status}>
                              <span className={statusColors[status]}>
                                {capitalizeFirst(status)}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Order #{selectedOrder?.orderNumber}</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.date).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) =>
                      handleStatusChange(selectedOrder.id, value as Order["status"])
                    }
                  >
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue>
                        <span className={statusColors[selectedOrder.status]}>
                          {capitalizeFirst(selectedOrder.status)}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(statusColors) as Order["status"][]).map((status) => (
                        <SelectItem key={status} value={status}>
                          <span className={statusColors[status]}>
                            {capitalizeFirst(status)}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <p>{selectedOrder.customer}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.phone}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Product</h3>
                <p className="font-medium">{selectedOrder.product_name}</p>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[#E6A8A8]">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
