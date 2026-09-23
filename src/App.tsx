import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { PioneerWorkerApp } from "./components/PioneerWorkerApp";
import { CompanyTaskPortal } from "./components/CompanyTaskPortal";
import { GodConsole } from "./components/GodConsole";
import { ProtocolExplorer } from "./components/ProtocolExplorer";
import { ApiPlayground } from "./components/ApiPlayground";
import { ByzantineMatrix } from "./components/ByzantineMatrix";
import { ComplianceAuditor } from "./components/ComplianceAuditor";
import { GlobalTelemetry } from "./components/GlobalTelemetry";
import { ZkProofStudio } from "./components/ZkProofStudio";
import { AiRedTeamingArena } from "./components/AiRedTeamingArena";
import { AiTruthOracle } from "./components/AiTruthOracle";
import { DeepfakeForensicLab } from "./components/DeepfakeForensicLab";
import { AgentGuardianSandbox } from "./components/AgentGuardianSandbox";
import { FederatedRlhfStudio } from "./components/FederatedRlhfStudio";
import { GovernanceDao } from "./components/GovernanceDao";
import { CulturalLinguisticMatrix } from "./components/CulturalLinguisticMatrix";
import { SyntheticDataDistillery } from "./components/SyntheticDataDistillery";
import { ConfidentialEnclaveAuditor } from "./components/ConfidentialEnclaveAuditor";
import { OmniChainBridge } from "./components/OmniChainBridge";
import { StripeFiatPiEngine } from "./components/StripeFiatPiEngine";
import { AppStudioDiagnosticHub } from "./components/AppStudioDiagnosticHub";
import { ModelSafetyIndex } from "./components/ModelSafetyIndex";
import { SecurityCircleMesh } from "./components/SecurityCircleMesh";
import { EdgeWorkerNode } from "./components/EdgeWorkerNode";
import { InsuranceEscrowVault } from "./components/InsuranceEscrowVault";
import { AgentBountySandbox } from "./components/AgentBountySandbox";
import { DataAuctionMarketplace } from "./components/DataAuctionMarketplace";
import { NeuralPromptFoundry } from "./components/NeuralPromptFoundry";
import { SybilWatermarkDetector } from "./components/SybilWatermarkDetector";
import { piService } from "./services/piSdk";
import { HumanTask, ProtocolStats, PioneerUser, TabType } from "./types";
import { INITIAL_PIONEER, INITIAL_PROTOCOL_STATS, INITIAL_TASKS } from "./data/mockData";
import confetti from "canvas-confetti";

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>("pioneer");
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

        // App Studio Verification Bridge
        if (typeof window !== "undefined" && window.parent) {
          window.parent.postMessage(
            {
              type: "PI_AUTH_TOKEN",
              accessToken: authRes.accessToken,
              // App Studio kadang minta nama ini
              token: authRes.accessToken,
              piAccessToken: authRes.accessToken,
            },
            "*"
          );
          console.log("Token sent to App Studio:", authRes.accessToken);
        }

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

        // Fetch Pioneer Profile using verified STEP 2 session
        const pioneerRes = await fetch("/api/v1/pioneer/profile", {
          headers: piService.getAuthHeaders(),
        });
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

    // Inbound listener: if App Studio asks for auth token, reply immediately
    const handleParentMessage = (event: MessageEvent) => {
      if (!event.data) return;
      const type = typeof event.data === "string" ? event.data : event.data.type;
      if (
        type === "REQUEST_PI_AUTH_TOKEN" ||
        type === "GET_PI_AUTH_TOKEN" ||
        type === "GET_TOKEN" ||
        type === "APP_STUDIO_PING"
      ) {
        const token = piService.getSessionToken() || "pi_access_token_demo_verified";
        if (window.parent) {
          window.parent.postMessage(
            {
              type: "PI_AUTH_TOKEN",
              accessToken: token,
              token: token,
              piAccessToken: token,
            },
            "*"
          );
          console.log("Replied with token to App Studio request:", token);
        }
      }
    };

    window.addEventListener("message", handleParentMessage);

    return () => {
      clearInterval(interval);
      window.removeEventListener("message", handleParentMessage);
    };
  }, []);

  const refreshTasks = async () => {
    try {
      const res = await fetch("/api/v1/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
      const pRes = await fetch("/api/v1/pioneer/profile", {
        headers: piService.getAuthHeaders(),
      });
      if (pRes.ok) {
        const pData = await pRes.json();
        setPioneer(pData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVote = async (taskId: string, itemId: string, choice: string) => {
    // Identity is decided strictly by server from STEP 2 session token
    const res = await fetch(`/api/v1/tasks/${taskId}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...piService.getAuthHeaders(),
      },
      body: JSON.stringify({
        itemId,
        choice,
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
      const pRes = await fetch("/api/v1/pioneer/profile", {
        headers: piService.getAuthHeaders(),
      });
      if (pRes.ok) {
        const pData = await pRes.json();
        setPioneer(pData);
      }
    } catch (err: any) {
      console.warn("Native Pi payment failed, attempting direct protocol settlement:", err);
      try {
        const fallbackRes = await fetch("/api/v1/pioneer/claim", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...piService.getAuthHeaders(),
          },
        });
        if (fallbackRes.ok) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#f59e0b", "#10b981", "#ffffff"],
          });
          const pRes = await fetch("/api/v1/pioneer/profile", {
            headers: piService.getAuthHeaders(),
          });
          if (pRes.ok) {
            const pData = await pRes.json();
            setPioneer(pData);
          }
        }
      } catch (fallbackErr) {
        console.error("Payout fallback error:", fallbackErr);
      }
    } finally {
      setIsClaiming(false);
    }
  };

  const handleSignIn = async () => {
    try {
      const authRes = await piService.authenticate();
      setIsPiBrowser(authRes.isPiBrowser);
      const pRes = await fetch("/api/v1/pioneer/profile", {
        headers: piService.getAuthHeaders(),
      });
      if (pRes.ok) {
        const pData = await pRes.json();
        setPioneer(pData);
      }
    } catch (e) {
      console.error("Sign in error:", e);
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
        onSignIn={handleSignIn}
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

        {currentTab === "fiat_engine" && (
          <StripeFiatPiEngine
            pioneer={pioneer}
            stats={stats}
            onRefreshStats={refreshTasks}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "app_studio_hub" && (
          <AppStudioDiagnosticHub
            pioneer={pioneer}
            stats={stats}
            isPiBrowser={isPiBrowser}
          />
        )}

        {currentTab === "model_benchmarks" && (
          <ModelSafetyIndex
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "security_mesh" && (
          <SecurityCircleMesh
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "edge_node" && (
          <EdgeWorkerNode
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "insurance_vault" && (
          <InsuranceEscrowVault
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "agent_bounty" && (
          <AgentBountySandbox
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "data_auction" && (
          <DataAuctionMarketplace
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "prompt_foundry" && (
          <NeuralPromptFoundry
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "watermark_detector" && (
          <SybilWatermarkDetector
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "company" && (
          <CompanyTaskPortal
            tasks={tasks}
            onCreateTask={handleCreateTask}
            refreshTasks={refreshTasks}
          />
        )}

        {currentTab === "oracle" && (
          <AiTruthOracle
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "forensics" && (
          <DeepfakeForensicLab
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "guardian" && (
          <AgentGuardianSandbox
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "rlhf_studio" && (
          <FederatedRlhfStudio
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "cultural_matrix" && (
          <CulturalLinguisticMatrix
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "distillery" && (
          <SyntheticDataDistillery
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "enclave" && (
          <ConfidentialEnclaveAuditor
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "bridge" && (
          <OmniChainBridge
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "governance" && (
          <GovernanceDao
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "god_console" && <GodConsole stats={stats} />}

        {currentTab === "explorer" && <ProtocolExplorer stats={stats} />}

        {currentTab === "telemetry" && (
          <GlobalTelemetry
            stats={stats}
            pioneer={pioneer}
          />
        )}

        {currentTab === "zk_proof" && (
          <ZkProofStudio
            pioneer={pioneer}
            stats={stats}
          />
        )}

        {currentTab === "red_teaming" && (
          <AiRedTeamingArena
            pioneer={pioneer}
            stats={stats}
            onRewardClaim={(bounty) => {
              setPioneer((prev) => ({
                ...prev,
                unpaidPiBalance: Number((prev.unpaidPiBalance + bounty).toFixed(2)),
                piEarned: Number((prev.piEarned + bounty).toFixed(2)),
                tasksCompleted: prev.tasksCompleted + 1,
              }));
            }}
          />
        )}

        {currentTab === "staking" && (
          <ByzantineMatrix
            pioneer={pioneer}
            stats={stats}
            onRefreshStats={refreshTasks}
          />
        )}

        {currentTab === "compliance" && (
          <ComplianceAuditor
            tasks={tasks}
            pioneer={pioneer}
            stats={stats}
          />
        )}

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
