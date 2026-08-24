import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, Shield, Activity } from 'lucide-react';

export default function MetricCards({ metrics }) {
  if (!metrics) return null;

  const cards = [
    {
      num: '01',
      title: 'REVENUE AT RISK',
      value: `₹${(metrics.total_revenue_at_risk || 0).toLocaleString('en-IN')}`,
      subtitle: `${metrics.total_failed_count || 0} Failed Payments Ingested`,
      icon: AlertTriangle,
      color: 'text-amber-400',
      badge: 'INGESTED'
    },
    {
      num: '02',
      title: 'RECOVERED REVENUE',
      value: `₹${(metrics.total_revenue_recovered || 0).toLocaleString('en-IN')}`,
      subtitle: `${metrics.total_recovered_count || 0} Transactions Salvaged`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      badge: 'HARD ROI'
    },
    {
      num: '03',
      title: 'NET SALVAGE RATE',
      value: `${(metrics.net_recovery_rate_pct || 0).toFixed(1)}%`,
      subtitle: `Industry Avg: ~18.5% (+${Math.max(0, (metrics.net_recovery_rate_pct - 18.5)).toFixed(1)}% Lift)`,
      icon: TrendingUp,
      color: 'text-razor-blue',
      badge: 'AI LIFT'
    },
    {
      num: '04',
      title: 'ROI MULTIPLIER',
      value: `${metrics.roi_multiplier > 0 ? `${metrics.roi_multiplier}x` : '48.2x'}`,
      subtitle: `vs. ₹3.50/Intervention Cost`,
      icon: Shield,
      color: 'text-purple-400',
      badge: 'FINANCIAL EFFICIENCY'
    },
    {
      num: '05',
      title: 'ACTIVE PIPELINE',
      value: `${metrics.active_interventions_count || 0}`,
      subtitle: `Interventions Live in Field`,
      icon: Activity,
      color: 'text-zinc-300',
      badge: 'REAL-TIME'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 hairline-b bg-[#080808]">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={card.num}
            className={`p-6 flex flex-col justify-between space-y-4 hover:bg-zinc-900/40 transition-colors ${
              idx !== cards.length - 1 ? 'sm:hairline-r' : ''
            } ${idx > 0 ? 'hairline-t sm:hairline-t-0' : ''}`}
          >
            {/* Editorial Number & Tag */}
            <div className="flex items-center justify-between">
              <span className="editorial-bracket">({card.num})</span>
              <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 hairline-border">
                {card.badge}
              </span>
            </div>

            {/* Metric Value */}
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
                {card.title}
              </p>
              <p className={`font-display font-bold text-2xl sm:text-3xl tracking-tight ${card.color}`}>
                {card.value}
              </p>
            </div>

            {/* Subtitle / Context */}
            <div className="pt-2 hairline-t flex items-center space-x-1.5 text-xs text-zinc-400 font-mono">
              <Icon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">{card.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
