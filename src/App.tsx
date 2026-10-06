import React, { useState, useEffect, useMemo } from 'react';
import { 
  Product, CartItem, Order, ProductCategory 
} from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { EmailConfirmationModal } from './components/EmailConfirmationModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { InventoryLiveWidget } from './components/InventoryLiveWidget';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { 
  Filter, SlidersHorizontal, ArrowUpDown, Radio, RefreshCw, 
  PackageCheck, AlertCircle, ShoppingBag, Heart 
} from 'lucide-react';
import { NexusAPI, netlifyEngine } from './services/nexusService';

export default function App() {
  // Products and inventory state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSseConnected, setIsSseConnected] = useState(false);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'stock'>('featured');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('NEXUS10');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isEmailViewerOpen, setIsEmailViewerOpen] = useState(false);
  const [orderToViewEmail, setOrderToViewEmail] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('NX-784201');

  const [mobileTab, setMobileTab] = useState<'shop' | 'search' | 'cart' | 'orders'>('shop');

  // Notification Banner Toast
  const [liveToast, setLiveToast] = useState<{ message: string; type: 'info' | 'success' | 'warn' } | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setLiveToast({ message, type });
    setTimeout(() => {
      setLiveToast(prev => prev?.message === message ? null : prev);
    }, 4000);
  };

  // 1. Fetch initial products from backend or Netlify offline engine
  const fetchProducts = async () => {
    try {
      const data = await NexusAPI.getProducts();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Setup Server-Sent Events (SSE) with seamless Netlify engine fallback
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let unsubscribeFallback: (() => void) | null = null;
    let sseFailed = false;

    const handlePayload = (payload: any) => {
      if (payload.type === 'initial_state') {
        if (payload.stocks) {
          setProducts(prev => prev.map(p => ({
            ...p,
            stock: payload.stocks[p.id] !== undefined ? payload.stocks[p.id] : p.stock
          })));
        }
      } else if (payload.type === 'inventory_update') {
        if (payload.stocks) {
          setProducts(prev => prev.map(p => ({
            ...p,
            stock: payload.stocks[p.id] !== undefined ? payload.stocks[p.id] : p.stock
          })));
        }
        if (payload.reason) {
          setRecentActivity(prev => [payload.reason, ...prev.slice(0, 9)]);
          showToast(`Real-Time Sync: ${payload.reason}`, 'info');
        }
      }
    };

    try {
      eventSource = new EventSource('/api/inventory/stream');

      eventSource.onopen = () => {
        setIsSseConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          handlePayload(payload);
        } catch {}
      };

      eventSource.onerror = () => {
        if (!sseFailed) {
          sseFailed = true;
          // When deployed statically to Netlify, fallback to local in-browser realtime engine
          if (eventSource) eventSource.close();
          setIsSseConnected(true);
          unsubscribeFallback = netlifyEngine.subscribe(handlePayload);
        }
      };
    } catch {
      setIsSseConnected(true);
      unsubscribeFallback = netlifyEngine.subscribe(handlePayload);
    }

    return () => {
      if (eventSource) eventSource.close();
      if (unsubscribeFallback) unsubscribeFallback();
    };
  }, []);

  // Sync selected product's stock with real-time updates
  useEffect(() => {
    if (selectedProduct) {
      const updated = products.find(p => p.id === selectedProduct.id);
      if (updated && updated.stock !== selectedProduct.stock) {
        setSelectedProduct(updated);
      }
    }
  }, [products, selectedProduct]);

  // Real-time Simulation Actions
  const handleSimulateActivity = async () => {
    setIsSimulating(true);
    try {
      const res = await NexusAPI.simulateActivity();
      if (res.success && res.product) {
        showToast(`Simulated customer purchase on ${res.product.name}! Stock dropped live.`, 'warn');
      }
    } catch {
      // ignore
    } finally {
      setIsSimulating(false);
    }
  };

  const handleRestock = async () => {
    try {
      const restocked = await NexusAPI.restock();
      if (Array.isArray(restocked) && restocked.length > 0) {
        setProducts(restocked);
      }
      showToast('Warehouse universally restocked! Real-time levels updated.', 'success');
    } catch {
      // ignore
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, colorName?: string) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is currently out of stock.`, 'warn');
      return;
    }

    const selectedColor = colorName || product.colors[0]?.name || 'Standard';

    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.productId === product.id && item.selectedColor === selectedColor);
      if (existingIdx > -1) {
        const copy = [...prev];
        const newQty = Math.min(product.stock, copy[existingIdx].quantity + quantity);
        copy[existingIdx] = {
          ...copy[existingIdx],
          quantity: newQty
        };
        return copy;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            product,
            quantity: Math.min(product.stock, quantity),
            selectedColor
          }
        ];
      }
    });

    showToast(`Added ${product.name} (${selectedColor}) to your bag.`, 'success');
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const liveProd = products.find(p => p.id === productId) || item.product;
        return {
          ...item,
          quantity: Math.min(liveProd.stock, quantity)
        };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const handleBuyNow = (product: Product, quantity = 1, colorName?: string) => {
    handleAddToCart(product, quantity, colorName);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Wishlist toggle handler
  const handleToggleWishlist = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    const prodName = prod ? prod.name : 'Item';
    setWishlist(prev => {
      let next: string[];
      if (prev.includes(productId)) {
        next = prev.filter(id => id !== productId);
        showToast(`Removed ${prodName} from your wishlist.`, 'info');
      } else {
        next = [...prev, productId];
        showToast(`Added ${prodName} to your wishlist!`, 'success');
      }
      try {
        localStorage.setItem('nexus_wishlist', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Order Success & Modals Flow
  const handleOrderSuccess = (order: Order) => {
    setCart([]);
    setIsCheckoutOpen(false);
    setConfirmedOrder(order);
    setOrderToViewEmail(order);
    setTrackingOrderNumber(order.orderNumber);
    setIsConfirmationOpen(true);
    showToast(`Order #${order.orderNumber} confirmed! Receipt dispatched.`, 'success');
  };

  const handleOpenEmailViewer = (order?: Order) => {
    if (order) {
      setOrderToViewEmail(order);
    } else if (confirmedOrder) {
      setOrderToViewEmail(confirmedOrder);
    }
    setIsEmailViewerOpen(true);
  };

  const handleOpenTrackingModal = (orderNumber?: string) => {
    if (orderNumber) {
      setTrackingOrderNumber(orderNumber);
    } else if (confirmedOrder) {
      setTrackingOrderNumber(confirmedOrder.orderNumber);
    }
    setIsTrackingOpen(true);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.tagline.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }

    // In Stock Only
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Wishlist Only
    if (showWishlistOnly) {
      result = result.filter(p => wishlist.includes(p.id));
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'stock') {
      result.sort((a, b) => b.stock - a.stock);
    }

    return result;
  }, [products, activeCategory, searchQuery, inStockOnly, showWishlistOnly, wishlist, sortBy]);

  const featuredProduct = products.find(p => p.id === 'prod-aura-100') || products[0];
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0d12] text-slate-100 selection:bg-indigo-500/30">
      {/* Real-time Toast Alert */}
      {liveToast && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 z-50 max-w-sm p-3 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl flex items-center gap-2.5 text-xs text-white animate-slide-in backdrop-blur-md"
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${
            liveToast.type === 'success' ? 'bg-emerald-400' :
            liveToast.type === 'warn' ? 'bg-amber-400' : 'bg-cyan-400'
          }`} />
          <span className="flex-1 font-medium">{liveToast.message}</span>
        </div>
      )}

      {/* Primary Top Bar */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setMobileTab('shop');
        }}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => {
          setShowWishlistOnly(prev => !prev);
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => handleOpenTrackingModal()}
        isSseConnected={isSseConnected}
        onSimulateActivity={handleSimulateActivity}
        onRestock={handleRestock}
        isSimulating={isSimulating}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Flagship Hero Banner (shown when browsing all and no active search) */}
        {activeCategory === 'all' && !searchQuery && featuredProduct && (
          <HeroBanner
            featuredProduct={featuredProduct}
            onSelectProduct={setSelectedProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
          />
        )}

        {/* Catalog Section */}
        <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {/* Section Header with Category Label and Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono uppercase tracking-wider mb-1">
                <span>Hardware Catalog</span>
                <span>·</span>
                <span className="text-slate-400">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Design' : 'Designs'} Available
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {showWishlistOnly ? 'My Saved Wishlist' :
                 activeCategory === 'all' ? 'All Engineered Hardware' :
                 activeCategory === 'audio' ? 'Studio Acoustics & Audio' :
                 activeCategory === 'workspace' ? 'Minimalist Workspace Gear' :
                 activeCategory === 'wearables' ? 'Titanium Chronos Wearables' : 'Optics & Studio Lighting'}
              </h2>
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Wishlist Favorites Toggle */}
              <button
                onClick={() => setShowWishlistOnly(!showWishlistOnly)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  showWishlistOnly
                    ? 'border-rose-500 bg-rose-950/40 text-rose-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${showWishlistOnly ? 'fill-rose-400 text-rose-400' : 'text-slate-400'}`} />
                <span>Favorites ({wishlist.length})</span>
              </button>

              {/* In-Stock Only Toggle */}
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  inStockOnly
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${inStockOnly ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span>In Stock Only</span>
              </button>

              {/* Sort Dropdown */}
              <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <label htmlFor="sort-select" className="sr-only">Sort products by</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort products by"
                  className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-2"
                >
                  <option value="featured" className="bg-slate-900">Featured Order</option>
                  <option value="price-asc" className="bg-slate-900">Price: Low to High</option>
                  <option value="price-desc" className="bg-slate-900">Price: High to Low</option>
                  <option value="rating" className="bg-slate-900">Customer Rating</option>
                  <option value="stock" className="bg-slate-900">Live Stock Count</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Search / Filter Indicator */}
          {(searchQuery || showWishlistOnly) && (
            <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800 text-xs text-slate-300">
              <span>
                {showWishlistOnly && <span className="text-rose-400 font-semibold mr-2">Showing Saved Wishlist ({filteredProducts.length} items)</span>}
                {searchQuery && <span>Search: <strong className="text-white">"{searchQuery}"</strong></span>}
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowWishlistOnly(false);
                }}
                className="text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Product Grid (3-column desktop / 2-column tablet) */}
          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-80 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-3">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                <h3 className="font-semibold text-white text-base">
                  {showWishlistOnly ? 'Your wishlist is currently empty' : 'No hardware found'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {showWishlistOnly
                    ? 'Click the heart icon on any product card to save items to your wishlist for quick access.'
                    : 'Try adjusting your search criteria or toggling off the In Stock Only filter.'}
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                    setInStockOnly(false);
                    setShowWishlistOnly(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium cursor-pointer"
                >
                  {showWishlistOnly ? 'Browse All Hardware' : 'Reset All Filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={setSelectedProduct}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    isInCart={cart.some(item => item.productId === product.id)}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Craftsmanship & Engineering Proof Section (Section Ceiling discipline) */}
        <section className="border-t border-slate-800/80 bg-[#0e1017] py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="text-xs text-indigo-400 font-mono uppercase tracking-wider mb-2">
                Engineering Discipline
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Built without compromise. Down to the millimeter.
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Every Nexus product begins as an unibody CNC aluminum billet or aerospace titanium block. We bypass unnecessary markup to bring studio instruments directly to engineers, producers, and designers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="p-5 rounded-xl border border-slate-800 bg-[#12141e]/60 space-y-2">
                <span className="font-mono text-xs text-indigo-400">01. Precision Acoustic Testing</span>
                <h3 className="font-semibold text-white text-sm">Beryllium & Planar Drivers</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Individual acoustic chamber calibration and waterfall decay plots verify linear phase response across the 10Hz–40kHz bandwidth.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-800 bg-[#12141e]/60 space-y-2">
                <span className="font-mono text-xs text-cyan-400">02. Live Inventory Telemetry</span>
                <h3 className="font-semibold text-white text-sm">Real-Time Serial Allocation</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Every order locks units atomically via Server-Sent Events. What you see is guaranteed physical stock ready for immediate dispatch.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-800 bg-[#12141e]/60 space-y-2">
                <span className="font-mono text-xs text-emerald-400">03. Encrypted Dummy Gateway</span>
                <h3 className="font-semibold text-white text-sm">Seamless Checkout Simulation</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Full multi-step checkout workflow with 3D Secure simulation, instant transactional email receipts, and real-time courier tracking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Live Warehouse Widget (Desktop) */}
      <InventoryLiveWidget
        products={products}
        isSseConnected={isSseConnected}
        onSimulateActivity={handleSimulateActivity}
        onRestock={handleRestock}
        isSimulating={isSimulating}
        recentActivity={recentActivity}
      />

      {/* Mobile Bottom Navigation Bar (Mobile) */}
      <MobileBottomNav
        activeTab={mobileTab}
        onSelectTab={(tab) => {
          setMobileTab(tab);
          if (tab === 'cart') setIsCartOpen(true);
          if (tab === 'orders') handleOpenTrackingModal();
          if (tab === 'search') {
            window.scrollTo({ top: 300, behavior: 'smooth' });
          }
        }}
        cartCount={totalCartCount}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenTracking={() => handleOpenTrackingModal()}
      />

      {/* Product Detail Modal (PDP) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty, color) => handleAddToCart(p, qty, color)}
        onBuyNow={(p, qty, color) => handleBuyNow(p, qty, color)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        products={products}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        promoCode={promoCode}
        onApplyPromoCode={setPromoCode}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        promoCode={promoCode}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setIsConfirmationOpen(false)}
        onViewEmail={() => {
          setIsConfirmationOpen(false);
          handleOpenEmailViewer();
        }}
        onTrackOrder={() => {
          setIsConfirmationOpen(false);
          handleOpenTrackingModal();
        }}
      />

      {/* Email Confirmation Viewer Modal */}
      <EmailConfirmationModal
        order={orderToViewEmail}
        onClose={() => setIsEmailViewerOpen(false)}
        onTrackOrder={() => {
          setIsEmailViewerOpen(false);
          handleOpenTrackingModal();
        }}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialOrderNumber={trackingOrderNumber}
        onViewEmail={(ord) => {
          setIsTrackingOpen(false);
          handleOpenEmailViewer(ord);
        }}
      />
    </div>
  );
}
