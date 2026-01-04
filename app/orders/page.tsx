"use client";

import { useState } from "react";
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
import { orders as initialOrders, Order } from "@/lib/dummy-data";
import { Eye, Download } from "lucide-react";

const statusColors = {
  pending: "text-yellow-600 font-semibold",
  processing: "text-blue-600 font-semibold",
  shipped: "text-purple-600 font-semibold",
  delivered: "text-green-600 font-semibold",
  cancelled: "text-red-600 font-semibold",
};

const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
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
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">
          Manage and track all customer orders
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>
                Complete list of customer orders
              </CardDescription>
            </div>
            <Button className="bg-[#E6A8A8] hover:bg-[#D88E8E]">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
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
                  <TableHead className="hidden md:table-cell">
                    Province
                  </TableHead>
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
                    <TableCell className="font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.email}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {order.province}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {new Date(order.date).toLocaleDateString("en-CA")}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {order.items}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value: string) =>
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
                          <SelectItem value="pending">
                            <span className={statusColors.pending}>
                              Pending
                            </span>
                          </SelectItem>
                          <SelectItem value="processing">
                            <span className={statusColors.processing}>
                              Processing
                            </span>
                          </SelectItem>
                          <SelectItem value="shipped">
                            <span className={statusColors.shipped}>
                              Shipped
                            </span>
                          </SelectItem>
                          <SelectItem value="delivered">
                            <span className={statusColors.delivered}>
                              Delivered
                            </span>
                          </SelectItem>
                          <SelectItem value="cancelled">
                            <span className={statusColors.cancelled}>
                              Cancelled
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => handleViewOrder(order)}
                      >
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              {/* Order Date & Status */}
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
                    onValueChange={(value: string) =>
                      handleStatusChange(
                        selectedOrder.id,
                        value as Order["status"]
                      )
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
                      <SelectItem value="pending">
                        <span className={statusColors.pending}>Pending</span>
                      </SelectItem>
                      <SelectItem value="processing">
                        <span className={statusColors.processing}>
                          Processing
                        </span>
                      </SelectItem>
                      <SelectItem value="shipped">
                        <span className={statusColors.shipped}>Shipped</span>
                      </SelectItem>
                      <SelectItem value="delivered">
                        <span className={statusColors.delivered}>
                          Delivered
                        </span>
                      </SelectItem>
                      <SelectItem value="cancelled">
                        <span className={statusColors.cancelled}>
                          Cancelled
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Customer Information */}
              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p>{selectedOrder.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{selectedOrder.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{selectedOrder.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Shipping Address
                    </p>
                    <div className="space-y-0.5">
                      <p>{selectedOrder.address.street}</p>
                      <p>
                        {selectedOrder.address.city}, {selectedOrder.province}
                      </p>
                      <p>{selectedOrder.address.postalCode}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-center">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            ${item.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${(item.quantity * item.price).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Separator />

              {/* Payment & Summary */}
              <div className="grid grid-cols-2 gap-4">
                {/* Payment Method */}
                <div>
                  <h3 className="font-semibold mb-3">Payment Method</h3>
                  {selectedOrder.paymentMethod === "card" ? (
                    <div>
                      <p className="font-medium">Credit Card</p>
                      <p className="text-sm text-muted-foreground">
                        •••• •••• •••• {selectedOrder.cardLast4}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        Pay on delivery
                      </p>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="font-semibold mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {selectedOrder.shipping === 0
                          ? "FREE"
                          : `$${selectedOrder.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center pt-1">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-[#E6A8A8]">
                        ${selectedOrder.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
