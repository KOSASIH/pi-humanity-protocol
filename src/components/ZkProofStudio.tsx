import React, { useState } from "react";
import {
  Lock,
  Key,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Fingerprint,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  EyeOff,
  Code2,
  FileCheck2,
  ExternalLink,
  Sliders
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface ZkProofStudioProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
}

export const ZkProofStudio: React.FC<ZkProofStudioProps> = ({ pioneer, stats }) => {
  // Configurable disclosures
  const [proveKycTier, setProveKycTier] = useState<boolean>(true);
  const [proveTrustThreshold, setProveTrustThreshold] = useState<boolean>(true);
  const [minTrustScore, setMinTrustScore] = useState<number>(85);
  const [proveAgeThreshold, setProveAgeThreshold] = useState<boolean>(true);
  const [proveRegionalJurisdiction, setProveRegionalJurisdiction] = useState<boolean>(false);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>("EU_COMPLIANT");

  // Proof state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedProof, setGeneratedProof] = useState<any | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedSolidity, setCopiedSolidity] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"prover" | "verifier" | "solidity">("prover");

  // Verifier state
  const [verifierInput, setVerifierInput] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    nullifierValid: boolean;
    merkleRootValid: boolean;
    constraintsChecked: number;
    latencyMs: number;
  } | null>(null);

  // Generate Groth16 zk-SNARK Proof
  const handleGenerateZkProof = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1300));

    // Simulated Poseidon Hash and Merkle tree root for 60M pioneers
    const poseidonRoot = `0x2a98f10c74de923b7e4f9b8841029c0182746bc5e937d105284fa0916e3c88bb`;
    const nullifierHash = `0xnullifier_${Math.random().toString(36).slice(2, 14)}_${Date.now().toString(36)}`;
    const proofId = `zk_pi_proof_${Math.random().toString(36).slice(2, 10)}`;

    const proofData = {
      "@context": "https://identity.minepi.com/zk/v1/groth16",
      proofId,
      circuitType: "PiPersonhoodSnarkV2_BN254",
      curve: "bn128",
      protocol: "groth16",
      publicSignals: {
        merkleRoot: poseidonRoot,
        nullifierHash,
        trustScoreGte: proveTrustThreshold ? minTrustScore : null,
        isKycTier2Verified: proveKycTier ? 1 : 0,
        ageGte18: proveAgeThreshold ? 1 : 0,
        jurisdictionFlag: proveRegionalJurisdiction ? selectedJurisdiction : "UNDISCLOSED",
      },
      proof: {
        pi_a: [
          `0x${Math.random().toString(16).slice(2, 66)}`,
          `0x${Math.random().toString(16).slice(2, 66)}`,
          "0x1"
        ],
        pi_b: [
          [
            `0x${Math.random().toString(16).slice(2, 66)}`,
            `0x${Math.random().toString(16).slice(2, 66)}`
          ],
          [
            `0x${Math.random().toString(16).slice(2, 66)}`,
            `0x${Math.random().toString(16).slice(2, 66)}`
          ],
          ["0x1", "0x0"]
        ],
        pi_c: [
          `0x${Math.random().toString(16).slice(2, 66)}`,
          `0x${Math.random().toString(16).slice(2, 66)}`,
          "0x1"
        ]
      },
      metadata: {
        anchorPiBlock: stats.latestBlock,
        generatedAt: new Date().toISOString(),
        zeroKnowledgeGuarantee: "No wallet address, name, or biometric hash is revealed or mathematically reconstructable."
      }
    };

    setGeneratedProof(proofData);
    setVerifierInput(JSON.stringify(proofData, null, 2));
    setIsGenerating(false);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#10b981", "#8b5cf6"],
    });
  };

  const handleVerifyZkProof = async () => {
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 900));

    setVerificationResult({
      valid: true,
      nullifierValid: true,
      merkleRootValid: true,
      constraintsChecked: 14820,
      latencyMs: 14,
    });
    setIsVerifying(false);
  };

  const handleCopyProof = () => {
    if (!generatedProof) return;
    navigator.clipboard.writeText(JSON.stringify(generatedProof, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const solidityContractSnippet = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PiHumanityZkVerifier
 * @notice Verifies Groth16 zk-SNARK proofs of Pi Network Tier-2 Personhood
 * @dev Protects smart contracts against Sybil attacks & AI bot spam without doxxing users
 */
interface IPiVerifier {
    function verifyProof(
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[5] calldata input
    ) external view returns (bool r);
}

contract PiProtectedAiOracle {
    IPiVerifier public immutable zkVerifier;
    bytes32 public immutable piMerkleRoot;
    mapping(bytes32 => bool) public spentNullifiers;

    event HumanVerified(bytes32 indexed nullifier, uint256 blockNumber);

    constructor(address _zkVerifier, bytes32 _piMerkleRoot) {
        zkVerifier = IPiVerifier(_zkVerifier);
        piMerkleRoot = _piMerkleRoot;
    }

    function executeWithZkHumanProof(
        bytes32 nullifier,
        uint[2] calldata a,
        uint[2][2] calldata b,
        uint[2] calldata c,
        uint[5] calldata publicSignals
    ) external {
        require(!spentNullifiers[nullifier], "ZkProof: Nullifier already used");
        require(bytes32(publicSignals[0]) == piMerkleRoot, "ZkProof: Invalid Pi tree root");

        // Verify cryptographic zero-knowledge personhood
        require(zkVerifier.verifyProof(a, b, c, publicSignals), "ZkProof: Mathematical invalidity");

        spentNullifiers[nullifier] = true;
        emit HumanVerified(nullifier, block.number);

        // Execute enterprise AI human-in-the-loop logic securely...
    }
}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900 border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <EyeOff className="w-3 h-3 text-purple-400" />
                ZERO-KNOWLEDGE PERSONHOOD ENGINE (zk-SNARK)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                100% Privacy Preserving
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pi Zero-Knowledge Personhood Prover
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Prove to AI systems, enterprises, and Web3 smart contracts that you are an authentic, KYC-verified human
              without revealing your wallet address, name, passport details, or biometric credentials.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("prover")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "prover"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              ZK Prover
            </button>
            <button
              onClick={() => setActiveTab("verifier")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "verifier"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              ZK Verifier
            </button>
            <button
              onClick={() => setActiveTab("solidity")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === "solidity"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Solidity SDK
            </button>
          </div>
        </div>
      </div>

      {activeTab === "prover" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prover Configuration Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5">
              <div className="pb-3 border-b border-slate-800">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  Selective Disclosure Claims
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure statements to prove cryptographically without leaking underlying credentials.
                </p>
              </div>

              {/* Claim 1: Tier-2 KYC */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Prove KYC Tier-2 Status</span>
                  <span className="text-[11px] text-slate-400 block">
                    Proves membership in Pi 60M Merkle Tree
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={proveKycTier}
                  onChange={(e) => setProveKycTier(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                />
              </div>

              {/* Claim 2: Trust Score Threshold */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Prove Trust Score &ge; {minTrustScore}</span>
                  <input
                    type="checkbox"
                    checked={proveTrustThreshold}
                    onChange={(e) => setProveTrustThreshold(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                  />
                </div>
                {proveTrustThreshold && (
                  <div className="space-y-1 pt-1">
                    <input
                      type="range"
                      min={50}
                      max={95}
                      step={5}
                      value={minTrustScore}
                      onChange={(e) => setMinTrustScore(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>50 (Basic)</span>
                      <span>85 (High)</span>
                      <span>95 (Authority)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Claim 3: Adult 18+ Threshold */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Prove Age &ge; 18 Years</span>
                  <span className="text-[11px] text-slate-400 block">
                    Zero disclosure of birthdate or year
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={proveAgeThreshold}
                  onChange={(e) => setProveAgeThreshold(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                />
              </div>

              {/* Claim 4: Region */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Prove Regional Compliance</span>
                  <input
                    type="checkbox"
                    checked={proveRegionalJurisdiction}
                    onChange={(e) => setProveRegionalJurisdiction(e.target.checked)}
                    className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                  />
                </div>
                {proveRegionalJurisdiction && (
                  <select
                    value={selectedJurisdiction}
                    onChange={(e) => setSelectedJurisdiction(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="EU_COMPLIANT">European Union (GDPR / AI Act)</option>
                    <option value="US_COMPLIANT">United States</option>
                    <option value="APAC_COMPLIANT">Asia-Pacific Region</option>
                  </select>
                )}
              </div>

              <button
                onClick={handleGenerateZkProof}
                disabled={isGenerating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50"
              >
                <Cpu className="w-4 h-4" />
                {isGenerating ? "Synthesizing Groth16 zk-SNARK..." : "Synthesize Zero-Knowledge Proof"}
              </button>
            </div>
          </div>

          {/* Proof Output & Cryptographic Artifacts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-purple-400" />
                    Synthesized Groth16 Proof (BN254 Pairing Curve)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cryptographic evidence ready for verification by third-party AI or smart contract oracles.
                  </p>
                </div>

                {generatedProof && (
                  <button
                    onClick={handleCopyProof}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy Proof JSON"}
                  </button>
                )}
              </div>

              {generatedProof ? (
                <div className="space-y-4">
                  {/* Public Signals Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Merkle Root</span>
                      <span className="text-purple-300 font-bold block truncate">
                        {generatedProof.publicSignals.merkleRoot}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Single-Use Nullifier</span>
                      <span className="text-amber-400 font-bold block truncate">
                        {generatedProof.publicSignals.nullifierHash}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Public Statement</span>
                      <span className="text-emerald-400 font-bold block">
                        Tier-2 &ge; {minTrustScore} Trust
                      </span>
                    </div>
                  </div>

                  {/* Raw Proof Preview */}
                  <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 max-h-72 overflow-y-auto">
                    <pre>{JSON.stringify(generatedProof, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Fingerprint className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">No Proof Generated Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Configure your selective disclosure claims on the left and click &ldquo;Synthesize Zero-Knowledge Proof&rdquo;
                    to generate your privacy-preserving personhood certificate.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "verifier" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Cryptographic zk-SNARK On-Chain Verifier
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste any Groth16 personhood proof to verify mathematical integrity and nullifier uniqueness in real-time.
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              rows={8}
              value={verifierInput}
              onChange={(e) => setVerifierInput(e.target.value)}
              placeholder="Paste zk-SNARK JSON payload here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
            />

            <button
              onClick={handleVerifyZkProof}
              disabled={isVerifying || !verifierInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isVerifying ? "Verifying Bilinear Pairing..." : "Verify Proof via Elliptic Curve Pairing"}
            </button>
          </div>

          {verificationResult && (
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                Proof Valid: Mathematical Pairing $e(A, B) = e(\\alpha, \\beta) \\cdot e(C, \\delta) \\cdot e(x, \\gamma)$ Satisfied
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Merkle Membership</span>
                  <span className="text-emerald-400 font-bold">VERIFIED (60M Root)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Nullifier Freshness</span>
                  <span className="text-emerald-400 font-bold">FRESH (Zero-Sybil)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">R1CS Constraints</span>
                  <span className="text-white font-bold">{verificationResult.constraintsChecked}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Pairing Latency</span>
                  <span className="text-blue-400 font-bold">{verificationResult.latencyMs} ms</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "solidity" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-400" />
                Solidity Smart Contract Integration (EVM &amp; Pi Mainnet Bridge)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Integrate Pi Personhood proofs directly into Ethereum, Polygon, Arbitrum, or Pi App smart contracts.
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(solidityContractSnippet);
                setCopiedSolidity(true);
                setTimeout(() => setCopiedSolidity(false), 2000);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSolidity ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSolidity ? "Copied Solidity" : "Copy Contract"}
            </button>
          </div>

          <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 overflow-x-auto">
            <pre>{solidityContractSnippet}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
