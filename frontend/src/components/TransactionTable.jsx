import React, { useState } from 'react';
import { Play, ExternalLink, CheckCircle2, Clock, AlertTriangle, ArrowRight, Eye, Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Zap, ShieldCheck, Sparkles } from 'lucide-react';

export default function TransactionTable({
  transactions = [],
  onRecoverSingle,
  onOpenPortal,
  onOpenAudit,
  isRecoveringId,
  isCompact = false,
  onViewAll
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [expandedTxnId, setExpandedTxnId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isCompact ? 5 : 8;

  // Filter logic
  const filtered = transactions.filter(t => {
    if (selectedFilter === 'RECOVERED' && t.status !== 'RECOVERED') return false;
    if (selectedFilter === 'IN_RECOVERY' && t.status !== 'IN_INTERVENTION') return false;
    if (selectedFilter === 'FAILED' && t.status !== 'FAILED') return false;
    if (selectedFilter === 'HIGH_URGENCY' && t.recovery_tier !== 'HIGH') return false;
    if (selectedFilter === 'TECHNICAL' && t.failure_category !== 'TECHNICAL') return false;
    if (selectedFilter === 'AUTHENTICATION' && t.failure_category !== 'AUTHENTICATION') return false;

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

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleExpand = (id) => {
    setExpandedTxnId(expandedTxnId === id ? null : id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RECOVERED':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>SALVAGED</span>
          </span>
        );
      case 'IN_INTERVENTION':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#ff4500]/10 text-[#ff4500] border border-[#ff4500]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4500] animate-ping"></span>
            <span>IN RECOVERY</span>
          </span>
        );
      case 'ANALYZED':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            <span>DIAGNOSED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
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
        <div className="w-14 bg-white/[0.08] rounded-full h-1.5 overflow-hidden">
          <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }}></div>
        </div>
        <span className="font-mono text-xs text-zinc-300 font-semibold">{pct}%</span>
      </div>
    );
  };

  return (
    <div className="bg-[#090909] rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl transition-all">
      
      {/* Header & Controls */}
      <div className="p-5 sm:p-6 border-b border-white/[0.08] bg-[#0c0c0c] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="editorial-bracket">(01)</span>
            <h2 className="font-display font-bold text-base sm:text-lg tracking-tight text-white uppercase">
              {isCompact ? 'Live Interception Stream' : 'Financial Transactions & Recovery Ledger'}
            </h2>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>REAL-TIME</span>
            </span>
          </div>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            {filtered.length} matching events • Automated Razorpay decline telemetry
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search txn, customer, bank..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1.5 text-xs bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] focus:border-[#ff4500]/50 rounded-lg text-white placeholder-zinc-600 focus:outline-none font-mono transition-colors w-52 sm:w-60"
            />
          </div>

          {isCompact && onViewAll && (
            <button
              onClick={onViewAll}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08] text-xs font-mono font-medium transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Full Ledger ({transactions.length})</span>
              <ArrowRight className="w-3 h-3 text-[#ff4500]" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Bar (Linear / Stripe Style) */}
      <div className="px-5 sm:px-6 py-2.5 bg-[#080808] border-b border-white/[0.06] flex items-center space-x-2 overflow-x-auto text-[11px] font-mono select-none">
        {[
          { id: 'ALL', label: `ALL (${transactions.length})` },
          { id: 'RECOVERED', label: 'SALVAGED' },
          { id: 'IN_RECOVERY', label: 'IN RECOVERY' },
          { id: 'FAILED', label: 'FAILED' },
          { id: 'HIGH_URGENCY', label: 'HIGH URGENCY' },
          { id: 'TECHNICAL', label: 'TIMEOUTS' },
          { id: 'AUTHENTICATION', label: '3DS AUTH' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setSelectedFilter(f.id);
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap cursor-pointer ${
              selectedFilter === f.id
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#0b0b0b] text-zinc-500 uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
            <tr>
              <th className="px-6 py-3 font-semibold">Transaction & Customer</th>
              <th className="px-6 py-3 font-semibold">Amount (₹)</th>
              <th className="px-6 py-3 font-semibold">Decline Vector & Bank</th>
              <th className="px-6 py-3 font-semibold">Recovery Likelihood</th>
              <th className="px-6 py-3 font-semibold">Channel Vector</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-14 text-center text-zinc-500">
                  <p>No matching transactions found.</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((t) => {
                const isExpanded = expandedTxnId === t.id;
                return (
                  <React.Fragment key={t.id}>
                    <tr
                      onClick={() => toggleExpand(t.id)}
                      className={`hover:bg-white/[0.02] transition-colors group cursor-pointer ${
                        isExpanded ? 'bg-white/[0.02]' : ''
                      }`}
                    >
                      {/* Transaction ID & Customer */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white font-mono">{t.id}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.05] text-zinc-400 border border-white/[0.08]">
                            {t.customer_tier || 'STANDARD'}
                          </span>
                        </div>
                        <div className="text-zinc-300 font-sans text-xs mt-0.5 font-medium">
                          {t.customer_name}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <div className="text-sm font-bold text-white">
                          ₹{t.amount.toLocaleString('en-IN')}
                        </div>
                        {t.discount_applied_pct > 0 ? (
                          <span className="text-[10px] text-emerald-400 font-mono">
                            {t.discount_applied_pct}% VIP applied (₹{t.final_amount?.toLocaleString('en-IN')})
                          </span>
                        ) : (
                          <div className="text-[10px] text-zinc-500 uppercase">{t.payment_method}</div>
                        )}
                      </td>

                      {/* Failure Code & Bank */}
                      <td className="px-6 py-3.5 max-w-xs">
                        <div className="text-zinc-200 font-medium truncate" title={t.failure_code}>
                          {t.failure_code}
                        </div>
                        <div className="text-[11px] text-zinc-500 truncate" title={t.failure_reason}>
                          {t.bank_name ? `${t.bank_name} • ` : ''}{t.failure_reason}
                        </div>
                      </td>

                      {/* Recovery Probability */}
                      <td className="px-6 py-3.5">
                        {getProbabilityBar(t.recovery_probability)}
                        <div className="text-[10px] text-zinc-500 mt-1 font-mono uppercase">
                          Tier: <span className={t.recovery_tier === 'HIGH' ? 'text-[#ff4500] font-bold' : 'text-zinc-400'}>{t.recovery_tier}</span>
                        </div>
                      </td>

                      {/* Strategy Vector / Channel */}
                      <td className="px-6 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-white/[0.04] text-zinc-300 text-[11px] border border-white/[0.08] inline-block font-mono">
                          {t.recommended_vector || 'AUTO_RETRY'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        {getStatusBadge(t.status)}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-6 py-3.5 text-right space-x-2 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Trigger Recovery Button */}
                        {t.status !== 'RECOVERED' && (
                          <button
                            onClick={() => onRecoverSingle(t.id)}
                            disabled={isRecoveringId === t.id}
                            className="px-3 py-1 rounded-lg bg-white hover:bg-zinc-200 text-black text-[11px] font-mono font-bold uppercase tracking-wider transition-all inline-flex items-center space-x-1 disabled:opacity-50 active:scale-95 cursor-pointer shadow-sm"
                            title="Execute Autonomous Recovery Agent"
                          >
                            <Play className="w-2.5 h-2.5 fill-black" />
                            <span>{isRecoveringId === t.id ? '...' : 'RECOVER'}</span>
                          </button>
                        )}

                        {/* Open Customer Payment Link Simulator */}
                        {t.payment_link_id && (
                          <button
                            onClick={() => onOpenPortal(t.payment_link_id)}
                            className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-[#ff4500]/10 text-white hover:text-[#ff4500] border border-white/[0.1] hover:border-[#ff4500]/30 transition-all inline-flex cursor-pointer"
                            title="Simulate Customer Recovery Checkout Portal"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Open Audit Details */}
                        <button
                          onClick={() => onOpenAudit(t)}
                          className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.08] transition-all inline-flex cursor-pointer"
                          title="Inspect Explainability & Audit Log"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => toggleExpand(t.id)}
                          className="p-1.5 text-zinc-500 hover:text-white transition-colors inline-flex cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>

                    {/* Inline Diagnostic Drawer */}
                    {isExpanded && (
                      <tr className="bg-[#070709]/30 border-y border-white/[0.06] animate-in fade-in duration-200">
                        <td colSpan="7" className="px-6 py-6">
                          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4 p-4 rounded-3xl bg-[#09090b]/80 border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                            
                            {/* Step 1: INGEST */}
                            <div className="flex-1 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-3 relative group hover:border-[#ff4500]/25 transition-all">
                              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                                <span>STAGE 01 // INGESTION</span>
                                <span className="text-zinc-600 font-bold">100% OK</span>
                              </div>
                              <div className="space-y-1.5">
                                <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Customer Target</span>
                                <div className="font-semibold text-white text-xs font-sans">{t.customer_name}</div>
                                <div className="text-zinc-500 text-[11px] font-mono">{t.customer_phone || '+91 98000 12345'}</div>
                                <div className="text-emerald-400 font-bold text-xs font-mono">LTV: ₹{(t.customer_ltv || 0).toLocaleString('en-IN')}</div>
                              </div>
                            </div>

                            {/* Connection Arrow */}
                            <div className="hidden lg:flex items-center text-zinc-700 font-mono text-sm self-center select-none">→</div>

                            {/* Step 2: DIAGNOSE */}
                            <div className="flex-1 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-3 relative group hover:border-rose-500/25 transition-all">
                              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                                <span>STAGE 02 // DIAGNOSTICS</span>
                                <span className="text-rose-400 font-bold">DECLINE MATCHED</span>
                              </div>
                              <div className="space-y-1.5">
                                <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Failure Vector</span>
                                <div className="text-rose-400 font-bold text-xs truncate max-w-[200px]" title={t.failure_code}>{t.failure_code}</div>
                                <p className="text-zinc-400 text-[11px] leading-relaxed font-sans mt-1">{t.failure_reason}</p>
                              </div>
                            </div>

                            {/* Connection Arrow */}
                            <div className="hidden lg:flex items-center text-zinc-700 font-mono text-sm self-center select-none">→</div>

                            {/* Step 3: GUARDRAIL */}
                            <div className="flex-1 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-3 relative group hover:border-emerald-500/25 transition-all">
                              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                                <span>STAGE 03 // POLICY CHECK</span>
                                <span className="text-emerald-400 font-bold">PASSED</span>
                              </div>
                              <div className="space-y-2 text-[10px] font-mono pt-2">
                                <div className="flex items-center space-x-1.5 text-zinc-400">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span>Frequency Cap check OK</span>
                                </div>
                                <div className="flex items-center space-x-1.5 text-zinc-400">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span>Margin limit check OK</span>
                                </div>
                                <div className="flex items-center space-x-1.5 text-zinc-500">
                                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                                  <span>Retry budget (Checks OK)</span>
                                </div>
                              </div>
                            </div>

                            {/* Connection Arrow */}
                            <div className="hidden lg:flex items-center text-zinc-700 font-mono text-sm self-center select-none">→</div>

                            {/* Step 4: RESOLVE */}
                            <div className="flex-1 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-3 relative group hover:border-[#ff4500]/25 transition-all flex flex-col justify-between">
                              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                                <span>STAGE 04 // RESOLUTION</span>
                                <span className="text-[#ff4500] font-bold">READY</span>
                              </div>
                              <div className="space-y-1.5">
                                <span className="text-zinc-500 text-[9px] uppercase tracking-wider block">Recommended Strategy</span>
                                <div className="text-white font-bold text-xs bg-white/[0.04] px-2.5 py-1 rounded border border-white/[0.06] inline-block">{t.recommended_vector}</div>
                              </div>
                              <div className="flex gap-2 pt-2">
                                {t.status !== 'RECOVERED' && (
                                  <button
                                    onClick={() => onRecoverSingle(t.id)}
                                    disabled={isRecoveringId === t.id}
                                    className="flex-1 py-2 rounded-xl bg-[#ff4500] hover:bg-[#ff571a] text-black font-mono font-bold text-[10px] uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer text-center"
                                  >
                                    {isRecoveringId === t.id ? '...' : 'RECOVER'}
                                  </button>
                                )}
                                {t.payment_link_id && (
                                  <button
                                    onClick={() => onOpenPortal(t.payment_link_id)}
                                    className="flex-1 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-mono font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center"
                                  >
                                    Open Link →
                                  </button>
                                )}
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-white/[0.06] bg-[#0c0c0c] flex items-center justify-between font-mono text-xs text-zinc-400">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} events
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-white/[0.08] hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-white"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-zinc-300 font-semibold px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-white/[0.08] hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-white"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
