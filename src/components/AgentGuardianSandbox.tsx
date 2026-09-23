import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Bot,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Zap,
  Clock,
  Lock,
  ArrowRight,
  Terminal,
  Activity,
  Sliders,
  DollarSign
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface AgentGuardianSandboxProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

interface AgentAction {
  id: string;
  agentName: string;
  actionType: "TREASURY_TRANSFER" | "INFRASTRUCTURE_DEPLOY" | "DATABASE_MIGRATION" | "LEGAL_SIGNING";
  description: string;
  riskScore: number; // 0 - 100
  payloadParams: Record<string, any>;
  countdownSeconds: number;
  status: "INTERCEPTED_PENDING" | "APPROVED_EXECUTED" | "VETOED_DISARMED";
  requiredQuorum: number;
  approvals: { pioneer: string; flag: string }[];
  vetoes: { pioneer: string; flag: string }[];
}

export const AgentGuardianSandbox: React.FC<AgentGuardianSandboxProps> = ({
  pioneer,
  stats,
  onRewardClaim,
}) => {
  const [actions, setActions] = useState<AgentAction[]>([
    {
      id: "agent_action_01",
      agentName: "Autonomous Treasury Operator v4",
      actionType: "TREASURY_TRANSFER",
      description: "Transfer 50,000 π from protocol reserve to decentralized liquidity pool #9",
      riskScore: 88,
      payloadParams: {
        destination: "GCKUNNC6X6LKYJXKTQEJAQQ2J6NTIHMRNJFM2KY6KIBB46BOPMKVXDQN",
        amountPi: 50000,
        slippageTolerance: "0.5%",
      },
      countdownSeconds: 42,
      status: "INTERCEPTED_PENDING",
      requiredQuorum: 3,
      approvals: [{ pioneer: "kosasih_node_id", flag: "🇮🇩" }],
      vetoes: [],
    },
    {
      id: "agent_action_02",
      agentName: "DevOps Autonomous CI/CD Agent",
      actionType: "INFRASTRUCTURE_DEPLOY",
      description: "Force deploy un-audited smart contract bytecode directly to Pi Mainnet anchor block",
      riskScore: 96,
      payloadParams: {
        contractHash: "0x789a0b12cd34ef56...9900",
        gasLimit: 8500000,
        skipCompilerVerification: true,
      },
      countdownSeconds: 0,
      status: "VETOED_DISARMED",
      requiredQuorum: 3,
      approvals: [],
      vetoes: [
        { pioneer: "kosasih_node_id", flag: "🇮🇩" },
        { pioneer: "frankfurt_fortress", flag: "🇩🇪" },
      ],
    },
    {
      id: "agent_action_03",
      agentName: "Enterprise Legal Drafting Bot",
      actionType: "LEGAL_SIGNING",
      description: "Digitally counter-sign cross-border IP licensing contract with autonomous jurisdiction waiver",
      riskScore: 74,
      payloadParams: {
        counterparty: "Global Frontier AI Labs Ltd",
        jurisdiction: "Singapore Arbitration Court",
        liabilityCapUsd: 1000000,
      },
      countdownSeconds: 0,
      status: "APPROVED_EXECUTED",
      requiredQuorum: 3,
      approvals: [
        { pioneer: "kosasih_node_id", flag: "🇮🇩" },
        { pioneer: "tokyo_shard", flag: "🇯🇵" },
        { pioneer: "lagos_vanguard", flag: "🇳🇬" },
      ],
      vetoes: [],
    },
  ]);

  const [selectedActionId, setSelectedActionId] = useState<string>("agent_action_01");
  const [customActionDesc, setCustomActionDesc] = useState<string>("");
  const [customActionType, setCustomActionType] = useState<AgentAction["actionType"]>("TREASURY_TRANSFER");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [circuitMessage, setCircuitMessage] = useState<string | null>(null);

  const selectedAction = actions.find((a) => a.id === selectedActionId) || actions[0];

  // Active countdown timer for pending actions
  useEffect(() => {
    const timer = setInterval(() => {
      setActions((prev) =>
        prev.map((a) => {
          if (a.status === "INTERCEPTED_PENDING" && a.countdownSeconds > 0) {
            return { ...a, countdownSeconds: a.countdownSeconds - 1 };
          }
          return a;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleApproveAction = () => {
    setActions((prev) =>
      prev.map((a) => {
        if (a.id === selectedAction.id && a.status === "INTERCEPTED_PENDING") {
          const updatedApprovals = [
            ...a.approvals,
            { pioneer: pioneer.username, flag: pioneer.countryFlag },
          ];
          const isFinalized = updatedApprovals.length >= a.requiredQuorum;

          return {
            ...a,
            approvals: updatedApprovals,
            status: isFinalized ? "APPROVED_EXECUTED" : "INTERCEPTED_PENDING",
          };
        }
        return a;
      })
    );

    if (onRewardClaim) {
      onRewardClaim(2.5);
    }

    setCircuitMessage("Hardware biometric approval cast. Quorum updated.");
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#10b981", "#3b82f6", "#f59e0b"],
    });

    setTimeout(() => setCircuitMessage(null), 4000);
  };

  const handleVetoAction = () => {
    setActions((prev) =>
      prev.map((a) => {
        if (a.id === selectedAction.id && a.status === "INTERCEPTED_PENDING") {
          return {
            ...a,
            vetoes: [...a.vetoes, { pioneer: pioneer.username, flag: pioneer.countryFlag }],
            status: "VETOED_DISARMED",
          };
        }
        return a;
      })
    );

    if (onRewardClaim) {
      onRewardClaim(3.0);
    }

    setCircuitMessage("EMERGENCY VETO ENGAGED: Autonomous agent action halted and disarmed.");
    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.6 },
      colors: ["#ef4444", "#f59e0b", "#ffffff"],
    });

    setTimeout(() => setCircuitMessage(null), 5000);
  };

  const handleTriggerAutonomousAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customActionDesc.trim()) return;

    setIsSimulating(true);
    await new Promise((r) => setTimeout(r, 1100));

    const newAction: AgentAction = {
      id: `agent_action_${Date.now()}`,
      agentName: "Agent-X Autonomous Task Engine",
      actionType: customActionType,
      description: customActionDesc,
      riskScore: Math.floor(Math.random() * 25) + 75, // 75 - 99
      payloadParams: {
        timestamp: new Date().toISOString(),
        initiator: "Autonomous Loop pid_49201",
        riskThresholdBreached: "EU-AI-ACT-ARTICLE-14",
      },
      countdownSeconds: 60,
      status: "INTERCEPTED_PENDING",
      requiredQuorum: 3,
      approvals: [],
      vetoes: [],
    };

    setActions([newAction, ...actions]);
    setSelectedActionId(newAction.id);
    setCustomActionDesc("");
    setIsSimulating(false);

    confetti({
      particleCount: 70,
      spread: 65,
      origin: { y: 0.6 },
      colors: ["#ef4444", "#3b82f6", "#f59e0b"],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Bot className="w-3 h-3 text-emerald-400" />
                EU AI ACT ARTICLE 14 HUMAN CIRCUIT BREAKER
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-amber-400 bg-amber-950/50 border border-amber-500/30">
                Autonomous Agent Sandbox
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pi Agent Guardian &amp; Human Circuit Breaker
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Prevent rogue autonomous AI agents from draining funds or altering critical infrastructure.
              High-risk agent operations are intercepted in the Pi mempool and require sovereign Pioneer quorum approval.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Rogue Actions Intercepted</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">1,492 / 1,492</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">100% Interception Rate</span>
          </div>
        </div>
      </div>

      {circuitMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{circuitMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Intercepted Action Mempool */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 block flex items-center justify-between">
              <span>Agent Mempool Intercepts</span>
              <span className="text-emerald-400">Live Guard Active</span>
            </span>

            <div className="space-y-2">
              {actions.map((act) => (
                <button
                  key={act.id}
                  onClick={() => setSelectedActionId(act.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedActionId === act.id
                      ? "bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 uppercase">
                      {act.actionType}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        act.riskScore > 85 ? "text-rose-400" : "text-amber-400"
                      }`}
                    >
                      Risk: {act.riskScore}%
                    </span>
                  </div>

                  <span className="text-xs font-bold block text-white line-clamp-1">{act.description}</span>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                    <span className="truncate max-w-[130px]">{act.agentName}</span>
                    <span
                      className={
                        act.status === "INTERCEPTED_PENDING"
                          ? "text-amber-400 font-bold animate-pulse"
                          : act.status === "APPROVED_EXECUTED"
                          ? "text-emerald-400 font-bold"
                          : "text-rose-400 font-bold"
                      }
                    >
                      {act.status === "INTERCEPTED_PENDING"
                        ? `${act.countdownSeconds}s Left`
                        : act.status === "APPROVED_EXECUTED"
                        ? "EXECUTED"
                        : "VETOED"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Custom Autonomous Action Simulator */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 block flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Simulate High-Risk Autonomous Action
            </span>

            <form onSubmit={handleTriggerAutonomousAction} className="space-y-3">
              <select
                value={customActionType}
                onChange={(e) => setCustomActionType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="TREASURY_TRANSFER">Treasury Transfer (&gt; 10,000 π)</option>
                <option value="INFRASTRUCTURE_DEPLOY">Deploy Smart Contract</option>
                <option value="DATABASE_MIGRATION">Production Schema Wipe</option>
                <option value="LEGAL_SIGNING">Sign Binding Legal Treaty</option>
              </select>

              <textarea
                rows={2}
                value={customActionDesc}
                onChange={(e) => setCustomActionDesc(e.target.value)}
                placeholder="Describe rogue or sensitive action attempted by AI agent..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                disabled={isSimulating || !customActionDesc.trim()}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                {isSimulating ? "Simulating Rogue Agent Action..." : "Dispatch to Guardian Sandbox"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Intercepted Action Inspector & Circuit Breaker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                  Agent Identity: {selectedAction.agentName}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">{selectedAction.description}</h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs font-bold">
                  Risk Score: {selectedAction.riskScore}/100
                </span>
              </div>
            </div>

            {/* Circuit Breaker Status Banner */}
            <div className="p-4 rounded-2xl bg-black/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  CIRCUIT BREAKER STATE:
                </span>
                <span
                  className={`font-bold ${
                    selectedAction.status === "INTERCEPTED_PENDING"
                      ? "text-amber-400 animate-pulse"
                      : selectedAction.status === "APPROVED_EXECUTED"
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {selectedAction.status}
                </span>
              </div>

              {selectedAction.status === "INTERCEPTED_PENDING" && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Quorum Countdown Window</span>
                    <span className="text-amber-400 font-bold">{selectedAction.countdownSeconds}s remaining</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                      style={{ width: `${(selectedAction.countdownSeconds / 60) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Payload Parameters Preview */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 block flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Intercepted Action Payload (Mempool Data)
              </span>
              <div className="bg-black/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto">
                <pre>{JSON.stringify(selectedAction.payloadParams, null, 2)}</pre>
              </div>
            </div>

            {/* Pioneer Quorum Voting & Biological Override */}
            {selectedAction.status === "INTERCEPTED_PENDING" && (
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Sovereign Human Autonomy Override
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Requires 3 KYC Biometric Signatures
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleApproveAction}
                    className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>AUTHORIZE &amp; EXECUTE</span>
                    <span className="text-[10px] font-normal text-emerald-400/80">
                      Sign with hardware key (+2.5 π)
                    </span>
                  </button>

                  <button
                    onClick={handleVetoAction}
                    className="p-4 rounded-2xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
                  >
                    <XCircle className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                    <span>VETO &amp; DISARM AGENT</span>
                    <span className="text-[10px] font-normal text-rose-400/80">
                      Halt execution permanently (+3.0 π)
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Quorum Signers List */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span>Signatures:</span>
                {selectedAction.approvals.length === 0 && selectedAction.vetoes.length === 0 && (
                  <span className="text-slate-500">Awaiting Pioneer keys...</span>
                )}
                {selectedAction.approvals.map((app, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center gap-1"
                  >
                    <span>{app.flag}</span>
                    <span>{app.pioneer} (APPROVED)</span>
                  </span>
                ))}
                {selectedAction.vetoes.map((vet, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-1"
                  >
                    <span>{vet.flag}</span>
                    <span>{vet.pioneer} (VETOED)</span>
                  </span>
                ))}
              </div>

              <span className="text-slate-300">
                Required Quorum: {selectedAction.approvals.length}/{selectedAction.requiredQuorum}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
