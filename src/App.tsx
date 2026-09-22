import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { PioneerWorkerApp } from "./components/PioneerWorkerApp";
import { CompanyTaskPortal } from "./components/CompanyTaskPortal";
import { GodConsole } from "./components/GodConsole";
import { ProtocolExplorer } from "./components/ProtocolExplorer";
import { ApiPlayground } from "./components/ApiPlayground";
import { piService } from "./services/piSdk";
import { HumanTask, ProtocolStats, PioneerUser } from "./types";
import { INITIAL_PIONEER, INITIAL_PROTOCOL_STATS, INITIAL_TASKS } from "./data/mockData";
import confetti from "canvas-confetti";

export default function App() {
  const [currentTab, setCurrentTab] = useState<"pioneer" | "company" | "god_console" | "explorer" | "api">("pioneer");
  const [tasks, setTasks] = useState<HumanTask[]>(INITIAL_TASKS);
  const [stats, setStats] = useState<ProtocolStats>(INITIAL_PROTOCOL_STATS);
  const [pioneer, setPioneer] = useState<PioneerUser>(INITIAL_PIONEER);
  const [isPiBrowser, setIsPiBrowser] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Pi SDK & Data
  useEffect(() => {
    async function setupApp() {
      try {
        // Authenticate with Pi SDK (handles Pi Browser or local testing simulation)
        const authRes = await piService.authenticate();
        setIsPiBrowser(authRes.isPiBrowser);

        // Fetch Tasks
        const tasksRes = await fetch("/api/v1/tasks");
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        }

        // Fetch Protocol Stats
        const statsRes = await fetch("/api/v1/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch Pioneer Profile
        const pioneerRes = await fetch("/api/v1/pioneer/profile");
        if (pioneerRes.ok) {
          const pioneerData = await pioneerRes.json();
          setPioneer(pioneerData);
        }
      } catch (err) {
        console.warn("Initial sync error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    setupApp();

    // Heartbeat for stats & live nodes
    const interval = setInterval(async () => {
      try {
        const statsRes = await fetch("/api/v1/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (e) {
        // silent
      }
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const refreshTasks = async () => {
    try {
      const res = await fetch("/api/v1/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
      const pRes = await fetch("/api/v1/pioneer/profile");
      if (pRes.ok) {
        const pData = await pRes.json();
        setPioneer(pData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVote = async (taskId: string, itemId: string, choice: string) => {
    const res = await fetch(`/api/v1/tasks/${taskId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId,
        choice,
        pioneerUid: pioneer.uid,
        pioneerUsername: pioneer.username,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to vote");
    }

    const data = await res.json();
    if (data.pioneerProfile) {
      setPioneer(data.pioneerProfile);
    }

    // Update local task
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? data.task : t))
    );

    return data;
  };

  const handleCreateTask = async (taskData: any) => {
    const res = await fetch("/api/v1/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create task");
    }

    const data = await res.json();
    await refreshTasks();
    return data;
  };

  const handleClaimPayout = async () => {
    if (pioneer.unpaidPiBalance <= 0 || isClaiming) return;
    setIsClaiming(true);

    try {
      await piService.createPayment(
        pioneer.unpaidPiBalance,
        `Pi Humanity Consensus Reward Payout`,
        { type: "worker_consensus_payout", pioneerUid: pioneer.uid }
      );

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#10b981", "#ffffff"],
      });

      // Update pioneer profile
      const pRes = await fetch("/api/v1/pioneer/profile");
      if (pRes.ok) {
        const pData = await pRes.json();
        setPioneer(pData);
      }
    } catch (err) {
      console.error("Payout error:", err);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        pioneer={pioneer}
        isPiBrowser={isPiBrowser}
        onClaimPayout={handleClaimPayout}
        isClaiming={isClaiming}
      />

      <main className="flex-1 pb-16">
        {currentTab === "pioneer" && (
          <PioneerWorkerApp
            tasks={tasks}
            pioneer={pioneer}
            onVote={handleVote}
            onClaimPayout={handleClaimPayout}
            isClaiming={isClaiming}
            refreshTasks={refreshTasks}
          />
        )}

        {currentTab === "company" && (
          <CompanyTaskPortal
            tasks={tasks}
            onCreateTask={handleCreateTask}
            refreshTasks={refreshTasks}
          />
        )}

        {currentTab === "god_console" && <GodConsole stats={stats} />}

        {currentTab === "explorer" && <ProtocolExplorer stats={stats} />}

        {currentTab === "api" && <ApiPlayground />}
      </main>

      {/* Persistent Bottom Bar for Protocol Trust & Domain */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>humanity.pi • Founded by <span className="text-slate-300 font-semibold">KOSASIH</span> (@Kosasih78, Indonesia 🇮🇩)</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px]">
            <span>EU AI Act Article 50 Compliant</span>
            <span>•</span>
            <span>Anti-Sybil 3-Node Consensus</span>
            <span>•</span>
            <span title="GCKUNNC6X6LKYJXKTQEJAQQ2J6NTIHMRNJFM2KY6KIBB46BOPMKVXDQN">
              Escrow Wallet: GCKUNN...KVXDQN
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
