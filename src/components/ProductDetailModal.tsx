import React, { useState } from 'react';
import { Product } from '../types';
import { ProductVisual } from './ProductVisual';
import { X, Star, ShieldCheck, Truck, RefreshCw, Zap, Check, AlertCircle, ShoppingBag } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, color: string) => void;
  onBuyNow: (product: Product, quantity: number, color: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow
}) => {
  if (!product) return null;

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const selectedColor = product.colors[selectedColorIndex] || product.colors[0];
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 4;
  const maxAvailable = Math.max(1, product.stock);

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity, selectedColor.name);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleInstantBuy = () => {
    if (isOutOfStock) return;
    onBuyNow(product, quantity, selectedColor.name);
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div className="relative w-full max-w-4xl bg-[#10121a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d0f16]">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="uppercase text-indigo-400">{product.category}</span>
            <span>/</span>
            <span className="text-slate-200">{product.sku}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close product details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Gallery Left (Sticky Gallery on desktop) */}
            <div className="md:col-span-6 space-y-4">
              <div className="w-full aspect-square rounded-xl overflow-hidden border border-slate-800 bg-[#0a0b10] relative shadow-inner">
                <ProductVisual
                  type={product.visualType}
                  colorHex={selectedColor.hex}
                  className="w-full h-full"
                />

                {/* Live Stock Badge */}
                <div className="absolute top-4 left-4 z-10">
                  {isOutOfStock ? (
                    <span className="bg-rose-950/90 text-rose-300 border border-rose-800 text-xs font-medium px-2.5 py-1 rounded">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="bg-amber-950/90 text-amber-300 border border-amber-800 text-xs font-medium px-2.5 py-1 rounded flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      Only {product.stock} units left in stock
                    </span>
                  ) : (
                    <span className="bg-slate-900/90 text-emerald-400 border border-slate-800 text-xs font-mono px-2.5 py-1 rounded flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {product.stock} units in warehouse
                    </span>
                  )}
                </div>
              </div>

              {/* Color Swatches */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Selected Finish: <strong className="text-white">{selectedColor.name}</strong></span>
                  <span className="font-mono text-slate-500">{product.colors.length} options</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColorIndex(i)}
                      className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        selectedColorIndex === i
                          ? 'border-indigo-500 bg-indigo-950/40 text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contiguous Purchase Module Right */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-300">{product.rating}</span>
                  <span className="text-xs text-slate-500">· {product.reviewsCount} verified reviews</span>
                </div>

                <h2 id="product-detail-title" className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {product.name}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {product.tagline}
                </p>
              </div>

              {/* Price & Guarantee */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-3xl font-bold text-white tabular-nums">
                      ${product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-slate-500 line-through tabular-nums">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">Free express insured shipping included</span>
                </div>
                <div className="text-right text-xs text-slate-400 font-mono">
                  <span>SKU: {product.sku}</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity Selector & Purchase CTAs */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400 font-medium">Quantity</span>
                  <div className="flex items-center border border-slate-700 bg-slate-900 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      aria-label="Decrease quantity"
                      className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-mono font-semibold text-white tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock || isOutOfStock}
                      aria-label="Increase quantity"
                      className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-500">
                    (Max {product.stock} available right now)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAdd}
                    disabled={isOutOfStock}
                    className={`py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isOutOfStock
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : addedSuccess
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-200" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleInstantBuy}
                    disabled={isOutOfStock}
                    className="py-3 px-4 rounded-lg font-medium text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Instant Checkout</span>
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-400 pt-2">
                <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80">
                  <Truck className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                  <span className="block font-medium text-slate-200">Express Courier</span>
                  <span className="text-[10px] text-slate-500">Tracked dispatch</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <span className="block font-medium text-slate-200">2-Year Warranty</span>
                  <span className="text-[10px] text-slate-500">Full replacement</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80">
                  <RefreshCw className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <span className="block font-medium text-slate-200">30-Day Returns</span>
                  <span className="text-[10px] text-slate-500">Hassle-free guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features & Tech Specs */}
          <div className="pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display text-lg font-semibold text-white mb-3">
                Engineered Capabilities
              </h3>
              <ul className="space-y-2">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold text-white mb-3">
                Technical Specifications
              </h3>
              <div className="rounded-lg border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
                {Object.entries(product.specs).map(([specKey, specVal]) => (
                  <div key={specKey} className="flex justify-between px-3 py-2 text-xs">
                    <span className="text-slate-400">{specKey}</span>
                    <span className="text-slate-200 font-mono text-right">{specVal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
