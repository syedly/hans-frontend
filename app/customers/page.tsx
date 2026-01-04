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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone } from "lucide-react";

const customers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@email.ca",
    phone: "+1 (416) 555-0123",
    province: "Ontario",
    orders: 12,
    totalSpent: 1245.5,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "mchen@email.ca",
    phone: "+1 (604) 555-0456",
    province: "British Columbia",
    orders: 8,
    totalSpent: 890.25,
  },
  {
    id: "3",
    name: "Emily Tremblay",
    email: "emily.t@email.ca",
    phone: "+1 (514) 555-0789",
    province: "Quebec",
    orders: 15,
    totalSpent: 2134.75,
  },
  {
    id: "4",
    name: "David Smith",
    email: "dsmith@email.ca",
    phone: "+1 (403) 555-0321",
    province: "Alberta",
    orders: 5,
    totalSpent: 567.8,
  },
  {
    id: "5",
    name: "Jessica Wong",
    email: "jwong@email.ca",
    phone: "+1 (647) 555-0654",
    province: "Ontario",
    orders: 20,
    totalSpent: 3245.0,
  },
];

export default function CustomersPage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <p className="text-muted-foreground">
          View and manage customer information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
          <CardDescription>All registered customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Contact
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Province
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Orders</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-[#E6A8A8] text-white">
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{customer.name}</span>
                          <span className="text-xs text-muted-foreground md:hidden">
                            {customer.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">{customer.email}</span>
                        <span className="text-xs text-muted-foreground">
                          {customer.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {customer.province}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {customer.orders}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${customer.totalSpent.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
