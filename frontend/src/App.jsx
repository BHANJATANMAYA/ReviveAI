import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import MetricCards from './components/MetricCards';
import TransactionTable from './components/TransactionTable';
import AgentConsole from './components/AgentConsole';
import DiagnosticsChart from './components/DiagnosticsChart';
import CustomerPortal from './components/CustomerPortal';
import AuditTrailModal from './components/AuditTrailModal';
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
      desc: "Instant routing to backup bank gateways when primary acquirers timeout."
    },
    {
      id: 1,
      title: "/ Autonomous Recovery",
      desc: "Want to supercharge your checkout? We offer real-time AI failure diagnosis and individual multi-channel salvage.",
      linkText: "Get started here"
    },
    {
      id: 2,
      title: "Guardrail Vault",
      desc: "Strict safety boundaries enforcing max retry limits and margin ceilings."
    },
    {
      id: 3,
      title: "WhatsApp & SMS Nudges",
      desc: "Personalized deep-link reminders for high-intent customer cart drop-offs."
    }
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col selection:bg-[#ff4500] selection:text-black">
      
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
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* TAB 1: COMMAND CENTER */}
        {activeTab === 'dashboard' && (
          <div className="space-y-0">
            
            {/* Dynamic Dribbble Hero */}
            <HeroBanner
              onTriggerBatch={handleTriggerBatch}
              isBatchRunning={isBatchRunning}
              metrics={metrics}
            />

            {/* Dribbble Facility & Programs Layout Section */}
            <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16 hairline-b">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#ff4500] uppercase tracking-wider mb-8">
                <span className="w-2.5 h-2.5 bg-[#ff4500]"></span>
                <span>Our facility and programs</span>
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
                        className="cursor-pointer group pt-4 hairline-t first:border-t-0"
                      >
                        <h3 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
                          isSelected ? 'text-[#ff4500]' : 'text-zinc-400 group-hover:text-white'
                        }`}>
                          {prog.title}
                        </h3>

                        {isSelected && (
                          <div className="mt-2 space-y-1 font-mono text-xs text-zinc-400 leading-relaxed">
                            <p>{prog.desc}</p>
                            {prog.linkText && (
                              <button
                                onClick={handleTriggerBatch}
                                className="text-[#ff4500] font-bold underline underline-offset-4 pt-1 block"
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

                {/* Right Arched Stadium Card */}
                <div className="lg:col-span-6 relative">
                  <div className="relative rounded-tl-[60px] rounded-br-[60px] rounded-tr-2xl rounded-bl-2xl overflow-hidden border-2 border-[#ff4500] aspect-[4/3] shadow-2xl shadow-[#ff4500]/10 group">
                    <img
                      src="/assets/dribbble_facility.jpg"
                      alt="ReviveAI Facility Hub"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Rotated Vertical Badge */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 bg-[#ff4500] text-black font-mono font-black text-xs px-3 py-1 rounded-r-md -rotate-90 origin-bottom-left uppercase tracking-widest">
                      reviveai.
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

            {/* Dribbble Dark Capsule Feature Section ("dive into the past" analog) */}
            <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
              <div className="bg-[#0e0e0e] rounded-3xl p-8 sm:p-14 border border-zinc-800 relative overflow-hidden space-y-10">
                
                {/* Header Line */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                    dive into the past - <br />
                    <span className="text-zinc-500 font-normal">/ with</span> reviveai vintage collection.
                  </h2>
                  <div className="text-right text-xs font-mono text-zinc-500 uppercase">
                    2026 ESSENTIALS <br />
                    <span className="text-white font-bold">PRODUCT</span>
                  </div>
                </div>

                {/* Center Floating White Card & Deck Image */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  
                  <div className="md:col-span-6 flex justify-center">
                    <div className="bg-white text-black p-6 rounded-3xl max-w-sm w-full shadow-2xl space-y-4 font-mono">
                      <div className="flex items-center justify-between text-[11px] text-zinc-500">
                        <span className="px-2 py-0.5 rounded bg-zinc-200 text-black font-bold uppercase">HOT DROP</span>
                        <span>RZP_V4</span>
                      </div>

                      <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 relative">
                        <img
                          src="/assets/dribbble_product.jpg"
                          alt="Custom Vintage Deck"
                          className="w-full h-full object-contain p-2 hover:scale-105 transition-transform"
                        />
                      </div>

                      <div>
                        <h4 className="font-display font-black text-lg text-black">
                          Multi-Route UPI Engine
                        </h4>
                        <div className="text-2xl font-black text-[#ff4500] mt-1">
                          ₹49,900 <span className="text-xs text-zinc-500 font-normal">SALVAGED AVG</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-600 leading-snug">
                        The elite ReviveAI UPI switch intercepts gateway disconnects and auto-recovers orders.
                      </p>

                      <button
                        onClick={() => setActiveTab('portal')}
                        className="w-full py-2.5 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-colors"
                      >
                        VIEW CHECKOUT LINK →
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-6 space-y-6">
                    <div className="text-xs font-mono text-zinc-400">
                      <span className="text-[#ff4500]">LET'S DIVE IN -&gt;</span>
                      <p className="mt-2 text-zinc-300">
                        Featuring raw decline recovery from the past. We are adding new bank failure routes every week, keep checking back!
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-2 font-mono text-xs">
                      <span className="px-4 py-1.5 rounded-full bg-[#ff4500] text-black font-bold">
                        [01] Essentials
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-zinc-900 text-zinc-300 hairline-border hover:text-white cursor-pointer">
                        Vintage
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-zinc-900 text-zinc-300 hairline-border hover:text-white cursor-pointer">
                        By Batch
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-zinc-900 text-zinc-300 hairline-border hover:text-white cursor-pointer">
                        Limited Editions
                      </span>
                    </div>

                    <div className="pt-4 hairline-t flex items-center justify-between text-xs font-mono text-zinc-500">
                      <span>Community & Storytelling</span>
                      <span>•</span>
                      <span>High Conversion</span>
                      <span>•</span>
                      <span>Sustainable ROI</span>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* Dribbble Featured Operators & Numbers Section (matching "featured / (69+) artists.") */}
            <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16 hairline-b">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#ff4500] uppercase tracking-wider mb-8">
                <span className="w-2.5 h-2.5 bg-[#ff4500]"></span>
                <span>AI operators around the world</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left Statement */}
                <div className="md:col-span-4 space-y-4">
                  <h2 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
                    featured <span className="text-[#ff4500]">/</span>
                  </h2>

                  <p className="text-sm font-mono text-zinc-300 leading-relaxed italic">
                    “They always say time changes things, but you actually have to change them yourself.”
                  </p>

                  <button
                    onClick={() => setActiveTab('agent')}
                    className="text-xs font-mono font-bold text-[#ff4500] hover:text-white uppercase flex items-center space-x-1 transition-colors underline underline-offset-4"
                  >
                    <span>SEE AGENT LOGS -&gt;</span>
                  </button>
                </div>

                {/* Center Arched Portrait Card */}
                <div className="md:col-span-4 flex justify-center">
                  <div className="relative rounded-t-[50px] rounded-b-2xl overflow-hidden border-2 border-[#ff4500] aspect-[3/4] max-w-xs w-full shadow-2xl group">
                    <img
                      src="/assets/dribbble_operator.jpg"
                      alt="Pac Vinsen Recovery Lead"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-3 rounded-xl hairline-border font-mono">
                      <span className="text-xs font-bold text-white block">/ Pac Vinsen</span>
                      <span className="text-[10px] text-zinc-400">Lead Autonomous Recovery Ops</span>
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

            {/* Transactions Stream Table */}
            <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 space-y-12">
              <TransactionTable
                transactions={transactions}
                onRecoverSingle={handleRecoverSingle}
                onOpenPortal={handleOpenPortal}
                onOpenAudit={(t) => setAuditTxn(t)}
                isRecoveringId={recoveringId}
              />

              {/* Agent Console Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <AgentConsole
                    logs={agentLogs}
                    onRefreshLogs={loadAllData}
                  />
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <div className="p-6 rounded-2xl bg-[#0e0e0e] hairline-border space-y-4 font-mono text-xs">
                    <div className="flex items-center space-x-2 text-[#ff4500]">
                      <Zap className="w-4 h-4" />
                      <span className="font-bold uppercase tracking-wider">How ReviveAI Works</span>
                    </div>

                    <p className="text-zinc-400 leading-relaxed font-sans text-xs">
                      ReviveAI sits atop Razorpay webhooks, ingests declines, runs real-time ML diagnostic scoring, and dynamically selects the highest-ROI salvage vector.
                    </p>

                    <div className="space-y-2 pt-2 hairline-t">
                      <div className="flex items-center justify-between text-zinc-300">
                        <span>• Razorpay Smart Retries</span>
                        <span className="text-emerald-400 font-bold">78% Salvage</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-300">
                        <span>• Dynamic Payment Links</span>
                        <span className="text-razor-blue font-bold">64% Salvage</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-300">
                        <span>• WhatsApp Deep-links</span>
                        <span className="text-purple-400 font-bold">72% Salvage</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#ff4500]/20 to-[#080808] border border-[#ff4500]/30 space-y-3 font-mono text-xs">
                    <span className="editorial-bracket">(04)</span>
                    <h4 className="font-display font-bold text-sm text-white uppercase">
                      Live Customer Simulator
                    </h4>
                    <p className="text-zinc-400 font-sans text-xs">
                      Experience how end customers resolve payments through generated dynamic Razorpay links.
                    </p>
                    <button
                      onClick={() => setActiveTab('portal')}
                      className="w-full py-2.5 rounded bg-white text-black font-bold text-xs tracking-wider uppercase flex items-center justify-center space-x-1 hover:bg-zinc-200 transition-colors"
                    >
                      <span>Open Customer Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

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
