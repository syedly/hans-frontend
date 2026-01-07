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

/* =====================
   Types
===================== */

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  province: string;
  orders: number;
  totalSpent: number;
};

/* =====================
   Page
===================== */

export default async function CustomersPage() {
  // Fetch purchases (API returns flattened purchase objects)
  const purchasesRes = await fetch("https://orghans.pythonanywhere.com/api/purchases/", {
    cache: "no-store",
  });

  let purchases: any[] = [];
  try {
    if (purchasesRes.ok) {
      const data = await purchasesRes.json();
      purchases = Array.isArray(data) ? data : [data];
    }
  } catch (e) {
    console.error("Failed to parse purchases for customers page", e);
  }

  // Build customers list from flattened purchases returned by the real API
  const list = purchases.reduce((acc: Record<string, Customer>, p: any) => {
    const uid = p.user_id ?? p.user_username ?? p.id ?? p.external_id;

    if (!acc[uid]) {
      const name =
        p.user_username || `${p.user_first_name ?? ""} ${p.user_last_name ?? ""}`.trim() ||
        "Customer";

      acc[uid] = {
        id: String(uid),
        name,
        email: p.user_email || "",
        phone: p.contact || p.phone || "",
        province: p.province || "-",
        orders: 0,
        totalSpent: 0,
      };
    }

    acc[uid].orders += 1;

    const rawPrice = p.product_discounted_price ?? p.product_price ?? p.price ?? p.product?.discounted_price ?? p.product?.price ?? 0;
    const price = typeof rawPrice === "string" ? parseFloat(rawPrice) : Number(rawPrice || 0);
    acc[uid].totalSpent += isFinite(price) ? price : 0;

    return acc;
  }, {} as Record<string, Customer>);

  const customersList: Customer[] = Object.values(list);

  /* =====================
     UI
  ===================== */

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
                  <TableHead className="hidden lg:table-cell">
                    Orders
                  </TableHead>
                  <TableHead className="text-right">
                    Total Spent
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {customersList.map((customer) => (
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
                          <span className="font-medium">
                            {customer.name}
                          </span>
                          <span className="text-xs text-muted-foreground md:hidden">
                            {customer.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">
                          {customer.email}
                        </span>
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

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Mail, Phone } from "lucide-react";

// const customers = [
//   {
//     id: "1",
//     name: "Sarah Johnson",
//     email: "sarah.j@email.ca",
//     phone: "+1 (416) 555-0123",
//     province: "Ontario",
//     orders: 12,
//     totalSpent: 1245.5,
//   },
//   {
//     id: "2",
//     name: "Michael Chen",
//     email: "mchen@email.ca",
//     phone: "+1 (604) 555-0456",
//     province: "British Columbia",
//     orders: 8,
//     totalSpent: 890.25,
//   },
//   {
//     id: "3",
//     name: "Emily Tremblay",
//     email: "emily.t@email.ca",
//     phone: "+1 (514) 555-0789",
//     province: "Quebec",
//     orders: 15,
//     totalSpent: 2134.75,
//   },
//   {
//     id: "4",
//     name: "David Smith",
//     email: "dsmith@email.ca",
//     phone: "+1 (403) 555-0321",
//     province: "Alberta",
//     orders: 5,
//     totalSpent: 567.8,
//   },
//   {
//     id: "5",
//     name: "Jessica Wong",
//     email: "jwong@email.ca",
//     phone: "+1 (647) 555-0654",
//     province: "Ontario",
//     orders: 20,
//     totalSpent: 3245.0,
//   },
// ];

// export default async function CustomersPage() {
//   // derive customers from purchases API
//   const purchasesRes = await fetch("http://localhost:3000/api/purchases", { cache: "no-store" });
//   let purchases: any[] = [];
//   try {
//     if (purchasesRes.ok) purchases = await purchasesRes.json();
//   } catch (e) {
//     console.error("Failed to parse purchases for customers page", e);
//   }

//   const list = (Array.isArray(purchases) ? purchases : [purchases]).reduce((acc: any, p: any) => {
//     const user = p.user || {};
//     const uid = user.id ?? p.user?.username ?? p.id;
//     if (!acc[uid]) {
//       acc[uid] = {
//         id: String(uid),
//         name: user.username || `${user.first_name} ${user.last_name}` || "Customer",
//         email: user.email || "",
//         phone: p.contact || "",
//         province: p.province || "-",
//         orders: 0,
//         totalSpent: 0,
//       };
//     }
//     acc[uid].orders += 1;
//     acc[uid].totalSpent += (p.product?.discounted_price ?? p.product?.price) || 0;
//     return acc;
//   }, {} as Record<string, any>);

//   const customersList = Object.values(list);

//   return (
//     <>
//       <div className="flex flex-col gap-2">
//         <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
//         <p className="text-muted-foreground">View and manage customer information</p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Customer Directory</CardTitle>
//           <CardDescription>All registered customers</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Customer</TableHead>
//                   <TableHead className="hidden md:table-cell">Contact</TableHead>
//                   <TableHead className="hidden sm:table-cell">Province</TableHead>
//                   <TableHead className="hidden lg:table-cell">Orders</TableHead>
//                   <TableHead className="text-right">Total Spent</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {customersList.map((customer) => (
//                   <TableRow key={customer.id}>
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <Avatar>
//                           <AvatarFallback className="bg-[#E6A8A8] text-white">
//                             {customer.name
//                               .split(" ")
//                               .map((n: string) => n[0])
//                               .join("")}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="flex flex-col">
//                           <span className="font-medium">{customer.name}</span>
//                           <span className="text-xs text-muted-foreground md:hidden">{customer.email}</span>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell className="hidden md:table-cell">
//                       <div className="flex flex-col gap-1">
//                         <span className="text-sm">{customer.email}</span>
//                         <span className="text-xs text-muted-foreground">{customer.phone}</span>
//                       </div>
//                     </TableCell>
//                     <TableCell className="hidden sm:table-cell">{customer.province}</TableCell>
//                     <TableCell className="hidden lg:table-cell">{customer.orders}</TableCell>
//                     <TableCell className="text-right font-medium">${customer.totalSpent.toFixed(2)}</TableCell>
//                     <TableCell>
//                       <div className="flex gap-1">
//                         <Button variant="ghost" size="icon">
//                           <Mail className="h-4 w-4" />
//                         </Button>
//                         <Button variant="ghost" size="icon">
//                           <Phone className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </>
//   );
// }
