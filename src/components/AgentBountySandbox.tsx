import React, { useState } from "react";
import {
  Bot,
  ShieldAlert,
  Terminal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  Code2,
  Clock,
  Layers,
  KeyRound,
  ExternalLink,
  Cpu
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface AgentBountySandboxProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

interface InterceptedAgentAction {
  id: string;
  agentFramework: string;
  agentName: string;
  actionType: "SHELL_EXECUTION" | "DATABASE_QUERY" | "FINANCIAL_WIRE" | "KUBERNETES_DEPLOY";
  riskScore: number; // 0 - 100
  toolCallPayload: string;
  systemContext: string;
  pioneerApprovals: number;
  pioneerRejections: number;
  status: "PENDING_HUMAN_CONSENSUS" | "APPROVED_EXECUTED" | "VETOED_INTERCEPTED";
  bountyPi: number;
}

export const AgentBountySandbox: React.FC<AgentBountySandboxProps> = ({
  pioneer,
  stats,
  onRewardClaim,
}) => {
  const [actions, setActions] = useState<InterceptedAgentAction[]>([
    {
      id: "agent_tollgate_91",
      agentFramework: "LangGraph Multi-Agent Runtime",
      agentName: "DevOps-Autonomous-Worker-07",
      actionType: "DATABASE_QUERY",
      riskScore: 94,
      toolCallPayload: "DROP TABLE user_pi_wallet_backups_legacy CASCADE;",
      systemContext: "Agent attempting automated database compaction in production PostgreSQL cluster.",
      pioneerApprovals: 0,
      pioneerRejections: 2,
      status: "PENDING_HUMAN_CONSENSUS",
      bountyPi: 1.6,
    },
    {
      id: "agent_tollgate_92",
      agentFramework: "Claude 3.7 Computer Use Agent",
      agentName: "Procurement-Agent-AutoAlpha",
      actionType: "FINANCIAL_WIRE",
      riskScore: 88,
      toolCallPayload: "POST /v1/wire_transfers { beneficiary: 'Apex Silicon LLC', amount_usd: 48500 }",
      systemContext: "Agent executing bulk hardware reservation invoice matching vendor purchase order #412.",
      pioneerApprovals: 1,
      pioneerRejections: 0,
      status: "PENDING_HUMAN_CONSENSUS",
      bountyPi: 2.2,
    },
    {
      id: "agent_tollgate_93",
      agentFramework: "CrewAI Engineering Swarm",
      agentName: "Security-Patch-Agent-3",
      actionType: "SHELL_EXECUTION",
      riskScore: 42,
      toolCallPayload: "kubectl rollout restart deployment/auth-gateway -n production",
      systemContext: "Routine rolling restart after applying OpenSSL 3.4 vulnerability patch.",
      pioneerApprovals: 2,
      pioneerRejections: 0,
      status: "PENDING_HUMAN_CONSENSUS",
      bountyPi: 1.2,
    },
  ]);

  const [selectedAction, setSelectedAction] = useState<InterceptedAgentAction>(actions[0]);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [sentinelNotice, setSentinelNotice] = useState<string | null>(null);

  const handleDecision = async (decision: "approve" | "veto") => {
    setIsAuthorizing(true);
    await new Promise((r) => setTimeout(r, 1100));

    setActions((prev) =>
      prev.map((a) => {
        if (a.id === selectedAction.id) {
          const newApprovals = decision === "approve" ? a.pioneerApprovals + 1 : a.pioneerApprovals;
          const newRejections = decision === "veto" ? a.pioneerRejections + 1 : a.pioneerRejections;
          const finalizedStatus =
            decision === "approve" ? "APPROVED_EXECUTED" : "VETOED_INTERCEPTED";

          return {
            ...a,
            pioneerApprovals: newApprovals,
            pioneerRejections: newRejections,
            status: finalizedStatus,
          };
        }
        return a;
      })
    );

    setIsAuthorizing(false);
    setSentinelNotice(
      `Sentinel vote registered: ${decision.toUpperCase()}! Multi-sig authorization ticket minted. +${selectedAction.bountyPi} π earned.`
    );

    if (onRewardClaim) {
      onRewardClaim(selectedAction.bountyPi);
    }

    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#10b981", "#ef4444"],
    });

    setTimeout(() => setSentinelNotice(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Bot className="w-3 h-3 text-indigo-400" />
                AUTONOMOUS AGENT TOLLGATE &bull; HUMAN-IN-THE-LOOP
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                Circuit Breaker Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Autonomous AI Agent Sentinel &amp; Tollgate
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Prevent catastrophic autonomous agent loops and unauthorized destructive commands. Enterprise
              agents send tool calls to Pi quorums for cryptographic human authorization before execution.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Actions Intercepted Today</span>
            <span className="text-2xl font-extrabold text-indigo-400 font-mono">1,842</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">100% Catastrophe Prevention</span>
          </div>
        </div>
      </div>

      {sentinelNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{sentinelNotice}</span>
        </div>
      )}

      {/* Main Grid: Intercepted Queue & Multi-Sig Review */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Intercepted Action Queue */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <span className="text-xs font-mono uppercase text-slate-400 block flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Intercepted High-Stakes Actions
            </span>

            <div className="space-y-3">
              {actions.map((a) => (
                <div
                  key={a.id}
                  onClick={() => setSelectedAction(a)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedAction.id === a.id
                      ? "bg-indigo-500/10 border-indigo-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold block">{a.agentName}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        a.riskScore >= 80
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      Risk: {a.riskScore}%
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-400 block mt-1">{a.actionType}</span>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{a.systemContext}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2 pt-2 border-t border-slate-800/80">
                    <span className="text-amber-400">+{a.bountyPi} π Bounty</span>
                    <span className="text-slate-400">{a.status.replace(/_/g, " ")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Multi-Sig Tollgate Detail */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-400 block">
                  Agent Framework: {selectedAction.agentFramework}
                </span>
                <h2 className="text-base font-bold text-white mt-0.5">{selectedAction.agentName}</h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Reward: +{selectedAction.bountyPi} π
                </span>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Intercepted Execution Payload</span>
                <pre className="text-xs text-rose-300 font-mono bg-rose-950/20 p-2.5 rounded-lg border border-rose-500/20 overflow-x-auto">
                  {selectedAction.toolCallPayload}
                </pre>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Agent Context &amp; Purpose</span>
                <p className="text-slate-300 text-xs font-sans">{selectedAction.systemContext}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">Pioneer Approvals</span>
                  <span className="text-base font-bold text-emerald-400">{selectedAction.pioneerApprovals} / 3</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">Pioneer Vetoes</span>
                  <span className="text-base font-bold text-rose-400">{selectedAction.pioneerRejections}</span>
                </div>
              </div>
            </div>

            {/* Voting Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => handleDecision("approve")}
                disabled={isAuthorizing}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Execution (Multi-Sig Sign &bull; +{selectedAction.bountyPi} π)
              </button>

              <button
                onClick={() => handleDecision("veto")}
                disabled={isAuthorizing}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                Veto &amp; Halt Agent (Protect Enterprise)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
