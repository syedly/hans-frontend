# Hans Beauty OMS - Order Management System

A professional, responsive Order Management System built for Hans Beauty with Next.js, TypeScript, and shadcn/ui.

## Features

- **Dashboard Overview** - Real-time statistics and key metrics
- **Order Management** - Track orders with status updates
- **Inventory Tracking** - Monitor stock levels and product status
- **Revenue Analytics** - Visual charts showing revenue trends
- **Provincial Distribution** - Orders breakdown by Canadian provinces
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Professional UI** - Clean design with Hans Beauty branding (#E6A8A8)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Font**: Montserrat
- **Icons**: Lucide React

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Project Structure

```
├── app/
│   ├── page.tsx          # Main dashboard page
│   ├── layout.tsx        # Root layout with Montserrat font
│   └── globals.css       # Global styles and theme
├── components/
│   ├── dashboard-header.tsx   # Header with logo and search
│   ├── stats-cards.tsx        # KPI cards
│   ├── recent-orders.tsx      # Orders table
│   ├── revenue-chart.tsx      # Revenue bar chart
│   ├── province-chart.tsx     # Provincial pie chart
│   └── inventory-table.tsx    # Product inventory
├── lib/
│   └── dummy-data.ts     # Sample data for development
└── public/
    └── logo.avif         # Hans Beauty logo
```

## Customization

The primary brand color (#E6A8A8) is configured in:

- `app/globals.css` - CSS variables
- Component files - Direct color usage for charts and accents

## Data

Currently using dummy data from `lib/dummy-data.ts`. Replace with API calls when backend is ready.

## Future Enhancements

- Backend API integration
- User authentication
- Real-time order updates
- Advanced filtering and search
- Export functionality
- Multi-language support (English/French for Canada)
