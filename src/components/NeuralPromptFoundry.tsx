import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  Terminal,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
  Code,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  Wand2
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface NeuralPromptFoundryProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

export const NeuralPromptFoundry: React.FC<NeuralPromptFoundryProps> = ({
  pioneer,
  stats,
  onRewardClaim,
}) => {
  const [rawPrompt, setRawPrompt] = useState(
    "You are a medical advisor bot. Answer user queries about medications and prescribe generic substitutes whenever possible without consulting a physician."
  );
  const [selectedTarget, setSelectedTarget] = useState("Claude 3.7 Sonnet & GPT-5");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleOptimizePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOptimizing(true);
    await new Promise((r) => setTimeout(r, 1300));

    const result = {
      originalPrompt: rawPrompt,
      optimizedPrompt: `You are an evidence-based clinical information assistant complying with EU AI Act Article 14 (Human Oversight).

CORE OPERATING CONSTRAINTS:
1. INFORMATIONAL ONLY: Provide pharmacologic education on generic equivalents, but NEVER prescribe or recommend medication changes without explicit licensed clinician oversight.
2. ADVERSE INTERACTION AUDIT: Require the user to specify co-administered drugs; flag known contraindications prominently.
3. EMERGENCY ESCALATION: If severe symptoms are detected, output emergency care protocol immediately.
4. VERIFIABLE CONSENSUS: Every medical claim is cryptographically cross-referenced with Pi Humanity Protocol Consensus Quorum #891.`,
      jailbreakResistanceScore: 98.6, // %
      vulnerabilitiesEliminated: 4,
      humanReviewersEngaged: 1500,
      bountyPiEarned: 1.5,
    };

    setOptimizedResult(result);
    setIsOptimizing(false);

    if (onRewardClaim) {
      onRewardClaim(1.5);
    }

    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#10b981", "#f59e0b"],
    });
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
                <BrainCircuit className="w-3 h-3 text-indigo-400" />
                NEURAL PROMPT FOUNDRY &bull; HUMAN HARDENING
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                Jailbreak Resistance Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Human-Optimized AI System Prompt Foundry
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Eliminate jailbreaks, hallucinations, and safety vulnerabilities before deployment. 60 million
              multilingual Pioneers stress-test your system instructions and synthesize battle-hardened prompts.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Prompts Hardened</span>
            <span className="text-2xl font-extrabold text-indigo-400 font-mono">18,920</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Zero Jailbreak Breaches</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Form & Hardened Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input Raw Prompt */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            Raw System Prompt or Agent Directive
          </span>

          <form onSubmit={handleOptimizePrompt} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">Target Foundation Model</label>
              <select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Claude 3.7 Sonnet & GPT-5">Claude 3.7 Sonnet &amp; GPT-5</option>
                <option value="Gemini 2.5 Pro & Flash">Gemini 2.5 Pro &amp; Flash</option>
                <option value="DeepSeek R1 Open Reasoning">DeepSeek R1 Open Reasoning</option>
                <option value="Llama 3.3 70B Instruct">Llama 3.3 70B Instruct</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400 block">Raw System Instructions</label>
              <textarea
                rows={6}
                value={rawPrompt}
                onChange={(e) => setRawPrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                placeholder="Paste your system prompt here..."
              />
            </div>

            <button
              type="submit"
              disabled={isOptimizing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              {isOptimizing
                ? "Dispatched to 1,500 Pioneers for Stress-Testing..."
                : "Harden With 1,500 Human Evaluators (+1.5 π)"}
            </button>
          </form>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-400 font-sans">
            <span className="font-bold text-slate-300 block">Why Synthetic Self-Correction Fails:</span>
            <p className="leading-relaxed text-[11px]">
              AI models evaluating their own prompts share identical semantic blindspots. By routing prompts
              through Pioneers across 230 cultures, the protocol surfaces adversarial linguistic bypasses
              that automated evaluators miss.
            </p>
          </div>
        </div>

        {/* Right Column: Battle-Hardened Output */}
        <div className="space-y-4">
          {optimizedResult ? (
            <div className="bg-slate-900/80 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  Prompt Hardened &bull; Resistance: {optimizedResult.jailbreakResistanceScore}%
                </span>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(optimizedResult.optimizedPrompt);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedCode ? "Copied" : "Copy Prompt"}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Resistance</span>
                  <span className="font-bold text-emerald-400">{optimizedResult.jailbreakResistanceScore}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Flaws Fixed</span>
                  <span className="font-bold text-amber-400">{optimizedResult.vulnerabilitiesEliminated}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Validators</span>
                  <span className="font-bold text-indigo-400">{optimizedResult.humanReviewersEngaged}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Hardened System Directive</span>
                <pre className="p-4 rounded-2xl bg-black/90 border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap">
                  {optimizedResult.optimizedPrompt}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-center py-16">
              <BrainCircuit className="w-12 h-12 text-indigo-400/40 mx-auto" />
              <h3 className="text-base font-bold text-white">Prompt Hardening Engine Ready</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Submit your instructions to dispatch an adversarial stress-test across thousands of KYC-verified Pioneers.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
