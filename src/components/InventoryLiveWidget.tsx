import React, { useState } from 'react';
import { Radio, RefreshCw, ChevronUp, ChevronDown, Activity, Box, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface InventoryLiveWidgetProps {
  products: Product[];
  isSseConnected: boolean;
  onSimulateActivity: () => void;
  onRestock: () => void;
  isSimulating: boolean;
  recentActivity: string[];
}

export const InventoryLiveWidget: React.FC<InventoryLiveWidgetProps> = ({
  products,
  isSseConnected,
  onSimulateActivity,
  onRestock,
  isSimulating,
  recentActivity
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 4).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <aside 
      aria-label="Real-time inventory telemetry"
      className="fixed bottom-4 right-4 z-30 max-w-sm w-full transition-all duration-300 hidden sm:block"
    >
      <div className="bg-[#10121a]/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Minimized Header Bar */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSseConnected ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSseConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            </span>
            <span className="text-xs font-semibold text-slate-200">
              Live Warehouse Telemetry
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              {totalStock} units
            </span>
          </div>

          <div className="flex items-center gap-2">
            {lowStockCount > 0 && (
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                {lowStockCount} Low
              </span>
            )}
            <button
              aria-label={isExpanded ? "Collapse telemetry drawer" : "Expand telemetry drawer"}
              className="text-slate-400 hover:text-white"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded Panel Details */}
        {isExpanded && (
          <div className="p-4 border-t border-slate-800 bg-[#0d0f16] space-y-3.5 text-xs">
            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Total Stock</span>
                <span className="font-mono text-sm font-bold text-white tabular-nums">{totalStock}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-amber-500 block text-[10px]">Low Stock</span>
                <span className="font-mono text-sm font-bold text-amber-400 tabular-nums">{lowStockCount}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-rose-500 block text-[10px]">Sold Out</span>
                <span className="font-mono text-sm font-bold text-rose-400 tabular-nums">{outOfStockCount}</span>
              </div>
            </div>

            {/* Real-time simulation actions */}
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Real-Time Demo Controls</span>
                <span className="text-cyan-400 font-mono">SSE Stream</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onSimulateActivity}
                  disabled={isSimulating}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>Simulate Order</span>
                </button>

                <button
                  onClick={onRestock}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Restock All</span>
                </button>
              </div>
            </div>

            {/* Live Activity Feed */}
            {recentActivity.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">
                  Recent Inventory Events
                </span>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {recentActivity.slice(0, 4).map((act, idx) => (
                    <div key={idx} className="text-[11px] text-slate-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span className="truncate">{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
