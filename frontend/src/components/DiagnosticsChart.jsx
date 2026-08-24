import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Activity, ShieldCheck, Zap, Layers } from 'lucide-react';

const COLORS = ['#00baf2', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

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
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="editorial-bracket">(03)</span>
            <h2 className="font-display font-bold text-xl tracking-tight text-white uppercase">
              Financial Recovery Diagnostics
            </h2>
          </div>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            Machine Learning failure clustering, intervention attribution, and recovery velocity
          </p>
        </div>
      </div>

      {/* Grid: 3 Visual Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Failure Categories Breakdown */}
        <div className="bg-[#0b0b0b] rounded-xl hairline-border p-6 space-y-4">
          <div className="flex items-center justify-between hairline-b pb-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-razor-blue" />
              <h3 className="font-display font-bold text-sm text-white uppercase">
                Decline Vector Clustering
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">ML CLASSIFIED</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={4}
                >
                  {distData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#141414', borderColor: '#333', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
            {distData.map((d, i) => (
              <div key={d.name} className="flex items-center space-x-1.5 text-zinc-400">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                <span className="truncate">{d.name}</span>
                <span className="text-zinc-600">({d.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Channel Efficacy Matrix */}
        <div className="bg-[#0b0b0b] rounded-xl hairline-border p-6 space-y-4">
          <div className="flex items-center justify-between hairline-b pb-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <h3 className="font-display font-bold text-sm text-white uppercase">
                Channel Salvage Efficacy (%)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">AVG: 74.3%</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#555" tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis dataKey="channel" type="category" width={110} stroke="#555" tick={{ fill: '#bbb', fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  formatter={(val) => [`${val}% Conversion`, 'Recovery Efficacy']}
                  contentStyle={{ backgroundColor: '#141414', borderColor: '#333', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Bar dataKey="rate" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded bg-zinc-900/60 hairline-border text-[11px] font-mono text-zinc-400">
            <span className="text-emerald-400 font-semibold">Razorpay Smart Retry</span> achieves peak 78.4% conversion on transient NPCI / Gateway timeouts.
          </div>
        </div>

        {/* 3. Real-Time Revenue Velocity */}
        <div className="bg-[#0b0b0b] rounded-xl hairline-border p-6 space-y-4">
          <div className="flex items-center justify-between hairline-b pb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <h3 className="font-display font-bold text-sm text-white uppercase">
                Salvage Trajectory (₹)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-purple-400">HARD REVENUE</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAtRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#555" tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 10, fontFamily: 'monospace' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#141414', borderColor: '#333', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="at_risk" name="Revenue at Risk" stroke="#ef4444" fillOpacity={1} fill="url(#colorAtRisk)" />
                <Area type="monotone" dataKey="recovered" name="Recovered ₹" stroke="#10b981" fillOpacity={1} fill="url(#colorRecovered)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded bg-zinc-900/60 hairline-border text-[11px] font-mono text-zinc-400 flex justify-between items-center">
            <span>Net Recovery Delta:</span>
            <span className="text-emerald-400 font-bold">
              +₹{(metrics.total_revenue_recovered || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
