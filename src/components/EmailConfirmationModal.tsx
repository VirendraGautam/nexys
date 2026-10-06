import React from 'react';
import { Order } from '../types';
import { ProductVisual } from './ProductVisual';
import { X, Mail, ExternalLink, Printer, CheckCircle, Shield, Package, ArrowRight } from 'lucide-react';

interface EmailConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: () => void;
}

export const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  order,
  onClose,
  onTrackOrder
}) => {
  if (!order) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-viewer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-[#0e1017] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Email Client Simulated Title Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-[#141724]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <Mail className="w-4 h-4 text-indigo-400" />
            <h2 id="email-viewer-title" className="text-xs font-semibold text-slate-200">
              Nexus Mail Client · Transactional Email Preview
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close email preview"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Envelope Meta Fields */}
        <div className="px-6 py-3 bg-[#11131f] border-b border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-baseline gap-2">
            <span className="text-slate-500 font-medium w-16">Subject:</span>
            <span className="font-semibold text-white">Order Confirmation #{order.orderNumber} - Nexus Store</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-slate-500 font-medium w-16">From:</span>
            <span className="text-slate-300 font-mono">Nexus Store Orders &lt;orders@nexus-store.io&gt;</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-slate-500 font-medium w-16">To:</span>
            <span className="text-indigo-400 font-mono">{order.customer.email}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-slate-500 font-medium w-16">Date:</span>
            <span className="text-slate-400 font-mono">{new Date(order.createdAt).toUTCString()}</span>
          </div>
        </div>

        {/* Rendered HTML Email Content Container */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-[#ffffff] text-slate-900 font-sans">
          <div className="max-w-xl mx-auto space-y-6">
            {/* Email Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                  NX
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900 font-display">
                  Nexus Store
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                RECEIPT #{order.orderNumber}
              </span>
            </div>

            {/* Greeting */}
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-slate-900">
                Your order is confirmed, {order.customer.name.split(' ')[0]}!
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                Thank you for purchasing from Nexus Store. We have received your payment and our engineering fulfillment team has allocated your serialized hardware.
              </p>
            </div>

            {/* Direct Tracking CTA Banner in Email */}
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-indigo-900 block">
                  Estimated Delivery: {order.tracking.estimatedDelivery}
                </span>
                <span className="text-xs text-indigo-700 font-mono">
                  Carrier: {order.tracking.carrier} ({order.tracking.trackingNumber})
                </span>
              </div>
              <button
                onClick={onTrackOrder}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
              >
                <span>Track Package</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Itemized Order Table */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Order Summary
              </h2>
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-200 overflow-hidden">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                        <ProductVisual
                          type={item.visualType}
                          className="w-full h-full"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{item.productName}</span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          Edition: {item.color} · Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-slate-900">
                      ${item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-xs border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono text-slate-900 font-medium">${order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Promotional Savings</span>
                  <span className="font-mono">-${order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping ({order.shippingMethod.title})</span>
                <span className="font-mono text-slate-900 font-medium">
                  {order.shipping === 0 ? 'FREE' : `$${order.shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-mono text-slate-900 font-medium">${order.tax}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Paid</span>
                <span className="font-mono text-indigo-700">${order.total}</span>
              </div>
            </div>

            {/* Payment & Shipping Addresses */}
            <div className="grid grid-cols-2 gap-4 text-xs pt-2">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 block">Shipping Address</span>
                <span className="text-slate-600 block">{order.customer.name}</span>
                <span className="text-slate-600 block">{order.customer.address}</span>
                <span className="text-slate-600 block">{order.customer.city}, {order.customer.postalCode}</span>
                <span className="text-slate-600 block">{order.customer.country}</span>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-900 block">Payment Authorization</span>
                <span className="text-slate-600 block">
                  Method: {order.payment.cardBrand || 'Card'} · Ending in {order.payment.last4}
                </span>
                <span className="text-slate-500 font-mono text-[10px] block">
                  Auth Ref: {order.payment.transactionId}
                </span>
                <span className="text-emerald-600 font-medium block">
                  Status: Payment Captured
                </span>
              </div>
            </div>

            {/* Email Footer */}
            <div className="pt-6 border-t border-slate-200 text-center space-y-2 text-[11px] text-slate-500">
              <p>
                Nexus Store Inc. · 450 Mission Street, San Francisco, CA 94105
              </p>
              <p>
                Questions about your delivery? Contact <span className="text-indigo-600">support@nexus-store.io</span> or manage your order in the Nexus App.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Controls Bar */}
        <div className="p-4 border-t border-slate-800 bg-[#0d0f16] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            A real-time copy was rendered from the backend confirmation dispatch.
          </div>
          <button
            onClick={onTrackOrder}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Open Order Tracking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
