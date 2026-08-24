import React, { useState, useEffect } from 'react';
import { Terminal, ShieldCheck, Cpu, ArrowRight, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function AgentConsole({ logs = [], onRefreshLogs }) {
  const [filterTool, setFilterTool] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    if (filterTool === 'ALL') return true;
    return log.action_tool?.toLowerCase().includes(filterTool.toLowerCase());
  });

  return (
    <div className="bg-[#0b0b0b] rounded-xl hairline-border overflow-hidden">
      
      {/* Console Header */}
      <div className="px-6 py-4 hairline-b bg-[#101010] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-md bg-razor-darkblue text-razor-blue">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-display font-bold text-sm tracking-tight text-white uppercase">
                Agent Reasoning Stream
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono">
              Live Chain-of-Thought (CoT) telemetry & guardrail decision logs
            </p>
          </div>
        </div>

        {/* Filter Badges & Refresh */}
        <div className="flex items-center space-x-2">
          {['ALL', 'diagnostic', 'guardrail', 'razorpay'].map(tool => (
            <button
              key={tool}
              onClick={() => setFilterTool(tool)}
              className={`px-2.5 py-1 text-[11px] font-mono uppercase rounded transition-colors ${
                filterTool === tool
                  ? 'bg-white text-black font-semibold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hairline-border'
              }`}
            >
              {tool}
            </button>
          ))}
          <button
            onClick={onRefreshLogs}
            className="p-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white hairline-border transition-colors"
            title="Refresh reasoning feed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="p-6 max-h-[600px] overflow-y-auto space-y-4 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <Terminal className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-600" />
            <p>No agent reasoning events recorded yet.</p>
            <p className="text-[11px] text-zinc-600 mt-1">Run an autonomous recovery to observe live CoT logs.</p>
          </div>
        ) : (
          filteredLogs.map((log, idx) => (
            <div
              key={log.id || idx}
              className="p-4 rounded-lg bg-[#141414] hairline-border hover:border-zinc-700 transition-all space-y-2.5"
            >
              {/* Top Row: Step, Tool & Guardrail Status */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="editorial-bracket">
                    STEP {log.step_number ? String(log.step_number).padStart(2, '0') : '01'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 text-razor-blue text-[11px] font-semibold hairline-border">
                    {log.action_tool || 'reasoning_core'}
                  </span>
                  <span className="text-zinc-500 text-[11px]">
                    TXN: <span className="text-zinc-300">{log.txn_id}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-[11px]">
                  {log.guardrail_check_passed ? (
                    <span className="flex items-center space-x-1 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>GUARDRAIL PASS</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-amber-400">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>GUARDRAIL CAUTION</span>
                    </span>
                  )}
                  {log.confidence_score > 0 && (
                    <span className="text-zinc-400">
                      Conf: <span className="text-white font-bold">{(log.confidence_score * 100).toFixed(0)}%</span>
                    </span>
                  )}
                  <span className="text-zinc-600">
                    {log.created_at ? new Date(log.created_at).toLocaleTimeString() : ''}
                  </span>
                </div>
              </div>

              {/* Thought Content */}
              <div className="text-zinc-200 text-xs leading-relaxed bg-[#0a0a0a] p-3 rounded hairline-border">
                <span className="text-zinc-500 select-none mr-2">&gt;</span>
                {log.thought}
              </div>

              {/* Observation / Tool Output */}
              {log.observation && (
                <div className="text-emerald-400/90 text-[11px] flex items-start space-x-1.5 pl-2">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-500" />
                  <span>Observation: {log.observation}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
