# Frosted Crusts

React cake ordering app for Abuja, Nigeria. Customers configure handcrafted products, pay through Paystack, and track orders. Admins manage fulfilment from a real-time dashboard.

## Features

- Customisable products (cakes, cookies, muffins) — size, layers, flavours, shapes, fillings, add-ons
- Pricing recalculates in real time as options change
- SVG previews update live in the configurator
- QR codes to share and restore cake configurations
- Shopping cart — guest (local state) or authenticated (Supabase)
- 5-step checkout: configure → cart → delivery → confirm → Paystack payment
- Order history with status tracking and cancellation
- Save default delivery details to profile — auto-filled at checkout
- 30-minute idle timeout with automatic sign-out
- Admin dashboard with real-time order updates (Supabase subscriptions)
- Dark/light theme

## Tech Stack

- **Frontend**: React 18, TypeScript, MUI v7, Framer Motion, GSAP
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Payments**: Paystack (`react-paystack`)
- **Auth**: Google OAuth via Supabase
- **QR**: `qrcode.react` (generate) + `html5-qrcode` (scan)
- **Build/Deploy**: Create React App → Vercel

## Setup

```bash
npm install
cp .env.example .env   # fill in your credentials
npm start
```

**.env** requires:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

## Project Structure

```
src/
├── components/
│   ├── CakeCustomizer.tsx              # Product configuration UI (size, layers, flavours, add-ons)
│   ├── ProductPreview/
│   │   ├── CakePreview.tsx             # Live SVG cake preview
│   │   ├── CookiesPreview.tsx          # Live SVG cookies preview
│   │   └── MuffinsPreview.tsx          # Live SVG muffins preview
│   ├── Header.tsx                      # Nav bar with theme toggle, cart badge, account menu
│   ├── Footer.tsx
│   ├── LoginModal.tsx                  # Google sign-in modal
│   ├── PaymentForm.tsx                 # Paystack payment integration
│   ├── PriceSummary.tsx                # Live price breakdown display
│   ├── QRCodeModal.tsx                 # QR generation and scanning
│   ├── EditOrderModal.tsx              # Admin: edit order details
│   ├── AdminOrderStatusControls.tsx    # Admin: advance/revert order status
│   ├── CancelOrderButton.tsx           # User/admin order cancellation with reason
│   ├── ProtectedRoute.tsx              # Redirects unauthenticated users
│   ├── AdminRoute.tsx                  # Redirects non-admin users
│   └── CardNav/                        # Account dropdown navigation
├── pages/
│   ├── HomePage.tsx                    # Landing page (hero, categories, featured designs)
│   ├── ConfiguratorPage.tsx            # Split-pane: config left, live preview right
│   ├── CartPage.tsx                    # Cart with quantity controls
│   ├── DeliveryDetailsPage.tsx         # Delivery address collection (pre-filled from profile)
│   ├── ConfirmationPage.tsx            # Order review before payment
│   ├── OrderHistoryPage.tsx            # User order list with status badges
│   ├── ProfilePage.tsx                 # Saved delivery defaults management
│   ├── AdminDashboard.tsx              # Admin order table with real-time updates
│   ├── ResetPasswordPage.tsx           # Password reset after email link
│   ├── AccessDeniedPage.tsx            # 401/403 error page
│   └── NotFoundPage.tsx                # 404 error page
├── context/
│   ├── ConfigContext.tsx               # Global auth state + active product config + idle timeout
│   └── CartContext.tsx                 # Cart state (guest: local / authenticated: Supabase)
├── utils/
│   ├── supabase.ts                     # Supabase client, auth helpers (Google OAuth, sign-out, listeners)
│   ├── orderService.ts                 # Order creation (RPC) and fetching, cancellation
│   ├── priceCalculator.ts              # Stateless price calculation from config
│   ├── orderStatusRules.ts             # Cancellation eligibility by role and status
│   └── orderStatusHelpers.ts           # Status transitions, labels, and badge colours
├── types/
│   └── order.ts                        # Order and OrderConfig TypeScript interfaces
├── constants/
│   └── images.ts                       # Image asset path constants
├── theme/
│   └── muiTheme.ts                     # MUI light/dark theme (brand primary: #EF3966)
├── App.tsx                             # Root — routing, theme provider, context providers
└── index.tsx
```

## Database

### `profiles`

| Column | Type | Notes |
|---|---|---|
| id | uuid | matches `auth.users` |
| email | text | |
| full_name | text | |
| is_admin | boolean | |
| phone | text | saved delivery default |
| default_address | text | saved delivery default |
| default_state | text | saved delivery default |

### `orders`

| Column | Type | Notes |
|---|---|---|
| id | integer | auto-increment |
| user_id | uuid | FK → `auth.users` |
| config | jsonb | full product configuration |
| items | jsonb | cart items snapshot |
| status | text | `pending` → `confirmed` → `in_progress` → `out_for_delivery` → `delivered` |
| total_price | numeric | |
| shipping_address | jsonb | delivery details at time of order |
| cancelled_at | timestamptz | |
| cancelled_by | uuid | |
| cancelled_by_role | text | `user` or `admin` |
| cancellation_reason | text | |
| previous_status | text | status before cancellation |

### `cart_items`

| Column | Type | Notes |
|---|---|---|
| id | uuid | |
| user_id | uuid | FK → `auth.users` |
| product_type | text | `cake`, `cookies`, or `muffins` |
| customization | jsonb | |
| quantity | integer | |
| unit_price | numeric | |

### RPC

- `create_order_from_cart(p_config, p_items, p_total_price, p_shipping_address)` — `SECURITY DEFINER` function; sets `user_id` server-side via `auth.uid()` so the client never sends a user ID directly.

## Deployment

```bash
npm run build
# deploy /build — vercel.json is pre-configured with security headers and SPA routing
```
