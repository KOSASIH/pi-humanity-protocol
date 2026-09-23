import React from "react";
import { 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Terminal, 
  Coins, 
  Award, 
  CheckCircle2, 
  Smartphone,
  Building2,
  Activity,
  Layers,
  ShieldAlert,
  Scale,
  Globe2,
  EyeOff,
  Flame,
  Sparkles,
  Video,
  Bot,
  Brain,
  Languages,
  Vote,
  Database,
  Network,
  CreditCard,
  KeyRound,
  Trophy,
  Users,
  Server,
  Gavel
} from "lucide-react";
import { PioneerUser, TabType } from "../types";

interface HeaderProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  pioneer: PioneerUser;
  isPiBrowser: boolean;
  onClaimPayout?: () => void;
  isClaiming?: boolean;
  onSignIn?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  pioneer,
  isPiBrowser,
  onClaimPayout,
  isClaiming,
  onSignIn,
}) => {
  const navTabs: { id: TabType; label: string; icon: React.ReactNode; categoryColor?: string }[] = [
    { id: "pioneer", label: "Pioneer Earner", icon: <Smartphone className="w-3.5 h-3.5" /> },
    { id: "fiat_engine", label: "Stripe for AI", icon: <CreditCard className="w-3.5 h-3.5 text-indigo-400" />, categoryColor: "indigo" },
    { id: "app_studio_hub", label: "App Studio Hub", icon: <KeyRound className="w-3.5 h-3.5 text-emerald-400" />, categoryColor: "emerald" },
    { id: "model_benchmarks", label: "Model Arena", icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />, categoryColor: "amber" },
    { id: "security_mesh", label: "Security Mesh", icon: <Users className="w-3.5 h-3.5 text-teal-400" />, categoryColor: "teal" },
    { id: "edge_node", label: "Edge Node", icon: <Server className="w-3.5 h-3.5 text-blue-400" />, categoryColor: "blue" },
    { id: "insurance_vault", label: "AI Insurance", icon: <Gavel className="w-3.5 h-3.5 text-rose-400" />, categoryColor: "rose" },
    { id: "company", label: "AI Portal", icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: "oracle", label: "Truth Oracle", icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" />, categoryColor: "indigo" },
    { id: "forensics", label: "Deepfake Lab", icon: <Video className="w-3.5 h-3.5 text-cyan-400" />, categoryColor: "cyan" },
    { id: "guardian", label: "Agent Guard", icon: <Bot className="w-3.5 h-3.5 text-emerald-400" />, categoryColor: "emerald" },
    { id: "rlhf_studio", label: "RLHF Studio", icon: <Brain className="w-3.5 h-3.5 text-blue-400" />, categoryColor: "blue" },
    { id: "cultural_matrix", label: "Cultural Matrix", icon: <Languages className="w-3.5 h-3.5 text-teal-400" />, categoryColor: "teal" },
    { id: "distillery", label: "Data Distillery", icon: <Database className="w-3.5 h-3.5 text-amber-400" />, categoryColor: "amber" },
    { id: "enclave", label: "TEE Enclave", icon: <Cpu className="w-3.5 h-3.5 text-indigo-400" />, categoryColor: "indigo" },
    { id: "bridge", label: "Omni Bridge", icon: <Network className="w-3.5 h-3.5 text-sky-400" />, categoryColor: "sky" },
    { id: "red_teaming", label: "Red Team", icon: <Flame className="w-3.5 h-3.5 text-rose-400" />, categoryColor: "rose" },
    { id: "zk_proof", label: "zk-SNARK", icon: <EyeOff className="w-3.5 h-3.5 text-purple-400" />, categoryColor: "purple" },
    { id: "staking", label: "BFT Staking", icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> },
    { id: "governance", label: "DAO Gov", icon: <Vote className="w-3.5 h-3.5 text-amber-400" /> },
    { id: "telemetry", label: "Node Map", icon: <Globe2 className="w-3.5 h-3.5 text-teal-400" /> },
    { id: "compliance", label: "EU AI Act", icon: <Scale className="w-3.5 h-3.5 text-blue-400" /> },
    { id: "god_console", label: "God Console", icon: <Activity className="w-3.5 h-3.5 text-yellow-400" /> },
    { id: "explorer", label: "Explorer", icon: <Layers className="w-3.5 h-3.5 text-slate-400" /> },
    { id: "api", label: "API Sandbox", icon: <Terminal className="w-3.5 h-3.5 text-slate-400" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Top Bar: Brand, Status, and Pioneer Wallet */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand & Domain */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/30 shrink-0">
              <span className="text-xl font-extrabold text-slate-950">π</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                  HUMANITY PROTOCOL <span className="text-amber-400">LAYER</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  humanitylayer.pinet.com
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Stripe for Human Intelligence on Pi &bull; 60M Verified Humans
              </p>
            </div>
          </div>

          {/* Pioneer Status & Balance */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* KYC Pill / Sign-in */}
            <button
              onClick={onSignIn}
              title="Pi Network Authenticated via App Studio. Click to re-verify identity."
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-xs transition-colors cursor-pointer text-left"
            >
              <span className="text-base" title={pioneer.country}>{pioneer.countryFlag}</span>
              <div className="flex flex-col">
                <span className="text-slate-200 font-mono text-[11px] font-semibold">@{pioneer.username}</span>
                {pioneer.name && (
                  <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider -mt-0.5">
                    {pioneer.isFounder ? "Founder" : pioneer.name}
                  </span>
                )}
              </div>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Pi Auth
              </span>
            </button>

            {/* Trust Score */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 leading-none">Trust</span>
                <span className="font-bold text-amber-400 text-xs leading-tight">{pioneer.trustScore}/100</span>
              </div>
            </div>

            {/* Pi Balance */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs">
                π
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 leading-none">Earned</span>
                <span className="font-bold text-amber-300 text-xs leading-tight">
                  {pioneer.piEarned.toFixed(1)} <span className="text-[10px]">Pi</span>
                </span>
              </div>
            </div>

            {/* Claim button if unpaid balance exists */}
            {pioneer.unpaidPiBalance > 0 && onClaimPayout && (
              <button
                onClick={onClaimPayout}
                disabled={isClaiming}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer"
                title="Release verified consensus payout to Pi Wallet"
              >
                <Coins className="w-3.5 h-3.5" />
                {isClaiming ? "Settling..." : `Claim ${pioneer.unpaidPiBalance.toFixed(1)} π`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Protocol Full-Suite Segmented Navigation Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar scroll-smooth">
            {navTabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-${tab.id}-tab`}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                      : "text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800"
                  }`}
                >
                  <span className={isActive ? "text-slate-950" : ""}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
