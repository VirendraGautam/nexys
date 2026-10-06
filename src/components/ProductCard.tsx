import React from 'react';
import { Product } from '../types';
import { ProductVisual } from './ProductVisual';
import { Star, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isInCart = false
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 4;

  return (
    <div className="group relative flex flex-col rounded-xl border border-slate-800/80 bg-[#10121a] hover:border-slate-700 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5">
      {/* Visual Image Area (65% of card height) */}
      <div 
        onClick={() => onSelect(product)}
        className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer bg-[#0f1118]"
      >
        <ProductVisual
          type={product.visualType}
          colorHex={product.colors[0]?.hex}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />

        {/* Live Stock Notification Ribbon/Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-xs">
          {isOutOfStock ? (
            <span className="bg-rose-950/80 text-rose-300 border border-rose-800/50 text-[11px] font-medium px-2 py-0.5 rounded">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-950/80 text-amber-300 border border-amber-800/50 text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Only {product.stock} left
            </span>
          ) : (
            <span className="bg-slate-900/80 text-emerald-400 border border-slate-800 text-[11px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {product.stock} in stock
            </span>
          )}
        </div>

        {/* Optional Flagship badge */}
        {product.badge && !isOutOfStock && !isLowStock && (
          <div className="absolute top-3 right-3 text-[11px] font-mono text-indigo-300 bg-indigo-950/80 border border-indigo-800/50 px-2 py-0.5 rounded">
            {product.badge}
          </div>
        )}
      </div>

      {/* Product Information Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between">
        <div className="space-y-1.5">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider font-mono text-[11px] text-slate-500">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-slate-300">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-xs">{product.rating}</span>
              <span className="text-slate-500 text-[11px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <button
            onClick={() => onSelect(product)}
            className="text-left font-semibold text-white hover:text-indigo-400 transition-colors text-base line-clamp-1 block cursor-pointer"
          >
            {product.name}
          </button>

          {/* Tagline / 1-line description */}
          <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-4 mt-2 border-t border-slate-800/60 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-lg font-bold text-white tabular-nums">
              ${product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-500 line-through tabular-nums">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            aria-label={`Add ${product.name} to bag`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : isInCart
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 hover:border-indigo-500'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>In Bag</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
