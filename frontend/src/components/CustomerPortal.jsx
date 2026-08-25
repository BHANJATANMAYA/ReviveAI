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
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 }
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
      <div className="bg-[#070709]/60 backdrop-blur-xl rounded-[2rem] border border-white/[0.08] p-16 text-center max-w-2xl mx-auto space-y-6 shadow-2xl">
        <div className="w-14 h-14 rounded-3xl bg-zinc-900 border border-white/[0.06] flex items-center justify-center mx-auto text-zinc-500">
          <Smartphone className="w-6 h-6" />
        </div>
        <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight font-bold">
          Customer Payment Simulator
        </h3>
        <p className="text-xs text-zinc-400 font-mono leading-relaxed max-w-md mx-auto">
          Please select a failed transaction containing a generated checkout link in the <span className="text-white font-semibold">Dashboard</span> to load the customer checkout portal.
        </p>
      </div>
    );
  }

  if (loading || !linkData) {
    return (
      <div className="bg-[#070709]/60 backdrop-blur-xl rounded-[2rem] border border-white/[0.08] p-16 text-center max-w-xl mx-auto space-y-4 shadow-2xl">
        <div className="w-7 h-7 border-2 border-[#ff4500] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-zinc-400 font-mono">Loading secure payment portal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#070709]/60 backdrop-blur-xl rounded-[2rem] border border-white/[0.08] p-12 text-center max-w-xl mx-auto space-y-4 text-rose-400 shadow-2xl">
        <AlertTriangle className="w-10 h-10 mx-auto" />
        <p className="text-xs font-mono">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-[#070709]/75 backdrop-blur-xl rounded-[2.5rem] border border-white/[0.08] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden font-sans">
      
      {/* Brand Header */}
      <div className="bg-[#09090b]/80 px-8 py-5 flex items-center justify-between border-b border-white/[0.08]">
        <div className="flex items-center space-x-3">
          <div className="font-display font-black text-xl tracking-tight text-white">
            reviveai<span className="text-[#ff4500]">.</span>
          </div>
          <span className="text-zinc-700 font-mono text-xs">/</span>
          <span className="text-[10px] font-mono text-zinc-400">
            Powered by <span className="text-white font-semibold">Razorpay API</span>
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-[9px] font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.06] rounded-full px-3 py-1">
          <Lock className="w-3 h-3 text-[#ff4500]" />
          <span>256-BIT SECURE</span>
        </div>
      </div>

      {paidResult ? (
        /* Success State */
        <div className="p-10 text-center space-y-6 bg-[#070709]/30">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 glow-emerald">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase tracking-wider">
              PAYMENT RECOVERED
            </span>
            <h2 className="font-display font-bold text-3xl text-white pt-2">
              ₹{(paidResult.amount_paid || linkData.final_amount).toLocaleString('en-IN')} Received
            </h2>
            <p className="text-xs text-zinc-500 font-mono">
              Order Ref: #{linkData.order_id || linkData.transaction_id}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-left space-y-2.5 text-xs font-mono">
            <div className="flex justify-between text-zinc-400">
              <span>Customer Name:</span>
              <span className="text-white font-semibold">{linkData.customer_name}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Razorpay Payment ID:</span>
              <span className="text-emerald-400 font-bold">{paidResult.payment_id || 'pay_simulated_success'}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Settlement Conduit:</span>
              <span className="text-emerald-400">Autonomous Retrial</span>
            </div>
          </div>

          <p className="text-[10px] text-zinc-500 font-mono">
            Dashboard ledger metrics and ML attribution graphs have updated in real time.
          </p>
        </div>
      ) : (
        /* Active Checkout Form */
        <div className="p-8 space-y-8">
          
          {/* Amount Card with VIP Concession */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-3 relative overflow-hidden">
            <div className="absolute top-[-30%] right-[-10%] w-40 h-40 bg-[#ff4500]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">Amount Due:</span>
              {linkData.discount_applied_pct > 0 && (
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold">
                  {linkData.discount_applied_pct}% Retention Discount Applied
                </span>
              )}
            </div>

            <div className="flex items-baseline space-x-3">
              <span className="font-display font-black text-4xl text-white">
                ₹{linkData.final_amount.toLocaleString('en-IN')}
              </span>
              {linkData.discount_applied_pct > 0 && (
                <span className="text-sm font-mono text-zinc-500 line-through">
                  ₹{linkData.original_amount.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="text-[11px] font-mono text-zinc-500 pt-2 border-t border-white/[0.04] leading-relaxed">
              Completing secure checkout for <span className="text-zinc-200 font-semibold">{linkData.customer_name}</span> ({linkData.customer_phone})
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
              Select Preferred Payment rail
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'upi', label: 'UPI / QR', icon: QrCode },
                { id: 'card', label: 'Card Payment', icon: CreditCard },
                { id: 'netbanking', label: 'NetBanking', icon: Smartphone }
              ].map(m => {
                const Icon = m.icon;
                const active = method === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`p-4 rounded-2xl flex flex-col items-center space-y-2 font-mono text-xs transition-all cursor-pointer ${
                      active
                        ? 'bg-white/[0.06] text-white border border-[#ff4500] shadow-[0_0_15px_rgba(255,69,0,0.15)] font-bold'
                        : 'bg-white/[0.02] text-zinc-400 border border-white/[0.06] hover:text-white hover:border-white/[0.12]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-[#ff4500]' : ''}`} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Method Inputs */}
            {method === 'upi' && (
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-4 text-xs font-mono relative overflow-hidden group">
                <div className="flex justify-between items-center">
                  <label className="text-zinc-400">UPI ID / Address (VPA)</label>
                  <span className="text-[9px] text-[#ff4500] font-bold">RZP INSTANT UPI</span>
                </div>
                <input
                  type="text"
                  value={vpa}
                  onChange={(e) => setVpa(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 text-white border border-white/[0.08] focus:outline-none focus:border-[#ff4500]/60 transition-colors"
                  placeholder="e.g. customer@okaxis"
                />
                
                {/* Simulated QR Scan Area */}
                <div className="flex flex-col items-center space-y-3 pt-3 border-t border-white/[0.04]">
                  <p className="text-[10px] text-zinc-500 uppercase">Or Scan recovery QR</p>
                  <div className="p-3 bg-white rounded-2xl relative overflow-hidden w-28 h-28 flex items-center justify-center">
                    {/* QR graphic placeholder */}
                    <div className="w-full h-full border border-black border-dashed flex flex-wrap p-1 opacity-80">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className={`w-8 h-8 border border-black m-0.5 ${(i===0||i===2||i===6||i===8) ? 'bg-black' : ''}`}></div>
                      ))}
                    </div>
                    {/* Laser scanner effect */}
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500 shadow-[0_0_8px_#10b981] animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}

            {method === 'card' && (
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-4 text-xs font-mono">
                
                {/* Simulated Credit Card Graphic */}
                <div className="relative w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-950 border border-white/10 p-6 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.6)] group select-none overflow-hidden glow-orange">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#ff4500]/5 to-transparent pointer-events-none" />
                  
                  <div className="flex justify-between items-start">
                    <span className="text-zinc-500 font-mono text-[9px]">SECURE SIMULATED CARD</span>
                    <div className="w-10 h-7 rounded bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                      <div className="w-6 h-4 border border-amber-500/40 rounded-sm"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="font-mono text-lg sm:text-xl text-white tracking-widest">
                      4111 4208 9011 {cardLast4}
                    </div>
                    
                    <div className="flex justify-between font-mono text-[9px] text-zinc-400">
                      <div>
                        <span className="text-[7px] text-zinc-600 block uppercase">CARDHOLDER</span>
                        <span className="text-zinc-200 font-semibold">{linkData.customer_name.toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="text-[7px] text-zinc-600 block uppercase">VALID THRU</span>
                        <span className="text-zinc-200 font-semibold">12/28</span>
                      </div>
                      <div>
                        <span className="text-[7px] text-zinc-600 block uppercase">NETWORK</span>
                        <span className="text-[#ff4500] font-bold">VISA</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-zinc-400 block">Edit Simulated Last 4</label>
                  <input
                    type="text"
                    maxLength="4"
                    value={cardLast4}
                    onChange={(e) => setCardLast4(e.target.value.replace(/\D/g,''))}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 text-white border border-white/[0.08] focus:outline-none focus:border-[#ff4500]/60 text-center font-bold tracking-widest transition-colors"
                    placeholder="e.g. 4321"
                  />
                </div>
              </div>
            )}

            {method === 'netbanking' && (
              <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-zinc-400 space-y-2">
                <div>Preferred Bank Routing rails:</div>
                <div className="flex items-center space-x-2 text-white font-semibold bg-white/[0.04] p-3 rounded-xl border border-white/[0.06]">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span>{linkData.bank_name || 'HDFC Bank'} Secure Conduit</span>
                </div>
              </div>
            )}
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full py-4 rounded-full bg-[#ff4500] hover:bg-[#ff571a] text-black font-mono font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#ff4500]/15 flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-[0.98] cursor-pointer"
          >
            {paying ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <ShieldCheck className="w-4.5 h-4.5 text-black" />
                <span>COMPLETE SECURE CHECKOUT (₹{linkData.final_amount.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            Simulated checkout node • webhook integration live
          </p>

        </div>
      )}

    </div>
  );
}
