import React, { useState } from 'react';
import { ArrowRight, Menu, X, ArrowUpRight, Cpu, Activity, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({
  activeTab,
  setActiveTab,
  autopilotMode,
  setAutopilotMode,
  onResetDataset,
  onInjectStream,
  isRefreshing,
  metrics,
  onTriggerBatch,
  isBatchRunning
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'how-it-works', label: 'How it Works' },
    { id: 'agent', label: 'Agent Studio' },
    { id: 'analytics', label: 'Diagnostics' },
    { id: 'portal', label: 'Checkout Demo' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const isItemActive = (id) => {
    if (id === 'dashboard' && activeTab === 'dashboard') return true;
    if (id === 'transactions' && activeTab === 'transactions') return true;
    if (id === 'how-it-works' && activeTab === 'how-it-works') return true;
    if (id === 'agent' && activeTab === 'agent') return true;
    if (id === 'analytics' && activeTab === 'analytics') return true;
    if (id === 'portal' && activeTab === 'portal') return true;
    return false;
  };

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6 select-none pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-center">
        <div className="w-full h-16 sm:h-[68px] flex items-center justify-between px-6 sm:px-8 rounded-full border border-white/[0.08] bg-[#070709]/75 backdrop-blur-xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] pointer-events-auto transition-all relative">
          
          {/* LEFT: ReviveAI Wordmark + Editorial Micro-label */}
          <div className="flex items-center space-x-4 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-1.5 focus:outline-none group cursor-pointer"
              aria-label="ReviveAI Home"
            >
              <span className="font-display font-black text-xl sm:text-2xl tracking-tighter text-white group-hover:text-zinc-200 transition-colors">
                reviveai<span className="text-[#ff4500]">.</span>
              </span>
            </button>

            <span className="hidden xl:inline-block text-[9px] font-mono uppercase tracking-widest text-zinc-500 border-l border-zinc-800/80 pl-3">
              AI REVENUE RECOVERY
            </span>
          </div>

          {/* CENTER: Minimal Sliding Active Pill Navigation */}
          <nav className="hidden md:flex items-center space-x-1 font-sans text-xs font-semibold tracking-tight relative bg-white/[0.03] p-1 rounded-full border border-white/[0.04]">
            {navItems.map((item) => {
              const active = isItemActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none ${
                    active
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Status Indicator + Command Link + Single CTA */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            
            {/* Autonomous Status Dot */}
            <button
              onClick={() => setAutopilotMode(!autopilotMode)}
              title="Toggle Autopilot / Copilot Mode"
              className="flex items-center space-x-2 text-[10px] font-mono tracking-wider transition-all cursor-pointer py-1.5 px-3 rounded-full bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] active:scale-[0.97]"
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  autopilotMode ? 'bg-[#ff4500]' : 'bg-zinc-600'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  autopilotMode ? 'bg-[#ff4500]' : 'bg-zinc-600'
                }`}></span>
              </span>
              <span className={autopilotMode ? 'text-zinc-300 font-bold' : 'text-zinc-500 font-medium'}>
                {autopilotMode ? 'AUTOPILOT' : 'COPILOT'}
              </span>
            </button>

            {/* Single Strong CTA Button */}
            <button
              onClick={onTriggerBatch}
              disabled={isBatchRunning}
              className="inline-flex items-center space-x-1.5 text-xs font-mono font-semibold text-white bg-[#ff4500] hover:bg-[#ff571a] border border-[#ff4500]/20 hover:border-[#ff571a]/30 px-4 py-2 rounded-full transition-all disabled:opacity-50 active:scale-[0.98] cursor-pointer shadow-lg shadow-[#ff4500]/15 text-black hover:text-black font-bold"
            >
              <span>{isBatchRunning ? 'Running...' : 'Run Sweep'}</span>
              <span className="font-bold">→</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.06] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (floating panel attached under navbar) */}
      {mobileMenuOpen && (
        <div className="max-w-7xl mx-auto mt-2 px-2 sm:px-4 pointer-events-auto md:hidden">
          <div className="rounded-3xl border border-white/[0.08] bg-[#070709]/95 backdrop-blur-2xl p-6 space-y-3 font-sans text-sm shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)]">
            {navItems.map((item) => {
              const active = isItemActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left py-2.5 px-4 rounded-xl transition-all flex items-center justify-between ${
                    active ? 'text-white font-semibold bg-white/[0.06] border border-white/[0.06]' : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#ff4500]"></span>}
                </button>
              );
            })}

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span>AI REVENUE RECOVERY</span>
              <span>EST. 2026</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
