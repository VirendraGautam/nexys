import React from 'react';
import { ProductVisual } from './ProductVisual';
import { Product } from '../types';
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react';

interface HeroBannerProps {
  featuredProduct: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredProduct,
  onSelectProduct,
  onAddToCart
}) => {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-[#10121a] to-[#0c0d12] py-12 md:py-16">
      {/* Background glow & subtle geometric lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Unboxed Metadata with typographic separator */}
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono tracking-wider uppercase">
              <span>Next-Gen Acoustics</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Batch 04 Now Open</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Stock: {featuredProduct.stock} Available
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
              Studio-grade clarity.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-300 to-indigo-300">
                Pure beryllium precision.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Meet the {featuredProduct.name}. Machined aluminum chassis, custom 40mm transducers, and 45dB hybrid ANC engineered for total sonic immersion.
            </p>

            {/* Spec Highlights - Zero-Pill text metrics */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-800/80 max-w-lg">
              <div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">40h</div>
                <div className="text-xs text-slate-400">Playtime with ANC</div>
              </div>
              <div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">24-bit</div>
                <div className="text-xs text-slate-400">Lossless USB-C DAC</div>
              </div>
              <div>
                <div className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">258g</div>
                <div className="text-xs text-slate-400">Lightweight Comfort</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onAddToCart(featuredProduct)}
                disabled={featuredProduct.stock <= 0}
                className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Instant Buy (${featuredProduct.price})</span>
              </button>

              <button
                onClick={() => onSelectProduct(featuredProduct)}
                className="px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>View Full Specifications</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>2-Year Comprehensive Warranty</span>
              </div>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span>30-Day Risk-Free Returns</span>
            </div>
          </div>

          {/* Right Product Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div 
              onClick={() => onSelectProduct(featuredProduct)}
              className="relative w-full max-w-md aspect-square rounded-2xl p-6 border border-slate-800 bg-slate-900/40 backdrop-blur-sm group cursor-pointer hover:border-indigo-500/50 transition-all shadow-2xl"
            >
              <ProductVisual
                type={featuredProduct.visualType}
                colorHex={featuredProduct.colors[0]?.hex}
                className="w-full h-full rounded-xl"
              />

              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="font-semibold text-white block">{featuredProduct.name}</span>
                  <span className="text-slate-400 text-[11px]">{featuredProduct.colors[0]?.name} Edition</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-mono font-bold">${featuredProduct.price}</span>
                  <span className="line-through text-slate-500 text-[11px] ml-1.5">${featuredProduct.originalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
