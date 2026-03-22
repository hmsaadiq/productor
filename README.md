# Frosted Crusts

React cake ordering app. Customers pick and configure products, pay through Paystack, and track orders. Admins get a dashboard to manage it all.

## Features

- Customizable products (cakes, cookies, muffins) — size, layers, flavours, shapes, add-ons
- Pricing recalculates in real time as options change
- Google sign-in via Supabase Auth
- Paystack for payments
- Order history with status tracking
- Save default delivery details to your profile — they auto-fill at checkout
- QR codes to share cake configurations
- Dark/light theme
- Admin dashboard

## Tech Stack

- **Frontend**: React 18, TypeScript, MUI v7
- **Backend**: Supabase (PostgreSQL + Auth)
- **Payments**: Paystack
- **Auth**: Google OAuth via Supabase
- **Build**: Create React App

## Setup
```bash
npm install
cp .env.example .env   # fill in your Supabase credentials
npm start
```

**.env** requires:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure
```
src/
├── components/
│   ├── CakeCustomizer.tsx        # Product configuration UI
│   ├── CardNav/                  # Account dropdown nav
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── LoginModal.tsx            # Google sign-in modal
│   ├── PaymentForm.tsx           # Paystack integration
│   ├── PriceSummary.tsx          # Live price display
│   ├── ProtectedRoute.tsx        # Auth route guard
│   ├── AdminRoute.tsx            # Admin route guard
│   ├── QRCodeModal.tsx           # QR generation/scanning
│   ├── EditOrderModal.tsx        # Admin order editing
│   ├── CancelOrderButton.tsx
│   └── AdminOrderStatusControls.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── ConfiguratorPage.tsx
│   ├── CartPage.tsx
│   ├── DeliveryDetailsPage.tsx
│   ├── ConfirmationPage.tsx
│   ├── OrderHistoryPage.tsx
│   ├── ProfilePage.tsx           # Saved delivery defaults
│   └── AdminDashboard.tsx
├── context/
│   └── ConfigContext.tsx         # Global cart/config state
├── utils/
│   ├── supabase.ts
│   ├── orderService.ts
│   └── priceCalculator.ts
└── types/
    └── order.ts
```

## Database

Supabase `profiles` table:

| Column | Type | Notes |
|---|---|---|
| id | uuid | matches auth.users |
| email | text | |
| full_name | text | |
| is_admin | boolean | |
| phone | text | saved delivery default |
| default_address | text | saved delivery default |
| default_state | text | saved delivery default |

## Deployment
```bash
npm run build
# deploy /build to Vercel, Netlify, etc.
```