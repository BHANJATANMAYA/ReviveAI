import React, { useState } from 'react';
import { Terminal, ShieldCheck, Cpu, ArrowRight, CheckCircle, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export default function AgentConsole({ logs = [], onRefreshLogs }) {
  const [filterTool, setFilterTool] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    if (filterTool === 'ALL') return true;
    return log.action_tool?.toLowerCase().includes(filterTool.toLowerCase());
  });

  return (
    <div className="bg-[#070709]/75 backdrop-blur-xl rounded-[2rem] border border-white/[0.08] overflow-hidden shadow-2xl relative">
      
      {/* Console Header */}
      <div className="px-8 py-5 border-b border-white/[0.08] bg-[#09090b]/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-[#ff4500]/5 border border-[#ff4500]/15 text-[#ff4500] glow-orange">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-display font-bold text-xs tracking-wider text-white uppercase tracking-wider font-bold">
                Agent Reasoning Stream
              </h2>
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>TELEMETRY LIVE</span>
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase tracking-wider">
              Chain-of-Thought Decision Telemetry · RZP Policy Core
            </p>
          </div>
        </div>

        {/* Filter Badges & Refresh */}
        <div className="flex items-center space-x-2">
          {['ALL', 'diagnostic', 'guardrail', 'razorpay'].map(tool => (
            <button
              key={tool}
              onClick={() => setFilterTool(tool)}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase rounded-full transition-colors cursor-pointer border ${
                filterTool === tool
                  ? 'bg-white text-black font-bold border-white'
                  : 'bg-white/[0.02] text-zinc-400 hover:text-white border-white/[0.08] hover:border-white/[0.15]'
              }`}
            >
              {tool}
            </button>
          ))}
          <button
            onClick={onRefreshLogs}
            className="p-2 rounded-full bg-white/[0.02] text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/[0.15] transition-colors cursor-pointer"
            title="Refresh reasoning feed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Feed Terminal with Scanlines */}
      <div className="scanlines bg-black/40 p-8 max-h-[620px] overflow-y-auto space-y-4 font-mono text-[11px]">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-20 text-zinc-600 space-y-3">
            <Terminal className="w-10 h-10 mx-auto text-zinc-700 opacity-60 animate-pulse" />
            <p className="font-bold text-zinc-400 uppercase tracking-widest text-xs">No active streams connected</p>
            <p className="text-[10px] text-zinc-600">Run an autonomous recovery sweep from the Dashboard to trigger the telemetry stack.</p>
          </div>
        ) : (
          <>
            {filteredLogs.map((log, idx) => (
              <div
                key={log.id || idx}
                className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.02] hover:border-white/[0.1] transition-all space-y-3 group"
              >
                {/* Top Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-[10px]">
                  <div className="flex items-center space-x-2">
                    <span className="editorial-bracket">
                      STEP_{String(log.step_number || (idx + 1)).padStart(2, '0')}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#ff4500]/10 text-[#ff4500] border border-[#ff4500]/25 font-bold uppercase tracking-wider text-[9px]">
                      {log.action_tool || 'reasoning_core'}
                    </span>
                    <span className="text-zinc-500">
                      ID: <span className="text-zinc-300 font-semibold">{log.txn_id}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    {log.guardrail_check_passed ? (
                      <span className="flex items-center space-x-1 text-emerald-400 font-semibold uppercase tracking-wider text-[9px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>POLICY PASS</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-amber-400 font-semibold uppercase tracking-wider text-[9px] bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>POLICY CAUTION</span>
                      </span>
                    )}
                    {log.confidence_score > 0 && (
                      <span className="text-zinc-500">
                        CONF: <span className="text-white font-bold">{(log.confidence_score * 100).toFixed(0)}%</span>
                      </span>
                    )}
                    <span className="text-zinc-600">
                      {log.created_at ? new Date(log.created_at).toLocaleTimeString() : ''}
                    </span>
                  </div>
                </div>

                {/* Thought Content formatted like console outputs */}
                <div className="text-zinc-300 leading-relaxed bg-black/60 p-4 rounded-xl border border-white/[0.04] relative">
                  <div className="absolute top-2.5 right-2.5 text-[8px] font-bold text-zinc-700 select-none">CoT_TELEMETRY</div>
                  <span className="text-[#ff4500] font-bold mr-2 select-none">&gt;</span>
                  {log.thought}
                </div>

                {/* Observation / Output */}
                {log.observation && (
                  <div className="text-emerald-400/90 flex items-start space-x-2 pl-2">
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">↳</span>
                    <span className="leading-relaxed">OBSERVATION: {log.observation}</span>
                  </div>
                )}
              </div>
            ))}
            
            {/* Blinking Prompt Cursor */}
            <div className="flex items-center space-x-2 text-[10px] text-zinc-600 pt-2 border-t border-white/[0.04]">
              <span>revive_agent_telemetry:~$</span>
              <span className="w-1.5 h-3 bg-emerald-400 animate-pulse"></span>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
