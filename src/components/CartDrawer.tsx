import React, { useState } from 'react';
import { CartItem, Product } from '../types';
import { ProductVisual } from './ProductVisual';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag, AlertTriangle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  products: Product[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  promoCode: string;
  onApplyPromoCode: (code: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  promoCode,
  onApplyPromoCode
}) => {
  if (!isOpen) return null;

  const [inputCode, setInputCode] = useState(promoCode);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Calculate live subtotal & stock mismatches
  let subtotal = 0;
  let hasStockConflict = false;

  const enrichedItems = items.map(item => {
    const liveProd = products.find(p => p.id === item.productId) || item.product;
    const currentStock = liveProd.stock;
    const isExceeded = item.quantity > currentStock;
    if (isExceeded) hasStockConflict = true;

    subtotal += item.product.price * item.quantity;
    return {
      ...item,
      currentStock,
      isExceeded
    };
  });

  let discount = 0;
  if (promoCode.toUpperCase() === 'NEXUS10') {
    discount = Math.round(subtotal * 0.10);
  } else if (promoCode.toUpperCase() === 'LAUNCH20') {
    discount = Math.round(subtotal * 0.20);
  }

  const freeShippingThreshold = 200;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15;
  const tax = Math.round((subtotal - discount) * 0.08);
  const total = Math.max(0, subtotal - discount + shipping + tax);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputCode.trim().toUpperCase();
    if (clean === 'NEXUS10' || clean === 'LAUNCH20') {
      onApplyPromoCode(clean);
      setPromoMessage(`Success! Code ${clean} applied.`);
    } else {
      setPromoMessage('Invalid coupon code. Try NEXUS10');
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end"
    >
      <div className="w-full max-w-md bg-[#10121a] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-slide-left">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d0f16]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            <h2 id="cart-drawer-title" className="font-display text-lg font-bold text-white">
              Shopping Bag
            </h2>
            <span className="text-xs font-mono text-slate-400">({items.length} items)</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress bar */}
        <div className="px-6 py-2.5 bg-slate-900/60 border-b border-slate-800 text-xs">
          {subtotal >= freeShippingThreshold ? (
            <div className="text-emerald-400 font-medium flex items-center gap-1.5">
              <span>✓ You qualified for Free Express Insured Shipping!</span>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Add ${freeShippingThreshold - subtotal} more for Free Shipping</span>
                <span className="font-mono text-slate-300">${subtotal} / ${freeShippingThreshold}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-medium text-white">Your bag is currently empty</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Explore our precision acoustic instruments and architectural desk hardware.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Start Browsing
              </button>
            </div>
          ) : (
            enrichedItems.map(item => (
              <div 
                key={`${item.productId}-${item.selectedColor}`}
                className={`p-3 rounded-xl border bg-slate-900/50 flex gap-3 transition-colors ${
                  item.isExceeded ? 'border-amber-500/80 bg-amber-950/20' : 'border-slate-800'
                }`}
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-800 shrink-0 bg-[#0c0d12]">
                  <ProductVisual
                    type={item.product.visualType}
                    colorHex={item.product.colors.find(c => c.name === item.selectedColor)?.hex}
                    className="w-full h-full"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="text-xs font-semibold text-white line-clamp-1">
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => onRemoveItem(item.productId)}
                        aria-label={`Remove ${item.product.name}`}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{item.selectedColor}</span>
                      <span>·</span>
                      <span className="font-mono text-slate-300">${item.product.price} each</span>
                    </div>

                    {/* Stock Alert Warning */}
                    {item.isExceeded && (
                      <div className="flex items-center gap-1 text-[11px] text-amber-400 mt-1 font-medium">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>Only {item.currentStock} in stock right now</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-slate-700 bg-slate-900 rounded-md overflow-hidden">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-mono font-semibold text-white tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.currentStock}
                        className="px-2 py-0.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono text-sm font-bold text-white tabular-nums">
                      ${item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Calculations and Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-800 bg-[#0d0f16] space-y-4">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Promo Code (e.g. NEXUS10)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 uppercase font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
            {promoMessage && (
              <p className={`text-[11px] ${promoMessage.startsWith('Success') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {promoMessage}
              </p>
            )}

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-slate-200 tabular-nums">${subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({promoCode})</span>
                  <span className="font-mono tabular-nums">-${discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Estimated Shipping</span>
                <span className="font-mono text-slate-200 tabular-nums">
                  {shipping === 0 ? 'FREE' : `$${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Tax (8%)</span>
                <span className="font-mono text-slate-200 tabular-nums">${tax}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                <span>Total</span>
                <span className="font-mono tabular-nums">${total}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={onCheckout}
              disabled={hasStockConflict}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{hasStockConflict ? 'Adjust Quantities to Proceed' : 'Proceed to Secure Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-bit TLS Encrypted Checkout · Dummy Gateway</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
