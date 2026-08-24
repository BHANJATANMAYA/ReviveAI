import React, { useState } from 'react';
import { Play, ExternalLink, ShieldAlert, CheckCircle2, Clock, AlertTriangle, ArrowRight, Eye } from 'lucide-react';

export default function TransactionTable({
  transactions = [],
  onRecoverSingle,
  onOpenPortal,
  onOpenAudit,
  isRecoveringId
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filtered = transactions.filter(t => {
    if (selectedStatus !== 'ALL' && t.status !== selectedStatus) return false;
    if (selectedCategory !== 'ALL' && t.failure_category !== selectedCategory) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.customer_name.toLowerCase().includes(q) ||
        t.failure_code.toLowerCase().includes(q) ||
        (t.bank_name && t.bank_name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RECOVERED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            <span>SALVAGED</span>
          </span>
        );
      case 'IN_INTERVENTION':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-blue-950/80 text-razor-blue border border-blue-800">
            <Clock className="w-3 h-3 animate-pulse" />
            <span>IN RECOVERY</span>
          </span>
        );
      case 'ANALYZED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-purple-950/80 text-purple-300 border border-purple-800">
            <span>DIAGNOSED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-rose-950/80 text-rose-400 border border-rose-800">
            <AlertTriangle className="w-3 h-3" />
            <span>FAILED</span>
          </span>
        );
    }
  };

  const getProbabilityBar = (prob) => {
    const pct = Math.round((prob || 0) * 100);
    const color = pct >= 75 ? 'bg-emerald-400' : pct >= 50 ? 'bg-amber-400' : 'bg-rose-400';
    return (
      <div className="flex items-center space-x-2">
        <div className="w-16 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${pct}%` }}></div>
        </div>
        <span className="font-mono text-xs text-zinc-300">{pct}%</span>
      </div>
    );
  };

  return (
    <div className="bg-[#0b0b0b] rounded-xl hairline-border overflow-hidden">
      
      {/* Header & Controls */}
      <div className="p-6 hairline-b bg-[#101010] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="editorial-bracket">(01)</span>
            <h2 className="font-display font-bold text-lg tracking-tight text-white uppercase">
              Failed Transactions Stream
            </h2>
          </div>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Showing {filtered.length} of {transactions.length} total transaction events
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search txn, customer, bank..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 text-xs bg-zinc-900 hairline-border rounded-md text-white placeholder-zinc-500 focus:outline-none focus:border-razor-blue font-mono"
          />

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-zinc-900 hairline-border rounded-md text-zinc-300 focus:outline-none focus:border-razor-blue font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="FAILED">Failed</option>
            <option value="IN_INTERVENTION">In Recovery</option>
            <option value="RECOVERED">Recovered</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs bg-zinc-900 hairline-border rounded-md text-zinc-300 focus:outline-none focus:border-razor-blue font-mono"
          >
            <option value="ALL">All Decline Types</option>
            <option value="TECHNICAL">Technical / Timeout</option>
            <option value="INSUFFICIENT_FUNDS">Insufficient Funds</option>
            <option value="USER_DROP">User Drop-off</option>
            <option value="AUTHENTICATION">3DS Auth Fail</option>
            <option value="BANK_DOWNTIME">Bank Downtime</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#0e0e0e] text-zinc-500 uppercase text-[10px] tracking-wider hairline-b">
            <tr>
              <th className="px-6 py-3.5">Transaction & Customer</th>
              <th className="px-6 py-3.5">Amount (₹)</th>
              <th className="px-6 py-3.5">Decline Vector & Bank</th>
              <th className="px-6 py-3.5">Recovery Score</th>
              <th className="px-6 py-3.5">Strategy / Channel</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-zinc-500">
                  No matching transactions found.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-900/40 transition-colors group">
                  
                  {/* Transaction ID & Customer */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{t.id}</div>
                    <div className="text-zinc-400 font-sans text-xs mt-0.5">{t.customer_name}</div>
                    <div className="text-zinc-600 text-[10px]">
                      LTV: ₹{(t.customer_ltv || 0).toLocaleString('en-IN')} • {t.customer_tier}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white">
                      ₹{t.amount.toLocaleString('en-IN')}
                    </div>
                    {t.discount_applied_pct > 0 && (
                      <span className="text-[10px] text-emerald-400">
                        {t.discount_applied_pct}% VIP Applied (₹{t.final_amount?.toLocaleString('en-IN')})
                      </span>
                    )}
                    <div className="text-[10px] text-zinc-500 uppercase">{t.payment_method}</div>
                  </td>

                  {/* Failure Code & Bank */}
                  <td className="px-6 py-4 max-w-xs">
                    <div className="text-zinc-300 font-medium truncate" title={t.failure_code}>
                      {t.failure_code}
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate" title={t.failure_reason}>
                      {t.bank_name ? `${t.bank_name} • ` : ''}{t.failure_reason}
                    </div>
                  </td>

                  {/* Recovery Probability */}
                  <td className="px-6 py-4">
                    {getProbabilityBar(t.recovery_probability)}
                    <div className="text-[10px] text-zinc-500 mt-1 uppercase">
                      Urgency: <span className={t.recovery_tier === 'HIGH' ? 'text-rose-400' : 'text-zinc-400'}>{t.recovery_tier}</span>
                    </div>
                  </td>

                  {/* Strategy Vector / Channel */}
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-zinc-900 text-zinc-300 text-[11px] hairline-border inline-block">
                      {t.recommended_vector || 'AUTO_RETRY'}
                    </span>
                    {t.payment_link_id && (
                      <div className="mt-1 text-[10px] text-razor-blue flex items-center space-x-1">
                        <span>{t.payment_link_id}</span>
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {getStatusBadge(t.status)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right space-x-2">
                    
                    {/* Trigger Recovery Button (if not yet recovered) */}
                    {t.status !== 'RECOVERED' && (
                      <button
                        onClick={() => onRecoverSingle(t.id)}
                        disabled={isRecoveringId === t.id}
                        className="px-2.5 py-1 rounded bg-white hover:bg-zinc-200 text-black text-[11px] font-bold tracking-wider uppercase transition-colors inline-flex items-center space-x-1 disabled:opacity-50"
                        title="Execute Agent Recovery Loop"
                      >
                        <Play className="w-2.5 h-2.5 fill-black" />
                        <span>{isRecoveringId === t.id ? '...' : 'RECOVER'}</span>
                      </button>
                    )}

                    {/* Open Customer Payment Link Simulator */}
                    {t.payment_link_id && (
                      <button
                        onClick={() => onOpenPortal(t.payment_link_id)}
                        className="p-1.5 rounded bg-razor-darkblue text-razor-blue hover:bg-blue-900/60 hairline-border transition-colors inline-flex"
                        title="Simulate Customer Checkout Portal"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Open Audit Details */}
                    <button
                      onClick={() => onOpenAudit(t)}
                      className="p-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white hairline-border transition-colors inline-flex"
                      title="Inspect Explainability & Audit Log"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
