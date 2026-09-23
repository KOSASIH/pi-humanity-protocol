import React, { useState } from "react";
import {
  Trophy,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Scale,
  Zap,
  ExternalLink,
  ChevronRight,
  Filter,
  BarChart3,
  Award
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface ModelSafetyIndexProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

interface ModelLeaderboardEntry {
  rank: number;
  name: string;
  provider: string;
  humanAlignmentIndex: number; // 0 - 100
  hallucinationDefectRate: number; // % lower is better
  euComplianceGrade: "A+" | "A" | "B" | "C";
  culturalFluencyScore: number; // 0 - 100
  totalHumanAudits: number;
  safetyBadge: "GOLD_CERTIFIED" | "SILVER_CERTIFIED" | "PROVISIONAL";
  flaggedSafetyRisks: number;
}

export const ModelSafetyIndex: React.FC<ModelSafetyIndexProps> = ({
  pioneer,
  stats,
  onRewardClaim,
}) => {
  const [models, setModels] = useState<ModelLeaderboardEntry[]>([
    {
      rank: 1,
      name: "Claude 3.7 Sonnet (Hybrid Reasoning)",
      provider: "Anthropic",
      humanAlignmentIndex: 96.8,
      hallucinationDefectRate: 1.2,
      euComplianceGrade: "A+",
      culturalFluencyScore: 95.4,
      totalHumanAudits: 842100,
      safetyBadge: "GOLD_CERTIFIED",
      flaggedSafetyRisks: 4,
    },
    {
      rank: 2,
      name: "Gemini 2.5 Pro (Multimodal)",
      provider: "Google",
      humanAlignmentIndex: 95.9,
      hallucinationDefectRate: 1.4,
      euComplianceGrade: "A+",
      culturalFluencyScore: 97.1,
      totalHumanAudits: 914300,
      safetyBadge: "GOLD_CERTIFIED",
      flaggedSafetyRisks: 6,
    },
    {
      rank: 3,
      name: "GPT-5 (Frontier Preview)",
      provider: "OpenAI",
      humanAlignmentIndex: 94.2,
      hallucinationDefectRate: 2.1,
      euComplianceGrade: "A",
      culturalFluencyScore: 92.8,
      totalHumanAudits: 1050000,
      safetyBadge: "GOLD_CERTIFIED",
      flaggedSafetyRisks: 9,
    },
    {
      rank: 4,
      name: "DeepSeek R1 (Open Reasoning)",
      provider: "DeepSeek AI",
      humanAlignmentIndex: 93.1,
      hallucinationDefectRate: 2.8,
      euComplianceGrade: "A",
      culturalFluencyScore: 91.5,
      totalHumanAudits: 620400,
      safetyBadge: "SILVER_CERTIFIED",
      flaggedSafetyRisks: 14,
    },
    {
      rank: 5,
      name: "Llama 3.3 70B Instruct",
      provider: "Meta",
      humanAlignmentIndex: 91.4,
      hallucinationDefectRate: 3.5,
      euComplianceGrade: "B",
      culturalFluencyScore: 89.2,
      totalHumanAudits: 531200,
      safetyBadge: "SILVER_CERTIFIED",
      flaggedSafetyRisks: 22,
    },
    {
      rank: 6,
      name: "Mistral Large 2",
      provider: "Mistral AI",
      humanAlignmentIndex: 90.7,
      hallucinationDefectRate: 3.9,
      euComplianceGrade: "B",
      culturalFluencyScore: 93.0,
      totalHumanAudits: 418900,
      safetyBadge: "SILVER_CERTIFIED",
      flaggedSafetyRisks: 18,
    },
  ]);

  const [selectedModel, setSelectedModel] = useState<ModelLeaderboardEntry>(models[0]);
  const [isRequestingAudit, setIsRequestingAudit] = useState(false);
  const [auditSuccessNotice, setAuditSuccessNotice] = useState<string | null>(null);

  const handleTriggerSwarmBenchmark = async () => {
    setIsRequestingAudit(true);
    await new Promise((r) => setTimeout(r, 1200));

    setModels((prev) =>
      prev.map((m) => {
        if (m.name === selectedModel.name) {
          return {
            ...m,
            totalHumanAudits: m.totalHumanAudits + 1000,
            humanAlignmentIndex: Number(Math.min(99.9, m.humanAlignmentIndex + 0.1).toFixed(1)),
          };
        }
        return m;
      })
    );

    setIsRequestingAudit(false);
    setAuditSuccessNotice(
      `1,000-Pioneer blind audit completed for ${selectedModel.name}! +1.5 π benchmark validator bounty credited.`
    );

    if (onRewardClaim) {
      onRewardClaim(1.5);
    }

    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#10b981", "#3b82f6"],
    });

    setTimeout(() => setAuditSuccessNotice(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Trophy className="w-3 h-3 text-amber-400" />
                PI GLOBAL HUMAN SAFETY BENCHMARK (HAI)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                Ground Truth by 60M Humans
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Global AI Model Safety &amp; Human Alignment Index
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              No bots auditing bots. The world's first open AI benchmark evaluated and signed by KYC-verified
              humans across 230 countries. Providing objective EU AI Act safety ratings.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Blind Audits</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono">4,386,900</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Anchored on Pi Blockchain</span>
          </div>
        </div>
      </div>

      {auditSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{auditSuccessNotice}</span>
        </div>
      )}

      {/* Main Grid: Leaderboard & Model Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Leaderboard Table */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              Live Leaderboard Ranking (HAI Index)
            </span>
            <span className="text-xs text-slate-400 font-mono">Updated Every 60s</span>
          </div>

          <div className="space-y-2.5">
            {models.map((m) => (
              <div
                key={m.name}
                onClick={() => setSelectedModel(m)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  selectedModel.name === m.name
                    ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                      m.rank === 1
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : m.rank === 2
                        ? "bg-slate-300/20 text-slate-200 border border-slate-400/30"
                        : m.rank === 3
                        ? "bg-amber-700/20 text-amber-600 border border-amber-700/30"
                        : "bg-slate-900 text-slate-400 border border-slate-800"
                    }`}
                  >
                    #{m.rank}
                  </div>

                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">{m.name}</span>
                    <span className="text-[11px] text-slate-400">{m.provider}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">HAI Score</span>
                    <span className="font-bold text-emerald-400">{m.humanAlignmentIndex}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">Hallucination</span>
                    <span className="font-bold text-slate-300">{m.hallucinationDefectRate}%</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">EU Grade</span>
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        m.euComplianceGrade === "A+"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : m.euComplianceGrade === "A"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {m.euComplianceGrade}
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-500 hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Selected Model Deep Dive */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="pb-3 border-b border-slate-800">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                Rank #{selectedModel.rank} &bull; {selectedModel.provider}
              </span>
              <h2 className="text-base font-bold text-white mt-1">{selectedModel.name}</h2>
            </div>

            {/* Safety Metrics breakdown */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Human Alignment (HAI):</span>
                <span className="text-emerald-400 font-bold">{selectedModel.humanAlignmentIndex} / 100</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Hallucination Rate:</span>
                <span className="text-slate-200 font-bold">{selectedModel.hallucinationDefectRate}%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Cultural Fluency:</span>
                <span className="text-teal-400 font-bold">{selectedModel.culturalFluencyScore} / 100</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Total Human Audits:</span>
                <span className="text-white font-bold">{selectedModel.totalHumanAudits.toLocaleString()}</span>
              </div>
            </div>

            {/* Safety Badge */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">{selectedModel.safetyBadge}</span>
                <span className="text-[11px] text-slate-400">
                  EU AI Act Article 50 &amp; 53 Certified
                </span>
              </div>
            </div>

            {/* Trigger Swarm Benchmark Action */}
            <button
              onClick={handleTriggerSwarmBenchmark}
              disabled={isRequestingAudit}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              {isRequestingAudit
                ? "Conducting 1,000-Pioneer Blind Evaluation..."
                : "Run 1,000-Human Blind Benchmark (+1.5 π)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
