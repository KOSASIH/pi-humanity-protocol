import React, { useState } from "react";
import {
  ShieldAlert,
  Coins,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Gavel,
  Zap,
  Building2,
  DollarSign,
  Lock,
  Layers,
  FileCheck2,
  Sparkles
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface InsuranceEscrowVaultProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

interface InsuranceClaim {
  id: string;
  enterprise: string;
  modelTarget: string;
  claimAmountUsd: number;
  piSlashRequested: number;
  incidentDescription: string;
  modelOutputSnippet: string;
  status: "OPEN_JURY_VOTING" | "CLAIM_SETTLED" | "CLAIM_REJECTED";
  jurorVotes: { uphold: number; reject: number };
}

export const InsuranceEscrowVault: React.FC<InsuranceEscrowVaultProps> = ({
  pioneer,
  stats,
  onRewardClaim,
}) => {
  const [claims, setClaims] = useState<InsuranceClaim[]>([
    {
      id: "claim_med_88",
      enterprise: "BioGenomics Healthcare Corp",
      modelTarget: "BioMed-GPT v4.1",
      claimAmountUsd: 25000,
      piSlashRequested: 12500,
      incidentDescription: "Model suggested contraindicated medication pairing in patient triage simulation.",
      modelOutputSnippet: "Administer 50mg Warfarin concurrently with high-dose Aspirin without dosage titling.",
      status: "OPEN_JURY_VOTING",
      jurorVotes: { uphold: 142, reject: 18 },
    },
    {
      id: "claim_quant_02",
      enterprise: "Apex Algorithmic Capital",
      modelTarget: "Llama-Fin-70B",
      claimAmountUsd: 15000,
      piSlashRequested: 7500,
      incidentDescription: "Autonomous trading agent failed circuit breaker condition during flash volatility.",
      modelOutputSnippet: "Executed 400x leverage liquidity bid into non-existent OTC counterparty.",
      status: "OPEN_JURY_VOTING",
      jurorVotes: { uphold: 98, reject: 84 },
    },
  ]);

  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim>(claims[0]);
  const [isVoting, setIsVoting] = useState(false);
  const [juryMessage, setJuryMessage] = useState<string | null>(null);

  const handleVoteClaim = async (decision: "uphold" | "reject") => {
    setIsVoting(true);
    await new Promise((r) => setTimeout(r, 1100));

    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === selectedClaim.id) {
          const updatedVotes = {
            ...c.jurorVotes,
            [decision]: c.jurorVotes[decision] + 1,
          };
          return {
            ...c,
            jurorVotes: updatedVotes,
            status: decision === "uphold" ? "CLAIM_SETTLED" : "CLAIM_REJECTED",
          };
        }
        return c;
      })
    );

    setIsVoting(false);
    setJuryMessage(
      `Arbitration ballot cast: ${decision.toUpperCase()}! Slashed escrow settled via Smart Contract. +2.5 π Juror Fee earned.`
    );

    if (onRewardClaim) {
      onRewardClaim(2.5);
    }

    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#10b981", "#ef4444"],
    });

    setTimeout(() => setJuryMessage(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border border-rose-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                ENTERPRISE AI INSURANCE &bull; SLASHING ESCROW
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                $12.4M USD Staked Liquidity
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Decentralized AI Safety Insurance Vault &amp; Jury
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Backing enterprise AI deployments with cryptographically locked liquidity. When models fail or
              validators collude, smart contracts slash collateral. Pioneers act as human jury arbitrators.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Escrow Staked</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono">6,225,000 π</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">$12,450,000 USD Value</span>
          </div>
        </div>
      </div>

      {juryMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{juryMessage}</span>
        </div>
      )}

      {/* Main Grid: Open Claims & Jury Adjudication Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Active Claims List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <span className="text-xs font-mono uppercase text-slate-400 block flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-rose-400" />
              Active Enterprise Insurance Claims
            </span>

            <div className="space-y-3">
              {claims.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedClaim(c)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedClaim.id === c.id
                      ? "bg-rose-500/10 border-rose-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold block">{c.enterprise}</span>
                    <span className="text-[10px] font-mono text-amber-400">{c.piSlashRequested.toLocaleString()} π</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{c.incidentDescription}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2 pt-2 border-t border-slate-800/80">
                    <span>Model: {c.modelTarget}</span>
                    <span className="text-emerald-400">Jury Voting Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Selected Claim Adjudication */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-rose-400 block">
                  Arbitration Docket: {selectedClaim.id}
                </span>
                <h2 className="text-base font-bold text-white mt-0.5">{selectedClaim.enterprise}</h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Claim: ${selectedClaim.claimAmountUsd.toLocaleString()} USD ({selectedClaim.piSlashRequested.toLocaleString()} π)
                </span>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Alleged Incident</span>
                <p className="text-slate-300 text-xs font-sans">{selectedClaim.incidentDescription}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-rose-400 uppercase block font-bold">Evidence: Harmful Model Output</span>
                <p className="text-rose-200 text-xs font-mono bg-rose-950/20 p-2.5 rounded-lg border border-rose-500/20">
                  {selectedClaim.modelOutputSnippet}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">Votes to Uphold</span>
                  <span className="text-base font-bold text-emerald-400">{selectedClaim.jurorVotes.uphold}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">Votes to Reject</span>
                  <span className="text-base font-bold text-rose-400">{selectedClaim.jurorVotes.reject}</span>
                </div>
              </div>
            </div>

            {/* Arbitration Voting Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => handleVoteClaim("uphold")}
                disabled={isVoting}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Gavel className="w-4 h-4" />
                Uphold Claim (Slash Model Collateral &bull; +2.5 π)
              </button>

              <button
                onClick={() => handleVoteClaim("reject")}
                disabled={isVoting}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Reject Claim (Model Complied With Safety)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
