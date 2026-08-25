import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, Clock, FileText, CheckCircle2, AlertCircle, DollarSign, Activity } from 'lucide-react';
import { api } from '../services/api';

export default function AuditTrailModal({ transaction, onClose }) {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (transaction?.id) {
      loadAudit(transaction.id);
    }
  }, [transaction]);

  const loadAudit = async (txnId) => {
    setLoading(true);
    try {
      const data = await api.getAuditTrail(txnId);
      setTrails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none">
      <div className="bg-[#070709]/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/[0.08] max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.9)] font-mono text-[11px] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-white/[0.08] bg-[#09090b]/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-white">
              <FileText className="w-4 h-4 text-[#ff4500]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider font-bold">
                Explainability & Financial Audit Log
              </h3>
              <p className="text-[9px] text-zinc-500 font-mono mt-0.5">
                CONDUIT TELEMETRY FOR TXN: <span className="text-[#ff4500] font-bold">{transaction.id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.02] hover:bg-[#ff4500]/15 text-zinc-400 hover:text-[#ff4500] border border-white/[0.08] hover:border-[#ff4500]/30 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Summary Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Amount Due</div>
              <div className="text-sm font-bold text-white mt-1">₹{transaction.amount.toLocaleString('en-IN')}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Customer</div>
              <div className="text-xs font-semibold text-zinc-300 mt-1 truncate font-sans">{transaction.customer_name}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Failure Vector</div>
              <div className="text-xs font-semibold text-rose-400 mt-1 truncate">{transaction.failure_code}</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Node Status</div>
              <div className="text-xs font-bold text-emerald-400 mt-1">{transaction.status}</div>
            </div>
          </div>

          {/* Timeline Audit Entries */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold border-b border-white/[0.04] pb-2">
              Immutable Event Ledger
            </h4>

            {loading ? (
              <div className="py-12 text-center text-zinc-500 font-mono">
                <div className="w-5 h-5 border border-[#ff4500] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Loading ledger stream...
              </div>
            ) : trails.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 uppercase tracking-wider font-bold">No event signatures recorded.</div>
            ) : (
              <div className="space-y-3">
                {trails.map((entry, idx) => (
                  <div
                    key={entry.id || idx}
                    className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.02] hover:border-white/[0.1] transition-all space-y-2 relative"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] text-zinc-300 font-bold border border-white/[0.06]">
                        {entry.event_type}
                      </span>
                      <span className="text-zinc-500 text-[9px]">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-zinc-300 text-xs font-sans leading-relaxed pl-1 pt-1">
                      {entry.notes || 'Automated recovery protocol executed.'}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.02] text-[9px] text-zinc-500">
                      <span>ACTOR_ID: <span className="text-zinc-400 font-bold">{entry.actor.toUpperCase()}</span></span>
                      {entry.amount_recovered > 0 && (
                        <span className="text-emerald-400 font-bold">
                          Attributed Value: +₹{entry.amount_recovered.toLocaleString('en-IN')} (ROI: {entry.roi_impact}x)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/[0.08] bg-[#09090b]/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer text-xs"
          >
            Close Telemetry
          </button>
        </div>

      </div>
    </div>
  );
}
