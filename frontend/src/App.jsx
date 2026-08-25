import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import MetricCards from './components/MetricCards';
import TransactionTable from './components/TransactionTable';
import AgentConsole from './components/AgentConsole';
import DiagnosticsChart from './components/DiagnosticsChart';
import CustomerPortal from './components/CustomerPortal';
import AuditTrailModal from './components/AuditTrailModal';
import HowItWorks from './components/HowItWorks';
import { api } from './services/api';
import { Bot, Shield, CheckCircle2, ArrowRight, Zap, Layers, Lock, Cpu, Sparkles, Plus, Minus, ArrowUpRight, ArrowUp } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [autopilotMode, setAutopilotMode] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [agentLogs, setAgentLogs] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [recoveringId, setRecoveringId] = useState(null);
  
  // Interactive Program List State
  const [activeProgram, setActiveProgram] = useState(1);

  // Modals & Links
  const [selectedLinkId, setSelectedLinkId] = useState(null);
  const [auditTxn, setAuditTxn] = useState(null);

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 6000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    try {
      const [m, t, l] = await Promise.all([
        api.getMetrics(),
        api.getTransactions({ limit: 100 }),
        api.getAgentLogs(40)
      ]);
      setMetrics(m);
      setTransactions(t);
      setAgentLogs(l);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  const handleResetDataset = async () => {
    setIsRefreshing(true);
    try {
      await api.seedDataset(40, true);
      await loadAllData();
    } catch (err) {
      alert(`Reset failed: ${err.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleInjectStream = async () => {
    try {
      await api.injectStream(10, 'mixed');
      await loadAllData();
    } catch (err) {
      alert(`Stream injection failed: ${err.message}`);
    }
  };

  const handleTriggerBatch = async () => {
    setIsBatchRunning(true);
    try {
      await api.recoverBatch({
        mode: autopilotMode ? 'autopilot' : 'copilot',
        limit: 50
      });
      await loadAllData();
    } catch (err) {
      alert(`Batch recovery failed: ${err.message}`);
    } finally {
      setIsBatchRunning(false);
    }
  };

  const handleRecoverSingle = async (txnId) => {
    setRecoveringId(txnId);
    try {
      const res = await api.recoverTransaction({
        txn_id: txnId,
        mode: autopilotMode ? 'autopilot' : 'copilot'
      });
      await loadAllData();
      if (res.payment_link_id) {
        setSelectedLinkId(res.payment_link_id);
      }
    } catch (err) {
      alert(`Recovery failed: ${err.message}`);
    } finally {
      setRecoveringId(null);
    }
  };

  const handleOpenPortal = (linkId) => {
    setSelectedLinkId(linkId);
    setActiveTab('portal');
  };

  const handlePaymentSuccess = async (txnId) => {
    await loadAllData();
  };

  const programs = [
    {
      id: 0,
      title: "Adaptive Switch",
      desc: "Dynamic low-latency routing across Razorpay bank gateways and UPI rails when primary acquirers experience transient failure.",
      image: "/assets/infra_switch.jpg",
      tag: "01 / ROUTING INFRASTRUCTURE",
      badge: "SUB-120MS FAILOVER"
    },
    {
      id: 1,
      title: "/ Autonomous Recovery",
      desc: "Real-time AI diagnostic classification and autonomous multi-vector salvage engine for silent gateway declines.",
      image: "/assets/infra_recovery.jpg",
      tag: "02 / AGENT ORCHESTRATION",
      badge: "CLOSED-LOOP AI",
      linkText: "Run Autonomous Recovery Sweep →"
    },
    {
      id: 2,
      title: "Guardrail Vault",
      desc: "Strict cryptographic safety boundaries enforcing maximum retry frequency, VIP margin caps, and audit compliance.",
      image: "/assets/infra_vault.jpg",
      tag: "03 / POLICY SECURITY",
      badge: "ZERO RISK VAULT"
    },
    {
      id: 3,
      title: "WhatsApp & SMS Nudges",
      desc: "Context-aware, high-conversion recovery links dispatched via verified messaging channels for user drop-offs.",
      image: "/assets/infra_dispatch.jpg",
      tag: "04 / MULTI-CHANNEL DISPATCH",
      badge: "78.4% CONVERSION"
    }
  ];

  const currentProgram = programs.find(p => p.id === activeProgram) || programs[0];

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col selection:bg-[#ff4500] selection:text-black">
      
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        autopilotMode={autopilotMode}
        setAutopilotMode={setAutopilotMode}
        onResetDataset={handleResetDataset}
        onInjectStream={handleInjectStream}
        isRefreshing={isRefreshing}
        metrics={metrics}
        onTriggerBatch={handleTriggerBatch}
        isBatchRunning={isBatchRunning}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* TAB 1: COMMAND CENTER */}
        {activeTab === 'dashboard' && (
          <div className="space-y-0">
            
            {/* Dynamic Hero */}
            <HeroBanner
              onTriggerBatch={handleTriggerBatch}
              isBatchRunning={isBatchRunning}
              metrics={metrics}
            />

            {/* Facility & Programs Layout Section */}
            <section id="facility-programs" className="max-w-7xl mx-auto px-6 sm:px-12 py-16 hairline-b">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#ff4500] uppercase tracking-wider mb-8">
                <span className="w-2.5 h-2.5 bg-[#ff4500]"></span>
                <span>Autonomous Infrastructure & Systems</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Interactive List */}
                <div className="lg:col-span-6 space-y-6">
                  {programs.map((prog) => {
                    const isSelected = activeProgram === prog.id;
                    return (
                      <div
                        key={prog.id}
                        onClick={() => setActiveProgram(prog.id)}
                        className="cursor-pointer group pt-4 hairline-t first:border-t-0 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
                            isSelected ? 'text-[#ff4500]' : 'text-zinc-400 group-hover:text-white'
                          }`}>
                            {prog.title}
                          </h3>
                          <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded border transition-colors ${
                            isSelected
                              ? 'text-[#ff4500] border-[#ff4500]/40 bg-[#ff4500]/10'
                              : 'text-zinc-600 border-white/[0.05] group-hover:border-white/[0.15] group-hover:text-zinc-400'
                          }`}>
                            {prog.badge}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="mt-2.5 space-y-2 font-mono text-xs text-zinc-400 leading-relaxed animate-in fade-in duration-200">
                            <p>{prog.desc}</p>
                            {prog.linkText && (
                              <button
                                onClick={handleTriggerBatch}
                                className="text-[#ff4500] font-bold underline underline-offset-4 pt-1 block cursor-pointer"
                              >
                                {prog.linkText}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <p className="text-[11px] font-mono text-zinc-600 pt-6">
                    ReviveAI is an autonomous engine that fosters a culture of zero financial leakage and precision recovery across Razorpay ecosystem.
                  </p>
                </div>

                {/* Right Interactive Architecture Visual Card */}
                <div className="lg:col-span-6 relative">
                  <div className="relative rounded-2xl overflow-hidden border border-white/[0.12] aspect-[4/3] shadow-2xl bg-black group">
                    <img
                      key={currentProgram.image}
                      src={currentProgram.image}
                      alt={currentProgram.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 animate-in fade-in zoom-in-95 duration-300"
                    />
                    
                    {/* Dark Smoked Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

                    {/* Top Right Status Badge */}
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 font-mono text-[10px] text-zinc-300 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff4500] animate-ping"></span>
                      <span>ACTIVE NODE</span>
                    </div>

                    {/* Bottom Metadata Bar */}
                    <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-3.5 rounded-xl border border-white/10 flex items-center justify-between font-mono text-xs">
                      <div>
                        <span className="text-[10px] text-[#ff4500] uppercase tracking-wider block font-bold">
                          {currentProgram.tag}
                        </span>
                        <span className="text-white font-semibold text-sm">
                          {currentProgram.title.replace('/', '').trim()}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 bg-white/[0.05] border border-white/[0.1] px-2.5 py-1 rounded">
                        256-BIT ISOLATION
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            </section>

            {/* Monochromatic Partner Ticker Bar (matching Dribbble logo strip) */}
            <section className="hairline-b bg-[#050505] py-8 overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-8 text-zinc-500 font-mono text-xs tracking-widest uppercase">
                <span className="flex items-center space-x-1 hover:text-white transition-colors">
                  <span className="text-[#ff4500] font-bold">•</span>
                  <span>RAZORPAY ADAPTIVE</span>
                </span>
                <span className="flex items-center space-x-1 hover:text-white transition-colors">
                  <span className="text-[#ff4500] font-bold">•</span>
                  <span>NPCI / UPI 2.0</span>
                </span>
                <span className="flex items-center space-x-1 hover:text-white transition-colors">
                  <span className="text-[#ff4500] font-bold">•</span>
                  <span>HDFC BANK SWITCH</span>
                </span>
                <span className="flex items-center space-x-1 hover:text-white transition-colors">
                  <span className="text-[#ff4500] font-bold">•</span>
                  <span>ICICI GATEWAY</span>
                </span>
                <span className="flex items-center space-x-1 hover:text-white transition-colors">
                  <span className="text-[#ff4500] font-bold">•</span>
                  <span>AXIS CBS DEFERRAL</span>
                </span>
                <span className="flex items-center space-x-1 hover:text-white transition-colors">
                  <span className="text-[#ff4500] font-bold">•</span>
                  <span>SBI CORE BANKING</span>
                </span>
              </div>
            </section>

            {/* Metric KPI Cards */}
            <MetricCards metrics={metrics} />

            {/* Closed-Loop AI Recovery Engine Showcase */}
            <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
              <div className="bg-[#090909] rounded-3xl p-8 sm:p-14 border border-white/[0.08] relative overflow-hidden space-y-10 shadow-2xl">
                
                {/* Header Line */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                    closed-loop recovery - <br />
                    <span className="text-zinc-500 font-normal">/ with</span> dynamic razorpay execution.
                  </h2>
                  <div className="text-right text-xs font-mono text-zinc-500 uppercase">
                    2026 ARCHITECTURE <br />
                    <span className="text-[#ff4500] font-bold">CORE ENGINE</span>
                  </div>
                </div>

                {/* Center Floating Card & Terminal Visual */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  
                  <div className="md:col-span-6 flex justify-center">
                    <div className="bg-white text-black p-6 rounded-3xl max-w-sm w-full shadow-2xl space-y-4 font-mono">
                      <div className="flex items-center justify-between text-[11px] text-zinc-500">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold uppercase">LIVE TERMINAL</span>
                        <span>RZP_V4_SECURE</span>
                      </div>

                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black relative">
                        <img
                          src="/assets/infra_terminal.jpg"
                          alt="Razorpay Autonomous Recovery Terminal"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div>
                        <h4 className="font-display font-black text-lg text-black">
                          Multi-Route Smart Retry
                        </h4>
                        <div className="text-2xl font-black text-[#ff4500] mt-1">
                          ₹49,900 <span className="text-xs text-zinc-500 font-normal">SALVAGED PEAK</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-600 leading-snug">
                        The elite ReviveAI switch intercepts gateway timeouts and autonomously settles dropped orders.
                      </p>

                      <button
                        onClick={() => setActiveTab('portal')}
                        className="w-full py-2.5 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-colors cursor-pointer"
                      >
                        SIMULATE CHECKOUT LINK →
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-6 space-y-6">
                    <div className="text-xs font-mono text-zinc-400 space-y-2">
                      <span className="text-[#ff4500] font-bold">AUTONOMOUS DISPATCH VECTORS -&gt;</span>
                      <p className="text-zinc-300 leading-relaxed font-sans text-sm">
                        Featuring real-time decline classification. ReviveAI deploys individual multi-channel recovery routes according to customer lifetime value (LTV) and risk profile.
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-2 font-mono text-xs">
                      <span className="px-4 py-1.5 rounded-full bg-[#ff4500] text-black font-bold">
                        [01] Smart Retry
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-white/[0.04] text-zinc-300 border border-white/[0.08] hover:text-white cursor-pointer">
                        WhatsApp 1-Click
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-white/[0.04] text-zinc-300 border border-white/[0.08] hover:text-white cursor-pointer">
                        VIP Concession
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-white/[0.04] text-zinc-300 border border-white/[0.08] hover:text-white cursor-pointer">
                        UPI Deep-Link
                      </span>
                    </div>

                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500">
                      <span>Zero Reputational Risk</span>
                      <span>•</span>
                      <span>High Conversion</span>
                      <span>•</span>
                      <span>Hard ROI</span>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* Autonomous Recovery Hub & Telemetry Section */}
            <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16 hairline-b">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#ff4500] uppercase tracking-wider mb-8">
                <span className="w-2.5 h-2.5 bg-[#ff4500]"></span>
                <span>Autonomous Recovery Telemetry</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left Statement */}
                <div className="md:col-span-4 space-y-4">
                  <h2 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
                    telemetry <span className="text-[#ff4500]">/</span>
                  </h2>

                  <p className="text-sm font-mono text-zinc-300 leading-relaxed italic">
                    “Every dropped checkout is a salvageable transaction. ReviveAI ensures zero revenue leakage across the entire payment stack.”
                  </p>

                  <button
                    onClick={() => setActiveTab('agent')}
                    className="text-xs font-mono font-bold text-[#ff4500] hover:text-white uppercase flex items-center space-x-1 transition-colors underline underline-offset-4 cursor-pointer"
                  >
                    <span>SEE AGENT REASONING LOGS -&gt;</span>
                  </button>
                </div>

                {/* Center Operations Hub Card */}
                <div className="md:col-span-4 flex justify-center">
                  <div className="relative rounded-2xl overflow-hidden border border-white/[0.12] aspect-[4/3] max-w-xs w-full shadow-2xl bg-black group">
                    <img
                      src="/assets/infra_recovery.jpg"
                      alt="Autonomous Operations Hub"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10 font-mono">
                      <span className="text-xs font-bold text-white block">/ Autonomous Telemetry Node</span>
                      <span className="text-[10px] text-zinc-400">Live Razorpay Fleet Orchestration</span>
                    </div>
                  </div>
                </div>

                {/* Right Giant Number */}
                <div className="md:col-span-4 text-center md:text-right space-y-2">
                  <div className="font-display font-black text-6xl sm:text-7xl lg:text-8xl text-zinc-400">
                    (98.4%)
                  </div>
                  <div className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
                    salvaged<span className="text-[#ff4500]">.</span>
                  </div>
                </div>

              </div>
            </section>

            {/* Transactions Stream Table (Compact Live Stream on Homepage) */}
            <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 space-y-12">
              <TransactionTable
                transactions={transactions}
                onRecoverSingle={handleRecoverSingle}
                onOpenPortal={handleOpenPortal}
                onOpenAudit={(t) => setAuditTxn(t)}
                isRecoveringId={recoveringId}
                isCompact={true}
                onViewAll={() => setActiveTab('transactions')}
              />

              {/* 3-Step Autonomous Protocol Summary (Clean, uncluttered overview) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-6 rounded-2xl bg-[#090909] border border-white/[0.08] space-y-3 shadow-xl hover:border-white/[0.15] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="editorial-bracket">(01)</span>
                    <span className="text-[10px] font-mono text-[#ff4500] uppercase tracking-wider font-bold">
                      INGEST & DIAGNOSE
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white">
                    Silent Webhook Intercept
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Captures declined checkout intents across Razorpay in under 50ms and classifies root failure vectors with ML diagnostic scoring.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#090909] border border-white/[0.08] space-y-3 shadow-xl hover:border-white/[0.15] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="editorial-bracket">(02)</span>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                      GUARDRAIL & STRATEGY
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white">
                    Policy-Enforced Routing
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    Selects optimal Smart Retry or VIP WhatsApp link without violating retry frequency ceilings or customer margin caps.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#090909] border border-white/[0.08] space-y-4 shadow-xl hover:border-white/[0.15] transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="editorial-bracket">(03)</span>
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold">
                        CLOSED-LOOP SETTLEMENT
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base text-white">
                      Instant Revenue Salvage
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      Customer resolves payment via dynamic Razorpay link. Real-time webhook updates immutable financial audit ledgers.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                    <button
                      onClick={() => setActiveTab('agent')}
                      className="text-[#ff4500] hover:text-white font-bold inline-flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <span>AGENT STUDIO →</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('portal')}
                      className="text-zinc-400 hover:text-white inline-flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <span>TEST SIMULATOR →</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB: TRANSACTIONS & RECOVERY LEDGER (DEDICATED FULL-SCREEN VIEW) */}
        {activeTab === 'transactions' && (
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="editorial-bracket">(01)</span>
                  <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white uppercase">
                    Financial Transactions & Recovery Stream
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Complete audit log of ingested Razorpay declines, ML diagnostics, and real-time intervention statuses
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleTriggerBatch}
                  disabled={isBatchRunning}
                  className="px-4 py-2 rounded-xl bg-[#ff4500] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#ff571a] transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#ff4500]/20"
                >
                  {isBatchRunning ? 'Executing AI Sweep...' : '⚡ Sweep & Recover All'}
                </button>
              </div>
            </div>

            <TransactionTable
              transactions={transactions}
              onRecoverSingle={handleRecoverSingle}
              onOpenPortal={handleOpenPortal}
              onOpenAudit={(t) => setAuditTxn(t)}
              isRecoveringId={recoveringId}
              isCompact={false}
            />
          </div>
        )}

        {/* TAB 2: AGENT STUDIO */}
        {activeTab === 'agent' && (
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="editorial-bracket">(02)</span>
                  <h2 className="font-display font-bold text-2xl tracking-tight text-white uppercase">
                    Agent Studio & Guardrails
                  </h2>
                </div>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  Inspect autonomous reasoning graphs, tool decisions, and financial policy safeguards
                </p>
              </div>

              <button
                onClick={handleTriggerBatch}
                disabled={isBatchRunning}
                className="px-4 py-2 rounded bg-[#ff4500] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#ff571a] transition-all disabled:opacity-50"
              >
                {isBatchRunning ? 'Executing...' : 'Run Autonomous Sweep'}
              </button>
            </div>

            <AgentConsole
              logs={agentLogs}
              onRefreshLogs={loadAllData}
            />
          </div>
        )}

        {/* TAB: HOW IT WORKS */}
        {activeTab === 'how-it-works' && (
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10">
            <HowItWorks />
          </div>
        )}

        {/* TAB 3: DIAGNOSTICS & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10">
            <DiagnosticsChart metrics={metrics} />
          </div>
        )}

        {/* TAB 4: CUSTOMER PORTAL */}
        {activeTab === 'portal' && (
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="editorial-bracket">(04)</span>
              <h2 className="font-display font-bold text-2xl tracking-tight text-white uppercase">
                Customer Recovery Checkout
              </h2>
              <p className="text-xs text-zinc-500 font-mono">
                Simulate the end-customer recovery experience powered by dynamic Razorpay links
              </p>
            </div>

            <CustomerPortal
              selectedLinkId={selectedLinkId || transactions.find(t => t.payment_link_id)?.payment_link_id}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>
        )}

      </main>

      {/* Audit Detail Modal */}
      {auditTxn && (
        <AuditTrailModal
          transaction={auditTxn}
          onClose={() => setAuditTxn(null)}
        />
      )}

      {/* Giant Dribbble Vibrant Electric Orange Footer (matching "silence. Let's Rollin!") */}
      <footer className="bg-[#ff4500] text-black font-mono overflow-hidden">
        
        {/* Top Info Strip */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs hairline-b border-black/20">
          <div>
            <div className="font-bold">ReviveAI 2026</div>
            <div className="text-black/80 mt-1">MON 24 AUG | 10:45 | 24°C</div>
          </div>
          <div>
            <div>+91 (80) 4123-4567</div>
            <div className="text-black/80">recovery@reviveai.in</div>
            <div className="text-black/80 mt-1">Koramangala, Bangalore</div>
          </div>
          <div>
            <div>All rights reserved</div>
            <div className="text-black/80">Privacy Policy</div>
            <div className="text-black/80">Terms of Service</div>
          </div>
          <div>
            <div>Razorpay Partner</div>
            <div className="text-black/80">NPCI Integrated</div>
            <div className="text-black/80">WhatsApp API Verified</div>
          </div>
        </div>

        {/* Massive Full-Bleed Typography */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 flex flex-col sm:flex-row items-baseline justify-between gap-4">
          <h2 className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter text-black leading-none select-none">
            reviveai. Let's Recover!
          </h2>
        </div>

        {/* Bottom Sub-bar */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 pb-8 flex items-center justify-between text-xs font-bold border-t border-black/20 pt-4">
          <span>/ est. 2026</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-1 hover:underline cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </footer>

    </div>
  );
}
