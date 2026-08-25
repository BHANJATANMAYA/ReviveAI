import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid
} from 'recharts';
import { Activity, ShieldCheck, Zap, Layers } from 'lucide-react';

const COLORS = [
  '#ff4500',       // Calibrated electric orange
  '#10b981',       // Emerald
  '#3b82f6',       // Electric Blue
  '#a855f7',       // Purple
  '#f59e0b',       // Amber
  '#ec4899'        // Rose
];

// High-end glassmorphic tooltip component
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="liquid-glass-subtle px-4 py-3 rounded-2xl border border-white/10 font-mono text-[11px] text-zinc-300 space-y-1.5 shadow-2xl">
        {label && <p className="text-zinc-500 font-bold uppercase tracking-wider">{label}</p>}
        {payload.map((p, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.payload.fill }}></span>
            <span>{p.name}:</span>
            <span className="text-white font-bold">
              {formatter ? formatter(p.value, p.name) : p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DiagnosticsChart({ metrics }) {
  if (!metrics) return null;

  // Prepare failure distribution data
  const distData = Object.entries(metrics.failure_distribution || {}).map(([key, value]) => ({
    name: key.replace(/_/g, ' '),
    count: value
  }));

  // Channel efficacy data
  const channelData = Object.entries(metrics.channel_efficacy || {}).map(([key, val]) => ({
    channel: val.name,
    rate: val.rate,
    total: val.total || 0
  }));

  // Timeline data
  const timelineData = metrics.timeline || [];

  return (
    <div className="space-y-10 py-8 select-none">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="editorial-bracket">(05)</span>
            <h2 className="font-display font-bold text-sm tracking-tight text-white uppercase font-bold">
              Financial Recovery Diagnostics
            </h2>
          </div>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            Machine Learning failure clustering, channel attribution models, and recovery trajectory velocity
          </p>
        </div>
      </div>

      {/* Grid: 3 Visual Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. Failure Categories Breakdown */}
        <div className="bg-[#070709]/40 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-8 space-y-6 shadow-xl relative overflow-hidden group hover:border-white/15 transition-all">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div className="flex items-center space-x-2.5">
              <Layers className="w-4 h-4 text-[#ff4500]" />
              <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider font-bold">
                Decline Vector Clustering
              </h3>
            </div>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">ML CLASSIFIED</span>
          </div>

          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={55}
                  paddingAngle={3}
                >
                  {distData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] font-mono">
            {distData.map((d, i) => (
              <div key={d.name} className="flex items-center space-x-1.5 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                <span className="truncate">{d.name}</span>
                <span className="text-zinc-600 font-bold">({d.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Channel Efficacy Matrix */}
        <div className="bg-[#070709]/40 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-8 space-y-6 shadow-xl relative overflow-hidden group hover:border-white/15 transition-all">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div className="flex items-center space-x-2.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider font-bold">
                Channel Salvage Efficacy (%)
              </h3>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">REAL-TIME</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical" margin={{ left: -10, right: 15, top: 10, bottom: 10 }}>
                <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis type="number" domain={[0, 100]} stroke="rgba(255,255,255,0.08)" tick={{ fill: '#888', fontSize: 9, fontFamily: 'monospace' }} />
                <YAxis dataKey="channel" type="category" width={100} stroke="rgba(255,255,255,0.08)" tick={{ fill: '#bbb', fontSize: 9, fontFamily: 'monospace' }} />
                <Tooltip content={<CustomTooltip formatter={(val) => `${val}% Recovery`} />} />
                <Bar dataKey="rate" fill="#10b981" radius={[0, 8, 8, 0]}>
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ff4500' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-[10px] font-mono text-zinc-400 leading-normal">
            <span className="text-[#ff4500] font-bold">Priority Smart Retry</span> acts dynamically on NPCI / Gateway maintenance issues to bypass transient blockages.
          </div>
        </div>

        {/* 3. Real-Time Revenue Velocity */}
        <div className="bg-[#070709]/40 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-8 space-y-6 shadow-xl relative overflow-hidden group hover:border-white/15 transition-all">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div className="flex items-center space-x-2.5">
              <Activity className="w-4 h-4 text-purple-400" />
              <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider font-bold">
                Salvage Trajectory (₹)
              </h3>
            </div>
            <span className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-widest">LEDGER STATS</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAtRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="hour" stroke="rgba(255,255,255,0.08)" tick={{ fill: '#888', fontSize: 9, fontFamily: 'monospace' }} />
                <YAxis stroke="rgba(255,255,255,0.08)" tick={{ fill: '#888', fontSize: 9, fontFamily: 'monospace' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip content={<CustomTooltip formatter={(val) => `₹${val.toLocaleString('en-IN')}`} />} />
                <Area type="monotone" dataKey="at_risk" name="Revenue at Risk" stroke="#ef4444" strokeWidth={1.5} fillOpacity={1} fill="url(#colorAtRisk)" />
                <Area type="monotone" dataKey="recovered" name="Recovered" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRecovered)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 rounded-2xl bg-[#10b981]/5 border border-[#10b981]/10 text-[10px] font-mono text-zinc-400 flex justify-between items-center">
            <span>Net Recovered Value:</span>
            <span className="text-emerald-400 font-bold text-xs">
              +₹{(metrics.total_revenue_recovered || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
