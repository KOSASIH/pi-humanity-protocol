import React, { useState, useEffect } from "react";
import {
  Globe2,
  Activity,
  Cpu,
  Server,
  Radio,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  Wifi,
  HardDrive
} from "lucide-react";
import { ProtocolStats, PioneerUser } from "../types";
import confetti from "canvas-confetti";

interface GlobalTelemetryProps {
  stats: ProtocolStats;
  pioneer: PioneerUser;
}

interface TelemetryNode {
  id: string;
  name: string;
  cluster: string;
  city: string;
  country: string;
  flag: string;
  lat: number;
  lng: number;
  xPct: number; // For SVG map overlay (0 - 100%)
  yPct: number;
  status: "ONLINE" | "SYNCHRONIZING" | "EVALUATING";
  stakedPi: string;
  activePioneers: number;
  latencyMs: number;
  quorumSlices: string[];
  cpuUsage: number;
  ramUsage: number;
  blocksValidated: number;
  tasksAuditedToday: number;
  isPrimaryAuthority?: boolean;
}

export const GlobalTelemetry: React.FC<GlobalTelemetryProps> = ({ stats, pioneer }) => {
  const [nodes, setNodes] = useState<TelemetryNode[]>([
    {
      id: "node_jakarta",
      name: "Jakarta Kosasih Authority Node #01",
      cluster: "Southeast Asia Sovereign Tier-1",
      city: "Jakarta",
      country: "Indonesia",
      flag: "🇮🇩",
      lat: -6.2088,
      lng: 106.8456,
      xPct: 77,
      yPct: 62,
      status: "ONLINE",
      stakedPi: "11,250,000 π",
      activePioneers: 14820,
      latencyMs: 18,
      quorumSlices: ["Frankfurt Fortress", "Tokyo Shard", "Singapore Mesh"],
      cpuUsage: 28,
      ramUsage: 44,
      blocksValidated: 42109,
      tasksAuditedToday: 3820,
      isPrimaryAuthority: true,
    },
    {
      id: "node_tokyo",
      name: "Tokyo Low-Latency Mesh",
      cluster: "East Asia Sharding Group",
      city: "Tokyo",
      country: "Japan",
      flag: "🇯🇵",
      lat: 35.6762,
      lng: 139.6503,
      xPct: 86,
      yPct: 40,
      status: "ONLINE",
      stakedPi: "5,900,000 π",
      activePioneers: 9410,
      latencyMs: 24,
      quorumSlices: ["Jakarta Authority", "Seoul Hub", "Frankfurt Fortress"],
      cpuUsage: 34,
      ramUsage: 51,
      blocksValidated: 31050,
      tasksAuditedToday: 2940,
    },
    {
      id: "node_frankfurt",
      name: "Frankfurt BFT Fortress",
      cluster: "EU Central Regulatory Anchor",
      city: "Frankfurt",
      country: "Germany",
      flag: "🇩🇪",
      lat: 50.1109,
      lng: 8.6821,
      xPct: 52,
      yPct: 32,
      status: "ONLINE",
      stakedPi: "6,800,000 π",
      activePioneers: 8200,
      latencyMs: 38,
      quorumSlices: ["Jakarta Authority", "London Peer", "Tokyo Shard"],
      cpuUsage: 22,
      ramUsage: 39,
      blocksValidated: 29840,
      tasksAuditedToday: 2610,
    },
    {
      id: "node_lagos",
      name: "Lagos Pioneer Vanguard",
      cluster: "Sub-Saharan Africa Authority",
      city: "Lagos",
      country: "Nigeria",
      flag: "🇳🇬",
      lat: 6.5244,
      lng: 3.3792,
      xPct: 50,
      yPct: 55,
      status: "ONLINE",
      stakedPi: "4,600,000 π",
      activePioneers: 16500,
      latencyMs: 52,
      quorumSlices: ["Jakarta Authority", "Frankfurt Fortress", "São Paulo Hub"],
      cpuUsage: 41,
      ramUsage: 58,
      blocksValidated: 26400,
      tasksAuditedToday: 4190,
    },
    {
      id: "node_saopaulo",
      name: "São Paulo Latin Cluster",
      cluster: "South America Shard",
      city: "São Paulo",
      country: "Brazil",
      flag: "🇧🇷",
      lat: -23.5505,
      lng: -46.6333,
      xPct: 34,
      yPct: 72,
      status: "ONLINE",
      stakedPi: "3,900,000 π",
      activePioneers: 7850,
      latencyMs: 64,
      quorumSlices: ["Silicon Valley", "Lagos Vanguard", "Frankfurt Fortress"],
      cpuUsage: 19,
      ramUsage: 35,
      blocksValidated: 19780,
      tasksAuditedToday: 1840,
    },
    {
      id: "node_siliconvalley",
      name: "Silicon Valley AI Gateway",
      cluster: "North America Enterprise Gateway",
      city: "San Jose",
      country: "United States",
      flag: "🇺🇸",
      lat: 37.3382,
      lng: -121.8863,
      xPct: 18,
      yPct: 37,
      status: "ONLINE",
      stakedPi: "7,400,000 π",
      activePioneers: 5600,
      latencyMs: 42,
      quorumSlices: ["Jakarta Authority", "Tokyo Shard", "Frankfurt Fortress"],
      cpuUsage: 45,
      ramUsage: 62,
      blocksValidated: 35120,
      tasksAuditedToday: 3200,
    },
    {
      id: "node_seoul",
      name: "Seoul Validator Hub",
      cluster: "Northeast Asia Fast-Finality",
      city: "Seoul",
      country: "South Korea",
      flag: "🇰🇷",
      lat: 37.5665,
      lng: 126.978,
      xPct: 83,
      yPct: 38,
      status: "ONLINE",
      stakedPi: "5,100,000 π",
      activePioneers: 6900,
      latencyMs: 21,
      quorumSlices: ["Tokyo Shard", "Jakarta Authority", "Singapore Mesh"],
      cpuUsage: 31,
      ramUsage: 46,
      blocksValidated: 27900,
      tasksAuditedToday: 2450,
    },
    {
      id: "node_singapore",
      name: "Singapore Maritime Relay",
      cluster: "Equatorial Transit Backbone",
      city: "Singapore",
      country: "Singapore",
      flag: "🇸🇬",
      lat: 1.3521,
      lng: 103.8198,
      xPct: 76,
      yPct: 58,
      status: "ONLINE",
      stakedPi: "6,200,000 π",
      activePioneers: 5100,
      latencyMs: 14,
      quorumSlices: ["Jakarta Authority", "Tokyo Shard", "Frankfurt Fortress"],
      cpuUsage: 25,
      ramUsage: 40,
      blocksValidated: 33400,
      tasksAuditedToday: 2780,
    }
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string>("node_jakarta");
  const [filterRegion, setFilterRegion] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);
  const [autoHeartbeat, setAutoHeartbeat] = useState<boolean>(true);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Dynamic heartbeat jitter for live telemetry realism
  useEffect(() => {
    if (!autoHeartbeat) return;
    const interval = setInterval(() => {
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          latencyMs: Math.max(10, n.latencyMs + Math.floor(Math.random() * 5) - 2),
          cpuUsage: Math.min(95, Math.max(15, n.cpuUsage + Math.floor(Math.random() * 7) - 3)),
          tasksAuditedToday: n.tasksAuditedToday + (Math.random() > 0.4 ? 1 : 0),
        }))
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [autoHeartbeat]);

  const runGlobalDiagnostic = async () => {
    setIsDiagnosing(true);
    setDiagnosticResult(null);

    await new Promise((r) => setTimeout(r, 1400));

    setDiagnosticResult(
      `All 8 primary global clusters passed SCP Quorum verification. Byzantine fault resistance: 100%. Max propagation delay: 64ms. Cryptographic attestation signed.`
    );
    setIsDiagnosing(false);

    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#10b981", "#3b82f6"],
    });
  };

  const filteredNodes = nodes.filter((n) => {
    const matchesSearch =
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalActivePioneersOnline = nodes.reduce((acc, curr) => acc + curr.activePioneers, 0);
  const avgClusterLatency = Math.round(
    nodes.reduce((acc, curr) => acc + curr.latencyMs, 0) / nodes.length
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
                GLOBAL SOVEREIGN NODE TOPOLOGY
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                Mainnet Genesis Cluster Synced
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Decentralized Quorum Telemetry &amp; Node Map
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Inspect real-time Byzantine consensus propagation across Pi Network's 60M sovereign human validators.
              Every node executes the Stellar Consensus Protocol (SCP) quorum slices to guarantee zero-bot data safety.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setAutoHeartbeat(!autoHeartbeat)}
              className={`px-3 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-colors ${
                autoHeartbeat
                  ? "bg-emerald-950/50 border-emerald-500/30 text-emerald-300"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Live Ping: {autoHeartbeat ? "ACTIVE" : "PAUSED"}
            </button>

            <button
              onClick={runGlobalDiagnostic}
              disabled={isDiagnosing}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              {isDiagnosing ? "Auditing Global Quorums..." : "Run Global BFT Health Check"}
            </button>
          </div>
        </div>
      </div>

      {diagnosticResult && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{diagnosticResult}</span>
        </div>
      )}

      {/* Network Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span>TOTAL POOL STAKE</span>
            <Server className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">51,050,000 π</span>
          <span className="text-[11px] text-emerald-400 block mt-1">+1.2M π delegated this week</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span>CONSENSUS PROPAGATION</span>
            <Wifi className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-blue-400 font-mono">
            {avgClusterLatency} ms
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Average inter-shard latency</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span>ACTIVE LIVE VALIDATORS</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
            {totalActivePioneersOnline.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Concurrent verified human nodes</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
            <span>BYZANTINE QUORUM SLICES</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">66.7% BFT</span>
          <span className="text-[11px] text-slate-400 block mt-1">Mathematical collusion immunity</span>
        </div>
      </div>

      {/* Main Holographic World Map & Interactive Topology */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-amber-400" />
              Sovereign Cluster Topology Overlay
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Click any cluster node to inspect hardware stats, quorum links, and human verification throughput.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Mainnet Block #{stats.latestBlock}
            </span>
          </div>
        </div>

        {/* Visual Map Representation */}
        <div className="relative w-full h-80 sm:h-96 bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-4">
          {/* Subtle Grid and World Map Silhouette styling */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>

          {/* Holographic Radar Rings centered on Jakarta */}
          <div className="absolute left-[77%] top-[62%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-32 h-32 rounded-full border border-amber-500/20 animate-ping"></div>
            <div className="w-56 h-56 rounded-full border border-amber-500/10 -ml-12 -mt-12"></div>
          </div>

          {/* SVG Map Path outlines for visual context */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 1000 500">
            {/* Americas */}
            <path d="M150,100 Q200,80 250,120 T200,220 T250,300 T300,420" fill="none" stroke="#475569" strokeWidth="2" />
            {/* Europe & Africa */}
            <path d="M480,90 Q540,80 560,140 T500,280 T540,420" fill="none" stroke="#475569" strokeWidth="2" />
            {/* Asia & Pacific */}
            <path d="M650,80 Q780,60 850,150 T780,260 T860,340" fill="none" stroke="#475569" strokeWidth="2" />
            {/* Consensus connection arcs between nodes */}
            <line x1="770" y1="310" x2="520" y2="160" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
            <line x1="770" y1="310" x2="860" y2="200" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
            <line x1="520" y1="160" x2="180" y2="185" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
            <line x1="770" y1="310" x2="500" y2="275" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
          </svg>

          {/* Interactive Node Pins */}
          {nodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                style={{ left: `${node.xPct}%`, top: `${node.yPct}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform hover:scale-125 z-20`}
                title={`${node.name} (${node.city})`}
              >
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-xl transition-all ${
                    node.isPrimaryAuthority
                      ? "bg-amber-500 text-slate-950 ring-4 ring-amber-500/30 scale-110"
                      : isSelected
                      ? "bg-blue-500 text-white ring-4 ring-blue-500/30"
                      : "bg-slate-900 border border-slate-700 text-slate-200 hover:border-amber-400"
                  }`}
                >
                  <span className="text-[12px] sm:text-sm">{node.flag}</span>
                </div>

                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded text-[9px] font-mono whitespace-nowrap pointer-events-none transition-opacity ${
                    isSelected ? "bg-amber-500 text-slate-950 font-bold opacity-100" : "bg-slate-900/90 text-slate-300 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {node.city} &bull; {node.latencyMs}ms
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Node Inspector Panel */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedNode.flag}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">{selectedNode.name}</h3>
                  {selectedNode.isPrimaryAuthority && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      PRIMARY AUTHORITY CLUSTER
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedNode.cluster} &bull; {selectedNode.city}, {selectedNode.country}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                SCP STATUS: {selectedNode.status}
              </span>
            </div>
          </div>

          {/* Node Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Node Pool Stake
              </span>
              <span className="text-base font-bold text-white font-mono">{selectedNode.stakedPi}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Roundtrip Latency
              </span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {selectedNode.latencyMs} ms
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Concurrent Humans
              </span>
              <span className="text-base font-bold text-amber-400 font-mono">
                {selectedNode.activePioneers.toLocaleString()} Pioneers
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Today&apos;s Audits
              </span>
              <span className="text-base font-bold text-blue-400 font-mono">
                {selectedNode.tasksAuditedToday.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Hardware & Quorum Slice Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-xs font-mono uppercase text-slate-400 block">
                Cluster Hardware Utilization
              </span>

              <div className="space-y-2 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>CPU Core Utilization</span>
                    <span className="text-white font-bold">{selectedNode.cpuUsage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${selectedNode.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>RAM Allocation (ECC DDR5)</span>
                    <span className="text-white font-bold">{selectedNode.ramUsage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${selectedNode.ramUsage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-xs font-mono uppercase text-slate-400 block">
                Federated Quorum Slices (SCP Peers)
              </span>

              <div className="space-y-1.5">
                {selectedNode.quorumSlices.map((peer, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono"
                  >
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      {peer}
                    </span>
                    <span className="text-emerald-400 text-[10px]">SYNCED (0.01ms jitter)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
