import React, { useState } from "react";
import {
  CreditCard,
  Coins,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Flame,
  FileCheck2,
  ExternalLink,
  Layers,
  Terminal,
  Copy,
  Check,
  Building2,
  Users
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface StripeFiatPiEngineProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRefreshStats?: () => void;
  onRewardClaim?: (piAmount: number) => void;
}

export const StripeFiatPiEngine: React.FC<StripeFiatPiEngineProps> = ({
  pioneer,
  stats,
  onRefreshStats,
  onRewardClaim,
}) => {
  const [taskPrompt, setTaskPrompt] = useState("audit this model for bias and safety");
  const [humanCount, setHumanCount] = useState<number>(1000);
  const [companyName, setCompanyName] = useState("Anthropic AI Alliance");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<any | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  // Economic calculations:
  // $1.00 USD per human check
  // 80% (0.80 Pi) goes to workers (Pioneers)
  // 20% (0.20 Pi) kept by Treasury for liquidity & burn
  const totalFiatUsd = humanCount * 1.0;
  const workerPayoutPi = humanCount * 0.8;
  const treasuryRetainedPi = humanCount * 0.2;

  const handleRentHumans = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch("/api/rent-humans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: taskPrompt,
          count: humanCount,
          companyName: companyName,
          fiatUsdAmount: totalFiatUsd,
        }),
      });

      const data = await res.json();
      setIsProcessing(false);

      if (data.success) {
        setLastReceipt(data);
        if (onRefreshStats) onRefreshStats();
        if (onRewardClaim) onRewardClaim(0.8);

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#10b981", "#f59e0b"],
        });
      }
    } catch (err) {
      setIsProcessing(false);
      console.error("Failed to rent humans:", err);
    }
  };

  const curlExample = `curl -X POST https://humanity-protocol-layer.testnet.minepi.com/api/rent-humans \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_live_humanity_stripe_88" \\
  -d '{
    "task": "${taskPrompt}",
    "count": ${humanCount},
    "companyName": "${companyName}",
    "fiatUsdAmount": ${totalFiatUsd}
  }'`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <CreditCard className="w-3 h-3 text-indigo-400" />
                STRIPE FOR HUMAN INTELLIGENCE
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                Pi Testnet Block #1894218 Verified
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-amber-400 bg-amber-950/50 border border-amber-500/30">
                humanitylayer.pinet.com
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Humanity Protocol Layer: Rent a Human, Not a Bot
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Turn Pi Network into the AWS for Human Intelligence. AI companies pay fiat (USD) via Stripe,
              Pioneers earn Pi micro-rewards for auditing models, and the Treasury accumulates non-inflationary liquidity.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Today's Fiat Revenue</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              ${stats.revenueTodayUsd.toLocaleString()} USD
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">80% Settled to Pioneers in Pi</span>
          </div>
        </div>
      </div>

      {/* 4-Step Money Machine Architecture Diagram */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            The "Fiat In, Pi Out" Core Liquidity Engine
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Immune to Pi Token Market Fluctuation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <span className="text-xs font-bold text-white block">AI Company Pays Fiat</span>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Enterprises pay $1,000 USD via Stripe credit card for 1,000 KYC human audits. No crypto friction.
            </p>
            <div className="pt-2 text-xs font-mono font-bold text-blue-400">FIAT IN ($ USD)</div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <span className="text-xs font-bold text-white block">Human Swarm Dispatch</span>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Humanity Protocol dispatches tasks to 60M verified Pioneers on the Pi Browser mobile app.
            </p>
            <div className="pt-2 text-xs font-mono font-bold text-indigo-400">60M VERIFIED HUMANS</div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <span className="text-xs font-bold text-white block">800 Pi Settled to Workers</span>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Smart contract distributes 800 Pi directly to Pioneers (0.80 Pi per check). Instant real utility.
            </p>
            <div className="pt-2 text-xs font-mono font-bold text-amber-400">PI OUT (80% TO WORKERS)</div>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <span className="text-xs font-bold text-white block">200 Pi Treasury &amp; Burn</span>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              20% retained by Treasury for liquidity injection and deflationary burn. Companies get EU certificate.
            </p>
            <div className="pt-2 text-xs font-mono font-bold text-emerald-400">20% TREASURY &amp; BURN</div>
          </div>
        </div>
      </div>

      {/* Interactive Rent Humans Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <span className="text-xs font-mono uppercase text-slate-400 block flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              Rent Real Humans (Stripe API)
            </span>

            <form onSubmit={handleRentHumans} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 block">Sponsoring AI Company</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 block">Task / Safety Verification Directive</label>
                <textarea
                  rows={3}
                  value={taskPrompt}
                  onChange={(e) => setTaskPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Verified Humans Count:</span>
                  <span className="text-indigo-400 font-bold">{humanCount.toLocaleString()} Humans</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={5000}
                  step={100}
                  value={humanCount}
                  onChange={(e) => setHumanCount(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Cost Summary Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Stripe Charge (USD):</span>
                  <span className="font-bold text-white">${totalFiatUsd.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>Pioneers Receive (80%):</span>
                  <span className="font-bold">{workerPayoutPi.toLocaleString()} Pi</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Treasury Reserve (20%):</span>
                  <span className="font-bold">{treasuryRetainedPi.toLocaleString()} Pi</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                {isProcessing
                  ? "Processing Stripe Checkout & Dispatching..."
                  : `Pay $${totalFiatUsd.toLocaleString()} via Stripe & Rent Humans`}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Output & API Specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Receipt if created */}
          {lastReceipt ? (
            <div className="bg-slate-900/80 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-white">
                    Stripe Payment Settled &bull; Task Dispatched to Pi Network
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Block #{lastReceipt.blockAnchor}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block">Fiat Paid</span>
                  <span className="text-sm font-bold text-white">${lastReceipt.fiatPaidUsd.toLocaleString()} USD</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block">Workers Settled</span>
                  <span className="text-sm font-bold text-amber-400">{lastReceipt.piSettledToWorkers} Pi</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block">Treasury Retained</span>
                  <span className="text-sm font-bold text-emerald-400">{lastReceipt.piTreasuryRetained} Pi</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  EU AI Act Article 14 Compliance Certificate Issued
                </span>
                <p className="text-xs text-slate-300 font-mono break-all">
                  Certificate Token: {lastReceipt.euAiActCertificate?.token}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  Cryptographic Proof: {lastReceipt.euAiActCertificate?.cryptographicProofHash}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <span className="text-xs font-mono uppercase text-slate-400 block flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                REST API Integration: `POST /api/rent-humans`
              </span>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">cURL Request Example</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(curlExample);
                      setCopiedCurl(true);
                      setTimeout(() => setCopiedCurl(false), 2000);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedCurl ? "Copied" : "Copy cURL"}
                  </button>
                </div>

                <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 max-h-52 overflow-y-auto">
                  <pre>{curlExample}</pre>
                </div>
              </div>
            </div>
          )}

          {/* Compliance & Hackathon Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Pi Hackathon 2026 - Utilities Track
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                We are not building another social chat app. We are building the real-world economic utility layer
                that makes every AI laboratory on earth buy and burn Pi.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                Endless Fiat Liquidity
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                By charging AI companies in fiat and distributing Pi micro-rewards, the protocol constantly pumps
                purchasing power into Pioneers' pockets without relying on secondary crypto markets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
