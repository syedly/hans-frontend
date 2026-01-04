export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: number;
  province: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: "cod" | "card";
  cardLast4?: string;
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockItems: number;
}

export const orders: Order[] = [
  {
    id: "1",
    orderNumber: "HB-2025-001",
    customer: "Sarah Johnson",
    email: "sarah.j@email.ca",
    phone: "+1 (416) 555-0123",
    date: "2025-01-15",
    status: "delivered",
    total: 145.99,
    items: 3,
    province: "Ontario",
    address: {
      street: "123 Queen Street West",
      city: "Toronto",
      postalCode: "M5H 2M9",
    },
    paymentMethod: "card",
    cardLast4: "4242",
    orderItems: [
      { id: "1", name: "Hydrating Face Serum", quantity: 1, price: 49.99 },
      { id: "2", name: "Vitamin C Moisturizer", quantity: 1, price: 39.99 },
      { id: "3", name: "Rose Water Toner", quantity: 2, price: 24.99 },
    ],
    subtotal: 139.96,
    tax: 1.03,
    shipping: 5.0,
  },
  {
    id: "2",
    orderNumber: "HB-2025-002",
    customer: "Michael Chen",
    email: "mchen@email.ca",
    phone: "+1 (604) 555-0198",
    date: "2025-01-18",
    status: "shipped",
    total: 89.5,
    items: 2,
    province: "British Columbia",
    address: {
      street: "456 Granville Street",
      city: "Vancouver",
      postalCode: "V6C 1V5",
    },
    paymentMethod: "cod",
    orderItems: [
      { id: "1", name: "Gentle Cleansing Foam", quantity: 2, price: 29.99 },
      { id: "2", name: "Rose Water Toner", quantity: 1, price: 24.99 },
    ],
    subtotal: 84.97,
    tax: 4.53,
    shipping: 0.0,
  },
  {
    id: "3",
    orderNumber: "HB-2025-003",
    customer: "Emily Tremblay",
    email: "emily.t@email.ca",
    phone: "+1 (514) 555-0167",
    date: "2025-01-20",
    status: "processing",
    total: 234.75,
    items: 5,
    province: "Quebec",
    address: {
      street: "789 Rue Saint-Catherine",
      city: "Montreal",
      postalCode: "H3B 1A1",
    },
    paymentMethod: "card",
    cardLast4: "5555",
    orderItems: [
      { id: "1", name: "Anti-Aging Night Cream", quantity: 2, price: 59.99 },
      { id: "2", name: "Hydrating Face Serum", quantity: 1, price: 49.99 },
      { id: "3", name: "Exfoliating Scrub", quantity: 2, price: 34.99 },
    ],
    subtotal: 219.95,
    tax: 9.8,
    shipping: 5.0,
  },
  {
    id: "4",
    orderNumber: "HB-2025-004",
    customer: "David Smith",
    email: "dsmith@email.ca",
    phone: "+1 (403) 555-0145",
    date: "2025-01-21",
    status: "pending",
    total: 67.25,
    items: 1,
    province: "Alberta",
    address: {
      street: "321 Stephen Avenue",
      city: "Calgary",
      postalCode: "T2P 2Y9",
    },
    paymentMethod: "card",
    cardLast4: "1234",
    orderItems: [
      { id: "1", name: "Vitamin C Moisturizer", quantity: 1, price: 39.99 },
      { id: "2", name: "Rose Water Toner", quantity: 1, price: 24.99 },
    ],
    subtotal: 64.98,
    tax: 2.27,
    shipping: 0.0,
  },
  {
    id: "5",
    orderNumber: "HB-2025-005",
    customer: "Jessica Wong",
    email: "jwong@email.ca",
    phone: "+1 (647) 555-0189",
    date: "2025-01-22",
    status: "processing",
    total: 312.0,
    items: 4,
    province: "Ontario",
    address: {
      street: "555 Bay Street",
      city: "Toronto",
      postalCode: "M5G 2C2",
    },
    paymentMethod: "cod",
    orderItems: [
      { id: "1", name: "Anti-Aging Night Cream", quantity: 3, price: 59.99 },
      { id: "2", name: "Hydrating Face Serum", quantity: 2, price: 49.99 },
    ],
    subtotal: 279.95,
    tax: 27.05,
    shipping: 5.0,
  },
  {
    id: "6",
    orderNumber: "HB-2025-006",
    customer: "Robert Leblanc",
    email: "rleblanc@email.ca",
    phone: "+1 (902) 555-0134",
    date: "2025-01-23",
    status: "pending",
    total: 156.8,
    items: 3,
    province: "Nova Scotia",
    address: {
      street: "888 Spring Garden Road",
      city: "Halifax",
      postalCode: "B3H 1X8",
    },
    paymentMethod: "card",
    cardLast4: "9876",
    orderItems: [
      { id: "1", name: "Exfoliating Scrub", quantity: 2, price: 34.99 },
      { id: "2", name: "Gentle Cleansing Foam", quantity: 1, price: 29.99 },
      { id: "3", name: "Vitamin C Moisturizer", quantity: 1, price: 39.99 },
    ],
    subtotal: 139.96,
    tax: 11.84,
    shipping: 5.0,
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Hydrating Face Serum",
    sku: "HB-SER-001",
    category: "Skincare",
    stock: 45,
    price: 49.99,
    status: "in-stock",
  },
  {
    id: "2",
    name: "Vitamin C Moisturizer",
    sku: "HB-MOI-002",
    category: "Skincare",
    stock: 8,
    price: 39.99,
    status: "low-stock",
  },
  {
    id: "3",
    name: "Gentle Cleansing Foam",
    sku: "HB-CLE-003",
    category: "Skincare",
    stock: 62,
    price: 29.99,
    status: "in-stock",
  },
  {
    id: "4",
    name: "Anti-Aging Night Cream",
    sku: "HB-CRE-004",
    category: "Skincare",
    stock: 0,
    price: 59.99,
    status: "out-of-stock",
  },
  {
    id: "5",
    name: "Rose Water Toner",
    sku: "HB-TON-005",
    category: "Skincare",
    stock: 34,
    price: 24.99,
    status: "in-stock",
  },
  {
    id: "6",
    name: "Exfoliating Scrub",
    sku: "HB-SCR-006",
    category: "Skincare",
    stock: 5,
    price: 34.99,
    status: "low-stock",
  },
];

export const dashboardStats: DashboardStats = {
  totalOrders: 156,
  totalRevenue: 45678.5,
  pendingOrders: 12,
  lowStockItems: 8,
};

export const revenueData = [
  { month: "Aug", revenue: 3800 },
  { month: "Sep", revenue: 5200 },
  { month: "Oct", revenue: 4900 },
  { month: "Nov", revenue: 6100 },
  { month: "Dec", revenue: 5800 },
  { month: "Jan", revenue: 6500 },
];

export const ordersByProvince = [
  { province: "Ontario", orders: 45 },
  { province: "Quebec", orders: 32 },
  { province: "British Columbia", orders: 28 },
  { province: "Alberta", orders: 22 },
  { province: "Manitoba", orders: 12 },
  { province: "Others", orders: 17 },
];
