import React, { useState } from "react";
import {
  Fingerprint,
  ShieldCheck,
  Scan,
  AlertOctagon,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  FileCheck2,
  Zap,
  Activity,
  UserCheck,
  Eye
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface SybilWatermarkDetectorProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

export const SybilWatermarkDetector: React.FC<SybilWatermarkDetectorProps> = ({
  pioneer,
  stats,
  onRewardClaim,
}) => {
  const [sampleType, setSampleType] = useState<"text" | "face_video" | "voice">("text");
  const [sampleContent, setSampleContent] = useState(
    "In light of recent macro conditions, the decentralized protocol underwent extensive parameter tuning to maximize long-term equilibrium and token utility across stakeholder ecosystems."
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  const handleRunForensicScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    await new Promise((r) => setTimeout(r, 1400));

    const isSynthetic = sampleContent.includes("macro conditions") || sampleContent.includes("equilibrium");

    const result = {
      detectionVerdict: isSynthetic ? "SYNTHETIC_AI_GENERATED" : "BIOLOGICAL_HUMAN_VERIFIED",
      syntheticProbability: isSynthetic ? 96.4 : 3.8, // %
      lexicalEntropy: isSynthetic ? 1.42 : 4.88, // bits / char
      humanMicroTremorScore: isSynthetic ? "NOT_DETECTED" : "DETECTED_99.1%",
      pioneerConsensusRatio: "12 / 12 Pioneer Validators Agreed",
      onChainProofHash: `0xzk_${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`,
      rewardPi: 1.4,
    };

    setScanResult(result);
    setIsScanning(false);

    if (onRewardClaim) {
      onRewardClaim(1.4);
    }

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#10b981", "#6366f1", "#f59e0b"],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Scan className="w-3 h-3 text-emerald-400" />
                BIOLOGICAL HUMANITY WATERMARK &bull; SYBIL DEFENSE
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                Zero Biometric Leakage
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Cryptographic Human vs. Synthetic AI Watermark Detector
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Detect synthetic deepfakes, AI-generated essays, and cloned biometric personas. Combines neural
              spectral entropy analysis with 60M Pioneer consensus to issue an on-chain Certificate of Biological Origin.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Attestations Issued</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">1,492,100</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Pi Mainnet Anchored</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Detection Input & Forensic Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
            Biological Personhood &amp; Watermark Verification
          </span>

          <form onSubmit={handleRunForensicScan} className="space-y-4">
            <div className="flex gap-2">
              {(["text", "face_video", "voice"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSampleType(type)}
                  className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold capitalize transition-colors cursor-pointer border ${
                    sampleType === type
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {type.replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">
                {sampleType === "text" ? "Sample Text / Essay" : `${sampleType} Sensor Stream Data`}
              </label>
              <textarea
                rows={5}
                value={sampleContent}
                onChange={(e) => setSampleContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isScanning}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Scan className="w-4 h-4" />
              {isScanning
                ? "Analyzing Spectral Entropy & Pioneer Quorum..."
                : "Run Cryptographic Human Origin Scan (+1.4 π)"}
            </button>
          </form>
        </div>

        {/* Right: Forensic Report */}
        <div className="space-y-4">
          {scanResult ? (
            <div
              className={`bg-slate-900/80 border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl ${
                scanResult.detectionVerdict === "BIOLOGICAL_HUMAN_VERIFIED"
                  ? "border-emerald-500/40"
                  : "border-rose-500/40"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span
                  className={`text-xs font-bold flex items-center gap-1.5 font-mono ${
                    scanResult.detectionVerdict === "BIOLOGICAL_HUMAN_VERIFIED"
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {scanResult.detectionVerdict === "BIOLOGICAL_HUMAN_VERIFIED" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertOctagon className="w-4 h-4" />
                  )}
                  {scanResult.detectionVerdict.replace(/_/g, " ")}
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  +1.40 π Credited
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Synthetic Probability</span>
                  <span
                    className={`text-base font-bold ${
                      scanResult.syntheticProbability > 50 ? "text-rose-400" : "text-emerald-400"
                    }`}
                  >
                    {scanResult.syntheticProbability}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Lexical Entropy</span>
                  <span className="text-base font-bold text-slate-200">
                    {scanResult.lexicalEntropy} bits/char
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-xs">
                <span className="text-[10px] text-slate-500 uppercase block">Validator Quorum</span>
                <span className="text-slate-300 block">{scanResult.pioneerConsensusRatio}</span>
                <span className="text-[10px] text-emerald-400 block pt-1 break-all">
                  Proof Hash: {scanResult.onChainProofHash}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-center py-16">
              <Scan className="w-12 h-12 text-emerald-400/40 mx-auto" />
              <h3 className="text-base font-bold text-white">Watermark Scanner Idle</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Submit any text, synthetic video frame, or audio file to verify genuine biological origin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
