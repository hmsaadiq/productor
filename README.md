# Cake Ordering System

A modern React-based cake ordering platform with real-time customization, secure payments, and order management.

## 🚀 Features

- **Product Customization**: Cakes, cookies, and muffins with various options (size, layers, flavors, shapes)
- **Real-time Pricing**: Dynamic price calculation based on selections
- **Secure Authentication**: Google sign-in integration via Supabase Auth
- **Payment Processing**: Paystack integration for secure payments
- **Order Management**: Complete order history and tracking
- **Delivery Details**: Customer information and delivery management
- **QR Code Generation**: Share and scan cake configurations
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Payment**: Paystack
- **Authentication**: Google OAuth via Supabase Auth
- **State Management**: React Context API
- **Build Tool**: Create React App

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd cake-ordering-system

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase credentials

# Start development server
npm start
```

## 🔧 Environment Setup

Create a `.env` file with:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CakeCustomizer.tsx    # Product customization interface
│   ├── Header.tsx            # Navigation header
│   ├── LoginModal.tsx        # Authentication modal
│   ├── PaymentForm.tsx       # Paystack payment integration
│   ├── PriceSummary.tsx      # Real-time price display
│   ├── ProtectedRoute.tsx    # Route authentication guard
│   └── QRCodeModal.tsx       # QR code generation/scanning
├── pages/              # Page components
│   ├── HomePage.tsx          # Landing page
│   ├── ConfiguratorPage.tsx  # Main customization page
│   ├── DeliveryDetailsPage.tsx # Customer details form
│   ├── ConfirmationPage.tsx  # Order confirmation
│   └── OrderHistoryPage.tsx  # User order history
├── context/            # React Context providers
│   └── ConfigContext.tsx     # Global state management
├── utils/              # Utility functions
│   ├── supabase.ts          # Supabase client configuration
│   ├── orderService.ts      # Order CRUD operations
│   └── priceCalculator.ts   # Dynamic pricing logic
├── types/              # TypeScript type definitions
│   └── order.ts             # Order and config types
└── assets/             # Static assets
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Deploy to your hosting platform
# (Vercel, Netlify, etc.)
```

## 📱 Key Features

### Product Customization
- **Cakes**: Size (8", 10", 12", Bento), layers (1-3), flavors, shapes (circle/heart)
- **Cookies & Muffins**: Box sizes (4, 6, 12), multiple flavors (up to 2)
- **Add-ons**: Fruit, text, filling options
- **Custom Text**: Personalized messages (40 character limit)

### Payment & Orders
- Secure Paystack integration
- Real-time price calculation
- Order confirmation and tracking
- Complete order history

### Authentication & Security
- Google OAuth via Supabase
- Protected routes for authenticated users
- Secure order data storage
- Input validation and sanitization

## 🔐 Security Features

- Environment variable protection
- Supabase Row Level Security (RLS)
- Input validation and sanitization
- Secure authentication flow
- Protected API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details