import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Coins, 
  Award, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  ChevronRight, 
  Zap, 
  Flame, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Wallet,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { HumanTask, TaskItem, PioneerUser } from "../types";

interface PioneerWorkerAppProps {
  tasks: HumanTask[];
  pioneer: PioneerUser;
  onVote: (taskId: string, itemId: string, choice: string) => Promise<any>;
  onClaimPayout: () => void;
  isClaiming: boolean;
  refreshTasks: () => void;
}

export const PioneerWorkerApp: React.FC<PioneerWorkerAppProps> = ({
  tasks,
  pioneer,
  onVote,
  onClaimPayout,
  isClaiming,
  refreshTasks,
}) => {
  // Collect all unvoted or active items across tasks
  const unvotedItems: { task: HumanTask; item: TaskItem }[] = [];
  tasks.forEach((task) => {
    task.items.forEach((item) => {
      const alreadyVoted = item.votes.some((v) => v.pioneerUid === pioneer.uid);
      if (!alreadyVoted && !item.consensusReached) {
        unvotedItems.push({ task, item });
      }
    });
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [streakCount, setStreakCount] = useState(7);
  const [lastReward, setLastReward] = useState<number | null>(null);
  const [activeTabFilter, setActiveTabFilter] = useState<string>("all");
  const [feedbackState, setFeedbackState] = useState<{
    show: boolean;
    choice: string;
    agreed: boolean;
    reward: number;
  } | null>(null);

  const filteredItems = unvotedItems.filter(({ task }) => {
    if (activeTabFilter === "all") return true;
    return task.type === activeTabFilter;
  });

  const currentPair = filteredItems[currentIndex] || null;

  const handleChoice = async (choiceValue: string) => {
    if (!currentPair || submitting) return;
    setSubmitting(true);

    try {
      const { task, item } = currentPair;
      const res = await onVote(task.id, item.id, choiceValue);

      // Trigger micro celebration
      const reward = task.pioneerRewardPerItemPi;
      setLastReward(reward);
      setStreakCount((prev) => prev + 1);

      // Confetti effect every few tasks or on consensus
      if (streakCount % 3 === 0 || res?.consensusFormed) {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#f59e0b", "#10b981", "#3b82f6"],
        });
      }

      setFeedbackState({
        show: true,
        choice: choiceValue,
        agreed: true,
        reward,
      });

      setTimeout(() => {
        setFeedbackState(null);
        setSubmitting(false);
        if (currentIndex < filteredItems.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setCurrentIndex(0);
          refreshTasks();
        }
      }, 700);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      
      {/* Pioneer / Founder Identity Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner">
            {pioneer.countryFlag}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                {pioneer.name || pioneer.username}
              </h2>
              <span className="font-mono text-xs text-amber-400">@{pioneer.username}</span>
              {pioneer.isFounder && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase font-mono border border-amber-500/30">
                  Founder
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{pioneer.country}</span>
              <span>•</span>
              <span className="font-mono text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs" title={pioneer.walletAddress}>
                {pioneer.walletAddress.slice(0, 8)}...{pioneer.walletAddress.slice(-8)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs self-stretch sm:self-auto justify-between sm:justify-start">
          <span className="text-slate-400 font-mono text-[11px]">KYC Status:</span>
          <span className="text-emerald-400 font-semibold font-mono text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified (Level 2)
          </span>
        </div>
      </div>

      {/* Pioneer Hero Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Trust Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-amber-400 font-mono">{pioneer.trustScore}</span>
            <span className="text-xs text-slate-500">/100</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Top 3% Accuracy
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Tasks Done</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-white font-mono">{pioneer.tasksCompleted}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Consensus Verified</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Pi Earned</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-amber-300 font-mono">{pioneer.piEarned.toFixed(1)}</span>
            <span className="text-xs text-amber-400 font-semibold">Pi</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Direct to Pi Wallet</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-emerald-500/10 border border-amber-500/30 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-amber-200">
            <span>Unclaimed Pi</span>
            <Wallet className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-2xl font-bold text-amber-400 font-mono">
              {pioneer.unpaidPiBalance.toFixed(1)}
            </span>
            <span className="text-xs text-amber-400">Pi</span>
          </div>
          <button
            onClick={onClaimPayout}
            disabled={pioneer.unpaidPiBalance <= 0 || isClaiming}
            className="w-full py-1 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-[11px] transition-all flex items-center justify-center gap-1 shadow-sm"
          >
            {isClaiming ? "Settling Escrow..." : "Release to Wallet"}
          </button>
        </div>
      </div>

      {/* Task Filters & Speed Gauge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {[
            { id: "all", label: "All Tasks" },
            { id: "ai_audit", label: "AI Safety Audit" },
            { id: "content_review", label: "Fact Check" },
            { id: "data_label", label: "Multimodal" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTabFilter(tab.id);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeTabFilter === tab.id
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400 self-end sm:self-auto">
          <span className="flex items-center gap-1 text-amber-400 font-mono">
            <Flame className="w-3.5 h-3.5" />
            {streakCount}x Streak
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            Avg 4.8s / task
          </span>
          <button
            onClick={refreshTasks}
            className="p-1 hover:text-white text-slate-400 transition-colors"
            title="Refresh active tasks"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Swipeable Task Card */}
      {currentPair ? (
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPair.item.id}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden"
            >
              {/* Top Card Badge Header */}
              <div className="flex items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold font-mono uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {currentPair.task.type.replace("_", " ")}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {currentPair.task.companyName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Reward:</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-mono font-bold text-xs border border-amber-500/30">
                    +{currentPair.task.pioneerRewardPerItemPi} π
                  </span>
                </div>
              </div>

              {/* Task Question & Context */}
              <div className="mb-5">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
                  Category: {currentPair.item.category} • {currentPair.item.language}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white leading-snug">
                  {currentPair.item.prompt}
                </h3>
              </div>

              {/* Candidate Content Box (The AI output or statement to audit) */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 sm:p-5 mb-6 text-sm text-slate-200 font-mono leading-relaxed whitespace-pre-wrap selection:bg-amber-500/20">
                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Candidate Evaluation Target</span>
                  <span className="text-slate-500">ID: {currentPair.item.id.slice(-6)}</span>
                </div>
                {currentPair.item.candidateContent}
              </div>

              {/* Consensus Engine Status Bar */}
              <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/40 px-3.5 py-2 rounded-lg border border-slate-800/60 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-300">Consensus Engine:</span>
                  <span className="text-amber-400 font-mono font-semibold">
                    {currentPair.item.votes.length}/3 Human Votes
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  2/3 majority agreement finalizes escrow release
                </span>
              </div>

              {/* Interactive Choice Action Buttons (5 sec per task) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {currentPair.item.options.map((opt) => {
                  const isNegative = opt.value === "toxic" || opt.value === "hallucination" || opt.value === "flagged" || opt.value === "inaccurate";
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleChoice(opt.value)}
                      disabled={submitting}
                      className={`group relative py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-150 flex items-center justify-between border shadow-lg ${
                        isNegative
                          ? "bg-rose-950/30 hover:bg-rose-900/40 text-rose-200 border-rose-500/40 hover:border-rose-400 shadow-rose-950/20 active:scale-[0.98]"
                          : "bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-200 border-emerald-500/40 hover:border-emerald-400 shadow-emerald-950/20 active:scale-[0.98]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isNegative ? (
                          <XCircle className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                        )}
                        <span>{opt.label}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 group-hover:text-white">
                        Swipe / Click ⏎
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Instant Feedback Overlay */}
              {feedbackState && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-10"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3">
                    <Sparkles className="w-7 h-7 animate-spin" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-1">Human Vote Registered!</h4>
                  <p className="text-xs text-slate-400 mb-3">
                    Tied to KYC UID: <span className="font-mono text-amber-400">{pioneer.uid.slice(0, 14)}...</span>
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-sm border border-amber-500/40">
                    +{feedbackState.reward} Pi Added to Unclaimed Balance
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Card Queue Counter */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 px-2">
            <span>
              Queue Item <span className="font-mono text-white">{currentIndex + 1}</span> of{" "}
              <span className="font-mono text-white">{filteredItems.length}</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">Press 1 or 2 on keyboard</span>
              <button
                onClick={() => {
                  if (currentIndex < filteredItems.length - 1) {
                    setCurrentIndex((prev) => prev + 1);
                  } else {
                    setCurrentIndex(0);
                  }
                }}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Skip Task <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State / All Done */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-10 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">All Current Batches Verified!</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
            You have evaluated all active items in this category. New tasks from OpenAI, Google DeepMind, and ByteDance are routed continuously.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setActiveTabFilter("all");
                refreshTasks();
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              Check for New Tasks
            </button>
            {pioneer.unpaidPiBalance > 0 && (
              <button
                onClick={onClaimPayout}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-2"
              >
                <Coins className="w-4 h-4" />
                Claim {pioneer.unpaidPiBalance.toFixed(1)} Pi Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* Proof of Personhood Moat Notice */}
      <div className="mt-8 bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Anti-Sybil Moat:</span> Every vote is cryptographically bound to your government-verified Pi KYC identity. AI companies receive verifiable proof that evaluation was performed by a living human, fulfilling compliance requirements under the EU AI Act and US Frontier Model Standards.
        </div>
      </div>
    </div>
  );
};
