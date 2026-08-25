import React, { useState } from 'react';
import { Layers, ShieldCheck, Send, CheckCircle2, ChevronRight } from 'lucide-react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Silent Webhook Intercept',
      subtitle: 'STAGE 01 // INGESTION',
      icon: Layers,
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
      desc: 'ReviveAI intercepts declining transaction payloads at the gateway API level in less than 50 milliseconds. The failure packet is immediately ingested into our ML classification pipeline to determine the failure vector (e.g., MPIN Cancelled, Insufficient Funds, Issuer CBS Maintenance).',
      detailCode: `// Telemetry Webhook Payload Ingested
{
  "event": "payment.failed",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_failed_txn_908",
        "amount": 299000, // ₹2,990
        "method": "upi",
        "error_code": "BAD_REQUEST_PAYMENT_TIMED_OUT",
        "error_description": "Issuer bank CBS response timed out"
      }
    }
  }
}`
    },
    {
      num: '02',
      title: 'ML Diagnostics & Guardrails',
      subtitle: 'STAGE 02 // RULES ENGINE',
      icon: ShieldCheck,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      desc: 'Our probability engine calculates recovery success metrics based on historical gateway health, user checkout profiles, and lifetime value (LTV). It checks three critical financial policy guardrails: 1) Retry budget capped at 3, 2) Message frequency cap at 2 nudge communications, and 3) VIP discount margin constraints <= 15%.',
      detailCode: `// Calibrating Policy Attributions
[Guardrails Vault Assessment]
- Frequency check: Passed (1 of 2 limits)
- Margin Check: OK (Attributed Concession: 5%)
- Retry Budget Check: Passed (Attempts: 0/3)
----------------------------------------
ML Attributed Probability: 92.4% (HIGH)`
    },
    {
      num: '03',
      title: 'Multi-Channel Conduit Dispatch',
      subtitle: 'STAGE 03 // INTERVENTION',
      icon: Send,
      color: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
      desc: 'Depending on the failure diagnostic, ReviveAI dispatches tailored intervention routes: 1) Low-latency bank gateways failover for technical retry failures, 2) Rich WhatsApp Deep-links nudging the customer to complete payment, or 3) Dynamic Payment Links providing secondary checkout methods with integrated retention discounts.',
      detailCode: `// Dispatching Intervention Conduits
[Vector: WHATSAPP_1CLICK_RECOVERY]
- Customer Cell: +91 98000 12345
- Payload conduit: plink_failed_checkout_908
- Channel Status: Sent via WhatsApp API
- Delivery telemetry: Delivered & Opened`
    },
    {
      num: '04',
      title: 'Closed-Loop Settlement Ledger',
      subtitle: 'STAGE 04 // RESOLUTION',
      icon: CheckCircle2,
      color: 'text-[#ff4500] border-[#ff4500]/25 bg-[#ff4500]/10',
      desc: 'The customer clicks the recovery link and completes checkout on our secure portal. ReviveAI captures the settlement webhook, terminates the active sweep pipeline, processes the attribution ROI metrics, and writes an immutable cryptographic ledger entry to the financial audit database.',
      detailCode: `// Ledger Entry Finalized
{
  "transaction_id": "txn_908",
  "status": "RECOVERED",
  "amount_recovered": 299000,
  "discount_applied_pct": 5,
  "actor": "reviveai_agent_autopilot",
  "conduit_method": "upi_deep_link",
  "immutable_signature": "sha256_82f1b4028cc076f8"
}`
    }
  ];

  const currentStep = steps[activeStep];
  const StepIcon = currentStep.icon;

  return (
    <div className="space-y-10 py-6 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="editorial-bracket">(03)</span>
            <h2 className="font-display font-bold text-sm tracking-tight text-white uppercase font-bold">
              Autonomous Recovery Workflow
            </h2>
          </div>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            Understanding the closed-loop ML diagnostic architecture from decline ingestion to financial ledger settlement
          </p>
        </div>
      </div>

      {/* Main Timeline Bento Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Step Selector List */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {steps.map((step, idx) => {
              const active = idx === activeStep;
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`cursor-pointer group p-5 rounded-2xl border transition-all duration-300 flex items-center space-x-4 ${
                    active
                      ? 'bg-white/[0.04] border-[#ff4500] shadow-[0_0_15px_rgba(255,69,0,0.1)]'
                      : 'bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.02] hover:border-white/[0.12]'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl border transition-colors ${
                    active ? 'bg-[#ff4500] text-black border-[#ff4500]' : 'bg-white/[0.02] border-white/[0.06] text-zinc-500 group-hover:text-zinc-300'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold tracking-wider">{step.subtitle}</span>
                    <span className={`text-sm font-sans font-bold transition-colors ${active ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                      {step.title}
                    </span>
                  </div>

                  <ChevronRight className={`w-4 h-4 transition-transform ${active ? 'text-[#ff4500] translate-x-1' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                </div>
              );
            })}
          </div>

          <div className="p-5 rounded-2xl bg-[#ff4500]/5 border border-[#ff4500]/10 font-mono text-[10px] text-zinc-400 leading-normal flex items-start space-x-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4500] mt-1 shrink-0 animate-pulse"></span>
            <p>
              Each transaction is processed automatically under 256-bit isolation. Guardrails enforce margin thresholds to prevent negative coupon attribution.
            </p>
          </div>
        </div>

        {/* Right Side: Step Detailed Visualization Card */}
        <div className="lg:col-span-7">
          <div className="h-full bg-[#070709]/50 backdrop-blur-xl rounded-[2rem] border border-white/[0.08] p-8 sm:p-10 flex flex-col justify-between space-y-8 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden group hover:border-white/15 transition-all duration-300">
            
            <div className="absolute top-[-30%] right-[-10%] w-44 h-44 bg-[#ff4500]/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Step Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="editorial-bracket">({currentStep.num})</span>
                <span className={`text-[10px] font-mono font-bold tracking-wider px-3 py-1 rounded-full border ${currentStep.color}`}>
                  {currentStep.subtitle}
                </span>
              </div>
              
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase pt-2">
                {currentStep.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed tracking-tight">
                {currentStep.desc}
              </p>
            </div>

            {/* Code / Debug Sandbox Telemetry */}
            <div className="relative rounded-2xl bg-black/60 border border-white/[0.06] overflow-hidden p-5 font-mono text-[10px] leading-relaxed text-emerald-400/90 shadow-inner">
              <div className="absolute top-3 right-3 text-[8px] font-bold text-zinc-700 select-none">DEBUG_CORE_SANDBOX</div>
              <pre className="overflow-x-auto">{currentStep.detailCode}</pre>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
