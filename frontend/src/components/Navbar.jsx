import React from 'react';
import { Bot, Zap, RefreshCw, Download, PlusCircle, Activity } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  autopilotMode,
  setAutopilotMode,
  onResetDataset,
  onInjectStream,
  isRefreshing,
  metrics
}) {
  const navTabs = [
    { id: 'dashboard', label: 'Command Center', num: '01' },
    { id: 'agent', label: 'Agent Studio', num: '02' },
    { id: 'analytics', label: 'Diagnostics', num: '03' },
    { id: 'portal', label: 'Customer Portal', num: '04' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur-xl hairline-b font-mono text-xs select-none">
      
      {/* Editorial Top Status Bar */}
      <div className="bg-[#040404] px-4 sm:px-8 py-1.5 hairline-b flex items-center justify-between text-[11px] text-zinc-500 tracking-wider">
        <div className="flex items-center space-x-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff4500] animate-pulse"></span>
          <span className="text-zinc-400">RAZORPAY AI BUILDATHON</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-400">TRACK 3: AI REVENUE RECOVERY</span>
          <span className="text-zinc-700 hidden md:inline">/</span>
          <span className="text-zinc-500 hidden md:inline">est. 2026</span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-[#ff4500] font-bold tracking-widest uppercase flex items-center space-x-1">
            <span>/</span>
            <span>AUTONOMOUS SALVAGE FLEET</span>
          </span>
          <span className="text-zinc-700">/</span>
          <div className="flex items-center space-x-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-[10px]">LIVE FEED</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Sub-tag */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-1.5 group cursor-pointer focus:outline-none"
            >
              <span className="font-display font-black text-2xl tracking-tighter text-white group-hover:text-zinc-200 transition-colors">
                reviveai<span className="text-[#ff4500]">.</span>
              </span>
            </button>

            <span className="hidden lg:inline-block px-2 py-0.5 rounded bg-zinc-900 hairline-border text-[10px] text-zinc-400 tracking-wider whitespace-nowrap">
              AUTONOMOUS AGENT
            </span>
          </div>

          {/* Sleek Editorial Center Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 bg-[#0e0e0e] p-1 rounded-xl hairline-border">
            {navTabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-3.5 py-1.5 text-xs font-mono tracking-wider transition-all rounded-lg flex items-center space-x-1.5 relative ${
                    isActive
                      ? 'bg-[#181818] text-white font-bold hairline-border shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  {/* Subtle active orange indicator dot */}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4500] shrink-0"></span>
                  )}
                  <span className={isActive ? 'text-[#ff4500]' : 'text-zinc-600'}>
                    ({tab.num})
                  </span>
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Controls & Autopilot Switch */}
          <div className="flex items-center space-x-2.5 shrink-0">
            
            {/* Mode Switch (Sleek Mechanical Glass Pill) */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-[#0e0e0e] hairline-border">
              <button
                onClick={() => setAutopilotMode(true)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-lg flex items-center space-x-1.5 transition-all ${
                  autopilotMode
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Agent automatically diagnoses and executes recovery actions"
              >
                <Zap className={`w-3 h-3 ${autopilotMode ? 'text-[#ff4500] fill-[#ff4500]' : ''}`} />
                <span>AUTOPILOT</span>
              </button>
              
              <button
                onClick={() => setAutopilotMode(false)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-lg flex items-center space-x-1.5 transition-all ${
                  !autopilotMode
                    ? 'bg-[#ff4500] text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Operator approves recommendations before execution"
              >
                <Bot className="w-3 h-3" />
                <span>COPILOT</span>
              </button>
            </div>

            {/* Ingestion Stream Simulator */}
            <button
              onClick={onInjectStream}
              className="px-2.5 py-1.5 text-xs font-mono text-zinc-200 hover:text-white bg-[#0e0e0e] hover:bg-zinc-800 rounded-lg hairline-border flex items-center space-x-1.5 transition-all hover:border-zinc-600"
              title="Simulate Ingestion Stream (+10 Failed Transactions)"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#ff4500]" />
              <span className="hidden xl:inline text-[11px] font-bold">+ STREAM</span>
            </button>

            {/* Reset Seed Button */}
            <button
              onClick={onResetDataset}
              disabled={isRefreshing}
              className="p-2 text-xs text-zinc-400 hover:text-white bg-[#0e0e0e] hover:bg-zinc-800 rounded-lg hairline-border transition-all hover:border-zinc-600 disabled:opacity-50"
              title="Reset with 40 fresh synthetic transactions"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#ff4500]' : ''}`} />
            </button>

            {/* Export CSV Button */}
            <a
              href="/api/export/audit-csv"
              download
              className="p-2 text-xs text-zinc-400 hover:text-white bg-[#0e0e0e] hover:bg-zinc-800 rounded-lg hairline-border transition-all hover:border-zinc-600"
              title="Export Financial Audit CSV"
            >
              <Download className="w-3.5 h-3.5" />
            </a>

          </div>

        </div>
      </div>
    </header>
  );
}
