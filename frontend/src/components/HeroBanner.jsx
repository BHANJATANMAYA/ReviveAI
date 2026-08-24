import React from 'react';
import { ArrowUpRight, Play, Cpu, ShieldCheck, Zap, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroBanner({ onTriggerBatch, isBatchRunning, metrics }) {
  return (
    <section className="relative overflow-hidden bg-[#080808] hairline-b">
      
      {/* Top Hero Dynamic Visual Container (matching Dribbble "silence." skater hero) */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[21/8] min-h-[360px] max-h-[580px] overflow-hidden">
        <img
          src="/assets/dribbble_hero.jpg"
          alt="ReviveAI Dynamic Leaper"
          className="w-full h-full object-cover object-center brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40"></div>

        {/* Floating Editorial Badges */}
        <div className="absolute top-6 left-6 sm:left-12 flex items-center space-x-2 text-xs font-mono text-white/90">
          <span className="text-[#ff4500] font-bold">/</span>
          <span>est. 2026</span>
        </div>

        <div className="absolute top-6 right-6 sm:right-12 flex items-center space-x-2 text-xs font-mono text-white/90">
          <span className="text-[#ff4500] font-bold">/</span>
          <span className="uppercase tracking-widest">Let's Recover!</span>
        </div>

        {/* Giant Dribbble-style Signature Wordmark over Hero */}
        <div className="absolute bottom-2 sm:bottom-4 left-6 sm:left-12 right-6 sm:right-12">
          <h1 className="font-display font-black text-6xl sm:text-8xl md:text-9xl lg:text-[140px] xl:text-[170px] tracking-tighter text-[#ff4500] leading-none select-none drop-shadow-2xl">
            reviveai<span className="text-white">.</span>
          </h1>
        </div>
      </div>

      {/* Editorial Sub-Headline & Action Section (matching Dribbble layout) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Statement */}
          <div className="lg:col-span-7">
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.05]">
              <span className="text-[#ff4500] mr-2">/</span>
              enhance your checkout revenue experience.
            </h2>
          </div>

          {/* Right Sub-Info & Avatars */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-zinc-400">/perfect recovery agent</p>
                <div className="flex items-center -space-x-2 mt-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-[10px] font-bold text-[#ff4500] font-mono">
                    AI
                  </div>
                  <div className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-black flex items-center justify-center text-[10px] font-bold text-white font-mono">
                    RZP
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#ff4500] border-2 border-black flex items-center justify-center text-[10px] font-bold text-black font-mono">
                    99%
                  </div>
                </div>
              </div>

              <button
                onClick={onTriggerBatch}
                disabled={isBatchRunning}
                className="text-xs font-mono font-bold text-[#ff4500] hover:text-white uppercase flex items-center space-x-1.5 transition-colors underline underline-offset-4"
              >
                <span>RUN AUTOPILOT FLEET</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              One of the most exciting aspects of revenue recovery is discovering dropped revenue streams in real time. Online businesses lose up to 25% of GMV to silent gateway declines—ReviveAI autonomously intercepts and salvages every drop.
            </p>

            <div className="pt-2">
              <button
                onClick={onTriggerBatch}
                disabled={isBatchRunning}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#ff4500] hover:bg-[#ff571a] text-black font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-xl shadow-[#ff4500]/25 group disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 fill-black ${isBatchRunning ? 'animate-pulse text-zinc-900' : ''}`} />
                <span>{isBatchRunning ? 'EXECUTING AUTONOMOUS SWEEP...' : 'EXECUTE RECOVERY SWEEP'}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
