import React, { useState } from "react";
import {
  ShieldAlert,
  Video,
  Mic,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  Download,
  Copy,
  Check,
  FileCheck2,
  Sparkles,
  Layers,
  Activity,
  UserCheck
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface DeepfakeForensicLabProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

interface ForensicEvidence {
  id: string;
  type: "audio" | "video" | "image";
  title: string;
  targetSubject: string;
  anomalyScore: number; // 0 - 100%
  forensicIndicators: string[];
  consensusStatus: "CONSENSUS_SYNTHETIC" | "CONSENSUS_AUTHENTIC" | "IN_AUDIT";
  humanQuorum: { pioneer: string; flag: string; verdict: "SYNTHETIC" | "AUTHENTIC" }[];
  c2paManifestId: string;
  bountyPi: number;
}

export const DeepfakeForensicLab: React.FC<DeepfakeForensicLabProps> = ({
  pioneer,
  stats,
  onRewardClaim,
}) => {
  const [evidenceList, setEvidenceList] = useState<ForensicEvidence[]>([
    {
      id: "forensic_01",
      type: "audio",
      title: "Executive Voice Clone: Urgent Offshore Wire Authorization",
      targetSubject: "Multinational Enterprise CEO",
      anomalyScore: 98.4,
      forensicIndicators: [
        "Robotic vocoder phase cancellation detected above 16kHz",
        "Zero biological respiration pauses between phonemes",
        "Spectral centroid flatness indicates diffusion model synthesis",
      ],
      consensusStatus: "CONSENSUS_SYNTHETIC",
      humanQuorum: [
        { pioneer: "kosasih_node_id", flag: "🇮🇩", verdict: "SYNTHETIC" },
        { pioneer: "pioneer_tokyo_4", flag: "🇯🇵", verdict: "SYNTHETIC" },
        { pioneer: "berlin_forensic_lab", flag: "🇩🇪", verdict: "SYNTHETIC" },
      ],
      c2paManifestId: "c2pa:pi-protocol:voice:e78a0b9432",
      bountyPi: 4.8,
    },
    {
      id: "forensic_02",
      type: "video",
      title: "Diplomatic Press Conference Deepfake Video",
      targetSubject: "Ambassador to United Nations",
      anomalyScore: 96.9,
      forensicIndicators: [
        "Pupillary reflex desynchronized from studio ambient lighting",
        "Ear-to-cheek boundary blur during rapid angular head movement",
        "Teeth geometry shows inconsistent neural Gaussian splatting",
      ],
      consensusStatus: "IN_AUDIT",
      humanQuorum: [
        { pioneer: "lagos_alpha", flag: "🇳🇬", verdict: "SYNTHETIC" },
        { pioneer: "saopaulo_node", flag: "🇧🇷", verdict: "SYNTHETIC" },
      ],
      c2paManifestId: "c2pa:pi-protocol:video:8f9021da78",
      bountyPi: 6.2,
    },
    {
      id: "forensic_03",
      type: "image",
      title: "Critical Infrastructure Satellite Photo",
      targetSubject: "Subsea Fiber Optic Cable Landing Site",
      anomalyScore: 12.1,
      forensicIndicators: [
        "Consistent lens diffraction pattern across high-contrast edges",
        "Optical sensor noise matches authenticated Sentinel-2 telemetry",
        "Verified human visual review confirmed genuine photographic origin",
      ],
      consensusStatus: "CONSENSUS_AUTHENTIC",
      humanQuorum: [
        { pioneer: "kosasih_node_id", flag: "🇮🇩", verdict: "AUTHENTIC" },
        { pioneer: "seoul_sc_node", flag: "🇰🇷", verdict: "AUTHENTIC" },
        { pioneer: "singapore_relay", flag: "🇸🇬", verdict: "AUTHENTIC" },
      ],
      c2paManifestId: "c2pa:pi-protocol:image:190283bc44",
      bountyPi: 3.5,
    },
  ]);

  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>("forensic_02");
  const [copiedManifest, setCopiedManifest] = useState<boolean>(false);
  const [userVoted, setUserVoted] = useState<boolean>(false);

  const selectedEvidence =
    evidenceList.find((e) => e.id === selectedEvidenceId) || evidenceList[0];

  const handleCastForensicVerdict = (verdict: "SYNTHETIC" | "AUTHENTIC") => {
    setEvidenceList((prev) =>
      prev.map((item) => {
        if (item.id === selectedEvidence.id) {
          const updatedQuorum = [
            ...item.humanQuorum,
            {
              pioneer: pioneer.username,
              flag: pioneer.countryFlag,
              verdict,
            },
          ];
          const syntheticCount = updatedQuorum.filter((v) => v.verdict === "SYNTHETIC").length;
          const authenticCount = updatedQuorum.filter((v) => v.verdict === "AUTHENTIC").length;
          const status =
            updatedQuorum.length >= 3
              ? syntheticCount > authenticCount
                ? "CONSENSUS_SYNTHETIC"
                : "CONSENSUS_AUTHENTIC"
              : "IN_AUDIT";

          return {
            ...item,
            humanQuorum: updatedQuorum,
            consensusStatus: status,
          };
        }
        return item;
      })
    );

    setUserVoted(true);
    if (onRewardClaim) {
      onRewardClaim(selectedEvidence.bountyPi);
    }

    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#10b981", "#ef4444"],
    });

    setTimeout(() => setUserVoted(false), 4000);
  };

  const c2paManifestJson = {
    "@context": "https://c2pa.org/specifications/v1",
    label: selectedEvidence.c2paManifestId,
    title: selectedEvidence.title,
    format: selectedEvidence.type === "audio" ? "audio/wav" : selectedEvidence.type === "video" ? "video/mp4" : "image/jpeg",
    claim_generator: "Pi Humanity Protocol Forensic Swarm v2.4",
    assertions: [
      {
        label: "c2pa.synthetic.detection",
        data: {
          consensusJudgement: selectedEvidence.consensusStatus,
          biologicalAnomalyScore: `${selectedEvidence.anomalyScore}%`,
          humanQuorumSignatures: selectedEvidence.humanQuorum.length,
          hardwareKycVerified: true,
          anchorPiBlock: stats.latestBlock,
        },
      },
      {
        label: "c2pa.forensic.indicators",
        data: selectedEvidence.forensicIndicators,
      },
    ],
    signature: {
      issuer: "did:pi:humanity-foundation:forensic-root",
      certChain: "https://humanity.pi/certs/c2pa-root.pem",
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 border border-cyan-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Video className="w-3 h-3 text-cyan-400" />
                C2PA COMPLIANT FORENSIC LAB
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                EU AI Act Article 52 Ready
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Multimodal Deepfake Forensic Swarm
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Automated AI detectors fail against next-generation synthetic media.
              Pi Network's 60M human biometric swarm provides un-spoofable forensic consensus and C2PA Content Credentials.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Forensics Accuracy</span>
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">99.84%</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Biometric Hardware Anchored</span>
          </div>
        </div>
      </div>

      {userVoted && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            Forensic vote registered with hardware biometric signature! Reward +{selectedEvidence.bountyPi} π credited to your sovereign balance.
          </span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Evidence Queue */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 block">
              Active Forensic Cases
            </span>

            <div className="space-y-2">
              {evidenceList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedEvidenceId(item.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedEvidenceId === item.id
                      ? "bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 uppercase flex items-center gap-1">
                      {item.type === "audio" && <Mic className="w-3 h-3 text-amber-400" />}
                      {item.type === "video" && <Video className="w-3 h-3 text-cyan-400" />}
                      {item.type === "image" && <ImageIcon className="w-3 h-3 text-purple-400" />}
                      {item.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">+{item.bountyPi} π</span>
                  </div>

                  <span className="text-xs font-bold block text-white line-clamp-1">{item.title}</span>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                    <span>Anomaly: {item.anomalyScore}%</span>
                    <span
                      className={
                        item.consensusStatus === "CONSENSUS_SYNTHETIC"
                          ? "text-rose-400 font-bold"
                          : item.consensusStatus === "CONSENSUS_AUTHENTIC"
                          ? "text-emerald-400 font-bold"
                          : "text-amber-400 font-bold"
                      }
                    >
                      {item.consensusStatus === "CONSENSUS_SYNTHETIC"
                        ? "SYNTHETIC"
                        : item.consensusStatus === "CONSENSUS_AUTHENTIC"
                        ? "AUTHENTIC"
                        : "IN QUORUM"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Forensic Inspection & Spectral Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                  Subject Target: {selectedEvidence.targetSubject}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">{selectedEvidence.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
                  Bounty: {selectedEvidence.bountyPi} π
                </span>
              </div>
            </div>

            {/* Simulated Spectral Heatmap / Visual Artifacts Canvas */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 block flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Spectral Artifacts &amp; Biometric Frequency Telemetry
              </span>

              <div className="p-5 rounded-2xl bg-black/90 border border-slate-800 space-y-4">
                <div className="h-28 rounded-xl bg-slate-950 border border-slate-800/80 p-3 flex items-end gap-1.5 overflow-hidden">
                  {[45, 62, 85, 92, 78, 65, 88, 95, 72, 60, 89, 99, 54, 76, 84, 91, 68, 79, 93, 85, 70, 94, 98, 62, 80, 88, 92].map(
                    (val, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-t transition-all duration-300 ${
                          val > 85 ? "bg-rose-500" : val > 70 ? "bg-amber-500" : "bg-cyan-500"
                        }`}
                        style={{ height: `${val}%` }}
                        title={`Bin ${idx}: ${val}% energy anomaly`}
                      ></div>
                    )
                  )}
                </div>

                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>0 Hz (Fundamental)</span>
                  <span>Diffusion Artifact Peak (8.4 kHz)</span>
                  <span>22.05 kHz (Nyquist Limit)</span>
                </div>
              </div>
            </div>

            {/* Forensic Indicator Bullets */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 block">
                Biometric &amp; Physical Anomaly Indicators
              </span>
              <div className="space-y-2">
                {selectedEvidence.forensicIndicators.map((ind, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300 flex items-start gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Voting Controls */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  Cast Forensic Swarm Verdict
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Requires Tier-2 Hardware Biometric Key
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleCastForensicVerdict("SYNTHETIC")}
                  className="p-4 rounded-2xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
                >
                  <AlertTriangle className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                  <span>CONFIRM SYNTHETIC / DEEPFAKE</span>
                  <span className="text-[10px] font-normal text-rose-400/80">
                    Neural artifacts / Voice clone detected (+{selectedEvidence.bountyPi} π)
                  </span>
                </button>

                <button
                  onClick={() => handleCastForensicVerdict("AUTHENTIC")}
                  className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>CONFIRM GENUINE / AUTHENTIC</span>
                  <span className="text-[10px] font-normal text-emerald-400/80">
                    Natural acoustics &amp; physical lighting (+{selectedEvidence.bountyPi} π)
                  </span>
                </button>
              </div>

              {/* Quorum Progress */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span>Pioneers Signed:</span>
                  {selectedEvidence.humanQuorum.map((q, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-white flex items-center gap-1"
                    >
                      <span>{q.flag}</span>
                      <span className="text-[10px] text-slate-400">{q.pioneer}</span>
                      <span
                        className={`text-[9px] font-bold ${
                          q.verdict === "SYNTHETIC" ? "text-rose-400" : "text-emerald-400"
                        }`}
                      >
                        ({q.verdict})
                      </span>
                    </span>
                  ))}
                </div>

                <span className="text-cyan-400 font-bold">
                  Status: {selectedEvidence.consensusStatus}
                </span>
              </div>
            </div>

            {/* C2PA Provenance Manifest JSON */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 block flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                  C2PA Content Credentials Manifest (EU AI Act Article 52 Compliant)
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(c2paManifestJson, null, 2));
                    setCopiedManifest(true);
                    setTimeout(() => setCopiedManifest(false), 2000);
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedManifest ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedManifest ? "Copied" : "Copy C2PA"}
                </button>
              </div>

              <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto">
                <pre>{JSON.stringify(c2paManifestJson, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
