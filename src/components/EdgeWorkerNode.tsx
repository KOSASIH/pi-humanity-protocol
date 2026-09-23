import React, { useState } from "react";
import {
  Cpu,
  Zap,
  Activity,
  CheckCircle2,
  HardDrive,
  Gauge,
  Layers,
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  Server,
  Lock,
  Code2,
  Fingerprint
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface EdgeWorkerNodeProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

export const EdgeWorkerNode: React.FC<EdgeWorkerNodeProps> = ({
  pioneer,
  stats,
  onRewardClaim,
}) => {
  const [selectedModel, setSelectedModel] = useState<string>("Llama 3.2 1B (Quantized Q4_K_M)");
  const [isRunningInference, setIsRunningInference] = useState(false);
  const [inferenceResult, setInferenceResult] = useState<any | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SYSTEM] Pi Node Daemon v0.5.2 initialized",
    "[HARDWARE] WebGPU / WASM execution engine: DETECTED (M2/RTX acceleration active)",
    "[NETWORK] Stellar Consensus Protocol (SCP) Federated Quorum: SYNCED",
    "[STORAGE] Model Weights Cache: 1.2 GB allocated in encrypted memory",
  ]);

  const modelsList = [
    {
      id: "llama3_2_1b",
      name: "Llama 3.2 1B (Quantized Q4_K_M)",
      size: "820 MB",
      latency: "14ms / token",
      vram: "1.1 GB",
      tier: "Low Power Edge",
    },
    {
      id: "gemma2_2b",
      name: "Gemma 2 2B Instruct (Q5_K)",
      size: "1.6 GB",
      latency: "22ms / token",
      vram: "1.9 GB",
      tier: "Balanced Edge",
    },
    {
      id: "smollm_135m",
      name: "SmolLM 135M Micro (Ultra Fast)",
      size: "140 MB",
      latency: "3ms / token",
      vram: "256 MB",
      tier: "Mobile Edge",
    },
  ];

  const handleRunEdgeInference = async () => {
    setIsRunningInference(true);
    setTerminalLogs((prev) => [
      ...prev,
      `[INFERENCE] Dispatching edge task to WebGPU compute shader...`,
      `[WEIGHTS] Loading quantized tensors for ${selectedModel}...`,
    ]);

    await new Promise((r) => setTimeout(r, 1500));

    const result = {
      model: selectedModel,
      prompt: "Verify factual consistency of claim: 'Solar arrays generate zero emissions during active operation.'",
      generatedCompletion: "Confirmed factual: Photovoltaic panels generate electric current via photoelectric effect without direct combustion or greenhouse emissions during active generation.",
      tokensPerSec: "78.4 tok/s",
      computeUnitsUsed: "142 GPU GFLOPs",
      humanAttestationHash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`,
      piReward: 1.8,
      anchorBlock: 1894218,
    };

    setTerminalLogs((prev) => [
      ...prev,
      `[COMPLETE] Tokens generated: 38 tokens at 78.4 tok/s`,
      `[ATTESTATION] Biometric signature attached: Pioneer @${pioneer.username}`,
      `[SETTLEMENT] +1.80 Pi edge node reward dispatched to wallet`,
    ]);

    setInferenceResult(result);
    setIsRunningInference(false);

    if (onRewardClaim) {
      onRewardClaim(1.8);
    }

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#10b981", "#8b5cf6"],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/20 to-slate-900 border border-blue-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <Server className="w-3 h-3 text-blue-400" />
                PI NODE DECENTRALIZED EDGE AI CLUSTER
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                200,000+ Active Edge Nodes
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pi Node Edge AI Inference &amp; Hardware Runner
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Turn your Pi Node into an enterprise AI compute node. Run local quantized open-source models
              via WebGPU and WASM, verify outputs with human intuition, and earn high-yield Node rewards.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Edge Hardware Status</span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono flex items-center gap-1.5 justify-end">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              WebGPU Ready
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">M2 / RTX Compute Acceleration</span>
          </div>
        </div>
      </div>

      {/* Hardware Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Compute Core</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-xs font-bold text-white block">WebGPU Shader Core</span>
          <span className="text-[11px] text-emerald-400 font-mono block">Zero cloud server dependency</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Memory Allocation</span>
            <HardDrive className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-xs font-bold text-white block">1.8 GB / 16 GB</span>
          <span className="text-[11px] text-slate-400 font-mono block">Encrypted VRAM sandbox</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Inference Throughput</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xs font-bold text-white block">78.4 Tokens / Sec</span>
          <span className="text-[11px] text-emerald-400 font-mono block">Sub-15ms prompt response</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Attestation Hash</span>
            <Fingerprint className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xs font-bold text-white block">SCP Quorum Signed</span>
          <span className="text-[11px] text-slate-400 font-mono block">Block #1894218 Verified</span>
        </div>
      </div>

      {/* Main Grid: Edge Model Selector & Interactive Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Model Choice */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <span className="text-xs font-mono uppercase text-slate-400 block flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Available Edge Quantized Models
            </span>

            <div className="space-y-2.5">
              {modelsList.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedModel(m.name)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedModel === m.name
                      ? "bg-blue-500/10 border-blue-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold block">{m.name}</span>
                    <span className="text-[10px] font-mono text-blue-400">{m.tier}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-1">
                    <span>Size: {m.size}</span>
                    <span>&bull;</span>
                    <span>Latency: {m.latency}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleRunEdgeInference}
              disabled={isRunningInference}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4" />
              {isRunningInference
                ? "Running WebGPU Edge Shader..."
                : "Execute Edge Inference & Verify (+1.8 π)"}
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Live Output & Daemon Terminal */}
        <div className="lg:col-span-2 space-y-4">
          {/* Result Card if available */}
          {inferenceResult && (
            <div className="bg-slate-900/80 border border-emerald-500/40 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  Edge Inference &amp; Human Biometric Verification Complete
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  +1.80 π Credited
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Prompt Evaluated</span>
                <p className="text-xs text-slate-300 font-mono">{inferenceResult.prompt}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Edge Model Output</span>
                <p className="text-xs text-white font-mono">{inferenceResult.generatedCompletion}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-1">
                <span>Speed: {inferenceResult.tokensPerSec}</span>
                <span>Compute: {inferenceResult.computeUnitsUsed}</span>
                <span>Proof: {inferenceResult.humanAttestationHash}</span>
              </div>
            </div>
          )}

          {/* Terminal Console */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                Pi Node Edge Daemon Log
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE
              </span>
            </div>

            <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 max-h-56 overflow-y-auto space-y-1.5">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-slate-500 mr-2">&gt;</span>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
