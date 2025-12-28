// FRONTEND TYPE DEFINITION FILE: This file defines TypeScript types for cake orders in the React frontend.
// It provides type safety for order data used throughout the app.
//
// Design Patterns: Uses TypeScript type/interface pattern for static typing.
// Data Structures: Defines interfaces and type aliases for order objects.
// Security: No direct security features; only provides type definitions.

// Expanded config to support multiple product types and delivery details.
export interface Order {
  id: string; // Unique order ID (Supabase UUID).
  userId: string; // User ID of the person who placed the order.
  config: {
    productType: 'cake' | 'cookies' | 'muffins'; // Product type selected by user.
    // Cake-specific fields
    size?: string; // Cake size (if cake)
    layers?: number; // Number of cake layers (if cake)
    flavor?: string; // Cake flavor (if cake)
    addons?: string[]; // List of add-ons (if cake)
    text?: string; // Custom text on cake (if cake)
    shape?: 'circle' | 'heart'; // Cake shape (if cake)
    // Box product fields
    boxSize?: 4 | 6 | 12; // Box size for cookies/muffins
    boxFlavors?: string[]; // Up to 2 flavors for cookies/muffins
    // Common fields
    price: number; // Total price.
    // Delivery details
    deliveryDetails: {
      name: string;
      address: string;
      phone: string;
      state: string;
    };
  };
  status: 'pending' | 'confirmed' | 'completed'; // Order status.
  createdAt: string; // ISO timestamp when order was created (Supabase uses timestamptz).
}

// OrderConfig type alias for the config property of an order.
export type OrderConfig = Order['config'];
