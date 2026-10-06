import { Product, Order, OrderItem, CustomerDetails, ShippingMethod, PaymentDetails } from '../types';

// Default initial catalog
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-aura-100',
    name: 'Nexus Aura NX-100',
    tagline: 'Precision Spatial Audio with Hybrid Active Noise Cancellation',
    price: 299,
    originalPrice: 349,
    category: 'audio',
    rating: 4.9,
    reviewsCount: 328,
    stock: 9,
    maxStock: 25,
    sku: 'NX-AUR-100-SLT',
    description: 'Custom 40mm beryllium drivers coupled with dedicated computational acoustic processing delivers studio-grade depth and ultra-low distortion.',
    features: [
      'Up to 45dB Active Noise Cancellation with Transparency Mode',
      'Lossless 24-bit/96kHz high-resolution audio over USB-C & Bluetooth 5.4',
      '40-hour playback with 10-minute fast charging giving 5 hours',
      'Aerospace-grade machined aluminum armatures with memory foam earcups'
    ],
    specs: {
      'Transducer': '40mm Custom Beryllium Driver',
      'Frequency Response': '10Hz – 40,000Hz',
      'Battery Life': '40 Hours (ANC On)',
      'Weight': '258g',
      'Connectivity': 'Bluetooth 5.4, USB-C Lossless, 3.5mm'
    },
    colors: [
      { name: 'Space Obsidian', hex: '#1e2029' },
      { name: 'Titanium Frost', hex: '#8e96a4' },
      { name: 'Lunar Dune', hex: '#cfc9be' }
    ],
    visualType: 'headphones',
    badge: 'Flagship'
  },
  {
    id: 'prod-apex-k7',
    name: 'Nexus Apex K7',
    tagline: 'Ultra-slim low-profile wireless mechanical keyboard',
    price: 189,
    originalPrice: 219,
    category: 'workspace',
    rating: 4.8,
    reviewsCount: 214,
    stock: 4,
    maxStock: 20,
    sku: 'NX-KBD-APX-7',
    description: 'CNC anodized solid aluminum frame, hot-swappable low-profile switches, and tri-mode connectivity engineered for effortless tactile fluidity.',
    features: [
      'Hot-swappable Gateron Low-Profile Mechanical Switches',
      'PBT double-shot low-profile keycaps with oil-resistant matte texture',
      'Tri-mode wireless (2.4GHz 1000Hz polling, Bluetooth 5.3, USB-C)',
      'Custom acoustic silicone dampening pad with sound absorption'
    ],
    specs: {
      'Layout': '75% Compact (84 Keys)',
      'Plate Material': 'CNC Sandblasted Aluminum',
      'Battery': '4000mAh (Up to 180 hrs)',
      'Switch Type': 'Linear Red / Tactile Brown',
      'Backlight': 'Warm White Studio Ambient (Per-Key)'
    },
    colors: [
      { name: 'Stealth Matte', hex: '#181920' },
      { name: 'Graphite Silver', hex: '#4b5563' }
    ],
    visualType: 'keyboard',
    badge: 'Low Stock'
  },
  {
    id: 'prod-chronos-w3',
    name: 'Nexus Chronos W3',
    tagline: 'Titanium bio-metric smartwatch with sapphire crystal',
    price: 349,
    originalPrice: 399,
    category: 'wearables',
    rating: 4.9,
    reviewsCount: 189,
    stock: 6,
    maxStock: 15,
    sku: 'NX-WTC-CHR-3',
    description: 'Forged Grade 5 titanium housing paired with micro-OLED 1,200 nit display, dual-frequency GNSS, and clinical-grade continuous heart & HRV metrics.',
    features: [
      'Grade 5 Aerospace Titanium with Sapphire Crystal Face',
      'Always-on 1.4-inch Micro-OLED with 1200 nits peak brightness',
      'Dual-Band GPS (L1 + L5) with breadcrumb route tracking',
      '14-day battery life with solar reserve micro-cell'
    ],
    specs: {
      'Case Diameter': '44mm Grade 5 Titanium',
      'Display': '1.43" AMOLED 466x466 (326 ppi)',
      'Water Resistance': '5 ATM / 50 meters',
      'Sensors': 'Optical PPG, SpO2, Skin Temp, Gyroscope',
      'Battery': 'Up to 14 Days Normal Usage'
    },
    colors: [
      { name: 'Deep Titanium', hex: '#262933' },
      { name: 'Raw Brushed Steel', hex: '#71717a' }
    ],
    visualType: 'watch',
    badge: 'Popular'
  },
  {
    id: 'prod-horizon-l1',
    name: 'Nexus Horizon L1',
    tagline: 'Sculptural architectural ambient smart lightbar',
    price: 129,
    originalPrice: 159,
    category: 'ambient',
    rating: 4.7,
    reviewsCount: 142,
    stock: 3,
    maxStock: 18,
    sku: 'NX-LGT-HRZ-1',
    description: 'Precision milled aluminum lightbar with asymmetric optical projection that illuminates your desk workspace without direct screen glare or eye fatigue.',
    features: [
      'Asymmetric 45° Optical Forward-Throw Lens System',
      '98+ Color Rendering Index (CRI) for true color accuracy',
      'Wireless rotary desktop dial for seamless brightness & color temperature',
      'Auto-dimming ambient light sensor adjusting to room light dynamically'
    ],
    specs: {
      'Color Temperature': '2700K – 6500K Continuous',
      'CRI Rating': 'Ra ≥ 98',
      'Input': 'USB-C 5V/2A (Included braided cable)',
      'Materials': 'Anodized Aluminum + Optical Acrylic',
      'Mount': 'Universal Weighted Counter-Balance Clasp'
    },
    colors: [
      { name: 'Anodized Black', hex: '#111217' },
      { name: 'Space Gray', hex: '#374151' }
    ],
    visualType: 'lamp',
    badge: 'Only 3 Left'
  },
  {
    id: 'prod-glide-m2',
    name: 'Nexus Glide M2',
    tagline: 'Ergonomic magnesium wireless mouse with magnetic hyper-scroll',
    price: 99,
    originalPrice: 119,
    category: 'workspace',
    rating: 4.8,
    reviewsCount: 175,
    stock: 15,
    maxStock: 30,
    sku: 'NX-MOU-GLD-2',
    description: 'Precision sculpted magnesium alloy skeleton weighing just 58g. Features optical micro-switches and dual-mode frictionless magnetic scroll wheel.',
    features: [
      '58g Ultralight Magnesium Alloy exoskeleton',
      '26,000 DPI PAW3395 Optical Sensor with 650 IPS tracking',
      'Dual-mode magnetic free-spin or ratcheted tactile scroll wheel',
      'Pure virgin PTFE skates for effortless glide across any desk mat'
    ],
    specs: {
      'Weight': '58 grams',
      'Sensor': '26,000 DPI Optical (Adjustable in 50 DPI steps)',
      'Battery Life': '90 Hours Wireless',
      'Polling Rate': 'Up to 4,000Hz (With 4K receiver)'
    },
    colors: [
      { name: 'Magnesium Matte', hex: '#1f242d' },
      { name: 'Chalk White', hex: '#e2e8f0' }
    ],
    visualType: 'mouse'
  },
  {
    id: 'prod-pulse-p1',
    name: 'Nexus Pulse P1 DAC',
    tagline: 'Audiophile portable USB-C DAC & headphone amplifier',
    price: 149,
    originalPrice: 179,
    category: 'audio',
    rating: 4.9,
    reviewsCount: 96,
    stock: 12,
    maxStock: 25,
    sku: 'NX-DAC-PLS-1',
    description: 'Dual ESS Sabre ES9038Q2M DAC chips delivering balanced 4.4mm and 3.5mm outputs with 240mW of clean, uncolored power to drive demanding audiophile headphones.',
    features: [
      'Dual ESS Sabre ES9038Q2M Reference Architecture',
      'Supports 32-bit/768kHz PCM and DSD512 native decoding',
      'Dual output jacks: 4.4mm Pentaconn Balanced and 3.5mm Single-Ended',
      'Integrated hardware hardware gain switch and volume rocker'
    ],
    specs: {
      'Output Power': '240mW @ 32Ω (Balanced), 125mW (Single-ended)',
      'THD+N': '< 0.0003% @ 1kHz',
      'SNR': '126dB',
      'Body': 'Single block CNC milled aluminum'
    },
    colors: [
      { name: 'Gunmetal Slate', hex: '#27272a' }
    ],
    visualType: 'dac'
  },
  {
    id: 'prod-folio-f1',
    name: 'Nexus Folio F1',
    tagline: 'Full-grain Tuscan leather magnetic laptop sleeve',
    price: 89,
    originalPrice: 109,
    category: 'wearables',
    rating: 4.8,
    reviewsCount: 160,
    stock: 18,
    maxStock: 40,
    sku: 'NX-FOL-TSC-1',
    description: 'Handcrafted vegetable-tanned Tuscan leather with microfiber interior lining and concealed neodymium magnetic snap closure.',
    features: [
      'Genuine Vegetable-Tanned Full Grain Leather that develops rich patina',
      'Concealed ultra-strong magnetic latch for seamless single-hand opening',
      'Anti-scratch micro-suede interior lining protects chassis finish',
      'Integrated rear document pocket and dedicated stylus loop'
    ],
    specs: {
      'Compatibility': 'Laptops up to 14.2" (MacBook Pro 14", Surface Laptop)',
      'Dimensions': '340mm x 245mm x 12mm',
      'Material': 'Certified Full-Grain Tuscan Cowhide',
      'Closure': 'Neodymium Magnetic Seal'
    },
    colors: [
      { name: 'Cognac Saddle', hex: '#854d0e' },
      { name: 'Charcoal Black', hex: '#1c1917' }
    ],
    visualType: 'folio'
  },
  {
    id: 'prod-clarity-v4',
    name: 'Nexus Clarity 32"',
    tagline: 'Color-calibrated 4K HDR IPS Black designer monitor',
    price: 649,
    originalPrice: 749,
    category: 'ambient',
    rating: 4.9,
    reviewsCount: 88,
    stock: 2,
    maxStock: 10,
    sku: 'NX-MON-CLR-32',
    description: '32-inch 4K IPS Black panel boasting 2000:1 contrast ratio, 99% DCI-P3 wide color gamut, single-cable 90W USB-C power delivery, and motorized height stand.',
    features: [
      'IPS Black Panel with deep blacks and 2000:1 contrast ratio',
      'Factory Calibrated Delta E < 1.0 with Calman Verified report',
      'Single-cable USB-C with 90W host charging and 4-port USB 3.2 hub',
      'Built-in ambient light sensor that adjusts backlight temperature'
    ],
    specs: {
      'Resolution': '3840 x 2160 (4K UHD) at 60Hz',
      'Color Space': '99% DCI-P3, 100% sRGB',
      'Brightness': '450 cd/m² (VESA DisplayHDR 400)',
      'Stand': 'Height, Pivot, Tilt, Swivel with cable routing'
    },
    colors: [
      { name: 'Architectural Silver', hex: '#64748b' }
    ],
    visualType: 'monitor',
    badge: 'Only 2 Left'
  }
];

// Seed initial demo order
export const SEED_ORDER: Order = {
  id: 'ord-seed-01',
  orderNumber: 'NX-784201',
  createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  status: 'shipped',
  customer: {
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '+1 (415) 890-1244',
    address: '742 Montgomery St, Apt 4B',
    city: 'San Francisco',
    postalCode: '94111',
    country: 'United States'
  },
  shippingMethod: {
    id: 'express',
    title: 'Nexus Priority Express (Next-Day Air)',
    price: 18,
    estimatedDays: '1-2 Days'
  },
  payment: {
    method: 'card',
    last4: '4242',
    cardBrand: 'Visa',
    transactionId: 'txn_sec_88491024',
    status: 'paid'
  },
  items: [
    {
      productId: 'prod-aura-100',
      productName: 'Nexus Aura NX-100',
      price: 299,
      quantity: 1,
      color: 'Space Obsidian',
      visualType: 'headphones'
    },
    {
      productId: 'prod-horizon-l1',
      productName: 'Nexus Horizon L1',
      price: 129,
      quantity: 1,
      color: 'Anodized Black',
      visualType: 'lamp'
    }
  ],
  subtotal: 428,
  discount: 42,
  shipping: 18,
  tax: 32,
  total: 436,
  tracking: {
    carrier: 'Nexus Priority Air',
    trackingNumber: 'NXTRK-892401US',
    currentLocation: 'San Francisco Sortation Facility (Bay Area Hub)',
    estimatedDelivery: 'Tomorrow, by 2:00 PM',
    timeline: [
      {
        status: 'confirmed',
        title: 'Payment Authorized & Order Received',
        location: 'Nexus Secure Core Gateway',
        timestamp: '5 hours ago',
        completed: true,
        current: false
      },
      {
        status: 'processing',
        title: 'Serialized & Quality Checked',
        location: 'Nexus Silicon Valley Warehouse',
        timestamp: '3 hours ago',
        completed: true,
        current: false
      },
      {
        status: 'shipped',
        title: 'Departed Facility via Nexus Express',
        location: 'San Francisco Hub 04',
        timestamp: '1 hour ago',
        completed: true,
        current: true
      },
      {
        status: 'in_transit',
        title: 'Local Courier Hand-off',
        location: 'Downtown SF Terminal',
        timestamp: 'Tomorrow 8:00 AM',
        completed: false
      },
      {
        status: 'delivered',
        title: 'Direct Hand Delivery & Signature',
        location: '742 Montgomery St, Apt 4B',
        timestamp: 'Tomorrow 2:00 PM',
        completed: false
      }
    ]
  }
};

// Storage keys for offline / Netlify persistence
const PRODUCTS_KEY = 'nexus_products_cache';
const ORDERS_KEY = 'nexus_orders_cache';

// In-browser fallback engine for static Netlify deploys
class NetlifyFallbackEngine {
  private products: Product[] = [];
  private orders: Record<string, Order> = {};
  private listeners: Array<(payload: any) => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedProds = localStorage.getItem(PRODUCTS_KEY);
      this.products = storedProds ? JSON.parse(storedProds) : INITIAL_PRODUCTS;
    } catch {
      this.products = INITIAL_PRODUCTS;
    }

    try {
      const storedOrders = localStorage.getItem(ORDERS_KEY);
      this.orders = storedOrders ? JSON.parse(storedOrders) : { [SEED_ORDER.orderNumber]: SEED_ORDER };
    } catch {
      this.orders = { [SEED_ORDER.orderNumber]: SEED_ORDER };
    }
  }

  private saveProducts() {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(this.products));
    } catch {}
  }

  private saveOrders() {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(this.orders));
    } catch {}
  }

  subscribe(listener: (payload: any) => void) {
    this.listeners.push(listener);
    // Send initial state
    const stockMap: Record<string, number> = {};
    this.products.forEach(p => { stockMap[p.id] = p.stock; });
    listener({
      type: 'initial_state',
      stocks: stockMap
    });

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private broadcast(reason: string, changedProductId?: string) {
    const stockMap: Record<string, number> = {};
    this.products.forEach(p => { stockMap[p.id] = p.stock; });
    const payload = {
      type: 'inventory_update',
      reason,
      changedProductId,
      stocks: stockMap
    };
    this.listeners.forEach(l => l(payload));
  }

  getProducts(): Product[] {
    return [...this.products];
  }

  restockAll(): Product[] {
    this.products = this.products.map(p => ({
      ...p,
      stock: Math.max(3, Math.min(p.maxStock, p.stock + 5))
    }));
    this.saveProducts();
    this.broadcast('Universal warehouse replenishment');
    return [...this.products];
  }

  simulatePurchase(): { success: boolean; product?: Product } {
    const candidates = this.products.filter(p => p.stock > 1);
    if (candidates.length === 0) return { success: false };
    const target = candidates[Math.floor(Math.random() * candidates.length)];
    target.stock -= 1;
    this.saveProducts();
    this.broadcast(`Concurrent customer purchased 1x ${target.name}`, target.id);
    return { success: true, product: target };
  }

  checkout(payload: {
    items: Array<{ productId: string; quantity: number; color?: string }>;
    customer: CustomerDetails;
    shippingMethod: ShippingMethod;
    payment: PaymentDetails;
    discountCode?: string;
  }): { success: boolean; order?: Order; error?: string } {
    const { items, customer, shippingMethod, payment, discountCode } = payload;

    // Check stock
    for (const it of items) {
      const prod = this.products.find(p => p.id === it.productId);
      if (!prod) return { success: false, error: 'Product not found' };
      if (prod.stock < it.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${prod.name}". Available: ${prod.stock}`
        };
      }
    }

    // Card decline simulation
    const cleanCard = (payment.cardNumber || '').replace(/\s+/g, '');
    if (payment.method === 'card' && cleanCard.endsWith('0002')) {
      return {
        success: false,
        error: 'Card declined by issuing bank (Simulated test card decline: ends in 0002). Please use 4242... test card.'
      };
    }

    // Decrement stock
    let subtotal = 0;
    const orderItems: OrderItem[] = [];
    for (const it of items) {
      const prod = this.products.find(p => p.id === it.productId)!;
      subtotal += prod.price * it.quantity;
      prod.stock -= it.quantity;
      orderItems.push({
        productId: prod.id,
        productName: prod.name,
        price: prod.price,
        quantity: it.quantity,
        color: it.color || prod.colors[0]?.name || 'Standard',
        visualType: prod.visualType
      });
    }
    this.saveProducts();

    // Discount
    let discount = 0;
    if (discountCode?.toUpperCase() === 'NEXUS10') {
      discount = Math.round(subtotal * 0.10);
    } else if (discountCode?.toUpperCase() === 'LAUNCH20') {
      discount = Math.round(subtotal * 0.20);
    }

    const shippingCost = shippingMethod?.price ?? (subtotal > 200 ? 0 : 15);
    const tax = Math.round((subtotal - discount) * 0.08);
    const total = subtotal - discount + shippingCost + tax;

    const orderNum = 'NX-' + Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = 'NXTRK-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const now = new Date();
    const deliveryDate = new Date(now.getTime() + (shippingMethod?.id === 'express' ? 2 : 4) * 86400000);

    const order: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      createdAt: now.toISOString(),
      status: 'confirmed',
      customer,
      shippingMethod: {
        id: shippingMethod?.id || 'standard',
        title: shippingMethod?.title || 'Nexus Express Insured',
        price: shippingCost,
        estimatedDays: shippingMethod?.estimatedDays || '3-5 Business Days'
      },
      payment: {
        method: payment.method || 'card',
        last4: cleanCard ? cleanCard.slice(-4) : '4242',
        cardBrand: cleanCard.startsWith('5') ? 'Mastercard' : (cleanCard.startsWith('3') ? 'Amex' : 'Visa'),
        transactionId: 'txn_sec_' + Math.random().toString(36).substring(2, 12),
        status: 'paid'
      },
      items: orderItems,
      subtotal,
      discount,
      shipping: shippingCost,
      tax,
      total,
      tracking: {
        carrier: 'Nexus Logistics Express',
        trackingNumber,
        currentLocation: 'San Francisco Sortation Facility (Hub 04)',
        estimatedDelivery: deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timeline: [
          {
            status: 'confirmed',
            title: 'Payment Authorized & Order Received',
            location: 'Nexus Secure Core Gateway',
            timestamp: 'Just now',
            completed: true
          },
          {
            status: 'processing',
            title: 'Inventory Reserved & Unit Barcode Serialized',
            location: 'Fulfillment Center Silicon Valley',
            timestamp: 'Scheduled today',
            completed: true,
            current: true
          },
          {
            status: 'shipped',
            title: 'Dispatched via Nexus Express Ground/Air',
            location: 'Origin Terminal SFX-09',
            timestamp: 'Estimated tomorrow, 9:00 AM',
            completed: false
          },
          {
            status: 'in_transit',
            title: 'In Transit to Regional Sorting Facility',
            location: 'Regional Hub',
            timestamp: 'In 2 days',
            completed: false
          },
          {
            status: 'delivered',
            title: 'Final Delivery & Signature Confirmation',
            location: customer.address,
            timestamp: deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            completed: false
          }
        ]
      }
    };

    this.orders[orderNum] = order;
    this.saveOrders();
    this.broadcast(`Order ${orderNum} completed (${orderItems.length} items)`, items[0]?.productId);

    return { success: true, order };
  }

  getOrder(orderNum: string): Order | null {
    return this.orders[orderNum] || null;
  }

  advanceOrderStatus(orderNum: string): Order | null {
    const order = this.orders[orderNum];
    if (!order) return null;

    const steps = ['confirmed', 'processing', 'shipped', 'in_transit', 'delivered'] as const;
    const currentIndex = steps.indexOf(order.status);
    if (currentIndex < steps.length - 1) {
      order.status = steps[currentIndex + 1];
      order.tracking.timeline.forEach((tl, idx) => {
        if (idx <= currentIndex + 1) {
          tl.completed = true;
          tl.current = idx === currentIndex + 1;
          if (idx === currentIndex + 1) tl.timestamp = 'Updated moments ago';
        } else {
          tl.completed = false;
          tl.current = false;
        }
      });
      if (order.status === 'delivered') order.tracking.currentLocation = 'Delivered to recipient doorstep';
      this.saveOrders();
    }
    return order;
  }
}

export const netlifyEngine = new NetlifyFallbackEngine();

// Hybrid API Gateway
export const NexusAPI = {
  // 1. Fetch products
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch('/api/products');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) return data.products;
      }
    } catch {
      // Fallback
    }
    return netlifyEngine.getProducts();
  },

  // 2. Simulate shopper purchase
  async simulateActivity(): Promise<{ success: boolean; product?: Product }> {
    try {
      const res = await fetch('/api/inventory/simulate-activity', { method: 'POST' });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch {}
    return netlifyEngine.simulatePurchase();
  },

  // 3. Restock inventory
  async restock(): Promise<Product[]> {
    try {
      const res = await fetch('/api/inventory/restock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.products) return data.products;
      }
    } catch {}
    return netlifyEngine.restockAll();
  },

  // 4. Checkout Dummy Payment
  async checkout(payload: {
    items: Array<{ productId: string; quantity: number; color?: string }>;
    customer: CustomerDetails;
    shippingMethod: ShippingMethod;
    payment: PaymentDetails;
    discountCode?: string;
  }): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok && data.success) return { success: true, order: data.order };
        return { success: false, error: data.error || 'Payment failed' };
      }
    } catch {}
    return netlifyEngine.checkout(payload);
  },

  // 5. Track Order
  async getOrder(orderNumber: string): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/${orderNumber.trim()}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.order) return data.order;
      }
    } catch {}
    return netlifyEngine.getOrder(orderNumber.trim());
  },

  // 6. Advance Order Milestone
  async advanceOrderStatus(orderNumber: string): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/${orderNumber}/advance-status`, { method: 'POST' });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.order) return data.order;
      }
    } catch {}
    return netlifyEngine.advanceOrderStatus(orderNumber);
  }
};
