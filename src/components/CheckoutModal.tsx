import React, { useState } from 'react';
import { CartItem, CustomerDetails, ShippingMethod, PaymentDetails, Order } from '../types';
import { ProductVisual } from './ProductVisual';
import { NexusAPI } from '../services/nexusService';
import { 
  X, Lock, CreditCard, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, 
  ShieldCheck, Truck, Sparkles, Smartphone, Landmark, Loader2 
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  promoCode: string;
  onOrderSuccess: (order: Order) => void;
}

const SHIPPING_OPTIONS: ShippingMethod[] = [
  {
    id: 'standard',
    title: 'Nexus Standard Insured',
    price: 0,
    estimatedDays: '3–5 Business Days',
    description: 'Tracked standard delivery with tamper-proof packaging.'
  },
  {
    id: 'express',
    title: 'Nexus Priority Express (Air)',
    price: 18,
    estimatedDays: '1–2 Business Days',
    description: 'Expedited air courier with signature requirement.'
  },
  {
    id: 'sameday',
    title: 'Nexus Metro Same-Day Courier',
    price: 28,
    estimatedDays: 'Same-Day (by 8:00 PM)',
    description: 'Dedicated courier for local metropolitan dispatch.'
  }
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  promoCode,
  onOrderSuccess
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod>(SHIPPING_OPTIONS[0]);

  // Customer shipping info
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: 'Virendra Gautam',
    email: 'virendragautam1991@gmail.com',
    phone: '+1 (415) 880-9214',
    address: '450 Mission Street, Suite 1200',
    city: 'San Francisco',
    postalCode: '94105',
    country: 'United States'
  });

  // Payment info
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'nexus_pay' | 'cod'>('card');
  const [payment, setPayment] = useState<PaymentDetails>({
    method: 'card',
    cardNumber: '4242 4242 4242 4242',
    cardExpiry: '12/28',
    cardCvc: '842',
    cardHolder: 'Virendra Gautam'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  let discount = 0;
  if (promoCode.toUpperCase() === 'NEXUS10') {
    discount = Math.round(subtotal * 0.10);
  } else if (promoCode.toUpperCase() === 'LAUNCH20') {
    discount = Math.round(subtotal * 0.20);
  }
  const shippingCost = subtotal >= 200 && selectedShipping.id === 'standard' ? 0 : selectedShipping.price;
  const tax = Math.round((subtotal - discount) * 0.08);
  const total = Math.max(0, subtotal - discount + shippingCost + tax);

  // Test card pre-fill helper
  const setTestCard = (type: 'success' | 'decline') => {
    if (type === 'success') {
      setPayment(prev => ({
        ...prev,
        cardNumber: '4242 4242 4242 4242',
        cardExpiry: '08/29',
        cardCvc: '312'
      }));
      setErrorMessage(null);
    } else {
      setPayment(prev => ({
        ...prev,
        cardNumber: '4000 0000 0000 0002',
        cardExpiry: '11/27',
        cardCvc: '999'
      }));
      setErrorMessage('Test decline card loaded. Submit payment to test bank decline simulation.');
    }
  };

  const autofillDemoData = () => {
    setCustomer({
      name: 'Elena Rostova',
      email: 'elena.rostova@techstudio.design',
      phone: '+1 (510) 902-1844',
      address: '88 King Street, Loft 302',
      city: 'San Francisco',
      postalCode: '94107',
      country: 'United States'
    });
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      setProcessingStatus('Connecting to Nexus Secure Payment Gateway...');
      await new Promise(r => setTimeout(r, 600));

      setProcessingStatus('Tokenizing credit credentials & 3D Secure check...');
      await new Promise(r => setTimeout(r, 700));

      setProcessingStatus('Authorizing transaction & locking real-time inventory...');

      const result = await NexusAPI.checkout({
        items: items.map(it => ({
          productId: it.productId,
          quantity: it.quantity,
          color: it.selectedColor
        })),
        customer,
        shippingMethod: {
          ...selectedShipping,
          price: shippingCost
        },
        payment: {
          method: paymentMethod,
          cardNumber: payment.cardNumber,
          cardExpiry: payment.cardExpiry,
          cardCvc: payment.cardCvc,
          cardHolder: payment.cardHolder
        },
        discountCode: promoCode
      });

      if (!result.success || !result.order) {
        throw new Error(result.error || 'Payment authorization failed');
      }

      setProcessingStatus('Order confirmed! Generating confirmation receipt & email...');
      await new Promise(r => setTimeout(r, 500));

      setIsProcessing(false);
      onOrderSuccess(result.order);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Payment processing failed');
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-[#10121a] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header with Steps */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d0f16]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-600/30">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 id="checkout-modal-title" className="font-display text-base font-bold text-white">
                Secure Checkout Gateway
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Nexus 256-Bit Encrypted Protocol · Dummy Payment
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cancel checkout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <button
              onClick={() => step > 1 && setStep(1)}
              className={`flex items-center gap-2 font-medium ${step >= 1 ? 'text-indigo-400' : 'text-slate-500'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>1</span>
              <span>Shipping Address</span>
            </button>

            <span className="text-slate-700">→</span>

            <button
              onClick={() => step > 2 && setStep(2)}
              className={`flex items-center gap-2 font-medium ${step >= 2 ? 'text-indigo-400' : 'text-slate-500'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>2</span>
              <span>Delivery Method</span>
            </button>

            <span className="text-slate-700">→</span>

            <div className={`flex items-center gap-2 font-medium ${step === 3 ? 'text-indigo-400' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>3</span>
              <span>Payment Gateway</span>
            </div>
          </div>

          <div className="hidden sm:block font-mono text-xs text-slate-300">
            Total: <strong className="text-white">${total}</strong>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Step Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Customer Contact & Shipping */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <h3 className="font-display text-base font-semibold text-white">
                  Customer Shipping & Delivery
                </h3>
                <button
                  type="button"
                  onClick={autofillDemoData}
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
                >
                  Autofill Alternate Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Recipient Name"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Email (For Order & Dispatch Confirmation)</label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Street, Suite or Apartment"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    placeholder="City"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={customer.postalCode}
                      onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                      placeholder="94105"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={customer.country}
                      onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>

              {/* Items summary mini badge */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Shipping {items.reduce((s, i) => s + i.quantity, 0)} items to {customer.city || 'your destination'}</span>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Continue to Shipping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Options */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-display text-base font-semibold text-white">
                Select Dispatch & Logistics Speed
              </h3>

              <div className="space-y-3">
                {SHIPPING_OPTIONS.map(opt => {
                  const isFree = subtotal >= 200 && opt.id === 'standard';
                  const displayPrice = isFree ? 'FREE' : `$${opt.price}`;
                  const isSelected = selectedShipping.id === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedShipping(opt)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-950/30 shadow-md shadow-indigo-600/10'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                          isSelected ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-600 bg-slate-800'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{opt.title}</span>
                            <span className="text-xs text-indigo-400 font-mono">({opt.estimatedDays})</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{opt.description}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-white tabular-nums">
                          {displayPrice}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Address</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Dummy Payment Gateway Integration */}
          {step === 3 && (
            <form onSubmit={handleProcessPayment} className="space-y-6">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs text-slate-400 mb-2 font-medium">Select Payment Gateway Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-indigo-500 bg-indigo-950/40 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                    <span className="text-xs font-semibold block">Credit / Debit</span>
                    <span className="text-[10px] text-slate-500">Dummy Gateway</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nexus_pay')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'nexus_pay'
                        ? 'border-indigo-500 bg-indigo-950/40 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                    <span className="text-xs font-semibold block">Nexus 1-Click</span>
                    <span className="text-[10px] text-slate-500">Biometric Token</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-indigo-500 bg-indigo-950/40 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Truck className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <span className="text-xs font-semibold block">Pay on Delivery</span>
                    <span className="text-[10px] text-slate-500">Cash / Card upon receipt</span>
                  </button>
                </div>
              </div>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 p-4 rounded-xl border border-slate-800 bg-slate-900/40">
                  {/* Test Cards Selector Bar */}
                  <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-800 text-slate-400">
                    <span className="font-mono text-cyan-400">Dummy Test Cards:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTestCard('success')}
                        className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 cursor-pointer"
                      >
                        4242... (Pass)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTestCard('decline')}
                        className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900 cursor-pointer"
                      >
                        0002 (Test Decline)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={payment.cardNumber}
                          onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-10 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500 tracking-wider"
                          placeholder="4242 4242 4242 4242"
                        />
                        <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Expiry Date (MM/YY)</label>
                        <input
                          type="text"
                          required
                          value={payment.cardExpiry}
                          onChange={(e) => setPayment({ ...payment, cardExpiry: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                          placeholder="12/28"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">CVC / CVV</label>
                        <input
                          type="text"
                          required
                          value={payment.cardCvc}
                          onChange={(e) => setPayment({ ...payment, cardCvc: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                          placeholder="842"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Cardholder Full Name</label>
                      <input
                        type="text"
                        required
                        value={payment.cardHolder}
                        onChange={(e) => setPayment({ ...payment, cardHolder: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                        placeholder="Name as printed on card"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'nexus_pay' && (
                <div className="p-5 rounded-xl border border-indigo-900/50 bg-indigo-950/20 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-600/30 border border-indigo-500 flex items-center justify-center mx-auto text-indigo-300">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Nexus Express Token Authorization</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      One-click encrypted checkout utilizing pre-authorized device token. No manual entry needed.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400">
                    DEVICE TOKEN: NX-TOK-98240-VERIFIED
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 text-center space-y-2">
                  <Truck className="w-8 h-8 mx-auto text-emerald-400" />
                  <h4 className="text-sm font-semibold text-white">Pay on Delivery (COD)</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Inspect your hardware packaging upon arrival and pay via contact card or cash directly to the courier.
                  </p>
                  <p className="text-[11px] text-amber-400 font-mono">
                    Exact amount due at doorstep: ${total}
                  </p>
                </div>
              )}

              {/* Order Final Summary */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-mono text-slate-200">${subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount Code ({promoCode})</span>
                    <span className="font-mono">-${discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Shipping ({selectedShipping.title})</span>
                  <span className="font-mono text-slate-200">
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sales Tax (8%)</span>
                  <span className="font-mono text-slate-200">${tax}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Authorized</span>
                  <span className="font-mono text-indigo-400 tabular-nums">${total}</span>
                </div>
              </div>

              {/* Action Buttons & Security Guarantee */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={isProcessing}
                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Shipping</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Authorizing...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Authorize & Pay ${total}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Gateway Processing Status Overlay/Pill */}
                {isProcessing && (
                  <div className="p-3 rounded-lg bg-indigo-950/70 border border-indigo-800 text-indigo-200 text-xs flex items-center gap-2 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0 text-cyan-400" />
                    <span className="font-mono">{processingStatus}</span>
                  </div>
                )}

                <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 text-center pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Dummy Sandbox Environment · No Actual Charges Billed</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
