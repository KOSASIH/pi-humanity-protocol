import React, { useState } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Search,
  Code2,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileText,
  DollarSign,
  Layers,
  Scale
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface AiTruthOracleProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

interface OracleFeedItem {
  id: string;
  query: string;
  category: "Regulatory & Law" | "Financial Markets" | "Scientific Fact" | "Public Safety" | "AI Fact-Checking";
  requester: string;
  bountyPi: number;
  status: "RESOLVED_TRUE" | "RESOLVED_FALSE" | "IN_QUORUM";
  quorumSize: number;
  votesTrue: number;
  votesFalse: number;
  anchorBlock: number;
  merkleProofRoot: string;
  resolvedAt: string;
  evidenceNotes: string;
}

export const AiTruthOracle: React.FC<AiTruthOracleProps> = ({ pioneer, stats, onRewardClaim }) => {
  const [oracleFeeds, setOracleFeeds] = useState<OracleFeedItem[]>([
    {
      id: "oracle_feed_101",
      query: "Has the European Commission officially enacted the AI Act General-Purpose Model safety code of practice as of September 2026?",
      category: "Regulatory & Law",
      requester: "Enterprise Legal AI Corp",
      bountyPi: 45.0,
      status: "RESOLVED_TRUE",
      quorumSize: 15,
      votesTrue: 15,
      votesFalse: 0,
      anchorBlock: stats.latestBlock - 18,
      merkleProofRoot: "0x89f2a01948bdce4910283c74a9192837bc901842091728394017263548901abc",
      resolvedAt: "4 minutes ago",
      evidenceNotes: "Official Journal of the European Union L 2024/1689 confirmed by 15 sovereign Tier-2 Pioneer hardware signatures.",
    },
    {
      id: "oracle_feed_102",
      query: "Did NVIDIA or OpenAI officially release the 'GPT-5 Omniscient' model weights as open-source on HuggingFace today?",
      category: "AI Fact-Checking",
      requester: "Autonomous Research Bot #402",
      bountyPi: 30.0,
      status: "RESOLVED_FALSE",
      quorumSize: 12,
      votesTrue: 0,
      votesFalse: 12,
      anchorBlock: stats.latestBlock - 42,
      merkleProofRoot: "0x34d910a273b0918c7283a01928475c8291038472910384729103847291038abc",
      resolvedAt: "12 minutes ago",
      evidenceNotes: "Hallucination debunked. HuggingFace repo was an unverified spoof account.",
    },
    {
      id: "oracle_feed_103",
      query: "Did the central bank of Indonesia (Bank Indonesia) launch the national digital rupiah pilot in Jakarta this week?",
      category: "Financial Markets",
      requester: "DeFi Cross-Border Settlement",
      bountyPi: 50.0,
      status: "RESOLVED_TRUE",
      quorumSize: 15,
      votesTrue: 14,
      votesFalse: 1,
      anchorBlock: stats.latestBlock - 88,
      merkleProofRoot: "0x78ab193498bd018274a901823746c81029384756192837465910293847561234",
      resolvedAt: "28 minutes ago",
      evidenceNotes: "Bank Indonesia official press release confirmed with on-ground Pioneer consensus in Jakarta.",
    },
    {
      id: "oracle_feed_104",
      query: "Is the severe storm alert active for Manila metropolitan transit networks according to national weather advisories?",
      category: "Public Safety",
      requester: "Autonomous Logistics Agent #99",
      bountyPi: 25.0,
      status: "IN_QUORUM",
      quorumSize: 9,
      votesTrue: 6,
      votesFalse: 1,
      anchorBlock: stats.latestBlock,
      merkleProofRoot: "0xpending_quorum_finalization_hash_block_1894218",
      resolvedAt: "Just now",
      evidenceNotes: "Live votes coming in from Southeast Asian Pioneer node cluster.",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"feeds" | "submit" | "contract">("feeds");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [copiedContract, setCopiedContract] = useState<boolean>(false);

  // New query form state
  const [newQuery, setNewQuery] = useState<string>("");
  const [newCategory, setNewCategory] = useState<OracleFeedItem["category"]>("AI Fact-Checking");
  const [newQuorum, setNewQuorum] = useState<number>(9);
  const [newBounty, setNewBounty] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const filteredFeeds = oracleFeeds.filter(
    (f) => filterCategory === "ALL" || f.category === filterCategory
  );

  const handleVoteInQuorum = (feedId: string, choice: boolean) => {
    setOracleFeeds((prev) =>
      prev.map((f) => {
        if (f.id === feedId && f.status === "IN_QUORUM") {
          const updatedVotesTrue = choice ? f.votesTrue + 1 : f.votesTrue;
          const updatedVotesFalse = !choice ? f.votesFalse + 1 : f.votesFalse;
          const totalVotes = updatedVotesTrue + updatedVotesFalse;
          const status =
            totalVotes >= f.quorumSize
              ? updatedVotesTrue > updatedVotesFalse
                ? "RESOLVED_TRUE"
                : "RESOLVED_FALSE"
              : "IN_QUORUM";

          return {
            ...f,
            votesTrue: updatedVotesTrue,
            votesFalse: updatedVotesFalse,
            status,
          };
        }
        return f;
      })
    );

    if (onRewardClaim) {
      onRewardClaim(1.5);
    }

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#10b981", "#3b82f6"],
    });
  };

  const handleSubmitNewQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuery.trim()) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));

    const newItem: OracleFeedItem = {
      id: `oracle_feed_${Date.now()}`,
      query: newQuery,
      category: newCategory,
      requester: `@${pioneer.username} (Pioneer Client)`,
      bountyPi: newBounty,
      status: "IN_QUORUM",
      quorumSize: newQuorum,
      votesTrue: 1,
      votesFalse: 0,
      anchorBlock: stats.latestBlock,
      merkleProofRoot: `0x${Math.random().toString(16).slice(2, 66)}`,
      resolvedAt: "Just now",
      evidenceNotes: "Dispatched to Pi Network 60M human validator swarm. Cryptographic quorum in progress.",
    };

    setOracleFeeds([newItem, ...oracleFeeds]);
    setNewQuery("");
    setIsSubmitting(false);
    setSubmitSuccess(`Oracle query registered on-chain with ${newBounty} π locked in escrow.`);
    setActiveTab("feeds");

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#10b981", "#6366f1"],
    });

    setTimeout(() => setSubmitSuccess(null), 5000);
  };

  const solidityOracleContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IPiTruthOracle
 * @notice Decentralized Human Consensus Truth Oracle powered by Pi Network's 60M KYC Humans
 * @dev Replaces vulnerable centralized APIs with Byzantine Fault-Tolerant Human Proof
 */
interface IPiTruthOracle {
    enum ResolutionStatus { UNRESOLVED, RESOLVED_TRUE, RESOLVED_FALSE, DISPUTED }

    struct OracleQuery {
        bytes32 queryHash;
        uint256 bountyPi;
        uint16 quorumSize;
        uint16 votesTrue;
        uint16 votesFalse;
        ResolutionStatus status;
        bytes32 merkleEvidenceRoot;
        uint256 anchorBlock;
    }

    event QuerySubmitted(bytes32 indexed queryId, string queryText, uint256 bounty);
    event QuorumFinalized(bytes32 indexed queryId, ResolutionStatus result, bytes32 merkleRoot);

    function submitQuery(string calldata queryText, uint16 quorumSize) external payable returns (bytes32 queryId);
    function getTruthResult(bytes32 queryId) external view returns (ResolutionStatus result, bytes32 merkleRoot);
}

contract EnterpriseAiGuardian {
    IPiTruthOracle public immutable piOracle;

    constructor(address _piOracle) {
        piOracle = IPiTruthOracle(_piOracle);
    }

    function executeSensitiveAiWorkflow(bytes32 queryId) external view {
        (IPiTruthOracle.ResolutionStatus result, ) = piOracle.getTruthResult(queryId);
        require(result == IPiTruthOracle.ResolutionStatus.RESOLVED_TRUE, "AI Action Halted: Ground truth rejected by Pioneer quorum");
        
        // Execute high-assurance autonomous pipeline...
    }
}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                DECENTRALIZED GROUND-TRUTH ORACLE (PCTO)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                14.8M Queries Resolved
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pi Human Consensus Truth Oracle
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Eliminate LLM hallucinations and bad data. Connect AI models and smart contracts directly to
              Pi Network's 60M sovereign humans for tamper-proof, real-world truth verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("feeds")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "feeds"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Live Truth Feeds
            </button>
            <button
              onClick={() => setActiveTab("submit")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "submit"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Query the Oracle
            </button>
            <button
              onClick={() => setActiveTab("contract")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "contract"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Solidity SDK
            </button>
          </div>
        </div>
      </div>

      {submitSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{submitSuccess}</span>
        </div>
      )}

      {activeTab === "feeds" && (
        <div className="space-y-6">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {["ALL", "Regulatory & Law", "AI Fact-Checking", "Financial Markets", "Public Safety"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      filterCategory === cat
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            <span className="text-xs font-mono text-slate-400">
              Showing {filteredFeeds.length} verified truth feeds
            </span>
          </div>

          {/* Feeds List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredFeeds.map((feed) => (
              <div
                key={feed.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-950 border border-slate-800 text-slate-300">
                      {feed.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Requested by <span className="text-slate-200">{feed.requester}</span> &bull; {feed.resolvedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Escrow: {feed.bountyPi} π
                    </span>

                    {feed.status === "RESOLVED_TRUE" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        TRUTH CONFIRMED
                      </span>
                    )}

                    {feed.status === "RESOLVED_FALSE" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        HALLUCINATION / FALSE
                      </span>
                    )}

                    {feed.status === "IN_QUORUM" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-950/60 border border-amber-500/40 text-amber-300 flex items-center gap-1 animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        VOTING IN PROGRESS
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {feed.query}
                  </h3>
                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono">
                    <span className="text-slate-400">Consensus Evidence:</span> {feed.evidenceNotes}
                  </p>
                </div>

                {/* Quorum Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold">
                      TRUE ({feed.votesTrue}/{feed.quorumSize})
                    </span>
                    <span className="text-slate-400">
                      Anchor Block #{feed.anchorBlock} &bull; Proof Root: {feed.merkleProofRoot.slice(0, 16)}...
                    </span>
                    <span className="text-rose-400 font-bold">
                      FALSE ({feed.votesFalse}/{feed.quorumSize})
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${(feed.votesTrue / feed.quorumSize) * 100}%`,
                      }}
                    ></div>
                    <div
                      className="h-full bg-rose-500 transition-all duration-500"
                      style={{
                        width: `${(feed.votesFalse / feed.quorumSize) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Action button if still in quorum */}
                {feed.status === "IN_QUORUM" && (
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-amber-400 font-mono">
                      Your Tier-2 Pioneer hardware key is eligible to cast an adjudication vote:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVoteInQuorum(feed.id, true)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Vote TRUE (+1.5 π)
                      </button>
                      <button
                        onClick={() => handleVoteInQuorum(feed.id, false)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Vote FALSE (+1.5 π)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "submit" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              Dispatch Real-World Fact Query to the Sovereign Human Swarm
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit any fact-checking or ground-truth inquiry to be evaluated by random KYC-verified Pioneers.
            </p>
          </div>

          <form onSubmit={handleSubmitNewQuery} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-400 block">
                Truth Query or Claim to Verify
              </label>
              <textarea
                rows={3}
                required
                value={newQuery}
                onChange={(e) => setNewQuery(e.target.value)}
                placeholder="e.g. Did the US FDA officially grant approval for Drug X on 2026-09-20?"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate-400 block">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Regulatory & Law">Regulatory &amp; Law</option>
                  <option value="AI Fact-Checking">AI Fact-Checking</option>
                  <option value="Financial Markets">Financial Markets</option>
                  <option value="Scientific Fact">Scientific Fact</option>
                  <option value="Public Safety">Public Safety</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate-400 block">
                  Quorum Consensus Size
                </label>
                <select
                  value={newQuorum}
                  onChange={(e) => setNewQuorum(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={5}>5 Pioneers (Fast Finality - 30s)</option>
                  <option value={9}>9 Pioneers (Standard Enterprise - 60s)</option>
                  <option value={15}>15 Pioneers (High Assurance - 120s)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-slate-400 block">
                  Escrow Bounty (π)
                </label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={newBounty}
                  onChange={(e) => setNewBounty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !newQuery.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isSubmitting ? "Locking Escrow & Dispatching Swarm..." : `Lock ${newBounty} π & Dispatch to Pioneer Quorum`}
            </button>
          </form>
        </div>
      )}

      {activeTab === "contract" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" />
                Smart Contract Interface (Solidity &amp; Web3 Oracle)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Allow your on-chain dApps to query the 60M human ground-truth oracle trustlessly.
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(solidityOracleContract);
                setCopiedContract(true);
                setTimeout(() => setCopiedContract(false), 2000);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedContract ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedContract ? "Copied" : "Copy Solidity"}
            </button>
          </div>

          <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 overflow-x-auto">
            <pre>{solidityOracleContract}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
