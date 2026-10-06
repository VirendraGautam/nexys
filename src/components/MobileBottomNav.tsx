import React from 'react';
import { ShoppingBag, Compass, Search, PackageCheck, Zap } from 'lucide-react';
import { ProductCategory } from '../types';

interface MobileBottomNavProps {
  activeTab: 'shop' | 'search' | 'cart' | 'orders';
  onSelectTab: (tab: 'shop' | 'search' | 'cart' | 'orders') => void;
  cartCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  cartCount
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d12]/95 backdrop-blur-lg border-t border-slate-800 px-4 py-2 pb-safe">
      <div className="flex items-center justify-around">
        <button
          onClick={() => onSelectTab('shop')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer py-1 ${
            activeTab === 'shop' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Catalog</span>
        </button>

        <button
          onClick={() => onSelectTab('search')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer py-1 ${
            activeTab === 'search' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => onSelectTab('cart')}
          className={`relative flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer py-1 ${
            activeTab === 'cart' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Bag</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 right-2 bg-indigo-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onSelectTab('orders')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer py-1 ${
            activeTab === 'orders' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PackageCheck className="w-5 h-5" />
          <span>Tracking</span>
        </button>
      </div>
    </div>
  );
};
