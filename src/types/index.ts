export type ProductCategory = 'all' | 'audio' | 'workspace' | 'ambient' | 'wearables';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  category: 'audio' | 'workspace' | 'ambient' | 'wearables';
  rating: number;
  reviewsCount: number;
  stock: number;
  maxStock: number;
  sku: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  colors: { name: string; hex: string }[];
  visualType: 'headphones' | 'keyboard' | 'mouse' | 'lamp' | 'watch' | 'folio' | 'dac' | 'monitor';
  badge?: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface ShippingMethod {
  id: string;
  title: string;
  price: number;
  estimatedDays: string;
  description: string;
}

export interface PaymentDetails {
  method: 'card' | 'nexus_pay' | 'cod';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardHolder: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  color: string;
  visualType: string;
}

export interface OrderTimelineStep {
  status: string;
  title: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'in_transit' | 'delivered';
  customer: CustomerDetails;
  shippingMethod: {
    id: string;
    title: string;
    price: number;
    estimatedDays: string;
  };
  payment: {
    method: 'card' | 'nexus_pay' | 'cod';
    last4: string;
    cardBrand: string;
    transactionId: string;
    status: 'paid';
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  tracking: {
    carrier: string;
    trackingNumber: string;
    currentLocation: string;
    estimatedDelivery: string;
    timeline: OrderTimelineStep[];
  };
}
