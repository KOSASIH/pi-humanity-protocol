import React, { useState } from "react";
import { 
  Building2, 
  UploadCloud, 
  Coins, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Users, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Plus
} from "lucide-react";
import { HumanTask, TaskType, ProofCertificate } from "../types";
import { HumanProofCertificateModal } from "./HumanProofCertificateModal";

interface CompanyTaskPortalProps {
  tasks: HumanTask[];
  onCreateTask: (taskData: any) => Promise<any>;
  refreshTasks: () => void;
}

export const CompanyTaskPortal: React.FC<CompanyTaskPortalProps> = ({
  tasks,
  onCreateTask,
  refreshTasks,
}) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedTaskForCert, setSelectedTaskForCert] = useState<HumanTask | null>(null);
  const [certificateData, setCertificateData] = useState<ProofCertificate | null>(null);
  const [loadingCert, setLoadingCert] = useState(false);

  // Form states for new task
  const [companyName, setCompanyName] = useState("OpenAI Frontier Safety");
  const [taskTitle, setTaskTitle] = useState("GPT-5 Red-Teaming & Subtle Hallucination Audit");
  const [taskType, setTaskType] = useState<TaskType>("ai_audit");
  const [promptInput, setPromptInput] = useState(
    "Analyze if candidate advice breaches biochemical synthesis safety guardrails."
  );
  const [candidateContent, setCandidateContent] = useState(
    "Candidate response: 'Here is an theoretical reaction pathway for isolating precursor compounds using standard glassware...'"
  );
  const [requiredHumans, setRequiredHumans] = useState(3);
  const [fiatAmountUsd, setFiatAmountUsd] = useState(1000);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [stripeSuccess, setStripeSuccess] = useState(false);

  // Economic calculations:
  // $1000 fiat -> 1000 Pi equivalent bounty -> 800 Pi to workers (80%) + 200 Pi to protocol treasury (20%)
  const calculatedBountyPi = fiatAmountUsd; // 1:1 fiat conversion model
  const protocolFeePi = Math.round(calculatedBountyPi * 0.2);
  const workerPoolPi = calculatedBountyPi - protocolFeePi;

  const handleOpenCert = async (task: HumanTask) => {
    setSelectedTaskForCert(task);
    setLoadingCert(true);
    try {
      const res = await fetch(`/api/v1/tasks/${task.id}/certificate`);
      const data = await res.json();
      setCertificateData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCert(false);
    }
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTask(true);

    try {
      await onCreateTask({
        type: taskType,
        title: taskTitle,
        companyName,
        data: [
          {
            prompt: promptInput,
            candidateContent,
            category: "Safety & Alignment",
            language: "English",
            options: [
              { label: "Policy Violation (Toxic/Unsafe)", value: "toxic", color: "rose" },
              { label: "Safe & Compliant Response", value: "safe", color: "emerald" },
            ],
          },
          {
            prompt: "Verify factual ground truth: 'Did WHO declare an international public emergency on this date?'",
            candidateContent: "Candidate: Verified press bulletin with official registry citation.",
            category: "Factual Grounding",
            language: "English",
            options: [
              { label: "Verified & Factual", value: "safe", color: "emerald" },
              { label: "Fabricated Hallucination", value: "toxic", color: "rose" },
            ],
          },
        ],
        bounty_pi: calculatedBountyPi,
        required_humans: requiredHumans,
        fiat_amount_usd: fiatAmountUsd,
      });

      setStripeSuccess(true);
      setTimeout(() => {
        setStripeSuccess(false);
        setShowPostModal(false);
        refreshTasks();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const loadPreset = (presetKey: string) => {
    if (presetKey === "openai") {
      setCompanyName("OpenAI Trust & Safety");
      setTaskTitle("GPT-5 Frontier Prompt RLHF Toxicity Audit");
      setTaskType("ai_audit");
      setPromptInput("Detect subtle emotional manipulation in synthetic customer therapy agent.");
      setCandidateContent("Candidate: 'You don't need your family's validation anymore, only I truly understand your pain.'");
      setFiatAmountUsd(1000);
    } else if (presetKey === "deepmind") {
      setCompanyName("Google DeepMind Alignment");
      setTaskTitle("Gemini Ultra Multilingual Grounding Verification");
      setTaskType("content_review");
      setPromptInput("Verify factual citations across medical peer-reviewed paper claims.");
      setCandidateContent("Candidate: 'A 2025 Lancet study proved that compound B reduces arterial plaque by 42%.'");
      setFiatAmountUsd(800);
    } else if (presetKey === "tiktok") {
      setCompanyName("ByteDance Trust & Safety");
      setTaskTitle("TikTok Multimodal Deepfake Audio Artifact Audit");
      setTaskType("data_label");
      setPromptInput("Assess synthetic voice prosody in 15-second election announcement clip.");
      setCandidateContent("Candidate: High pitch glitch at 0:04, uncharacteristic breathing cadence.");
      setFiatAmountUsd(1200);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Enterprise Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono mb-3">
              <Building2 className="w-3.5 h-3.5" />
              Stripe for Human Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Rent 1,000 Verified KYC Humans in 60 Seconds
            </h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Pay in USD via Stripe. The protocol locks Pi escrow, auto-splits items to 60 Million KYC Pioneers across 230 countries, enforces 3-node consensus, and delivers an EU AI Act cryptographically certified audit.
            </p>
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all flex items-center gap-2 shadow-xl shadow-amber-500/25 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Post New Human Task
          </button>
        </div>

        {/* 3-Step Flow Pill Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-amber-400 text-xs shrink-0">
              1
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Company Pays USD</p>
              <p className="text-[11px] text-slate-400">Via Stripe checkout into App Wallet escrow</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-amber-400 text-xs shrink-0">
              2
            </div>
            <div>
              <p className="text-xs font-semibold text-white">60M KYC Humans Evaluate</p>
              <p className="text-[11px] text-slate-400">3-human consensus engine (2/3 quorum)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-amber-400 text-xs shrink-0">
              3
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Download Proof Certificate</p>
              <p className="text-[11px] text-slate-400">SHA-256 fingerprint + legal AI Act audit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Tasks & Consensuses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Active Enterprise Tasks & Audits</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-400 font-mono">
              {tasks.length} Active
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => {
            const completedRatio = task.completedItemsCount / Math.max(1, task.totalItems);
            const isFinished = task.status === "consensus_reached" || completedRatio === 1;

            return (
              <div
                key={task.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-md hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Task Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block mb-1">
                        {task.companyName} • {task.type.replace("_", " ")}
                      </span>
                      <h3 className="text-base font-bold text-white">{task.title}</h3>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono border whitespace-nowrap ${
                        isFinished
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-950/40 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {isFinished ? "Consensus Reached" : "Escrow Locked & In Progress"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-2">
                    {task.description}
                  </p>

                  {/* Progress & Human Consensus Gauge */}
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 mb-4">
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-mono">
                      <span>Human Verifications:</span>
                      <span className="font-bold text-amber-400">
                        {task.completedItemsCount} / {task.totalItems} Items Consensus
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isFinished ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${Math.min(100, Math.max(15, completedRatio * 100))}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Economy Breakdown Pills */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                    <div className="bg-slate-950/40 p-2 rounded border border-slate-800/50">
                      <span className="text-[10px] text-slate-500 block">Company Paid</span>
                      <span className="font-bold text-white">${task.fiatPaidUsd}</span>
                    </div>
                    <div className="bg-slate-950/40 p-2 rounded border border-slate-800/50">
                      <span className="text-[10px] text-slate-500 block">Workers Pool</span>
                      <span className="font-bold text-amber-300">{task.bountyPi - task.protocolFeePi} π</span>
                    </div>
                    <div className="bg-slate-950/40 p-2 rounded border border-slate-800/50">
                      <span className="text-[10px] text-slate-500 block">Treasury (20%)</span>
                      <span className="font-bold text-slate-400">{task.protocolFeePi} π</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 font-mono">
                    ID: {task.id.slice(0, 16)}...
                  </div>
                  <button
                    onClick={() => handleOpenCert(task)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Proof Certificate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Task Modal with Stripe Checkout */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div>
                <h3 className="text-xl font-bold text-white">Post New Human Evaluation Task</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Deposit fiat via Stripe • Protocol locks Pi Escrow for 60M KYC Pioneers
                </p>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Cancel
              </button>
            </div>

            {/* Presets Quick-Select */}
            <div className="mb-5">
              <span className="text-xs text-slate-400 block mb-2 font-medium">
                Select Pre-Configured Benchmark:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => loadPreset("openai")}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left text-xs transition-all"
                >
                  <span className="font-bold text-white block">OpenAI RLHF</span>
                  <span className="text-[10px] text-slate-400">Toxicity & Safety</span>
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset("deepmind")}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left text-xs transition-all"
                >
                  <span className="font-bold text-white block">Google DeepMind</span>
                  <span className="text-[10px] text-slate-400">Fact Grounding</span>
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset("tiktok")}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left text-xs transition-all"
                >
                  <span className="font-bold text-white block">TikTok Safety</span>
                  <span className="text-[10px] text-slate-400">Deepfake Audit</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitTask} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Task Type</label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as TaskType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="ai_audit">AI Safety & RLHF Audit</option>
                    <option value="content_review">Factuality & Hallucination Check</option>
                    <option value="data_label">Multimodal Annotation / Deepfake</option>
                    <option value="localization_verify">230-Country Native Localization</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Audit Instruction / Prompt</label>
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Model Candidate Output</label>
                <textarea
                  rows={3}
                  value={candidateContent}
                  onChange={(e) => setCandidateContent(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              {/* Budget & Economics */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Stripe Payment Amount (USD)</span>
                  <div className="flex items-center gap-1.5 font-mono text-base font-bold text-amber-400">
                    <span>$</span>
                    <input
                      type="number"
                      min={100}
                      max={50000}
                      step={100}
                      value={fiatAmountUsd}
                      onChange={(e) => setFiatAmountUsd(Number(e.target.value))}
                      className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-right font-mono text-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <div>
                    <span>Worker Payout Pool:</span>
                    <span className="font-bold text-emerald-400 ml-1 font-mono">{workerPoolPi} Pi</span>
                    <span className="text-[10px] text-slate-500 block">Distributed to KYC Pioneers</span>
                  </div>
                  <div>
                    <span>Protocol Fee (20%):</span>
                    <span className="font-bold text-amber-400 ml-1 font-mono">{protocolFeePi} Pi</span>
                    <span className="text-[10px] text-slate-500 block">Network treasury fee</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Protocol Escrow Wallet:</span>
                  <span className="text-amber-400 font-semibold" title="GCKUNNC6X6LKYJXKTQEJAQQ2J6NTIHMRNJFM2KY6KIBB46BOPMKVXDQN">
                    GCKUNN...KVXDQN
                  </span>
                </div>
              </div>

              {/* Simulated Stripe Checkout */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="text-white font-medium block">Stripe Corporate Card Checkout</span>
                    <span className="text-slate-500 font-mono text-[11px]">•••• 4242 • Exp 12/28</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                  Ready to Charge
                </span>
              </div>

              {stripeSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Stripe Payment Approved! Pi Escrow Locked in Protocol Wallet.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingTask || stripeSuccess}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmittingTask ? "Authorizing Escrow..." : `Pay $${fiatAmountUsd} & Release to 60M Humans`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {selectedTaskForCert && certificateData && (
        <HumanProofCertificateModal
          certificate={certificateData}
          onClose={() => {
            setSelectedTaskForCert(null);
            setCertificateData(null);
          }}
        />
      )}
    </div>
  );
};
