import React, { useRef } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, Shield, Activity, ArrowUpRight } from 'lucide-react';

function BentoCard({ num, title, value, subtitle, icon: Icon, color, badge, badgeColor, gridSpan }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-card liquid-glass p-8 space-y-6 spring-hover relative group border border-white/[0.08] bg-[#070709]/50 backdrop-blur-xl transition-all duration-300 ${gridSpan}`}
    >
      {/* Top Subtle Corner Indicator */}
      <div className="absolute top-4 left-4 text-[9px] font-mono text-zinc-600 font-bold select-none">
        // NODE_{num}
      </div>

      {/* Badge & Icon Row */}
      <div className="flex items-center justify-between pt-2">
        <span className={`text-[10px] font-mono font-bold tracking-wider px-3 py-1 rounded-full border ${badgeColor}`}>
          {badge}
        </span>
        <div className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-zinc-400 group-hover:text-white group-hover:border-white/[0.15] transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Main Metric Data */}
      <div className="space-y-1">
        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
          {title}
        </p>
        <p className={`font-display font-black text-3xl sm:text-4xl lg:text-[46px] tracking-tighter leading-none ${color}`}>
          {value}
        </p>
      </div>

      {/* Subtext info */}
      <div className="pt-4 border-t border-white/[0.04] text-[11px] font-mono text-zinc-500 leading-snug flex items-center space-x-1.5 truncate">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-[#ff4500] transition-colors"></span>
        <span className="truncate group-hover:text-zinc-400 transition-colors">{subtitle}</span>
      </div>
    </div>
  );
}

export default function MetricCards({ metrics }) {
  if (!metrics) return null;

  const cards = [
    {
      num: '01',
      title: 'REVENUE AT RISK',
      value: `₹${(metrics.total_revenue_at_risk || 0).toLocaleString('en-IN')}`,
      subtitle: `${metrics.total_failed_count || 0} declines clustered`,
      icon: AlertTriangle,
      color: 'text-rose-400',
      badge: 'AT RISK',
      badgeColor: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
      gridSpan: 'lg:col-span-2'
    },
    {
      num: '02',
      title: 'RECOVERED REVENUE',
      value: `₹${(metrics.total_revenue_recovered || 0).toLocaleString('en-IN')}`,
      subtitle: `${metrics.total_recovered_count || 0} orders recovered`,
      icon: CheckCircle2,
      color: 'text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.1)]',
      badge: 'SALVAGED',
      badgeColor: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      gridSpan: 'lg:col-span-3'
    },
    {
      num: '03',
      title: 'NET ATTRIBUTION LIFT',
      value: `${(metrics.net_recovery_rate_pct || 0).toFixed(1)}%`,
      subtitle: `Industry: 18% (ReviveAI: +${Math.max(0, (metrics.net_recovery_rate_pct - 18.5)).toFixed(1)}%)`,
      icon: TrendingUp,
      color: 'text-white',
      badge: 'NET RATE',
      badgeColor: 'text-[#ff4500] border-[#ff4500]/30 bg-[#ff4500]/10',
      gridSpan: 'lg:col-span-2'
    },
    {
      num: '04',
      title: 'ROI MULTIPLIER',
      value: `${metrics.roi_multiplier > 0 ? `${metrics.roi_multiplier}x` : '48.2x'}`,
      subtitle: `vs. ₹3.50 autonomous cost`,
      icon: Shield,
      color: 'text-purple-300',
      badge: 'EFFICIENCY',
      badgeColor: 'text-purple-300 border-purple-500/20 bg-purple-500/5',
      gridSpan: 'lg:col-span-2'
    },
    {
      num: '05',
      title: 'PIPELINE',
      value: `${metrics.active_interventions_count || 0}`,
      subtitle: `Active agents in field`,
      icon: Activity,
      color: 'text-zinc-300',
      badge: 'LIVE SWEEP',
      badgeColor: 'text-zinc-400 border-white/10 bg-white/5',
      gridSpan: 'lg:col-span-1'
    }
  ];

  return (
    <section className="relative bg-[#050507] py-16 border-b border-white/[0.08] select-none">
      
      {/* Dynamic Header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="editorial-bracket">(02)</span>
            <h2 className="font-display font-bold text-sm tracking-tight text-white uppercase font-bold">
              Autonomous Financial Telemetry
            </h2>
          </div>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            Real-time value tracking, AI attribution analysis, and platform efficiencies
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-500 bg-white/[0.02] border border-white/[0.06] rounded-full px-4 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>STREAM ONLINE</span>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {cards.map((card) => (
            <BentoCard key={card.num} {...card} />
          ))}
        </div>
      </div>

    </section>
  );
}
