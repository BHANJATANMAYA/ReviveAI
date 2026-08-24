import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, QrCode, CreditCard, Smartphone, ArrowRight, Sparkles, AlertTriangle, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export default function CustomerPortal({
  selectedLinkId,
  onPaymentSuccess
}) {
  const [linkData, setLinkData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [method, setMethod] = useState('upi');
  const [vpa, setVpa] = useState('customer@oksbi');
  const [cardLast4, setCardLast4] = useState('4321');
  const [paying, setPaying] = useState(false);
  const [paidResult, setPaidResult] = useState(null);

  useEffect(() => {
    if (selectedLinkId) {
      loadLink(selectedLinkId);
    }
  }, [selectedLinkId]);

  const loadLink = async (linkId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCustomerLink(linkId);
      setLinkData(data);
      if (data.status === 'RECOVERED') {
        setPaidResult({
          status: 'RECOVERED',
          amount_paid: data.final_amount
        });
      }
    } catch (err) {
      setError(err.message || 'Payment link not found or expired');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!linkData) return;
    setPaying(true);
    try {
      const res = await api.payCustomerLink({
        payment_link_id: linkData.payment_link_id,
        chosen_method: method,
        vpa: vpa,
        card_last4: cardLast4
      });
      setPaidResult(res);
      
      // Trigger Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onPaymentSuccess) {
        onPaymentSuccess(linkData.transaction_id);
      }
    } catch (err) {
      alert(`Payment failed: ${err.message}`);
    } finally {
      setPaying(false);
    }
  };

  if (!selectedLinkId) {
    return (
      <div className="bg-[#0b0b0b] rounded-xl hairline-border p-12 text-center max-w-2xl mx-auto space-y-4">
        <Smartphone className="w-12 h-12 text-zinc-600 mx-auto" />
        <h3 className="font-display font-bold text-lg text-white uppercase">
          Customer Payment Simulator
        </h3>
        <p className="text-xs text-zinc-400 font-mono leading-relaxed">
          Select any transaction with a generated payment link from the <span className="text-white font-semibold">Command Center</span> or <span className="text-white font-semibold">Agent Studio</span> to test the closed-loop recovery checkout flow.
        </p>
      </div>
    );
  }

  if (loading || !linkData) {
    return (
      <div className="bg-[#0b0b0b] rounded-xl hairline-border p-12 text-center max-w-xl mx-auto space-y-3">
        <div className="w-6 h-6 border-2 border-razor-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-zinc-400 font-mono">Loading Razorpay Secure Checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0b0b0b] rounded-xl hairline-border p-8 text-center max-w-xl mx-auto space-y-3 text-rose-400">
        <AlertTriangle className="w-8 h-8 mx-auto" />
        <p className="text-xs font-mono">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-[#101010] rounded-2xl hairline-border shadow-2xl overflow-hidden font-sans">
      
      {/* Brand Header */}
      <div className="bg-[#0a0a0a] px-6 py-4 flex items-center justify-between hairline-b">
        <div className="flex items-center space-x-3">
          <div className="font-display font-black text-lg tracking-tight text-white">
            reviveai<span className="text-[#ff4500]">.</span>
          </div>
          <span className="text-zinc-600">/</span>
          <span className="text-xs font-mono text-zinc-400">
            Powered by <span className="text-white font-semibold">Razorpay</span>
          </span>
        </div>
        <div className="flex items-center space-x-1 text-[11px] font-mono text-zinc-400">
          <Lock className="w-3 h-3 text-[#ff4500]" />
          <span>256-Bit SSL Secured</span>
        </div>
      </div>

      {paidResult ? (
        /* Success State */
        <div className="p-8 text-center space-y-5 bg-[#0e0e0e]">
          <div className="w-16 h-16 bg-emerald-950 border border-emerald-700 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
              PAYMENT RECOVERED
            </span>
            <h2 className="font-display font-bold text-2xl text-white mt-3">
              ₹{(paidResult.amount_paid || linkData.final_amount).toLocaleString('en-IN')} Received
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Order #{linkData.order_id || linkData.transaction_id}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-zinc-900 hairline-border text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between text-zinc-400">
              <span>Customer:</span>
              <span className="text-white">{linkData.customer_name}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Payment ID:</span>
              <span className="text-razor-blue">{paidResult.payment_id || 'pay_simulated_success'}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Settlement Vector:</span>
              <span className="text-emerald-400">Closed-Loop AI Recovery</span>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 font-mono">
            Dashboard metrics and audit ledger updated in real time.
          </p>
        </div>
      ) : (
        /* Active Checkout Form */
        <div className="p-6 space-y-6">
          
          {/* Amount Card with VIP Concession */}
          <div className="p-4 rounded-xl bg-[#141414] hairline-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">Amount Due:</span>
              {linkData.discount_applied_pct > 0 && (
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">
                  {linkData.discount_applied_pct}% VIP RETENTION DISCOUNT APPLIED
                </span>
              )}
            </div>

            <div className="flex items-baseline space-x-3">
              <span className="font-display font-black text-3xl text-white">
                ₹{linkData.final_amount.toLocaleString('en-IN')}
              </span>
              {linkData.discount_applied_pct > 0 && (
                <span className="text-sm font-mono text-zinc-500 line-through">
                  ₹{linkData.original_amount.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="text-[11px] font-mono text-zinc-500 pt-1 hairline-t">
              Re-initiating payment for <span className="text-zinc-300">{linkData.customer_name}</span> ({linkData.customer_phone})
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Select Preferred Payment Method
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'upi', label: 'UPI / QR', icon: QrCode },
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'netbanking', label: 'NetBanking', icon: Smartphone }
              ].map(m => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`p-3 rounded-lg flex flex-col items-center space-y-1.5 font-mono text-xs transition-all ${
                      method === m.id
                        ? 'bg-zinc-800 text-razor-blue border border-razor-blue'
                        : 'bg-zinc-900/60 text-zinc-400 hairline-border hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Method Inputs */}
            {method === 'upi' && (
              <div className="p-3 rounded-lg bg-zinc-900 hairline-border space-y-2 text-xs font-mono">
                <label className="text-zinc-400 block">UPI Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  value={vpa}
                  onChange={(e) => setVpa(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black text-white hairline-border focus:outline-none focus:border-razor-blue"
                  placeholder="e.g. mobile@upi"
                />
                <div className="flex gap-2 pt-1 text-[10px] text-zinc-400">
                  <span className="px-2 py-0.5 bg-zinc-800 rounded">GPay</span>
                  <span className="px-2 py-0.5 bg-zinc-800 rounded">PhonePe</span>
                  <span className="px-2 py-0.5 bg-zinc-800 rounded">Paytm</span>
                  <span className="px-2 py-0.5 bg-zinc-800 rounded">CRED</span>
                </div>
              </div>
            )}

            {method === 'card' && (
              <div className="p-3 rounded-lg bg-zinc-900 hairline-border space-y-2 text-xs font-mono">
                <label className="text-zinc-400 block">Card Number (Simulated Test Mode)</label>
                <input
                  type="text"
                  disabled
                  value="4111 •••• •••• 4321"
                  className="w-full px-3 py-2 rounded bg-black text-zinc-300 hairline-border"
                />
                <div className="grid grid-cols-2 gap-2 text-zinc-400 text-[11px]">
                  <div>Exp: 12/28</div>
                  <div>CVV: •••</div>
                </div>
              </div>
            )}

            {method === 'netbanking' && (
              <div className="p-3 rounded-lg bg-zinc-900 hairline-border text-xs font-mono text-zinc-400">
                <span>Selected Bank: </span>
                <span className="text-white font-semibold">{linkData.bank_name || 'HDFC Bank'}</span>
              </div>
            )}
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full py-3.5 rounded-xl bg-razor-blue hover:bg-[#20c7f7] text-black font-mono font-bold text-sm tracking-wide uppercase transition-all shadow-lg shadow-razor-blue/20 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {paying ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>COMPLETE PAYMENT (₹{linkData.final_amount.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-[10px] font-mono text-zinc-600">
            Simulated Razorpay webhook trigger • ReviveAI Autonomous Revenue Recovery Loop
          </p>

        </div>
      )}

    </div>
  );
}
