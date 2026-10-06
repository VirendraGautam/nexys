import React from 'react';
import { Order } from '../types';
import { ProductVisual } from './ProductVisual';
import { CheckCircle2, Mail, MapPin, Package, ArrowRight, X, ShieldCheck, Printer } from 'lucide-react';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onViewEmail: () => void;
  onTrackOrder: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onViewEmail,
  onTrackOrder
}) => {
  if (!order) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-confirmation-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-[#10121a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d0f16]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
              Order Confirmed & Payment Captured
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close confirmation"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Hero */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="text-center space-y-2 py-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 id="order-confirmation-title" className="font-display text-2xl font-bold text-white tracking-tight">
              Thank you, {order.customer.name.split(' ')[0]}!
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Your order <strong className="text-white font-mono">{order.orderNumber}</strong> has been secured and sent to our Silicon Valley fulfillment center.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 mt-2">
              <span>Receipt sent to:</span>
              <strong className="text-indigo-400">{order.customer.email}</strong>
            </div>
          </div>

          {/* Quick Action Cards: Track Order & Email Confirmation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onTrackOrder}
              className="p-4 rounded-xl border border-indigo-500/50 bg-indigo-950/30 hover:bg-indigo-950/50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between text-indigo-400 mb-2">
                <Package className="w-5 h-5" />
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-sm font-semibold text-white">Track Delivery Live</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitor dispatch timeline and courier transit updates.
              </p>
            </button>

            <button
              onClick={onViewEmail}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between text-cyan-400 mb-2">
                <Mail className="w-5 h-5" />
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-sm font-semibold text-white">View Email Confirmation</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect transactional receipt dispatched to your inbox.
              </p>
            </button>
          </div>

          {/* Items Breakdown */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="font-semibold text-slate-300">Ordered Items</span>
              <span className="font-mono text-slate-500">Est. Delivery: {order.tracking.estimatedDelivery}</span>
            </div>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                      <ProductVisual
                        type={item.visualType}
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{item.productName}</h4>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {item.color} · Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono font-medium text-slate-200">
                    ${item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-slate-300">${order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promotion Applied</span>
                  <span className="font-mono">-${order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Shipping ({order.shippingMethod.title})</span>
                <span className="font-mono text-slate-300">
                  {order.shipping === 0 ? 'FREE' : `$${order.shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax (8%)</span>
                <span className="font-mono text-slate-300">${order.tax}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-white pt-1.5 border-t border-slate-800">
                <span>Total Paid</span>
                <span className="font-mono text-indigo-400">${order.total}</span>
              </div>
            </div>
          </div>

          {/* Destination Details */}
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/30 flex items-start gap-3 text-xs">
            <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Shipping Destination</span>
              <span className="text-slate-300 block">
                {order.customer.name} · {order.customer.address}, {order.customer.city}, {order.customer.postalCode}, {order.customer.country}
              </span>
              <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                Carrier: {order.tracking.carrier} (Tracking: {order.tracking.trackingNumber})
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0d0f16] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Serial number recorded for warranty</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
