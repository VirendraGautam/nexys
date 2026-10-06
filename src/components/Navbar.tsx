import React from 'react';
import { ShoppingBag, Radio, RefreshCw, Smartphone, Monitor, Search } from 'lucide-react';
import { ProductCategory } from '../types';

interface NavbarProps {
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  isSseConnected: boolean;
  onSimulateActivity: () => void;
  onRestock: () => void;
  isSimulating: boolean;
  mobileViewActive: boolean;
  onToggleMobileView: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  cartCount,
  onOpenCart,
  onOpenTracking,
  isSseConnected,
  onSimulateActivity,
  onRestock,
  isSimulating,
  mobileViewActive,
  onToggleMobileView,
  searchQuery,
  onSearchChange
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0c0d12]/90 backdrop-blur-md">
      {/* Promotional Top Ribbon (single clean text, dismissible/slim) */}
      <div className="w-full bg-slate-900/60 border-b border-slate-800/40 px-4 py-1.5 text-center text-xs text-slate-400 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-emerald-400">REAL-TIME INVENTORY STREAM ACTIVE</span>
        </div>

        <div className="mx-auto sm:mx-0 flex items-center gap-3">
          <span>Complimentary insured shipping on orders over $200</span>
          <span className="hidden md:inline text-slate-600">·</span>
          <span className="hidden md:inline text-indigo-400 font-mono">Use code NEXUS10 for 10% off</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <button
            onClick={onSimulateActivity}
            disabled={isSimulating}
            title="Simulate a real-time order from another shopper"
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer text-[11px]"
          >
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>Simulate Live Demand</span>
          </button>
          <button
            onClick={onRestock}
            title="Warehouse universal restock"
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer text-[11px]"
          >
            <RefreshCw className="w-3 h-3 text-emerald-400" />
            <span>Restock</span>
          </button>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (Nav Links) - Zone 3 (Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => onSelectCategory('all')}
            className="group flex items-center gap-2 text-left cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-black text-sm tracking-tighter">NX</span>
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                Nexus Store
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links & Search */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Hardware
            </button>
            <button
              onClick={() => onSelectCategory('audio')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'audio'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Audio & Acoustics
            </button>
            <button
              onClick={() => onSelectCategory('workspace')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'workspace'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Workspace
            </button>
            <button
              onClick={() => onSelectCategory('wearables')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'wearables'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Wearables
            </button>
            <button
              onClick={() => onSelectCategory('ambient')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'ambient'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Optics & Ambient
            </button>
          </nav>

          {/* Quick Search */}
          <div className="relative w-48 lg:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search gear..."
              className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          {/* Order Tracking Trigger */}
          <button
            onClick={onOpenTracking}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Track Order
          </button>

          {/* Mobile Shell Mode Toggle */}
          <button
            onClick={onToggleMobileView}
            title={mobileViewActive ? "Switch to Desktop Layout" : "View as Nexus Mobile App"}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {mobileViewActive ? <Monitor className="w-3.5 h-3.5 text-indigo-400" /> : <Smartphone className="w-3.5 h-3.5 text-indigo-400" />}
            <span className="text-[11px]">{mobileViewActive ? "Desktop View" : "Mobile App Frame"}</span>
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={onOpenCart}
            aria-label={`Shopping bag with ${cartCount} items`}
            className="relative flex items-center justify-center p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0c0d12] animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
