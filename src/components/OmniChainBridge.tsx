import React, { useState } from "react";
import {
  Network,
  ArrowRightLeft,
  CheckCircle2,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Globe2,
  Layers,
  Sparkles,
  RefreshCw,
  Cpu
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface OmniChainBridgeProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

interface CrossChainMessage {
  id: string;
  targetChain: "Ethereum" | "Arbitrum" | "Base" | "Solana";
  payloadType: "ZK_PERSONHOOD_ATTESTATION" | "ORACLE_CONSENSUS_FEED" | "AGENT_CIRCUIT_BREAKER_SIGNAL";
  sourceBlockPi: number;
  relayedStateRoot: string;
  targetContractAddress: string;
  status: "RELAYED_CONFIRMED" | "PENDING_RELAY";
  relayerFeePi: number;
  gasCostGwei: number;
}

export const OmniChainBridge: React.FC<OmniChainBridgeProps> = ({
  pioneer,
  stats,
  onRewardClaim,
}) => {
  const [messages, setMessages] = useState<CrossChainMessage[]>([
    {
      id: "msg_bridge_01",
      targetChain: "Base",
      payloadType: "ZK_PERSONHOOD_ATTESTATION",
      sourceBlockPi: 4981240,
      relayedStateRoot: "0x8912ba44...de33aa90",
      targetContractAddress: "0x4e083dd...55aa91bc",
      status: "RELAYED_CONFIRMED",
      relayerFeePi: 1.8,
      gasCostGwei: 0.002,
    },
    {
      id: "msg_bridge_02",
      targetChain: "Arbitrum",
      payloadType: "ORACLE_CONSENSUS_FEED",
      sourceBlockPi: 4981244,
      relayedStateRoot: "0x3344cc99...1100ffee",
      targetContractAddress: "0x77aa88bb...22334455",
      status: "PENDING_RELAY",
      relayerFeePi: 2.5,
      gasCostGwei: 0.015,
    },
    {
      id: "msg_bridge_03",
      targetChain: "Ethereum",
      payloadType: "AGENT_CIRCUIT_BREAKER_SIGNAL",
      sourceBlockPi: 4981249,
      relayedStateRoot: "0xbbcc5566...77889900",
      targetContractAddress: "0x11223344...8899aabb",
      status: "PENDING_RELAY",
      relayerFeePi: 3.2,
      gasCostGwei: 12.4,
    },
  ]);

  const [selectedMsgId, setSelectedMsgId] = useState<string>("msg_bridge_02");
  const [isRelaying, setIsRelaying] = useState<boolean>(false);
  const [relayNotice, setRelayNotice] = useState<string | null>(null);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);

  // Dispatch custom relay form
  const [targetChainSelect, setTargetChainSelect] = useState<CrossChainMessage["targetChain"]>("Base");
  const [payloadTypeSelect, setPayloadTypeSelect] = useState<CrossChainMessage["payloadType"]>("ZK_PERSONHOOD_ATTESTATION");

  const selectedMsg = messages.find((m) => m.id === selectedMsgId) || messages[0];

  const handleExecuteRelay = async () => {
    setIsRelaying(true);
    await new Promise((r) => setTimeout(r, 1200));

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === selectedMsg.id) {
          return {
            ...m,
            status: "RELAYED_CONFIRMED",
          };
        }
        return m;
      })
    );

    setIsRelaying(false);
    setRelayNotice(
      `State root broadcast to ${selectedMsg.targetChain}! +${selectedMsg.relayerFeePi} π relayer bounty credited.`
    );

    if (onRewardClaim) {
      onRewardClaim(selectedMsg.relayerFeePi);
    }

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#10b981", "#8b5cf6"],
    });

    setTimeout(() => setRelayNotice(null), 5000);
  };

  const handleCreateCustomRelay = (e: React.FormEvent) => {
    e.preventDefault();
    const newMsg: CrossChainMessage = {
      id: `msg_bridge_${Date.now()}`,
      targetChain: targetChainSelect,
      payloadType: payloadTypeSelect,
      sourceBlockPi: 4981255,
      relayedStateRoot: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 10)}`,
      targetContractAddress: `0x${Math.random().toString(16).substring(2, 12)}...${Math.random().toString(16).substring(2, 6)}`,
      status: "PENDING_RELAY",
      relayerFeePi: 2.2,
      gasCostGwei: 0.005,
    };

    setMessages([newMsg, ...messages]);
    setSelectedMsgId(newMsg.id);
    setRelayNotice(`New cross-chain relay packet queued for ${targetChainSelect}!`);
    setTimeout(() => setRelayNotice(null), 4000);
  };

  const solBridgeSnippet = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPiHumanityCrossChainReceiver {
    event ProofOfPersonhoodReceived(bytes32 indexed pioneerNullifier, uint256 trustScore);
    event OracleConsensusReceived(bytes32 indexed queryHash, bytes payload);

    function verifyPiCrossChainRoot(
        bytes32 piStateRoot,
        bytes calldata zkProof,
        bytes calldata payload
    ) external returns (bool verified);
}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/20 to-slate-900 border border-sky-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                <Network className="w-3 h-3 text-sky-400" />
                OMNI-CHAIN RELAYER &amp; CROSS-CHAIN BRIDGE
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                EVM &bull; Solana &bull; Cosmos Interoperable
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pi Proof-of-Personhood Omni Bridge
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Export Pi Network's 60M human verification to any external Web3 smart contract. Relay zk-SNARK
              personhood proofs and truth oracle state roots across Ethereum, Arbitrum, Base, and Solana.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Cross-Chain Packets</span>
            <span className="text-2xl font-extrabold text-sky-400 font-mono">1.8M Packets</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Light-Client Cryptographically Verified</span>
          </div>
        </div>
      </div>

      {relayNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{relayNotice}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Relayer Mempool */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 block flex items-center justify-between">
              <span>Cross-Chain Relayer Queue</span>
              <span className="text-sky-400">Live Relayer Swarm</span>
            </span>

            <div className="space-y-2">
              {messages.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMsgId(m.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedMsgId === m.id
                      ? "bg-sky-500/10 border-sky-500 text-white shadow-lg shadow-sky-500/10"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold">
                      {m.targetChain}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">+{m.relayerFeePi} π</span>
                  </div>

                  <span className="text-xs font-bold block text-white line-clamp-1">{m.payloadType}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Pi Block #{m.sourceBlockPi}</span>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                    <span>Gas: {m.gasCostGwei} Gwei</span>
                    <span
                      className={`font-bold ${
                        m.status === "RELAYED_CONFIRMED" ? "text-emerald-400" : "text-sky-400 animate-pulse"
                      }`}
                    >
                      {m.status === "RELAYED_CONFIRMED" ? "DELIVERED" : "RELAY PENDING"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Queue Custom Packet */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 block flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              Dispatch Custom Cross-Chain Proof
            </span>

            <form onSubmit={handleCreateCustomRelay} className="space-y-3">
              <select
                value={targetChainSelect}
                onChange={(e) => setTargetChainSelect(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Base">Base (Coinbase L2)</option>
                <option value="Arbitrum">Arbitrum One</option>
                <option value="Ethereum">Ethereum Mainnet</option>
                <option value="Solana">Solana</option>
              </select>

              <select
                value={payloadTypeSelect}
                onChange={(e) => setPayloadTypeSelect(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="ZK_PERSONHOOD_ATTESTATION">zk-SNARK Personhood Proof</option>
                <option value="ORACLE_CONSENSUS_FEED">Truth Oracle Consensus Feed</option>
                <option value="AGENT_CIRCUIT_BREAKER_SIGNAL">Agent Guardian Circuit Breaker</option>
              </select>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Queue Cross-Chain Packet
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Message Packet Inspector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-wider block">
                  Bridge Destination: {selectedMsg.targetChain}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1">{selectedMsg.payloadType}</h2>
              </div>

              <span className="px-3 py-1 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 font-mono text-xs font-bold">
                Relayer Reward: {selectedMsg.relayerFeePi} π
              </span>
            </div>

            {/* Packet Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Source Block &amp; State Root</span>
                <span className="text-xs font-bold text-white font-mono block">Pi Block #{selectedMsg.sourceBlockPi}</span>
                <span className="text-xs text-sky-300 font-mono truncate block">{selectedMsg.relayedStateRoot}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Destination Contract</span>
                <span className="text-xs font-bold text-white font-mono block">{selectedMsg.targetChain} Receiver</span>
                <span className="text-xs text-emerald-400 font-mono truncate block">{selectedMsg.targetContractAddress}</span>
              </div>
            </div>

            {/* Solidity Interface */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  EVM Cross-Chain Receiver Interface (`IPiHumanityReceiver.sol`)
                </span>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(solBridgeSnippet);
                    setCopiedPayload(true);
                    setTimeout(() => setCopiedPayload(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedPayload ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedPayload ? "Copied" : "Copy Solidity"}
                </button>
              </div>

              <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto">
                <pre>{solBridgeSnippet}</pre>
              </div>
            </div>

            {/* Relayer Execute Action */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-mono">
                Pioneer Node: <span className="text-white font-bold">@{pioneer.username}</span> &bull; Relayer Status:{" "}
                <span className="text-sky-400 font-bold">{selectedMsg.status}</span>
              </span>

              <button
                onClick={handleExecuteRelay}
                disabled={isRelaying || selectedMsg.status === "RELAYED_CONFIRMED"}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  selectedMsg.status === "RELAYED_CONFIRMED"
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/25"
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRelaying ? "animate-spin" : ""}`} />
                {isRelaying
                  ? "Relaying Proof via Light-Client..."
                  : selectedMsg.status === "RELAYED_CONFIRMED"
                  ? "Proof Delivered & Confirmed"
                  : `Execute Cross-Chain Relay (+${selectedMsg.relayerFeePi} π)`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
