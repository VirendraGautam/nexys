import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory product catalog with real-time inventory
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

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  color: string;
  visualType: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'in_transit' | 'delivered';
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
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
    timeline: {
      status: string;
      title: string;
      location: string;
      timestamp: string;
      completed: boolean;
      current?: boolean;
    }[];
  };
}

let products: Product[] = [
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

// In-memory orders database
const orders: Record<string, Order> = {};

// SSE Client Connections for Real-Time Inventory
interface SSEClient {
  id: number;
  res: Response;
}
let sseClients: SSEClient[] = [];
let nextClientId = 1;

function broadcastInventoryUpdate(reason: string, changedProductId?: string) {
  const stockMap: Record<string, number> = {};
  products.forEach(p => {
    stockMap[p.id] = p.stock;
  });

  const payload = JSON.stringify({
    type: 'inventory_update',
    timestamp: new Date().toISOString(),
    reason,
    changedProductId,
    stocks: stockMap,
    products: products.map(p => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      inStock: p.stock > 0
    }))
  });

  sseClients.forEach(client => {
    try {
      client.res.write(`data: ${payload}\n\n`);
    } catch {
      // client disconnected
    }
  });
}

// REST API Endpoints

// 1. Get products list
app.get('/api/products', (req: Request, res: Response) => {
  res.json({
    success: true,
    products
  });
});

// 2. Get single product
app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, product });
});

// 3. SSE Stream for Real-time Inventory
app.get('/api/inventory/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = nextClientId++;
  const newClient: SSEClient = { id: clientId, res };
  sseClients.push(newClient);

  // Send initial stock payload immediately
  const initialStockMap: Record<string, number> = {};
  products.forEach(p => {
    initialStockMap[p.id] = p.stock;
  });

  res.write(`data: ${JSON.stringify({
    type: 'initial_state',
    timestamp: new Date().toISOString(),
    stocks: initialStockMap,
    products: products.map(p => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      inStock: p.stock > 0
    }))
  })}\n\n`);

  // Keep-alive heartbeat every 20 seconds
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

// 4. Admin / Simulation Restock Route
app.post('/api/inventory/restock', (req: Request, res: Response) => {
  const { productId, amount } = req.body;
  if (productId) {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      prod.stock = Math.min(prod.maxStock, prod.stock + (amount || 5));
      broadcastInventoryUpdate(`Restocked ${prod.name}`, prod.id);
      return res.json({ success: true, product: prod });
    }
  } else {
    // Reset all to defaults
    products.forEach(p => {
      p.stock = Math.max(3, Math.min(p.maxStock, p.stock + 5));
    });
    broadcastInventoryUpdate('Universal warehouse replenishment');
    return res.json({ success: true, products });
  }
  res.status(400).json({ success: false, error: 'Invalid product' });
});

// 5. Simulate Live Shopping Activity (concurrent shopper purchase simulation)
app.post('/api/inventory/simulate-activity', (req: Request, res: Response) => {
  // Pick a random product with stock > 1 and decrement by 1
  const candidates = products.filter(p => p.stock > 1);
  if (candidates.length === 0) {
    return res.json({ success: false, message: 'All items low/out of stock' });
  }
  const target = candidates[Math.floor(Math.random() * candidates.length)];
  target.stock -= 1;
  broadcastInventoryUpdate(`Concurrent customer purchased 1x ${target.name}`, target.id);
  res.json({
    success: true,
    message: `Simulated purchase on ${target.name}`,
    product: target
  });
});

// 6. Secure Checkout API (Dummy Payment Gateway)
app.post('/api/checkout', (req: Request, res: Response) => {
  const {
    items,
    customer,
    shippingMethod,
    payment,
    discountCode
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Cart is empty' });
  }

  if (!customer || !customer.email || !customer.name || !customer.address) {
    return res.status(400).json({ success: false, error: 'Incomplete customer shipping details' });
  }

  // 1. Stock check: ensure every item is currently in stock
  for (const item of items) {
    const prod = products.find(p => p.id === item.productId);
    if (!prod) {
      return res.status(404).json({ success: false, error: `Product ${item.productId} not found` });
    }
    if (prod.stock < item.quantity) {
      return res.status(409).json({
        success: false,
        error: `Insufficient stock for "${prod.name}". Available: ${prod.stock}, requested: ${item.quantity}. Inventory updated in real time.`,
        availableStock: prod.stock,
        productId: prod.id
      });
    }
  }

  // 2. Dummy Payment Gateway Simulation
  // Check for test decline card (e.g. ends in 0002)
  const cardNumClean = (payment.cardNumber || '').replace(/\s+/g, '');
  if (payment.method === 'card' && cardNumClean.endsWith('0002')) {
    return res.status(402).json({
      success: false,
      error: 'Card declined by issuing bank (Simulated test card decline: ends in 0002). Please use 4242... test card.'
    });
  }

  // Calculate pricing
  let subtotal = 0;
  const orderItems: OrderItem[] = [];

  for (const item of items) {
    const prod = products.find(p => p.id === item.productId)!;
    subtotal += prod.price * item.quantity;
    orderItems.push({
      productId: prod.id,
      productName: prod.name,
      price: prod.price,
      quantity: item.quantity,
      color: item.color || prod.colors[0]?.name || 'Default',
      visualType: prod.visualType
    });

    // Atomic stock decrement
    prod.stock -= item.quantity;
  }

  // Discount calculation
  let discount = 0;
  if (discountCode && discountCode.toUpperCase() === 'NEXUS10') {
    discount = Math.round(subtotal * 0.10);
  } else if (discountCode && discountCode.toUpperCase() === 'LAUNCH20') {
    discount = Math.round(subtotal * 0.20);
  }

  const shippingCost = shippingMethod?.price ?? (subtotal > 200 ? 0 : 15);
  const tax = Math.round((subtotal - discount) * 0.08); // 8% tax
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
    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '+1 (555) 019-2834',
      address: customer.address,
      city: customer.city || 'San Francisco',
      postalCode: customer.postalCode || '94107',
      country: customer.country || 'United States'
    },
    shippingMethod: {
      id: shippingMethod?.id || 'standard',
      title: shippingMethod?.title || 'Nexus Express Insured',
      price: shippingCost,
      estimatedDays: shippingMethod?.estimatedDays || '3-5 Business Days'
    },
    payment: {
      method: payment.method || 'card',
      last4: cardNumClean ? cardNumClean.slice(-4) : '4242',
      cardBrand: cardNumClean.startsWith('5') ? 'Mastercard' : (cardNumClean.startsWith('3') ? 'Amex' : 'Visa'),
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
          completed: true,
          current: false
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

  orders[orderNum] = order;

  // Broadcast inventory update to all connected sessions!
  broadcastInventoryUpdate(`Order ${orderNum} completed (${orderItems.length} items)`, items[0]?.productId);

  // Return full confirmation receipt & email payload
  res.json({
    success: true,
    order,
    emailSent: {
      to: customer.email,
      subject: `Order Confirmation #${orderNum} - Nexus Store`,
      sentAt: now.toISOString()
    }
  });
});

// 7. Get Order by Order Number (for Order Tracking)
app.get('/api/orders/:orderNumber', (req: Request, res: Response) => {
  const order = orders[req.params.orderNumber];
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  res.json({ success: true, order });
});

// 8. Advance / Update order status (for interactive simulation in order tracking view)
app.post('/api/orders/:orderNumber/advance-status', (req: Request, res: Response) => {
  const order = orders[req.params.orderNumber];
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  const steps = ['confirmed', 'processing', 'shipped', 'in_transit', 'delivered'] as const;
  const currentIndex = steps.indexOf(order.status);
  if (currentIndex < steps.length - 1) {
    const nextStatus = steps[currentIndex + 1];
    order.status = nextStatus;

    // Update timeline
    order.tracking.timeline.forEach((tl, idx) => {
      if (idx <= currentIndex + 1) {
        tl.completed = true;
        tl.current = idx === currentIndex + 1;
        if (idx === currentIndex + 1) {
          tl.timestamp = 'Updated moments ago';
        }
      } else {
        tl.completed = false;
        tl.current = false;
      }
    });

    if (nextStatus === 'delivered') {
      order.tracking.currentLocation = 'Delivered to recipient doorstep';
    } else if (nextStatus === 'in_transit') {
      order.tracking.currentLocation = 'Regional Distribution Center';
    } else if (nextStatus === 'shipped') {
      order.tracking.currentLocation = 'In Transit with Courier Vehicle';
    }
  }

  res.json({ success: true, order });
});

// Seed an initial demo order so users can test tracking immediately without checking out first
const demoOrderNum = 'NX-784201';
const demoNow = new Date(Date.now() - 3600000 * 5);
orders[demoOrderNum] = {
  id: 'ord-seed-01',
  orderNumber: demoOrderNum,
  createdAt: demoNow.toISOString(),
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

// Vite development middleware or static production serve
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nexus Store server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
