import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, Clock, FileText, CheckCircle2, AlertCircle, DollarSign } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#101010] rounded-2xl hairline-border max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl font-mono text-xs">
        
        {/* Header */}
        <div className="p-6 hairline-b bg-[#141414] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded bg-zinc-900 text-razor-blue hairline-border">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white uppercase tracking-tight">
                Explainability & Financial Audit Log
              </h3>
              <p className="text-[11px] text-zinc-500">
                Transaction: <span className="text-zinc-300 font-semibold">{transaction.id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white hairline-border transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Summary Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded bg-zinc-900 hairline-border">
              <div className="text-[10px] text-zinc-500 uppercase">Amount</div>
              <div className="text-sm font-bold text-white mt-0.5">₹{transaction.amount.toLocaleString('en-IN')}</div>
            </div>
            <div className="p-3 rounded bg-zinc-900 hairline-border">
              <div className="text-[10px] text-zinc-500 uppercase">Customer</div>
              <div className="text-xs font-semibold text-zinc-300 mt-0.5 truncate">{transaction.customer_name}</div>
            </div>
            <div className="p-3 rounded bg-zinc-900 hairline-border">
              <div className="text-[10px] text-zinc-500 uppercase">Decline Code</div>
              <div className="text-xs font-semibold text-rose-400 mt-0.5 truncate">{transaction.failure_code}</div>
            </div>
            <div className="p-3 rounded bg-zinc-900 hairline-border">
              <div className="text-[10px] text-zinc-500 uppercase">Status</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">{transaction.status}</div>
            </div>
          </div>

          {/* Timeline Audit Entries */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Immutable Event Ledger
            </h4>

            {loading ? (
              <div className="py-8 text-center text-zinc-500">Loading audit history...</div>
            ) : trails.length === 0 ? (
              <div className="py-6 text-center text-zinc-500">No audit records generated yet.</div>
            ) : (
              trails.map((entry, idx) => (
                <div
                  key={entry.id || idx}
                  className="p-3.5 rounded-lg bg-[#141414] hairline-border space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 font-bold hairline-border">
                      {entry.event_type}
                    </span>
                    <span className="text-zinc-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-zinc-300 text-xs">
                    {entry.notes || 'Automated agent policy execution.'}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-500">
                    <span>Actor: <span className="text-zinc-400">{entry.actor}</span></span>
                    {entry.amount_recovered > 0 && (
                      <span className="text-emerald-400 font-bold">
                        Salvaged: ₹{entry.amount_recovered.toLocaleString('en-IN')} (ROI: {entry.roi_impact}x)
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 hairline-t bg-[#141414] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-white text-black font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
