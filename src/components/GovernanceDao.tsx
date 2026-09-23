import React, { useState } from "react";
import {
  Vote,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  Coins,
  Scale,
  Award,
  TrendingUp,
  XCircle
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface GovernanceDaoProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

interface ProposalItem {
  id: string;
  cipNumber: string;
  title: string;
  category: "Consensus Security" | "Treasury Allocation" | "ZK Cryptography" | "Pioneer Rewards";
  proposer: string;
  summary: string;
  status: "ACTIVE_VOTING" | "PASSED_TIMELOCKED" | "REJECTED";
  votesFor: number;
  votesAgainst: number;
  quorumThreshold: number;
  endsInDays: number;
}

export const GovernanceDao: React.FC<GovernanceDaoProps> = ({
  pioneer,
  stats,
  onRewardClaim,
}) => {
  const [proposals, setProposals] = useState<ProposalItem[]>([
    {
      id: "cip_42",
      cipNumber: "CIP-42",
      title: "Elevate Byzantine Quorum Minimum from 3 to 5 Nodes for Clinical & Healthcare AI Tasks",
      category: "Consensus Security",
      proposer: "@kosasih_node_id (Founder)",
      summary:
        "High-assurance medical and pharmaceutical evaluation workflows require heightened Byzantine fault tolerance. Mandate a 5-node distributed quorum across at least 3 distinct geographic clusters.",
      status: "ACTIVE_VOTING",
      votesFor: 842000,
      votesAgainst: 12500,
      quorumThreshold: 1000000,
      endsInDays: 3,
    },
    {
      id: "cip_43",
      cipNumber: "CIP-43",
      title: "Establish 500,000 π Protocol Treasury Reserve for Pioneer Node Hardware Insurance",
      category: "Treasury Allocation",
      proposer: "@tokyo_validator",
      summary:
        "Allocate a dedicated slash-protection fund to safeguard honest validator nodes experiencing accidental ISP outages or power grid failures.",
      status: "PASSED_TIMELOCKED",
      votesFor: 1240000,
      votesAgainst: 95000,
      quorumThreshold: 1000000,
      endsInDays: 0,
    },
    {
      id: "cip_44",
      cipNumber: "CIP-44",
      title: "Standardize Groth16 Zero-Knowledge SNARK Verification for Cross-Border Financial Queries",
      category: "ZK Cryptography",
      proposer: "@frankfurt_zk_core",
      summary:
        "Require all institutional banking queries through the Pi Oracle to include cryptographic personhood proofs without exposing user wallet addresses or local jurisdictions.",
      status: "ACTIVE_VOTING",
      votesFor: 692000,
      votesAgainst: 48000,
      quorumThreshold: 1000000,
      endsInDays: 5,
    },
  ]);

  const [activeTab, setActiveTab] = useState<"proposals" | "create" | "calculator">("proposals");
  const [userVotedIds, setUserVotedIds] = useState<Record<string, "FOR" | "AGAINST">>({});
  const [votingSuccess, setVotingSuccess] = useState<string | null>(null);

  // New proposal form
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ProposalItem["category"]>("Consensus Security");
  const [newSummary, setNewSummary] = useState("");

  // Quadratic voting power calculation: TrustScore * sqrt(StakedPi)
  const estimatedStakedPi = 500;
  const quadraticVotingPower = Math.round(pioneer.trustScore * Math.sqrt(estimatedStakedPi));

  const handleCastVote = (proposalId: string, choice: "FOR" | "AGAINST") => {
    if (userVotedIds[proposalId]) return;

    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === proposalId) {
          return {
            ...p,
            votesFor: choice === "FOR" ? p.votesFor + quadraticVotingPower : p.votesFor,
            votesAgainst: choice === "AGAINST" ? p.votesAgainst + quadraticVotingPower : p.votesAgainst,
          };
        }
        return p;
      })
    );

    setUserVotedIds((prev) => ({ ...prev, [proposalId]: choice }));
    setVotingSuccess(`Vote cast successfully with ${quadraticVotingPower.toLocaleString()} quadratic voting power!`);

    if (onRewardClaim) {
      onRewardClaim(1.0);
    }

    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#10b981", "#3b82f6"],
    });

    setTimeout(() => setVotingSuccess(null), 4000);
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const newCip: ProposalItem = {
      id: `cip_${Date.now()}`,
      cipNumber: `CIP-${proposals.length + 42}`,
      title: newTitle,
      category: newCategory,
      proposer: `@${pioneer.username}`,
      summary: newSummary,
      status: "ACTIVE_VOTING",
      votesFor: quadraticVotingPower,
      votesAgainst: 0,
      quorumThreshold: 1000000,
      endsInDays: 7,
    };

    setProposals([newCip, ...proposals]);
    setNewTitle("");
    setNewSummary("");
    setActiveTab("proposals");
    setVotingSuccess("Consensus Improvement Proposal submitted to the decentralized mempool!");

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#8b5cf6", "#10b981"],
    });

    setTimeout(() => setVotingSuccess(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Vote className="w-3 h-3 text-amber-400" />
                SOVEREIGN PROTOCOL DAO
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                Quadratic Voting Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pi Protocol Governance &amp; CIPs
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Decentralized governance powered by verified humans. Pioneers vote on protocol upgrades,
              treasury distributions, and AI safety criteria using sybil-resistant quadratic voting weight.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("proposals")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "proposals"
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Active CIPs
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "create"
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Submit CIP
            </button>
          </div>
        </div>
      </div>

      {votingSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{votingSuccess}</span>
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 block">Your Quadratic Power</span>
            <span className="text-xl font-bold text-amber-400 font-mono mt-1">
              {quadraticVotingPower.toLocaleString()} Votes
            </span>
          </div>
          <Award className="w-8 h-8 text-amber-400/50" />
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 block">Total Staked in DAO</span>
            <span className="text-xl font-bold text-emerald-400 font-mono mt-1">
              {(stats.totalStakedPi ?? 28450000).toLocaleString()} π
            </span>
          </div>
          <Coins className="w-8 h-8 text-emerald-400/50" />
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 block">Byzantine Quorum Level</span>
            <span className="text-xl font-bold text-blue-400 font-mono mt-1">
              {stats.byzantineToleranceRatio ?? 99.94}% BFT
            </span>
          </div>
          <ShieldCheck className="w-8 h-8 text-blue-400/50" />
        </div>
      </div>

      {/* Tabs */}
      {activeTab === "proposals" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5">
            {proposals.map((cip) => {
              const totalVotes = cip.votesFor + cip.votesAgainst;
              const percentFor = totalVotes > 0 ? (cip.votesFor / totalVotes) * 100 : 0;
              const hasUserVoted = !!userVotedIds[cip.id];

              return (
                <div
                  key={cip.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {cip.cipNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono bg-slate-950 border border-slate-800 text-slate-300">
                        {cip.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Author: {cip.proposer}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {cip.status === "ACTIVE_VOTING" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-950/60 border border-amber-500/40 text-amber-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {cip.endsInDays} Days Remaining
                        </span>
                      )}

                      {cip.status === "PASSED_TIMELOCKED" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          PASSED &bull; TIMELOCK ENQUEUED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base sm:text-lg font-bold text-white">{cip.title}</h2>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{cip.summary}</p>
                  </div>

                  {/* Voting Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-emerald-400 font-bold">
                        FOR: {cip.votesFor.toLocaleString()} ({percentFor.toFixed(1)}%)
                      </span>
                      <span className="text-slate-400">
                        Quorum Progress: {Math.round((totalVotes / cip.quorumThreshold) * 100)}%
                      </span>
                      <span className="text-rose-400 font-bold">
                        AGAINST: {cip.votesAgainst.toLocaleString()} ({(100 - percentFor).toFixed(1)}%)
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${percentFor}%` }}
                      ></div>
                      <div
                        className="h-full bg-rose-500 transition-all duration-500"
                        style={{ width: `${100 - percentFor}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Voting Buttons */}
                  {cip.status === "ACTIVE_VOTING" && (
                    <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span className="text-xs text-slate-400 font-mono">
                        {hasUserVoted
                          ? `You voted: ${userVotedIds[cip.id]}`
                          : `Cast vote with your ${quadraticVotingPower.toLocaleString()} voting weight:`}
                      </span>

                      {!hasUserVoted ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCastVote(cip.id, "FOR")}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Vote FOR (+1.0 π)
                          </button>
                          <button
                            onClick={() => handleCastVote(cip.id, "AGAINST")}
                            className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Vote AGAINST (+1.0 π)
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-mono text-emerald-400 font-bold">
                          Hardware Signature Verified &amp; Counted
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "create" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-400" />
              Submit Consensus Improvement Proposal (CIP)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Proposals require Tier-2 KYC verification and a minimum trust score of 80 to submit.
            </p>
          </div>

          <form onSubmit={handleCreateProposal} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-slate-400 block">Proposal Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Implement Adaptive Staking Yields for Low-Latency Nodes"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-slate-400 block">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Consensus Security">Consensus Security</option>
                <option value="Treasury Allocation">Treasury Allocation</option>
                <option value="ZK Cryptography">ZK Cryptography</option>
                <option value="Pioneer Rewards">Pioneer Rewards</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-slate-400 block">Detailed Summary &amp; Rationale</label>
              <textarea
                rows={4}
                required
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                placeholder="Explain the protocol rationale, technical parameters, and economic impact..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Sign &amp; Broadcast Proposal with Quadratic Weight
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
