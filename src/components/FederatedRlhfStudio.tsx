import React, { useState } from "react";
import {
  Brain,
  Sliders,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Download,
  Copy,
  Check,
  Award,
  Layers,
  Zap,
  BarChart3,
  ThumbsUp,
  Cpu
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface FederatedRlhfStudioProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

interface PreferencePair {
  id: string;
  prompt: string;
  category: "Safety & Ethics" | "Reasoning & Math" | "Helpful Explanation" | "Creative Nuance";
  modelA: {
    name: string;
    response: string;
    rewardScore: number;
  };
  modelB: {
    name: string;
    response: string;
    rewardScore: number;
  };
  bountyPi: number;
  consensusWinner: "A" | "B" | "PENDING";
  votesA: number;
  votesB: number;
}

export const FederatedRlhfStudio: React.FC<FederatedRlhfStudioProps> = ({
  pioneer,
  stats,
  onRewardClaim,
}) => {
  const [pairs, setPairs] = useState<PreferencePair[]>([
    {
      id: "rlhf_pair_01",
      prompt: "Explain how zero-knowledge proofs work to an undergraduate computer science student without using overly abstract jargon.",
      category: "Helpful Explanation",
      modelA: {
        name: "Llama-3-Humanity-Aligned",
        response:
          "Imagine a color-blind friend and two balls—one red, one blue—identical in texture. To prove to your friend that the balls are different colors without revealing which is red, you hand them over. Your friend puts them behind their back and either swaps them or doesn't, then asks you: 'Did I switch them?' If the balls were identical, you would only guess correctly 50% of the time. Repeating this 20 times makes your chance of guessing correctly less than 1 in a million, mathematically proving you possess knowledge without transferring the secret.",
        rewardScore: 9.4,
      },
      modelB: {
        name: "Base-Foundation-70B",
        response:
          "Zero-knowledge proofs use cryptographic primitives like polynomial commitments, homomorphic hiding, and elliptic curve pairing over BN254 to evaluate quadratic arithmetic programs with succinct non-interactive arguments.",
        rewardScore: 6.8,
      },
      bountyPi: 2.5,
      consensusWinner: "A",
      votesA: 28,
      votesB: 2,
    },
    {
      id: "rlhf_pair_02",
      prompt: "A developer asks for safe architecture patterns to handle high-frequency concurrent balance deductions in a distributed ledger.",
      category: "Reasoning & Math",
      modelA: {
        name: "Base-Foundation-70B",
        response:
          "Use a global database mutex lock on the balance table during every update transaction so only one thread can modify state at a time.",
        rewardScore: 5.2,
      },
      modelB: {
        name: "Llama-3-Humanity-Aligned",
        response:
          "Global locks cause extreme latency bottlenecks. Prefer an optimistic concurrency control model with versioned balance records (CAS / Compare-And-Swap), append-only ledger journals, or an event-sourced actor mailbox where account mutations are serialized in-memory before asynchronous ledger commits.",
        rewardScore: 9.6,
      },
      bountyPi: 3.0,
      consensusWinner: "B",
      votesA: 3,
      votesB: 35,
    },
    {
      id: "rlhf_pair_03",
      prompt: "How should an autonomous system resolve competing priorities when allocating emergency hospital transport resources?",
      category: "Safety & Ethics",
      modelA: {
        name: "Candidate-Alpha-v2",
        response:
          "The system should implement transparent, deterministic clinical triage criteria verified by multi-stakeholder consensus (e.g., SOFA score, transport proximity, and acute clinical urgency). Automated algorithms must never make unilateral life-or-death decisions without certified medical professional oversight and traceable audit logging.",
        rewardScore: 9.1,
      },
      modelB: {
        name: "Candidate-Beta-v2",
        response:
          "Optimize purely for shortest transit route distance and dispatch vehicles to the nearest beacon to maximize ambulance trips per day.",
        rewardScore: 4.8,
      },
      bountyPi: 3.5,
      consensusWinner: "PENDING",
      votesA: 14,
      votesB: 1,
    },
  ]);

  const [selectedPairId, setSelectedPairId] = useState<string>("rlhf_pair_03");
  const [dpoBeta, setDpoBeta] = useState<number>(0.2);
  const [copiedConfig, setCopiedConfig] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  const selectedPair = pairs.find((p) => p.id === selectedPairId) || pairs[0];

  const handleVotePreference = (winner: "A" | "B") => {
    setPairs((prev) =>
      prev.map((p) => {
        if (p.id === selectedPair.id) {
          const newVotesA = winner === "A" ? p.votesA + 1 : p.votesA;
          const newVotesB = winner === "B" ? p.votesB + 1 : p.votesB;
          const status = newVotesA > newVotesB ? "A" : "B";
          return {
            ...p,
            votesA: newVotesA,
            votesB: newVotesB,
            consensusWinner: status,
          };
        }
        return p;
      })
    );

    setHasVoted(true);
    if (onRewardClaim) {
      onRewardClaim(selectedPair.bountyPi);
    }

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#10b981", "#f59e0b"],
    });

    setTimeout(() => setHasVoted(false), 3500);
  };

  const dpoConfigSnippet = JSON.stringify(
    {
      dataset_name: "pi-humanity-preference-dpo-v1",
      total_pioneer_annotators: 60482190,
      loss_function: "DirectPreferenceOptimization",
      hyperparameters: {
        beta_kl_penalty: dpoBeta,
        learning_rate: 5e-7,
        warmup_ratio: 0.05,
        max_prompt_length: 1024,
        max_response_length: 2048,
      },
      consensus_validation: {
        min_pioneer_quorum: 15,
        hardware_kyc_required: true,
        byzantine_filter: "Strict-BFT-66.7%",
      },
      export_format: "SafeTensors / LoRA Adapter",
    },
    null,
    2
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/20 to-slate-900 border border-blue-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <Brain className="w-3 h-3 text-blue-400" />
                FEDERATED RLHF &amp; DPO STUDIO
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                Direct Preference Optimization
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Human-in-the-Loop Alignment Studio
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Train safer, smarter foundation models. Evaluate candidate completions and guide direct preference
              optimization with consensus feedback from 60 million sovereign humans.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Aligned Models</span>
            <span className="text-2xl font-extrabold text-blue-400 font-mono">142 Models</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Bradley-Terry Aligned</span>
          </div>
        </div>
      </div>

      {hasVoted && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            Preference score anchored to RLHF dataset! +{selectedPair.bountyPi} π credited to your sovereign balance.
          </span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Active Tasks List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 block flex items-center justify-between">
              <span>Preference Evaluation Queue</span>
              <span className="text-blue-400">Pairwise RLHF</span>
            </span>

            <div className="space-y-2">
              {pairs.map((pair) => (
                <button
                  key={pair.id}
                  onClick={() => setSelectedPairId(pair.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedPairId === pair.id
                      ? "bg-blue-500/10 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {pair.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">+{pair.bountyPi} π</span>
                  </div>

                  <span className="text-xs font-bold block text-white line-clamp-2 leading-relaxed">
                    {pair.prompt}
                  </span>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                    <span>Votes: {pair.votesA + pair.votesB}</span>
                    <span className="text-emerald-400 font-bold">
                      {pair.consensusWinner === "PENDING" ? "Voting Active" : `Winner: Model ${pair.consensusWinner}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* DPO Hyperparameter Tuner */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 block flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              DPO Parameter &amp; KL Penalty (β)
            </span>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>KL Penalty Coefficient (β):</span>
                <span className="text-blue-400 font-bold">{dpoBeta.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={0.5}
                step={0.05}
                value={dpoBeta}
                onChange={(e) => setDpoBeta(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400 block leading-tight">
                Controls the constraint strength keeping the aligned model close to the reference base policy.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Evaluation Sandbox */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">
                Category: {selectedPair.category}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white mt-1">Prompt: "{selectedPair.prompt}"</h2>
            </div>

            {/* Model A vs Model B side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Candidate Model A */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-blue-400" />
                      Candidate Model A
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Reward: {selectedPair.modelA.rewardScore}/10
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedPair.modelA.response}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <button
                    onClick={() => handleVotePreference("A")}
                    className="w-full py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Prefer Model A (+{selectedPair.bountyPi} π)
                  </button>
                  <span className="text-[11px] font-mono text-center text-slate-400 block">
                    {selectedPair.votesA} Pioneer votes ({Math.round((selectedPair.votesA / (selectedPair.votesA + selectedPair.votesB || 1)) * 100)}%)
                  </span>
                </div>
              </div>

              {/* Candidate Model B */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      Candidate Model B
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Reward: {selectedPair.modelB.rewardScore}/10
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedPair.modelB.response}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <button
                    onClick={() => handleVotePreference("B")}
                    className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Prefer Model B (+{selectedPair.bountyPi} π)
                  </button>
                  <span className="text-[11px] font-mono text-center text-slate-400 block">
                    {selectedPair.votesB} Pioneer votes ({Math.round((selectedPair.votesB / (selectedPair.votesA + selectedPair.votesB || 1)) * 100)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* DPO Adapter Export Snippet */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  DPO Training Card &amp; LoRA Configuration
                </span>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(dpoConfigSnippet);
                    setCopiedConfig(true);
                    setTimeout(() => setCopiedConfig(false), 2000);
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedConfig ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedConfig ? "Copied" : "Copy Config"}
                </button>
              </div>

              <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 max-h-44 overflow-y-auto">
                <pre>{dpoConfigSnippet}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
