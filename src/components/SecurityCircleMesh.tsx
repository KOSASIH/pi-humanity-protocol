import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Network,
  Lock,
  RefreshCw,
  Fingerprint,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface SecurityCircleMeshProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

interface CircleMember {
  uid: string;
  username: string;
  country: string;
  flag: string;
  kycTier: string;
  eigenTrustScore: number; // 0 - 100
  circleStatus: "VERIFIED_ACTIVE" | "PENDING_PIONEER_AUDIT";
  humanAuditsCompleted: number;
}

export const SecurityCircleMesh: React.FC<SecurityCircleMeshProps> = ({
  pioneer,
  stats,
  onRewardClaim,
}) => {
  const [members, setMembers] = useState<CircleMember[]>([
    {
      uid: "node_sg_01",
      username: "singapore_validator_88",
      country: "Singapore",
      flag: "🇸🇬",
      kycTier: "Tier 2 (Biometric Liveness)",
      eigenTrustScore: 98.4,
      circleStatus: "VERIFIED_ACTIVE",
      humanAuditsCompleted: 4210,
    },
    {
      uid: "node_fr_02",
      username: "paris_sorbonne_ai",
      country: "France",
      flag: "🇫🇷",
      kycTier: "Tier 2 (Biometric Liveness)",
      eigenTrustScore: 97.2,
      circleStatus: "VERIFIED_ACTIVE",
      humanAuditsCompleted: 3890,
    },
    {
      uid: "node_id_03",
      username: "nusantara_consensus",
      country: "Indonesia",
      flag: "🇮🇩",
      kycTier: "Tier 2 (Biometric Liveness)",
      eigenTrustScore: 99.1,
      circleStatus: "VERIFIED_ACTIVE",
      humanAuditsCompleted: 6140,
    },
    {
      uid: "node_br_04",
      username: "rio_defi_validator",
      country: "Brazil",
      flag: "🇧🇷",
      kycTier: "Tier 2 (Biometric Liveness)",
      eigenTrustScore: 96.5,
      circleStatus: "VERIFIED_ACTIVE",
      humanAuditsCompleted: 2950,
    },
    {
      uid: "node_ng_05",
      username: "lagos_human_guard",
      country: "Nigeria",
      flag: "🇳🇬",
      kycTier: "Tier 2 (Biometric Liveness)",
      eigenTrustScore: 98.9,
      circleStatus: "PENDING_PIONEER_AUDIT",
      humanAuditsCompleted: 5310,
    },
  ]);

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  const handleAuditCircle = async () => {
    setIsAuditing(true);
    await new Promise((r) => setTimeout(r, 1100));

    setMembers((prev) =>
      prev.map((m) => ({
        ...m,
        circleStatus: "VERIFIED_ACTIVE",
        eigenTrustScore: Math.min(100, Number((m.eigenTrustScore + 0.2).toFixed(1))),
      }))
    );

    setIsAuditing(false);
    setAuditMessage(
      "EigenTrust Sybil audit completed! Security circle verified with 0% bot collision. +1.2 π reward earned."
    );

    if (onRewardClaim) {
      onRewardClaim(1.2);
    }

    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#10b981", "#6366f1", "#f59e0b"],
    });

    setTimeout(() => setAuditMessage(null), 5000);
  };

  const averageTrustScore = (
    members.reduce((acc, m) => acc + m.eigenTrustScore, 0) / members.length
  ).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/20 to-slate-900 border border-teal-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                <Users className="w-3 h-3 text-teal-400" />
                PI NETWORK SECURITY CIRCLE &bull; EIGENTRUST
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                Sybil Resistance: 99.4%
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pioneer Security Circle &amp; Sybil Defense Mesh
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Pi Network's unique strength: trust circles of real humans. We utilize decentralized graph algorithms
              to guarantee that voting quorums in AI evaluations cannot be hijacked by sybil bot clusters.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Circle EigenTrust</span>
            <span className="text-2xl font-extrabold text-teal-400 font-mono">{averageTrustScore}%</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">5/5 Verified Members</span>
          </div>
        </div>
      </div>

      {auditMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{auditMessage}</span>
        </div>
      )}

      {/* Main Grid: Members List & Sybil Defense Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Security Circle Members */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-teal-400" />
              Your Verified Security Circle (5 Humans)
            </span>
            <span className="text-xs text-slate-400 font-mono">Max Bonus Tier</span>
          </div>

          <div className="space-y-3">
            {members.map((m) => (
              <div
                key={m.uid}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">{m.flag}</span>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">@{m.username}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {m.country} &bull; {m.kycTier}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">EigenTrust</span>
                    <span className="font-bold text-teal-400">{m.eigenTrustScore}%</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">Audits Done</span>
                    <span className="font-bold text-slate-300">{m.humanAuditsCompleted.toLocaleString()}</span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                      m.circleStatus === "VERIFIED_ACTIVE"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse"
                    }`}
                  >
                    {m.circleStatus === "VERIFIED_ACTIVE" ? "ACTIVE" : "AUDIT"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Trigger */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400 font-mono">
              Sybil Collision Risk: <span className="text-emerald-400 font-bold">0.0001% (Zero Cartels)</span>
            </span>

            <button
              onClick={handleAuditCircle}
              disabled={isAuditing}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-600/25 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? "animate-spin" : ""}`} />
              {isAuditing ? "Calculating EigenTrust Matrix..." : "Audit Security Circle (+1.2 π)"}
            </button>
          </div>
        </div>

        {/* Right Col: Sybil Defense Graph Theory */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <span className="text-xs font-mono uppercase text-slate-400 block flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              Sybil Defense Guarantees
            </span>

            <ul className="text-xs text-slate-300 space-y-3 font-sans leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Decentralized Trust Graph:</strong> Each Pioneer is backed by 5 real peers who know them,
                  creating an unbreakable mesh.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Geographic Entropy:</strong> AI tasks are routed across multiple independent circles in
                  different continents to eliminate localized bias.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Bot Feasibility:</strong> Cost to attack a 15-node quorum exceeds $40,000 in KYC hardware
                  and social trust proofs.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
