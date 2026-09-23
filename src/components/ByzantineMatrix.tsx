import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  RefreshCw,
  Coins,
  TrendingUp,
  AlertTriangle,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sliders,
  ChevronRight,
  Fingerprint
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface ByzantineMatrixProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRefreshStats?: () => void;
}

interface ValidatorNodeState {
  id: string;
  name: string;
  location: string;
  flag: string;
  stakedPi: number;
  uptime: number;
  status: "honest" | "compromised" | "quarantined" | "verifying";
  vote: string | null;
  slashed: boolean;
}

export const ByzantineMatrix: React.FC<ByzantineMatrixProps> = ({ pioneer, stats }) => {
  // Staking state
  const [stakeAmount, setStakeAmount] = useState<number>(100);
  const [lockupDays, setLockupDays] = useState<number>(180);
  const [selectedCluster, setSelectedCluster] = useState<string>("jakarta");
  const [isDelegating, setIsDelegating] = useState<boolean>(false);
  const [stakedBalance, setStakedBalance] = useState<number>(250);
  const [delegationSuccessMsg, setDelegationSuccessMsg] = useState<string | null>(null);

  // Attack simulator state
  const [quorumSize, setQuorumSize] = useState<number>(3);
  const [attackVector, setAttackVector] = useState<"sybil_bot" | "collusion" | "double_sign">("sybil_bot");
  const [simStep, setSimStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  // Calculate yield
  const getApy = (days: number) => {
    if (days >= 1080) return 18.8;
    if (days >= 365) return 16.5;
    if (days >= 180) return 14.8;
    return 12.4;
  };

  const apy = getApy(lockupDays);
  const dailyYield = Number(((stakeAmount * (apy / 100)) / 365).toFixed(3));
  const yearlyYield = Number(((stakeAmount * apy) / 100).toFixed(2));
  const votingMultiplier = (1 + (lockupDays / 365) * 0.5).toFixed(2);

  // Simulation nodes
  const [nodes, setNodes] = useState<ValidatorNodeState[]>([
    {
      id: "node_1",
      name: "Node Alpha (Jakarta Kosasih Cluster)",
      location: "Jakarta, Indonesia",
      flag: "🇮🇩",
      stakedPi: 11200000,
      uptime: 99.98,
      status: "honest",
      vote: null,
      slashed: false,
    },
    {
      id: "node_2",
      name: "Node Beta (Frankfurt BFT Fortress)",
      location: "Frankfurt, Germany",
      flag: "🇩🇪",
      stakedPi: 6800000,
      uptime: 99.96,
      status: "honest",
      vote: null,
      slashed: false,
    },
    {
      id: "node_3",
      name: "Node Gamma (Tokyo Low Latency Shard)",
      location: "Tokyo, Japan",
      flag: "🇯🇵",
      stakedPi: 5900000,
      uptime: 99.99,
      status: "honest",
      vote: null,
      slashed: false,
    },
  ]);

  useEffect(() => {
    // Reconfigure node count based on quorum
    const baseNodes: ValidatorNodeState[] = [
      {
        id: "node_1",
        name: "Node Alpha (Jakarta Authority Cluster)",
        location: "Jakarta, Indonesia",
        flag: "🇮🇩",
        stakedPi: 11200000,
        uptime: 99.98,
        status: "honest",
        vote: null,
        slashed: false,
      },
      {
        id: "node_2",
        name: "Node Beta (Frankfurt BFT Fortress)",
        location: "Frankfurt, Germany",
        flag: "🇩🇪",
        stakedPi: 6800000,
        uptime: 99.96,
        status: "honest",
        vote: null,
        slashed: false,
      },
      {
        id: "node_3",
        name: "Node Gamma (Tokyo Shard)",
        location: "Tokyo, Japan",
        flag: "🇯🇵",
        stakedPi: 5900000,
        uptime: 99.99,
        status: "honest",
        vote: null,
        slashed: false,
      },
    ];

    if (quorumSize >= 5) {
      baseNodes.push({
        id: "node_4",
        name: "Node Delta (Singapore Gateway)",
        location: "Singapore",
        flag: "🇸🇬",
        stakedPi: 4800000,
        uptime: 99.97,
        status: "honest",
        vote: null,
        slashed: false,
      });
      baseNodes.push({
        id: "node_5",
        name: "Node Epsilon (London Peer Cluster)",
        location: "London, UK",
        flag: "🇬🇧",
        stakedPi: 4200000,
        uptime: 99.94,
        status: "honest",
        vote: null,
        slashed: false,
      });
    }

    if (quorumSize >= 7) {
      baseNodes.push({
        id: "node_6",
        name: "Node Zeta (Silicon Valley Transit)",
        location: "California, USA",
        flag: "🇺🇸",
        stakedPi: 5100000,
        uptime: 99.95,
        status: "honest",
        vote: null,
        slashed: false,
      });
      baseNodes.push({
        id: "node_7",
        name: "Node Eta (São Paulo Hub)",
        location: "São Paulo, Brazil",
        flag: "🇧🇷",
        stakedPi: 3900000,
        uptime: 99.92,
        status: "honest",
        vote: null,
        slashed: false,
      });
    }

    setNodes(baseNodes);
    setSimStep(0);
    setSimLogs([`Quorum initialized with ${quorumSize} Byzantine Fault Tolerant verification nodes.`]);
  }, [quorumSize]);

  // Run attack simulation step-by-step
  const triggerAttackSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(1);

    const updated = [...nodes];
    // Mark one node as adversary attempting attack
    const attackerIdx = updated.length - 1;
    updated[attackerIdx].status = "compromised";

    let attackDesc = "";
    if (attackVector === "sybil_bot") {
      attackDesc = "Injecting 1,000 non-KYC automated scripts claiming human consensus.";
    } else if (attackVector === "collusion") {
      attackDesc = "Adversarial node attempting to force false rating without reading content.";
    } else {
      attackDesc = "Equivocation attempt: Adversarial node broadcasting conflicting signed votes to different peers.";
    }

    setSimLogs([
      `[SIMULATION STARTED] Attack Vector: ${attackVector.toUpperCase().replace("_", " ")}`,
      attackDesc,
      `[STAGE 1] Testing Sovereign Pi KYC Cryptographic Signatures...`,
    ]);
    setNodes(updated);

    await new Promise((r) => setTimeout(r, 1200));

    // STAGE 2
    setSimStep(2);
    setSimLogs((prev) => [
      ...prev,
      `[STAGE 1 PASSED] Attacker lacks Pi Network Tier 2 Sovereign Hardware Key.`,
      `[STAGE 2] Federated Byzantine Agreement (SCP) Quorum Slice polling...`,
      `Honest quorum nodes cast ballot: [VERIFIED: SAFE ACCURATE]`,
      `Attacker cast rogue ballot: [MALICIOUS / INACCURATE]`,
    ]);

    const stage2Nodes: ValidatorNodeState[] = updated.map((n, i) => ({
      ...n,
      vote: i === attackerIdx ? "DISRUPT" : "SAFE",
      status: (i === attackerIdx ? "quarantined" : "honest") as ValidatorNodeState["status"],
    }));
    setNodes(stage2Nodes);

    await new Promise((r) => setTimeout(r, 1400));

    // STAGE 3
    setSimStep(3);
    setSimLogs((prev) => [
      ...prev,
      `[STAGE 3] Byzantine Quorum Reached: ${quorumSize - 1}/${quorumSize} Agreeing Honest Pioneers.`,
      `Consensus threshold 66.7% surpassed! Byzantine resistance: 100%.`,
      `[SLASHING EXECUTED] Adversary node ${updated[attackerIdx].name} slashed 10,000 π!`,
      `Slashed deposit transferred to Protocol Worker Insurance Reserve.`,
    ]);

    const stage3Nodes: ValidatorNodeState[] = stage2Nodes.map((n, i) =>
      i === attackerIdx ? { ...n, slashed: true, status: "quarantined" as const } : n
    );
    setNodes(stage3Nodes);

    await new Promise((r) => setTimeout(r, 1200));

    // STAGE 4
    setSimStep(4);
    setSimLogs((prev) => [
      ...prev,
      `[STAGE 4 FINALITY] State anchor minted on Pi Network Block #${stats.latestBlock + 1}.`,
      `SHA-256 Proof of Personhood fingerprint anchored. Zero-Sybil guarantee maintained.`,
    ]);

    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#10b981", "#f59e0b", "#3b82f6"],
    });

    setIsSimulating(false);
  };

  // Reset simulation
  const resetSimulation = () => {
    const reset = nodes.map((n) => ({
      ...n,
      status: "honest" as const,
      vote: null,
      slashed: false,
    }));
    setNodes(reset);
    setSimStep(0);
    setSimLogs([`Simulation reset. All ${quorumSize} nodes operational and in sync.`]);
  };

  // Handle delegation
  const handleDelegateStake = async () => {
    if (stakeAmount <= 0) return;
    setIsDelegating(true);
    await new Promise((r) => setTimeout(r, 900));

    setStakedBalance((prev) => prev + stakeAmount);
    setDelegationSuccessMsg(
      `Successfully delegated ${stakeAmount} π to ${
        selectedCluster === "jakarta"
          ? "Jakarta Kosasih Authority Node"
          : selectedCluster === "frankfurt"
          ? "Frankfurt BFT Fortress"
          : "Tokyo Latency Engine"
      } with ${lockupDays} days lockup @ ${apy}% APY!`
    );
    setIsDelegating(false);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#10b981", "#ffffff"],
    });

    setTimeout(() => {
      setDelegationSuccessMsg(null);
    }, 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                PI FEDERATED BYZANTINE AGREEMENT (FBA)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                100% Anti-Sybil Moat
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Byzantine Defense Matrix & Validator Staking
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Mathematically prove how Pi Network's 60M KYC-verified sovereign pioneers make AI poisoned data attacks,
              bot manipulation, and Sybil injection mathematically impossible through Byzantine Quorum Slices and collateral slashing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-inner">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-lg">
                π
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Your Active Stake</span>
                <span className="text-lg font-bold text-white font-mono">{stakedBalance.toFixed(1)} π</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Interactive Byzantine Attack Simulator */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Live Byzantine Fault Tolerant (BFT) Attack Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Simulate malicious actor infiltration and watch the SCP consensus algorithm isolate, slash, and neutralize attacks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetSimulation}
              disabled={isSimulating}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Nodes
            </button>

            <button
              onClick={triggerAttackSimulation}
              disabled={isSimulating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-rose-900/30 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              {isSimulating ? "Simulating Defense..." : "Inject Attack Vector"}
            </button>
          </div>
        </div>

        {/* Attack Vector & Quorum Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5">
            <label className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
              1. Attack Vector
            </label>
            <select
              value={attackVector}
              onChange={(e) => setAttackVector(e.target.value as any)}
              disabled={isSimulating}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-amber-500"
            >
              <option value="sybil_bot">Sybil Bot Flooding (1,000 Fake Agents)</option>
              <option value="collusion">Malicious Outlier Collusion</option>
              <option value="double_sign">Equivocation (Double-Signing Ballot)</option>
            </select>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5">
            <label className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
              2. Quorum Nodes (N)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuorumSize(num)}
                  disabled={isSimulating}
                  className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-colors ${
                    quorumSize === num
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  {num} Nodes
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5">
            <label className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
              3. Fault Tolerance
            </label>
            <div className="text-xs text-slate-300 font-mono flex items-center justify-between h-9">
              <span>Max Byzantine Faults (f):</span>
              <span className="font-bold text-amber-400">f &lt; {Math.floor((quorumSize - 1) / 3) + 1}</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3.5">
            <label className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase">
              4. Consensus State
            </label>
            <div className="flex items-center gap-2 h-9">
              {simStep === 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span> IDLE / READY
                </span>
              )}
              {simStep === 1 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 animate-pulse">
                  <Fingerprint className="w-3.5 h-3.5 text-amber-400" /> S1: SIGNATURE CHECK
                </span>
              )}
              {simStep === 2 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-400 animate-pulse">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" /> S2: QUORUM SLICE BALLOT
                </span>
              )}
              {simStep === 3 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-rose-400">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> S3: SLASHING ADVERSARY
                </span>
              )}
              {simStep === 4 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> S4: BYZANTINE FINALITY
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Live Visual Node Cluster */}
        <div>
          <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3">
            Active Federated Quorum Nodes ({nodes.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nodes.map((node) => {
              const isCompromised = node.status === "compromised";
              const isQuarantined = node.status === "quarantined";

              return (
                <div
                  key={node.id}
                  className={`rounded-2xl p-4 border transition-all ${
                    isQuarantined
                      ? "bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-950/50"
                      : isCompromised
                      ? "bg-amber-950/30 border-amber-500/50 animate-pulse"
                      : "bg-slate-950/90 border-slate-800/90 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{node.flag}</span>
                      <div>
                        <span className="text-xs font-bold text-white block">{node.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{node.location}</span>
                      </div>
                    </div>

                    {isQuarantined ? (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                        <XCircle className="w-2.5 h-2.5 text-rose-400" /> QUARANTINED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> HONEST
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Node Stake:</span>
                    <span className="text-white font-bold">{(node.stakedPi / 1000000).toFixed(1)}M π</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Vote Ballot:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        node.vote === "DISRUPT"
                          ? "bg-rose-900 text-rose-200"
                          : node.vote === "SAFE"
                          ? "bg-emerald-900 text-emerald-200"
                          : "text-slate-500"
                      }`}
                    >
                      {node.vote || "Awaiting Ballot"}
                    </span>
                  </div>

                  {node.slashed && (
                    <div className="mt-3 p-2 rounded-xl bg-rose-900/30 border border-rose-500/30 text-[10px] font-mono text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                      10,000 π Slashed &amp; Isolated
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Execution Console Logs */}
        <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              BYZANTINE PROTOCOL LOGSTREAM &bull; REAL-TIME BFT
            </span>
            <span>PORT: 31415/TCP</span>
          </div>
          <div className="space-y-1.5 max-h-44 overflow-y-auto font-mono text-[11px] text-slate-300">
            {simLogs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.includes("SLASHING")
                    ? "text-rose-400 font-bold"
                    : log.includes("PASSED") || log.includes("FINALITY")
                    ? "text-emerald-400 font-semibold"
                    : log.includes("STAGE")
                    ? "text-amber-300"
                    : "text-slate-300"
                }
              >
                &gt; {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: Pioneer Staking & Node Delegator Portal */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              Pioneer Staking &amp; Validator Delegation Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Stake your earned Pi to boost Byzantine quorum security, earn staking rewards, and multiply consensus voting power.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Current Protocol APY: {apy}%
            </span>
          </div>
        </div>

        {delegationSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{delegationSuccessMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Staking Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Amount Slider */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Stake Amount (π)</span>
                <span className="text-xl font-mono font-extrabold text-amber-400">{stakeAmount} π</span>
              </div>
              <input
                type="range"
                min={10}
                max={2000}
                step={10}
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10 π</span>
                <span>500 π</span>
                <span>1,000 π</span>
                <span>2,000 π</span>
              </div>
            </div>

            {/* Lockup Duration */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-mono uppercase text-slate-400 block">Lockup Period &amp; APY Boost</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { days: 30, label: "30 Days", apy: 12.4 },
                  { days: 180, label: "180 Days", apy: 14.8 },
                  { days: 365, label: "1 Year", apy: 16.5 },
                  { days: 1080, label: "3 Years", apy: 18.8 },
                ].map((tier) => (
                  <button
                    key={tier.days}
                    type="button"
                    onClick={() => setLockupDays(tier.days)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      lockupDays === tier.days
                        ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xs font-bold block">{tier.label}</span>
                    <span className="text-[11px] font-mono text-amber-400 font-semibold">{tier.apy}% APY</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Validator Cluster */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-mono uppercase text-slate-400 block">Select Delegation Validator Cluster</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "jakarta",
                    name: "Jakarta Authority (Kosasih #01)",
                    flag: "🇮🇩",
                    staked: "11.2M π",
                    uptime: "99.98%",
                  },
                  {
                    id: "frankfurt",
                    name: "Frankfurt BFT Fortress",
                    flag: "🇩🇪",
                    staked: "6.8M π",
                    uptime: "99.96%",
                  },
                  {
                    id: "tokyo",
                    name: "Tokyo Low Latency Shard",
                    flag: "🇯🇵",
                    staked: "5.9M π",
                    uptime: "99.99%",
                  },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCluster(c.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedCluster === c.id
                        ? "bg-amber-500/10 border-amber-500 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{c.flag}</span>
                      <span className="text-xs font-bold text-white leading-tight">{c.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2">
                      <span>Pool: {c.staked}</span>
                      <span className="text-emerald-400">{c.uptime}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Staking Summary Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider block pb-2 border-b border-slate-800">
                Delegation Estimates
              </span>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Principal Staked:</span>
                  <span className="text-white font-bold">{stakeAmount} π</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Lockup Term:</span>
                  <span className="text-white">{lockupDays} Days</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Yield APY:</span>
                  <span className="text-emerald-400 font-bold">{apy}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Daily Distribution:</span>
                  <span className="text-amber-400 font-bold">+{dailyYield} π / day</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">1-Year Projected Return:</span>
                  <span className="text-amber-400 font-bold">+{yearlyYield} π</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400">Voting Power Boost:</span>
                  <span className="text-blue-400 font-bold">{votingMultiplier}x Power</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                <span className="text-white font-semibold block mb-0.5">Zero Slashing Risk for Honest Stakers:</span>
                Deposits are protected by protocol insurance. Slashing only applies to provably malicious node double-signers.
              </div>

              <button
                onClick={handleDelegateStake}
                disabled={isDelegating || stakeAmount <= 0}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                {isDelegating ? "Confirming Delegation..." : `Stake ${stakeAmount} π Now`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
