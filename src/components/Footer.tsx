import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Cpu, Download } from 'lucide-react';
import { ProductCategory } from '../types';

interface FooterProps {
  onSelectCategory: (category: ProductCategory) => void;
  onOpenTracking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenTracking
}) => {
  return (
    <footer className="border-t border-slate-800 bg-[#0a0b0f] text-slate-400 text-xs">
      {/* Trust Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Industrial Precision</h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                Machined aluminum alloys, high-grade acoustic dampening, and titanium armatures.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">2-Year Warranty</h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                Direct hardware replacement guarantee backed by registered serial authentication.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Air Courier Dispatch</h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                Insured express air logistics from Silicon Valley with continuous GPS telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">30-Day Evaluation</h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                Trial in your personal studio workspace with risk-free prepaid return labels.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs">
                NX
              </div>
              <span className="font-display text-lg font-bold text-white tracking-tight">
                Nexus Store
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Engineered studio acoustics, minimalist mechanical hardware, and ergonomic workspace tools with real-time stock allocation.
            </p>
            <div className="text-[11px] text-slate-500 font-mono pt-2">
              Real-time Node.js backend & SSE event pipeline enabled.
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Hardware</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectCategory('audio')} className="hover:text-white transition-colors cursor-pointer">
                  Audio & Acoustics
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('workspace')} className="hover:text-white transition-colors cursor-pointer">
                  Keyboards & Mice
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('wearables')} className="hover:text-white transition-colors cursor-pointer">
                  Chronos Wearables
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('ambient')} className="hover:text-white transition-colors cursor-pointer">
                  Optics & Ambient
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Customer Care</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenTracking} className="hover:text-white transition-colors cursor-pointer">
                  Track Delivery
                </button>
              </li>
              <li><span className="text-slate-400">Warranty Registration</span></li>
              <li><span className="text-slate-400">Acoustic Driver Guide</span></li>
              <li><span className="text-slate-400">Returns & Exchanges</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Deploy & Download</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="/nexus-store-source.zip" 
                  download="nexus-store-source.zip" 
                  className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Source (.zip)</span>
                </a>
              </li>
              <li>
                <a 
                  href="/nexus-store-dist.zip" 
                  download="nexus-store-dist.zip" 
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Netlify Build (.zip)</span>
                </a>
              </li>
              <li><span className="text-slate-400">Netlify Ready (netlify.toml)</span></li>
              <li><span className="text-slate-400">Security & TLS Protocol</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & payment icons */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Nexus Store Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span>VISA</span>
            <span>·</span>
            <span>MASTERCARD</span>
            <span>·</span>
            <span>AMEX</span>
            <span>·</span>
            <span>NEXUS PAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
