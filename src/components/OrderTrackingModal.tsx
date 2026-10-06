import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { ProductVisual } from './ProductVisual';
import { NexusAPI } from '../services/nexusService';
import { 
  X, Search, Package, Truck, CheckCircle2, Clock, MapPin, 
  RefreshCw, Navigation, Mail, ArrowRight, ShieldCheck, Play 
} from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
  onViewEmail?: (order: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber = 'NX-784201',
  onViewEmail
}) => {
  if (!isOpen) return null;

  const [orderNumberInput, setOrderNumberInput] = useState(initialOrderNumber);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const fetchOrder = async (ordNum: string) => {
    setLoading(true);
    setError(null);
    try {
      const order = await NexusAPI.getOrder(ordNum.trim());
      if (!order) {
        throw new Error('Order not found. Please verify the order number.');
      }
      setCurrentOrder(order);
    } catch (err: any) {
      setError(err.message || 'Failed to load order');
      setCurrentOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      setOrderNumberInput(initialOrderNumber);
      fetchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumberInput.trim()) {
      fetchOrder(orderNumberInput.trim());
    }
  };

  const handleAdvanceMilestone = async () => {
    if (!currentOrder) return;
    setIsAdvancing(true);
    try {
      const updated = await NexusAPI.advanceOrderStatus(currentOrder.orderNumber);
      if (updated) {
        setCurrentOrder(updated);
      }
    } catch {
      // ignore
    } finally {
      setIsAdvancing(false);
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="tracking-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-[#10121a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d0f16]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 id="tracking-modal-title" className="font-display text-base font-bold text-white">
                Nexus Express Live Tracking
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Satellite telemetry & fulfillment pipeline
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close tracking"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search / Lookup Bar */}
        <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={orderNumberInput}
                onChange={(e) => setOrderNumberInput(e.target.value)}
                placeholder="Enter Order # (e.g. NX-784201 or NX-...)"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500 uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Locating...' : 'Track'}
            </button>
            <button
              type="button"
              onClick={() => {
                setOrderNumberInput('NX-784201');
                fetchOrder('NX-784201');
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              Load Demo Seed (NX-784201)
            </button>
          </form>
        </div>

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs text-center space-y-1">
              <p className="font-semibold">{error}</p>
              <p className="text-slate-400 text-[11px]">
                Tip: Try clicking "Load Demo Seed (NX-784201)" to inspect a live pre-shipped consignment.
              </p>
            </div>
          )}

          {currentOrder && (
            <div className="space-y-6">
              {/* Status Header Card with Live Simulator Trigger */}
              <div className="p-5 rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900/90 to-[#141724] relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-indigo-400 font-bold">
                        {currentOrder.orderNumber}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">
                        {currentOrder.shippingMethod.title}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-white capitalize">
                      {currentOrder.status === 'delivered' ? 'Consignment Delivered' : 
                       currentOrder.status === 'in_transit' ? 'In Transit — On Schedule' :
                       currentOrder.status === 'shipped' ? 'Dispatched via Air Courier' :
                       currentOrder.status === 'processing' ? 'Processing in Warehouse' : 'Payment Authorized'}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Estimated Arrival: <strong className="text-emerald-400">{currentOrder.tracking.estimatedDelivery}</strong></span>
                    </div>
                  </div>

                  {/* Interactive Status Advancement Button for Simulation */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={handleAdvanceMilestone}
                      disabled={isAdvancing || currentOrder.status === 'delivered'}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        currentOrder.status === 'delivered'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>
                        {currentOrder.status === 'delivered' ? 'Package Delivered' : 'Advance Next Milestone'}
                      </span>
                    </button>

                    {onViewEmail && (
                      <button
                        onClick={() => onViewEmail(currentOrder)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span>View Order Email</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-4 gap-2 text-[11px]">
                  <div className={`p-2 rounded bg-slate-900 border text-center ${['confirmed', 'processing', 'shipped', 'in_transit', 'delivered'].includes(currentOrder.status) ? 'border-indigo-500 text-indigo-300' : 'border-slate-800 text-slate-500'}`}>
                    1. Authorized
                  </div>
                  <div className={`p-2 rounded bg-slate-900 border text-center ${['processing', 'shipped', 'in_transit', 'delivered'].includes(currentOrder.status) ? 'border-indigo-500 text-indigo-300' : 'border-slate-800 text-slate-500'}`}>
                    2. Serialized
                  </div>
                  <div className={`p-2 rounded bg-slate-900 border text-center ${['shipped', 'in_transit', 'delivered'].includes(currentOrder.status) ? 'border-indigo-500 text-indigo-300' : 'border-slate-800 text-slate-500'}`}>
                    3. In Transit
                  </div>
                  <div className={`p-2 rounded bg-slate-900 border text-center ${currentOrder.status === 'delivered' ? 'border-emerald-500 text-emerald-300 bg-emerald-950/20' : 'border-slate-800 text-slate-500'}`}>
                    4. Delivered
                  </div>
                </div>
              </div>

              {/* Courier & Telemetry Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50">
                  <span className="text-slate-500 block mb-1">Carrier Network</span>
                  <span className="font-semibold text-white block">{currentOrder.tracking.carrier}</span>
                  <span className="font-mono text-slate-400 text-[11px]">Waybill: {currentOrder.tracking.trackingNumber}</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50">
                  <span className="text-slate-500 block mb-1">Live Location</span>
                  <span className="font-semibold text-white block">{currentOrder.tracking.currentLocation}</span>
                  <span className="text-emerald-400 text-[11px] font-mono">GPS Ping: Active</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50">
                  <span className="text-slate-500 block mb-1">Destination</span>
                  <span className="font-semibold text-white block truncate">{currentOrder.customer.address}</span>
                  <span className="text-slate-400 text-[11px]">{currentOrder.customer.city}, {currentOrder.customer.postalCode}</span>
                </div>
              </div>

              {/* Milestone Timeline */}
              <div>
                <h4 className="font-display text-sm font-semibold text-white mb-3">
                  Logistics Milestones & Checkpoints
                </h4>

                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {currentOrder.tracking.timeline.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 pl-8">
                      {/* Timeline dot */}
                      <div className={`absolute left-1.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        item.completed
                          ? 'border-indigo-500 bg-indigo-600 text-white'
                          : 'border-slate-700 bg-slate-900 text-slate-600'
                      }`}>
                        {item.completed && <CheckCircle2 className="w-2.5 h-2.5" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-1">
                          <span className={`text-xs font-semibold ${item.completed ? 'text-white' : 'text-slate-400'}`}>
                            {item.title}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {item.timestamp}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Package Manifest */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30">
                <span className="text-xs font-semibold text-slate-300 block mb-3">
                  Consignment Contents ({currentOrder.items.length} items)
                </span>
                <div className="space-y-2">
                  {currentOrder.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-200">
                        {it.quantity}x {it.productName} ({it.color})
                      </span>
                      <span className="font-mono text-slate-400">${it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0d0f16] flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Nexus Guaranteed Delivery Protection Active</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
