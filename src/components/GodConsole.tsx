import React from "react";
import { 
  Globe, 
  Users, 
  DollarSign, 
  Coins, 
  ShieldCheck, 
  Lock, 
  Activity, 
  Layers, 
  Zap,
  TrendingUp,
  MapPin,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { ProtocolStats } from "../types";

interface GodConsoleProps {
  stats: ProtocolStats;
}

export const GodConsole: React.FC<GodConsoleProps> = ({ stats }) => {
  // Global nodes for the visual map
  const activeNodes = [
    { city: "Lagos", country: "Nigeria", flag: "🇳🇬", lat: 6.5, lng: 3.3, x: "51%", y: "55%", count: "4.8M" },
    { city: "Mumbai", country: "India", flag: "🇮🇳", lat: 19.0, lng: 72.8, x: "68%", y: "48%", count: "12.4M" },
    { city: "Jakarta", country: "Indonesia", flag: "🇮🇩", lat: -6.2, lng: 106.8, x: "78%", y: "60%", count: "7.1M" },
    { city: "São Paulo", country: "Brazil", flag: "🇧🇷", lat: -23.5, lng: -46.6, x: "35%", y: "72%", count: "5.2M" },
    { city: "Hanoi", country: "Vietnam", flag: "🇻🇳", lat: 21.0, lng: 105.8, x: "76%", y: "50%", count: "3.9M" },
    { city: "Manila", country: "Philippines", flag: "🇵🇭", lat: 14.5, lng: 121.0, x: "82%", y: "52%", count: "4.1M" },
    { city: "New York", country: "USA", flag: "🇺🇸", lat: 40.7, lng: -74.0, x: "28%", y: "38%", count: "2.8M" },
    { city: "Paris", country: "France", flag: "🇫🇷", lat: 48.8, lng: 2.3, x: "49%", y: "35%", count: "1.9M" },
    { city: "Nairobi", country: "Kenya", flag: "🇰🇪", lat: -1.2, lng: 36.8, x: "57%", y: "58%", count: "2.4M" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs mb-1">
            <Activity className="w-4 h-4 animate-pulse" />
            PROTOCOL GOD CONSOLE • FOUNDER COMMAND CENTER
          </div>
          <h1 className="text-2xl font-black text-white">Global Human Intelligence Telemetry</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time consensus verification stream across 230 countries on Pi Network Mainnet.
          </p>
        </div>

        {/* Founder & Status Credentials */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs">
            <span className="text-xl">🇮🇩</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-mono text-[10px]">FOUNDER:</span>
                <span className="text-white font-bold font-mono">KOSASIH</span>
                <span className="text-amber-400 font-mono text-[11px]">(@Kosasih78)</span>
              </div>
              <div className="font-mono text-[10px] text-slate-500 truncate max-w-[220px]" title="GCKUNNC6X6LKYJXKTQEJAQQ2J6NTIHMRNJFM2KY6KIBB46BOPMKVXDQN">
                Wallet: GCKUNN...KVXDQN
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Anti-Sybil Consensus Live
          </div>
        </div>
      </div>

      {/* Core Protocol Vital Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Verified Human Moat</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            60,482,190
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> 5x Larger than Worldcoin
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Tasks Processed Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {(stats.tasksToday / 1000000).toFixed(2)}M
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Avg 4.8s consensus / item
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Revenue Today (USD)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
            ${stats.revenueTodayUsd.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            20% Protocol Treasury Take Rate
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Pi Distributed to Workers</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
            {stats.piDistributed.toLocaleString()} <span className="text-lg">π</span>
          </div>
          <p className="text-[11px] text-amber-400/80 mt-2 font-mono">
            {stats.escrowLockedPi.toLocaleString()} π in App Escrow
          </p>
        </div>
      </div>

      {/* Protocol Staking, BFT & Oracle Telemetry Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-sm">
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Active Staking Pool</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-white text-sm">
                {((stats.totalStakedPi || 28450000) / 1000000).toFixed(1)}M π Staked
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">APY 14.2%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Byzantine Tolerance</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-white text-sm">
                {stats.byzantineToleranceRatio || 99.94}% Quorum
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Zero Sybils</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-sm">
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Mainnet Sync State</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-white text-sm">Block #{stats.latestBlock}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                100% HEALTHY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Map & Live Working Pings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive World Map Canvas Container */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400" />
                Active Pioneer KYC Nodes Across 230 Countries
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pioneers in Nigeria, India, Indonesia, Brazil, Vietnam, US active right now
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {stats.activeWorkersOnline.toLocaleString()} Online
            </span>
          </div>

          {/* Stylized Geo Node Map View */}
          <div className="relative w-full h-64 sm:h-80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            {/* World grid background lines */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Simulated World Silhouette Outlines */}
            <div className="absolute inset-4 rounded-lg border border-dashed border-slate-800/60 pointer-events-none flex items-center justify-center">
              <span className="text-[10px] font-mono text-slate-600 tracking-widest uppercase">
                LAT/LNG HIGH-DENSITY VERIFIED KYCS
              </span>
            </div>

            {/* Pulsing City Nodes */}
            {activeNodes.map((node) => (
              <div
                key={node.city}
                style={{ left: node.x, top: node.y }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                {/* Ping ring */}
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-ping opacity-60 absolute inset-0"></div>
                <div className="relative w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-slate-950 shadow-md shadow-amber-500/50 flex items-center justify-center"></div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-20 whitespace-nowrap bg-slate-900 border border-amber-500/30 px-2.5 py-1 rounded-lg text-[11px] shadow-xl">
                  <span className="font-bold text-white flex items-center gap-1">
                    <span>{node.flag}</span> {node.city}, {node.country}
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono">{node.count} KYC Humans</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 pt-3 border-t border-slate-800/60">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Pioneer Workers
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              Sub-second latency via Pi Browser WebRTC + HTTP mesh
            </span>
          </div>
        </div>

        {/* Live Activity Stream */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Live Consensus Feed
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Live</span>
            </div>

            <div className="space-y-3">
              {stats.liveActivityPings.map((ping) => (
                <div
                  key={ping.id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-xs flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-lg leading-none mt-0.5">{ping.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-white font-medium">{ping.pioneer}</span>
                        <span className="text-[10px] text-slate-500">{ping.country}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{ping.action}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-amber-400 font-bold text-xs block">
                      +{ping.rewardPi} π
                    </span>
                    <span className="text-[10px] text-slate-500">{ping.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 text-center">
            <span className="text-[11px] text-slate-400 font-mono">
              Consensus engine: 2/3 agreement finalized at block level
            </span>
          </div>
        </div>
      </div>

      {/* 5 Moats Breakdown - Why Impossible to Copy */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="mb-6">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block mb-1">
            Unfair Competitive Moats
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Why Pi Humanity Protocol Is Impossible To Replicate
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-mono text-xs font-bold">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">1</span>
              DATA MOAT: 60M KYC HUMANS
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Worldcoin has 12M iris scans. Pi has 60 Million real government-verified KYC humans. A Silicon Valley competitor would need 6+ years and $500M+ to replicate this human workforce.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-mono text-xs font-bold">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">2</span>
              TRUST MOAT: EU AI ACT COMPLIANCE
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Under the EU AI Act and US Frontier Model commitments, anonymous crowd workers are a legal compliance liability. Pi KYC provides sovereign cryptographic personhood proof with zero liability.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-mono text-xs font-bold">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">3</span>
              NETWORK MOAT: 230 COUNTRIES
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scale AI and Mechanical Turk are heavily English-skewed. Pioneers speak 100+ native mother tongues (Yoruba, Hindi, Tagalog, Vietnamese, Portuguese, Arabic) with true cultural nuance.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-mono text-xs font-bold">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">4</span>
              ZERO CAC DISTRIBUTION MOAT
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              60M Pioneers are already inside Pi Browser on their smartphones. No paid user acquisition ads required. Customer acquisition cost for human intelligence is mathematically $0.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-mono text-xs font-bold">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">5</span>
              TECH & MONEY MACHINE: FIAT IN, PI OUT
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stripe model: Company pays $1,000 USD fiat for 1,000 checks. 800 Pi is settled to workers and 200 Pi (20%) is kept by the treasury. This creates endless fiat liquidity regardless of market Pi price fluctuations—because AI companies urgently need verified humans.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
