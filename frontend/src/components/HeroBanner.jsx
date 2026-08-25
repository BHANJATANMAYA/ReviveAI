import React from 'react';
import { ArrowUpRight, Play, ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react';

export default function HeroBanner({ onTriggerBatch, isBatchRunning, metrics }) {
  return (
    <section className="relative overflow-hidden bg-[#050507] py-10 sm:py-16 md:py-20 border-b border-white/[0.08] select-none">
      
      {/* Background Cinematic Video Layer (Exclusively for Hero Section) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <video
          src="/revive_ai_bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-[0.32] filter brightness-75 contrast-110"
        />
        {/* Gradients to fade out top, bottom, and side borders */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-transparent to-[#050507] pointer-events-none" />
      </div>

      {/* Background Spatial Gradients */}
      <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#ff4500]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/[0.02] blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* LEFT COLUMN: Grotesque Editorial Headline & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8 sm:space-y-12">
            <div className="space-y-6">
              
              {/* Telemetry Indicator Badge */}
              <div className="flex items-center space-x-2.5 text-[11px] font-mono text-[#ff4500]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4500] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff4500]"></span>
                </span>
                <span className="uppercase tracking-widest font-bold text-zinc-400">Autonomous Payment Telemetry Node</span>
              </div>
              
              {/* Asymmetric grotesque typography */}
              <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-[76px] tracking-tighter text-white leading-[0.88] uppercase">
                REVIVE<br />
                REVENUE<span className="text-[#ff4500]">.</span><br />
                <span className="text-zinc-500">SHIELD</span> LOSS<span className="text-zinc-500">.</span>
              </h1>
              
              <p className="text-sm sm:text-base text-zinc-400 font-sans tracking-tight max-w-xl leading-relaxed">
                Online payment friction, issuer banking maintenance, and transient network drop-offs account for up to 25% of checkout failures. ReviveAI automatically intercepts, clusters, and salvages failed transaction streams under strict policy guardrails.
              </p>
            </div>
            
            {/* Action Row */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={onTriggerBatch}
                disabled={isBatchRunning}
                className="px-8 py-4 rounded-full bg-[#ff4500] hover:bg-[#ff571a] text-black font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl shadow-[#ff4500]/15 group disabled:opacity-50 active:scale-[0.98] cursor-pointer"
              >
                <Play className={`w-3.5 h-3.5 fill-black ${isBatchRunning ? 'animate-pulse text-zinc-900' : ''}`} />
                <span>{isBatchRunning ? 'Executing Autopilot Sweep...' : 'Run Autonomous Sweep'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('facility-programs');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-4 rounded-full bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 hover:text-white border border-white/[0.08] hover:border-white/[0.15] font-mono text-xs uppercase tracking-wider flex items-center justify-center space-x-1 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>View Engine Systems</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </div>
            
            {/* Inline Mini-KPI attribution bar */}
            <div className="pt-6 border-t border-white/[0.06] grid grid-cols-3 gap-6 font-mono text-[10px] text-zinc-500">
              <div>
                <span className="text-white block font-bold text-lg leading-tight">
                  ₹{metrics?.total_revenue_recovered ? (metrics.total_revenue_recovered).toLocaleString('en-IN') : '14,82,900'}
                </span>
                <span className="uppercase text-[9px] tracking-wider text-zinc-500">TOTAL SALVAGED</span>
              </div>
              <div>
                <span className="text-[#ff4500] block font-bold text-lg leading-tight">
                  {(metrics?.net_recovery_rate_pct || 78.4).toFixed(1)}%
                </span>
                <span className="uppercase text-[9px] tracking-wider text-zinc-500">NET CONVERSION LIFT</span>
              </div>
              <div>
                <span className="text-zinc-300 block font-bold text-lg leading-tight">
                  {metrics?.total_failed_count || '2,408'}
                </span>
                <span className="uppercase text-[9px] tracking-wider text-zinc-500">INGESTED DECLINES</span>
              </div>
            </div>

          </div>
          
          {/* RIGHT COLUMN: Asymmetric Floating Glass Video Frame */}
          <div className="lg:col-span-5 flex items-center justify-center lg:pl-6">
            <div className="w-full max-w-[420px] relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#070709]/50 backdrop-blur-xl p-3.5 shadow-[0_30px_70px_rgba(0,0,0,0.85)] flex flex-col justify-between group select-none transition-all duration-500 hover:border-white/20">
              
              {/* Inner subtle glow accent */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-transparent via-[#ff4500]/5 to-transparent pointer-events-none" />
              
              {/* Top Panel Bar */}
              <div className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.04] rounded-[1.5rem] font-mono text-[9px] text-zinc-400">
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff4500] animate-ping"></span>
                  <span className="text-white font-bold uppercase tracking-wider">LIVE_MONITOR_NODE</span>
                </span>
                <span className="text-zinc-500">256-BIT ISOLATION</span>
              </div>
              
              {/* System Node Mapping Interface */}
              <div className="flex-1 my-3.5 rounded-[1.5rem] overflow-hidden bg-black/40 backdrop-blur-md relative border border-white/[0.06] aspect-[4/5] sm:aspect-square lg:aspect-[4/5] p-5 flex flex-col justify-between font-mono text-[10px] group-hover:border-white/12 transition-all">
                
                {/* Visual grid connections */}
                <div className="flex-1 relative flex items-center justify-center border border-white/[0.03] rounded-xl bg-black/40 overflow-hidden p-4">
                  {/* Subtle matrix dots background */}
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
                  
                  {/* Simulated routing line nodes */}
                  <div className="relative z-10 w-full space-y-4">
                    <div className="flex items-center justify-between text-[#ff4500] bg-[#ff4500]/5 border border-[#ff4500]/10 p-2.5 rounded-xl animate-pulse">
                      <span className="font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff4500] animate-ping"></span>
                        INGEST_DECLINE
                      </span>
                      <span className="text-[9px]">pay_failed_49b8</span>
                    </div>

                    <div className="flex justify-center text-zinc-700 h-6 items-center">
                      <div className="w-[1px] h-full border-l border-dashed border-zinc-700"></div>
                    </div>

                    <div className="flex items-center justify-between text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-xl">
                      <span className="font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        GATEWAY_ROUTING
                      </span>
                      <span className="text-[9px]">NPCI_SMART_RETRY</span>
                    </div>

                    <div className="flex justify-center text-zinc-700 h-6 items-center">
                      <div className="w-[1px] h-full border-l border-dashed border-zinc-700"></div>
                    </div>

                    <div className="flex items-center justify-between text-white bg-white/5 border border-white/10 p-2.5 rounded-xl shadow-lg shadow-black/40">
                      <span className="font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        LEDGER_SETTLED
                      </span>
                      <span className="text-emerald-400 font-bold">₹49,900</span>
                    </div>
                  </div>
                  
                  {/* Glowing scanner sweep bar overlay */}
                  <div className="absolute top-0 left-0 w-full h-[1.5px] bg-[#ff4500] opacity-40 shadow-[0_0_10px_rgba(255,69,0,0.6)] animate-[marqueeRightToLeft_8s_linear_infinite]" style={{ transform: 'rotate(90deg)' }}></div>
                </div>

                <div className="flex items-center justify-between pt-3 font-mono text-[9px] text-zinc-500">
                  <span>SWEEP NODE ATTRIBUTION</span>
                  <span>LATENCY: 42MS</span>
                </div>
              </div>

              {/* Bottom Card metadata */}
              <div className="p-3.5 bg-white/[0.02] border border-white/[0.04] rounded-[1.5rem] font-mono text-[10px] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 uppercase tracking-wider">Operational Engine Status</span>
                  <span className="text-[#ff4500] font-bold bg-[#ff4500]/10 border border-[#ff4500]/20 px-2 py-0.5 rounded text-[8px]">ACTIVE SWITCH</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-snug font-sans">
                  Adaptive network switches intercept declining transaction payloads in under 50ms and dynamically generate micro-payment conduits.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
