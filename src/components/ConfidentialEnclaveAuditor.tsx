import React, { useState } from "react";
import {
  Cpu,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Terminal,
  FileCode2,
  Copy,
  Check,
  Zap,
  Activity,
  Server
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface ConfidentialEnclaveAuditorProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

interface EnclaveSession {
  id: string;
  enclaveType: "Intel SGX v3" | "AMD SEV-SNP" | "AWS Nitro Enclave";
  modelName: string;
  enterpriseClient: string;
  pcr0Hash: string;
  pcr1Hash: string;
  pcr2Hash: string;
  mrEnclave: string;
  memoryZeroized: boolean;
  hardwareProofStatus: "VERIFIED" | "PENDING_PIONEER_AUDIT" | "FAILED_TAMPERED";
  bountyPi: number;
  quorumsVerified: number;
  requiredQuorum: number;
}

export const ConfidentialEnclaveAuditor: React.FC<ConfidentialEnclaveAuditorProps> = ({
  pioneer,
  stats,
  onRewardClaim,
}) => {
  const [sessions, setSessions] = useState<EnclaveSession[]>([
    {
      id: "tee_session_01",
      enclaveType: "Intel SGX v3",
      modelName: "BioGenomics-Oncology-Transformer-70B",
      enterpriseClient: "Mayo Clinic Distributed AI Alliance",
      pcr0Hash: "0x89ab45cd...ee3491fa",
      pcr1Hash: "0x3344bb12...88cc11ee",
      pcr2Hash: "0xa1b2c3d4...99887766",
      mrEnclave: "0x77fa2312bbaaccddeeff00112233445566778899aabbccddeeff001122334455",
      memoryZeroized: true,
      hardwareProofStatus: "VERIFIED",
      bountyPi: 3.5,
      quorumsVerified: 15,
      requiredQuorum: 15,
    },
    {
      id: "tee_session_02",
      enclaveType: "AMD SEV-SNP",
      modelName: "Algorithmic-HighFreq-Arbitrage-Agent-v9",
      enterpriseClient: "Zurich Quantitative Sovereign Fund",
      pcr0Hash: "0xfa129034...77bc89de",
      pcr1Hash: "0x11223344...55667788",
      pcr2Hash: "0x9900aabb...ccddeeff",
      mrEnclave: "0x99112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
      memoryZeroized: false,
      hardwareProofStatus: "PENDING_PIONEER_AUDIT",
      bountyPi: 4.2,
      quorumsVerified: 12,
      requiredQuorum: 15,
    },
    {
      id: "tee_session_03",
      enclaveType: "AWS Nitro Enclave",
      modelName: "Confidential-Contract-Parser-LLM",
      enterpriseClient: "Deloitte Sovereign Legal Compute",
      pcr0Hash: "0xeeff1122...33445566",
      pcr1Hash: "0x77889900...aabbccdd",
      pcr2Hash: "0x44556677...889900aa",
      mrEnclave: "0xbbccddeeff00112233445566778899aabbccddeeff00112233445566778899aa",
      memoryZeroized: true,
      hardwareProofStatus: "VERIFIED",
      bountyPi: 2.8,
      quorumsVerified: 15,
      requiredQuorum: 15,
    },
  ]);

  const [selectedSessionId, setSelectedSessionId] = useState<string>("tee_session_02");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const selectedSession =
    sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  const handleVerifyEnclaveProof = async () => {
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 1200));

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === selectedSession.id) {
          return {
            ...s,
            memoryZeroized: true,
            hardwareProofStatus: "VERIFIED",
            quorumsVerified: s.quorumsVerified + 1,
          };
        }
        return s;
      })
    );

    setIsVerifying(false);
    setAuditMessage(
      `Hardware Attestation cryptographic quote verified! Remote enclave validated without prompt leaks. +${selectedSession.bountyPi} π earned.`
    );

    if (onRewardClaim) {
      onRewardClaim(selectedSession.bountyPi);
    }

    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#10b981", "#8b5cf6"],
    });

    setTimeout(() => setAuditMessage(null), 5000);
  };

  const attestationQuote = JSON.stringify(
    {
      enclave_architecture: selectedSession.enclaveType,
      model: selectedSession.modelName,
      enterprise_sponsor: selectedSession.enterpriseClient,
      cryptographic_registers: {
        PCR0_image_hash: selectedSession.pcr0Hash,
        PCR1_kernel_hash: selectedSession.pcr1Hash,
        PCR2_model_weights_hash: selectedSession.pcr2Hash,
        MRENCLAVE: selectedSession.mrEnclave,
      },
      security_guarantees: {
        memory_zeroization_verified: selectedSession.memoryZeroized,
        hardware_attestation_authority: "Intel / AMD Root Certificate Authority",
        side_channel_isolation: "Spectre/Meltdown L1TF Mitigated",
        prompt_privacy: "Zero Plaintext Exposure Outside Enclave",
      },
      pioneer_attestation_quorum: `${selectedSession.quorumsVerified}/${selectedSession.requiredQuorum} Nodes`,
    },
    null,
    2
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-indigo-400" />
                TEE HARDWARE ATTESTATION &amp; CONFIDENTIAL AI
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                Intel SGX / AMD SEV-SNP
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Confidential AI Enclave Auditor
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Enterprise AI running on sensitive patient data or proprietary weights must run inside hardware Trusted
              Execution Environments. Pioneers verify remote hardware attestation quotes and validate memory zeroization.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Enclaves Attested</span>
            <span className="text-2xl font-extrabold text-indigo-400 font-mono">3,891 TEEs</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Zero Data Leaks Recorded</span>
          </div>
        </div>
      </div>

      {auditMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{auditMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Active Enclave Sessions */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 block flex items-center justify-between">
              <span>Active Enclave Audits</span>
              <span className="text-indigo-400">Hardware PCR Swarm</span>
            </span>

            <div className="space-y-2">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSessionId(s.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedSessionId === s.id
                      ? "bg-indigo-500/10 border-indigo-500 text-white shadow-lg shadow-indigo-500/10"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {s.enclaveType}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">+{s.bountyPi} π</span>
                  </div>

                  <span className="text-xs font-bold block text-white line-clamp-1">{s.modelName}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{s.enterpriseClient}</span>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                    <span>
                      Quorum: {s.quorumsVerified}/{s.requiredQuorum}
                    </span>
                    <span
                      className={`font-bold ${
                        s.hardwareProofStatus === "VERIFIED"
                          ? "text-emerald-400"
                          : "text-amber-400 animate-pulse"
                      }`}
                    >
                      {s.hardwareProofStatus === "VERIFIED" ? "ATTESTED" : "AUDIT NEEDED"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Enclave Security Standards Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 block flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              Hardware Enclave Security Guarantees
            </span>
            <ul className="text-xs text-slate-300 space-y-2 font-mono">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">&bull;</span>
                <span>Hypervisor Root Isolation (No Host OS Access)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">&bull;</span>
                <span>Cryptographic RAM Encryption Engine (AES-XTS-256)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">&bull;</span>
                <span>Zeroized Prompt Buffers upon Inference Return</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Deep Quote Inspector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">
                  Enclave Target: {selectedSession.enclaveType}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1">{selectedSession.modelName}</h2>
                <span className="text-xs text-slate-400">{selectedSession.enterpriseClient}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
                    selectedSession.hardwareProofStatus === "VERIFIED"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-300 animate-pulse"
                  }`}
                >
                  Status: {selectedSession.hardwareProofStatus}
                </span>
              </div>
            </div>

            {/* Platform Configuration Registers (PCRs) */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase text-slate-400 block flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-indigo-400" />
                Hardware Platform Configuration Registers (PCRs)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-black/80 border border-slate-800 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block">PCR-0 (BIOS &amp; FW)</span>
                  <span className="text-xs text-indigo-300 font-bold truncate block">{selectedSession.pcr0Hash}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/80 border border-slate-800 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block">PCR-1 (Kernel &amp; OS)</span>
                  <span className="text-xs text-indigo-300 font-bold truncate block">{selectedSession.pcr1Hash}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/80 border border-slate-800 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase block">PCR-2 (Weights Hash)</span>
                  <span className="text-xs text-indigo-300 font-bold truncate block">{selectedSession.pcr2Hash}</span>
                </div>
              </div>
            </div>

            {/* Memory Zeroization Check */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Post-Inference Memory Zeroization Proof
                </span>
                <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                  Ensures zero residual prompt tokens or training vectors remain in enclave cache memory
                </span>
              </div>

              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                  selectedSession.memoryZeroized
                    ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                    : "bg-amber-950/60 border border-amber-500/40 text-amber-300"
                }`}
              >
                {selectedSession.memoryZeroized ? "ZEROIZED OK" : "AUDIT PENDING"}
              </span>
            </div>

            {/* JSON Attestation Quote */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  Cryptographic Remote Attestation Quote (Intel/AMD Signed)
                </span>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(attestationQuote);
                    setCopiedHash(true);
                    setTimeout(() => setCopiedHash(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedHash ? "Copied" : "Copy Quote"}
                </button>
              </div>

              <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto">
                <pre>{attestationQuote}</pre>
              </div>
            </div>

            {/* Pioneer Verification Action */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 font-mono">
                Pioneer Node: <span className="text-white font-bold">@{pioneer.username}</span> &bull; Quorum Verified:{" "}
                <span className="text-indigo-400 font-bold">
                  {selectedSession.quorumsVerified}/{selectedSession.requiredQuorum}
                </span>
              </div>

              <button
                onClick={handleVerifyEnclaveProof}
                disabled={isVerifying || selectedSession.hardwareProofStatus === "VERIFIED"}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  selectedSession.hardwareProofStatus === "VERIFIED"
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25"
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin" : ""}`} />
                {isVerifying
                  ? "Verifying SGX Hardware PCR Quote..."
                  : selectedSession.hardwareProofStatus === "VERIFIED"
                  ? "Hardware Quote Verified"
                  : `Attest Remote Enclave (+${selectedSession.bountyPi} π)`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
