import React, { useState } from "react";
import {
  Sparkles,
  Database,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Zap,
  Sliders,
  FileCheck,
  Cpu,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface SyntheticDataDistilleryProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

interface DatasetBatch {
  id: string;
  datasetName: string;
  targetDomain: "Advanced Mathematics" | "Quantum Physics" | "Distributed Systems Code" | "Biomedical Reasoning";
  rawTokensCount: number;
  syntheticModelOrigin: string;
  rawPerplexity: number;
  distilledPerplexity: number;
  humanEntropyBits: number;
  rawSnippet: string;
  distilledSnippet: string;
  status: "READY_FOR_DISTILLATION" | "CERTIFIED_DISTILLED";
  bountyPi: number;
  distillationQuorum: number;
}

export const SyntheticDataDistillery: React.FC<SyntheticDataDistilleryProps> = ({
  pioneer,
  stats,
  onRewardClaim,
}) => {
  const [batches, setBatches] = useState<DatasetBatch[]>([
    {
      id: "batch_math_01",
      datasetName: "Synthetic-Euler-Topology-StepProof-v3",
      targetDomain: "Advanced Mathematics",
      rawTokensCount: 2500000,
      syntheticModelOrigin: "DeepSeek-R1-Synthesizer-671B",
      rawPerplexity: 14.8,
      distilledPerplexity: 4.2,
      humanEntropyBits: 7.82,
      rawSnippet:
        "Step 4: Assume the manifold M is simply connected. By recursively applying Poincaré duality, we deduce that all torsion subgroups automatically cancel across all dimensions n > 2 without checking boundary conditions.",
      distilledSnippet:
        "Step 4: Let M be a closed, simply connected smooth n-manifold. Apply Poincaré duality H^k(M; Z) ≅ H_{n-k}(M; Z). Unlike raw heuristic assumptions, torsion subgroups Ext(H_{k-1}(M), Z) must be explicitly bounded via the Universal Coefficient Theorem to preserve boundary topology.",
      status: "READY_FOR_DISTILLATION",
      bountyPi: 3.8,
      distillationQuorum: 24,
    },
    {
      id: "batch_code_02",
      datasetName: "Rust-LockFree-Memory-Primitives",
      targetDomain: "Distributed Systems Code",
      rawTokensCount: 4100000,
      syntheticModelOrigin: "Claude-Sonnet-CodeGenerator-3.7",
      rawPerplexity: 11.2,
      distilledPerplexity: 3.8,
      humanEntropyBits: 8.14,
      rawSnippet:
        "unsafe { let ptr = Box::into_raw(Box::new(node)); (*ptr).next = AtomicPtr::new(null_mut()); // assumes sequential consistency always }",
      distilledSnippet:
        "unsafe { let ptr = Box::into_raw(Box::new(node)); (*ptr).next.store(ptr::null_mut(), Ordering::Release); // explicit release ordering prevents CPU memory reordering on ARM64/x86 }",
      status: "CERTIFIED_DISTILLED",
      bountyPi: 4.5,
      distillationQuorum: 30,
    },
    {
      id: "batch_med_03",
      datasetName: "Synthetic-Clinical-Oncology-Trials",
      targetDomain: "Biomedical Reasoning",
      rawTokensCount: 1800000,
      syntheticModelOrigin: "Llama-3.3-Medical-Draft",
      rawPerplexity: 16.4,
      distilledPerplexity: 5.1,
      humanEntropyBits: 7.95,
      rawSnippet:
        "Patient presenting with EGFR exon 19 deletion can immediately be given standard chemotherapy doublet without genotyping T790M resistance mutations.",
      distilledSnippet:
        "In patients with metastatic NSCLC harboring EGFR exon 19 deletion, first-line third-generation osimertinib is prioritized; subsequent progression mandates circulating tumor DNA or re-biopsy testing for on-target C797S resistance mechanisms.",
      status: "READY_FOR_DISTILLATION",
      bountyPi: 4.0,
      distillationQuorum: 18,
    },
  ]);

  const [selectedBatchId, setSelectedBatchId] = useState<string>("batch_math_01");
  const [isCertifying, setIsCertifying] = useState<boolean>(false);
  const [certifiedNotice, setCertifiedNotice] = useState<string | null>(null);
  const [copiedWatermark, setCopiedWatermark] = useState<boolean>(false);

  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  const handleCertifyBatch = async () => {
    setIsCertifying(true);
    await new Promise((r) => setTimeout(r, 1100));

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id === selectedBatch.id) {
          return {
            ...b,
            status: "CERTIFIED_DISTILLED",
          };
        }
        return b;
      })
    );

    setIsCertifying(false);
    setCertifiedNotice(
      `Dataset batch certified with Proof-of-Human-Distillation! +${selectedBatch.bountyPi} π added to your Pioneer balance.`
    );

    if (onRewardClaim) {
      onRewardClaim(selectedBatch.bountyPi);
    }

    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#10b981", "#3b82f6"],
    });

    setTimeout(() => setCertifiedNotice(null), 5000);
  };

  const watermarkProof = JSON.stringify(
    {
      proof_type: "Proof-of-Human-Distillation (PoHD)",
      dataset_uid: selectedBatch.id,
      dataset_name: selectedBatch.datasetName,
      synthetic_pretraining_origin: selectedBatch.syntheticModelOrigin,
      entropy_metrics: {
        human_entropy_bits_per_token: selectedBatch.humanEntropyBits,
        raw_perplexity: selectedBatch.rawPerplexity,
        purified_perplexity: selectedBatch.distilledPerplexity,
        perplexity_reduction_ratio: `${Math.round(
          ((selectedBatch.rawPerplexity - selectedBatch.distilledPerplexity) / selectedBatch.rawPerplexity) * 100
        )}%`,
      },
      cryptographic_pioneer_signatures: [
        { node: `@${pioneer.username}`, country: pioneer.country, kyc_hash: "0x89fa...2211" },
        { node: "@tokyo_validator", country: "JP", kyc_hash: "0x11bb...9988" },
        { node: "@frankfurt_zk_core", country: "DE", kyc_hash: "0x44dd...33aa" },
      ],
      safe_tensors_header_signature: "0xdeadbeef8877665544332211aabbccddeeff00112233445566778899aabbccdd",
    },
    null,
    2
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Database className="w-3 h-3 text-amber-400" />
                SYNTHETIC DATA DISTILLERY &amp; WATERMARKING
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                Proof-of-Human-Distillation (PoHD)
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Decentralized Pretraining Data Distillery
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Prevent recursive AI model collapse. Transform raw hallucination-prone synthetic data into high-entropy,
              human-purified pretraining datasets certified by 60 million Pioneers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Purified Tokens</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono">1.2 Trillion Tokens</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">PoHD Cryptographically Watermarked</span>
          </div>
        </div>
      </div>

      {certifiedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{certifiedNotice}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Batches */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 block flex items-center justify-between">
              <span>Synthetic Batches Awaiting Distillation</span>
              <span className="text-amber-400">High-Yield</span>
            </span>

            <div className="space-y-2">
              {batches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBatchId(b.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedBatchId === b.id
                      ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {b.targetDomain}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">+{b.bountyPi} π</span>
                  </div>

                  <span className="text-xs font-bold block text-white line-clamp-1">{b.datasetName}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{b.syntheticModelOrigin}</span>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                    <span>{(b.rawTokensCount / 1000000).toFixed(1)}M Tokens</span>
                    <span
                      className={`font-bold ${
                        b.status === "CERTIFIED_DISTILLED" ? "text-emerald-400" : "text-amber-400 animate-pulse"
                      }`}
                    >
                      {b.status === "CERTIFIED_DISTILLED" ? "CERTIFIED" : "DISTILLING"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Model Collapse Prevention Guide */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              The 2026 Model Collapse Problem
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              When models are trained exclusively on recursive unverified synthetic text, tail probabilities disappear
              and functional entropy decays to zero. Pi Network pioneers re-inject natural human variance, mathematical
              grounding, and physical common sense.
            </p>
          </div>
        </div>

        {/* Right Column: Comparative Inspection & Watermark Issuer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                  Domain: {selectedBatch.targetDomain} &bull; Origin: {selectedBatch.syntheticModelOrigin}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1">{selectedBatch.datasetName}</h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                  Bounty: {selectedBatch.bountyPi} π
                </span>
              </div>
            </div>

            {/* Entropy Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-black/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Raw Perplexity</span>
                <span className="text-lg font-bold text-rose-400 font-mono mt-0.5">
                  {selectedBatch.rawPerplexity} PPL
                </span>
                <span className="text-[10px] text-slate-500 block">High Hallucination Decay</span>
              </div>

              <div className="p-3 rounded-xl bg-black/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Distilled Perplexity</span>
                <span className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                  {selectedBatch.distilledPerplexity} PPL
                </span>
                <span className="text-[10px] text-emerald-400/80 block">71% Noise Reduction</span>
              </div>

              <div className="p-3 rounded-xl bg-black/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Human Entropy Score</span>
                <span className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                  {selectedBatch.humanEntropyBits} bits/token
                </span>
                <span className="text-[10px] text-slate-500 block">Maximum Cognitive Density</span>
              </div>
            </div>

            {/* Raw vs Distilled Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-rose-400 font-mono block">
                  Raw Synthetic Output (Pre-Distillation)
                </span>
                <p className="text-xs text-slate-300 font-mono leading-relaxed bg-black/60 p-3 rounded-xl border border-rose-500/20">
                  {selectedBatch.rawSnippet}
                </p>
                <span className="text-[11px] text-slate-500 italic block">
                  Contains subtle logic flaws or ungrounded heuristics.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 font-mono block">
                  Pi Swarm Distilled &amp; Purified
                </span>
                <p className="text-xs text-slate-200 font-mono leading-relaxed bg-black/60 p-3 rounded-xl border border-emerald-500/20">
                  {selectedBatch.distilledSnippet}
                </p>
                <span className="text-[11px] text-emerald-400/80 font-mono block">
                  Rigorous boundary definitions verified by verified humans.
                </span>
              </div>
            </div>

            {/* Proof of Human Distillation (PoHD) Manifest */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                  Proof-of-Human-Distillation (PoHD) Cryptographic Manifest
                </span>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(watermarkProof);
                    setCopiedWatermark(true);
                    setTimeout(() => setCopiedWatermark(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedWatermark ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedWatermark ? "Copied" : "Copy Manifest"}
                </button>
              </div>

              <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 max-h-44 overflow-y-auto">
                <pre>{watermarkProof}</pre>
              </div>
            </div>

            {/* Certify Action Button */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-mono">
                Pioneer Validator: <span className="text-white font-bold">@{pioneer.username}</span> &bull; Quorum:{" "}
                <span className="text-amber-400 font-bold">{selectedBatch.distillationQuorum} Pioneer Nodes</span>
              </span>

              <button
                onClick={handleCertifyBatch}
                disabled={isCertifying || selectedBatch.status === "CERTIFIED_DISTILLED"}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  selectedBatch.status === "CERTIFIED_DISTILLED"
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isCertifying ? "animate-spin" : ""}`} />
                {isCertifying
                  ? "Signing Cryptographic PoHD Watermark..."
                  : selectedBatch.status === "CERTIFIED_DISTILLED"
                  ? "Dataset Certified Distilled"
                  : `Sign Proof-of-Human-Distillation (+${selectedBatch.bountyPi} π)`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
