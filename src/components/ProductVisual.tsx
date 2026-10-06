import React from 'react';

interface ProductVisualProps {
  type: 'headphones' | 'keyboard' | 'mouse' | 'lamp' | 'watch' | 'folio' | 'dac' | 'monitor' | string;
  colorHex?: string;
  className?: string;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  type,
  colorHex = '#1e2029',
  className = 'w-full h-full'
}) => {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden select-none bg-gradient-to-b from-[#14161f] to-[#0d0e14] ${className}`}>
      {/* Subtle ambient lighting backdrop */}
      <div 
        className="absolute inset-0 opacity-20 transition-all duration-500 blur-2xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colorHex || '#6366f1'}, transparent 70%)`
        }}
      />

      {/* Grid texture overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
      />

      {type === 'headphones' && (
        <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 max-h-56 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]">
          <defs>
            <linearGradient id="headbandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor={colorHex} />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="cupGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="40%" stopColor={colorHex} />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="metalRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
          {/* Headband arch */}
          <path d="M 45 105 C 45 40, 155 40, 155 105" fill="none" stroke="url(#headbandGrad)" strokeWidth="11" strokeLinecap="round" />
          <path d="M 52 90 C 52 50, 148 50, 148 90" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
          
          {/* Metal armatures */}
          <rect x="39" y="100" width="8" height="24" rx="3" fill="url(#metalRim)" />
          <rect x="153" y="100" width="8" height="24" rx="3" fill="url(#metalRim)" />

          {/* Left Earcup */}
          <ellipse cx="43" cy="126" rx="20" ry="32" fill="url(#cupGrad)" stroke="#64748b" strokeWidth="1.5" />
          <ellipse cx="43" cy="126" rx="14" ry="24" fill="#090a0f" opacity="0.7" />
          <circle cx="43" cy="126" r="6" fill="#38bdf8" opacity="0.8" />

          {/* Right Earcup */}
          <ellipse cx="157" cy="126" rx="20" ry="32" fill="url(#cupGrad)" stroke="#64748b" strokeWidth="1.5" />
          <ellipse cx="157" cy="126" rx="14" ry="24" fill="#090a0f" opacity="0.7" />
          <circle cx="157" cy="126" r="6" fill="#38bdf8" opacity="0.8" />
        </svg>
      )}

      {type === 'keyboard' && (
        <svg viewBox="0 0 240 160" className="w-5/6 h-5/6 max-h-56 drop-shadow-[0_16px_32px_rgba(0,0,0,0.7)]">
          <defs>
            <linearGradient id="kbdBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor={colorHex} />
            </linearGradient>
          </defs>
          {/* Keyboard Chassis */}
          <rect x="20" y="30" width="200" height="100" rx="10" fill="url(#kbdBody)" stroke="#475569" strokeWidth="2" />
          
          {/* Key Rows */}
          {/* Row 1 */}
          <g fill="#1e293b" stroke="#334155" strokeWidth="1">
            {[30, 48, 66, 84, 102, 120, 138, 156, 174, 192].map((x, i) => (
              <rect key={`r1-${i}`} x={x} y="40" width="14" height="12" rx="2" fill={i === 0 ? '#f43f5e' : '#1e293b'} />
            ))}
          </g>
          {/* Row 2 */}
          <g fill="#1e293b" stroke="#334155" strokeWidth="1">
            {[30, 48, 66, 84, 102, 120, 138, 156, 174, 192].map((x, i) => (
              <rect key={`r2-${i}`} x={x} y="56" width="14" height="12" rx="2" />
            ))}
          </g>
          {/* Row 3 */}
          <g fill="#1e293b" stroke="#334155" strokeWidth="1">
            {[30, 50, 68, 86, 104, 122, 140, 158, 178].map((x, i) => (
              <rect key={`r3-${i}`} x={x} y="72" width={i === 8 ? '28' : '14'} height="12" rx="2" />
            ))}
          </g>
          {/* Row 4 Spacebar */}
          <g fill="#1e293b" stroke="#334155" strokeWidth="1">
            <rect x="30" y="88" width="18" height="12" rx="2" />
            <rect x="52" y="88" width="18" height="12" rx="2" />
            <rect x="74" y="88" width="80" height="12" rx="2" fill="#38bdf8" opacity="0.8" />
            <rect x="158" y="88" width="18" height="12" rx="2" />
            <rect x="180" y="88" width="26" height="12" rx="2" />
          </g>
          {/* Warm LED light strip at bottom */}
          <line x1="30" y1="120" x2="210" y2="120" stroke="#fcd34d" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        </svg>
      )}

      {type === 'watch' && (
        <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 max-h-56 drop-shadow-[0_16px_28px_rgba(0,0,0,0.6)]">
          <defs>
            <linearGradient id="strapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <radialGradient id="dialGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#111827" />
              <stop offset="85%" stopColor="#030712" />
              <stop offset="100%" stopColor="#1f2937" />
            </radialGradient>
          </defs>
          {/* Top Strap */}
          <path d="M 78 20 L 122 20 L 118 70 L 82 70 Z" fill="url(#strapGrad)" stroke="#334155" strokeWidth="1.5" />
          {/* Bottom Strap */}
          <path d="M 82 130 L 118 130 L 122 180 L 78 180 Z" fill="url(#strapGrad)" stroke="#334155" strokeWidth="1.5" />

          {/* Titanium Case */}
          <rect x="66" y="66" width="68" height="68" rx="20" fill={colorHex} stroke="#64748b" strokeWidth="2.5" />
          {/* Crown */}
          <rect x="134" y="88" width="5" height="14" rx="2" fill="#94a3b8" />

          {/* Sapphire OLED Face */}
          <circle cx="100" cy="100" r="28" fill="url(#dialGrad)" stroke="#374151" strokeWidth="1.5" />
          {/* Activity Rings */}
          <circle cx="100" cy="100" r="22" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="95 40" strokeLinecap="round" />
          <circle cx="100" cy="100" r="17" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="70 40" strokeLinecap="round" />
          {/* Digital Time */}
          <text x="100" y="103" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold" fontFamily="monospace">10:42</text>
          <text x="100" y="113" textAnchor="middle" fill="#94a3b8" fontSize="5.5" fontFamily="sans-serif">NEXUS</text>
        </svg>
      )}

      {type === 'lamp' && (
        <svg viewBox="0 0 220 180" className="w-5/6 h-5/6 max-h-56 drop-shadow-[0_16px_30px_rgba(0,0,0,0.6)]">
          <defs>
            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Ambient downward light cone */}
          <polygon points="110,65 30,165 190,165" fill="url(#beamGrad)" />

          {/* Architectural Lightbar Cylinder */}
          <rect x="35" y="58" width="150" height="12" rx="6" fill={colorHex} stroke="#64748b" strokeWidth="2" />
          {/* Diffuser lens */}
          <rect x="42" y="66" width="136" height="3" rx="1.5" fill="#fef08a" />
          
          {/* Weighted Counterbalance Clasp */}
          <rect x="104" y="42" width="12" height="20" rx="3" fill="#334155" />
          <circle cx="110" cy="38" r="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <circle cx="110" cy="38" r="3" fill="#38bdf8" />
        </svg>
      )}

      {type === 'mouse' && (
        <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 max-h-56 drop-shadow-[0_16px_28px_rgba(0,0,0,0.6)]">
          <defs>
            <linearGradient id="mouseBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor={colorHex} />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          {/* Mouse contour */}
          <path d="M 70 80 C 70 45, 130 45, 130 80 C 130 145, 120 165, 100 165 C 80 165, 70 145, 70 80 Z" 
                fill="url(#mouseBody)" stroke="#475569" strokeWidth="2" />
          {/* Left/Right Button split line */}
          <line x1="100" y1="45" x2="100" y2="85" stroke="#1e293b" strokeWidth="2" />
          {/* Magnetic scroll wheel */}
          <rect x="96" y="60" width="8" height="22" rx="4" fill="#94a3b8" stroke="#334155" strokeWidth="1" />
          {/* Thumb grip accents */}
          <path d="M 72 100 C 74 110, 74 125, 72 135" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </svg>
      )}

      {type === 'dac' && (
        <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 max-h-56 drop-shadow-[0_16px_28px_rgba(0,0,0,0.6)]">
          {/* CNC Aluminum Chassis */}
          <rect x="50" y="45" width="100" height="110" rx="10" fill={colorHex} stroke="#64748b" strokeWidth="2.5" />
          {/* OLED Status Screen */}
          <rect x="65" y="65" width="70" height="35" rx="4" fill="#090a0f" stroke="#334155" strokeWidth="1.5" />
          <text x="100" y="80" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">96kHz / 24bit</text>
          <text x="100" y="92" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="sans-serif">DSD512 NATIVE</text>
          
          {/* Output Ports at Bottom */}
          <circle cx="80" cy="130" r="7" fill="#0f172a" stroke="#d97706" strokeWidth="2" />
          <text x="80" y="145" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="sans-serif">4.4mm</text>

          <circle cx="120" cy="130" r="5" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="120" y="145" textAnchor="middle" fill="#64748b" fontSize="6" fontFamily="sans-serif">3.5mm</text>
        </svg>
      )}

      {type === 'folio' && (
        <svg viewBox="0 0 220 180" className="w-5/6 h-5/6 max-h-56 drop-shadow-[0_16px_28px_rgba(0,0,0,0.6)]">
          {/* Leather Folio */}
          <rect x="35" y="35" width="150" height="110" rx="8" fill={colorHex} stroke="#78350f" strokeWidth="1.5" />
          {/* Perimeter Stitching */}
          <rect x="40" y="40" width="140" height="100" rx="6" fill="none" stroke="#ca8a04" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          {/* Magnetic Flap */}
          <path d="M 75 35 L 145 35 L 135 65 L 85 65 Z" fill="#451a03" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="110" cy="53" r="4" fill="#d97706" />
          <text x="110" y="110" textAnchor="middle" fill="#fed7aa" fontSize="9" fontWeight="bold" letterSpacing="3" opacity="0.8">NEXUS</text>
        </svg>
      )}

      {type === 'monitor' && (
        <svg viewBox="0 0 240 180" className="w-5/6 h-5/6 max-h-56 drop-shadow-[0_18px_32px_rgba(0,0,0,0.7)]">
          {/* Display Bezels */}
          <rect x="30" y="25" width="180" height="110" rx="6" fill="#030712" stroke="#475569" strokeWidth="2.5" />
          {/* 4K Screen Area */}
          <rect x="34" y="29" width="172" height="102" rx="4" fill="#0f172a" />
          {/* Vibrant Color Gradient Test Pattern on Screen */}
          <rect x="40" y="35" width="160" height="90" rx="2" fill="url(#screenGrad)" />
          <defs>
            <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* Aluminum Stand Pillar */}
          <rect x="114" y="135" width="12" height="25" fill="#64748b" />
          {/* Stand Base */}
          <rect x="90" y="160" width="60" height="6" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      )}

      {/* Zero Broken Image Brand Watermark */}
      <div className="absolute bottom-2.5 right-3 text-[10px] uppercase tracking-widest text-slate-500 font-mono font-medium opacity-60">
        Nexus Lab
      </div>
    </div>
  );
};
