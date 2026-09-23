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
  Flame
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
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand & Domain */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/30">
              <span className="text-xl font-extrabold text-slate-950">π</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                  PI HUMANITY <span className="text-amber-400">PROTOCOL</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  humanity.pi
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                60M Verified Humans Powering Every AI
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              id="nav-pioneer-tab"
              onClick={() => setCurrentTab("pioneer")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === "pioneer"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Pioneer Earner
            </button>

            <button
              id="nav-company-tab"
              onClick={() => setCurrentTab("company")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === "company"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              AI Company Portal
            </button>

            <button
              id="nav-god-console-tab"
              onClick={() => setCurrentTab("god_console")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === "god_console"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              God Console
            </button>

            <button
              id="nav-explorer-tab"
              onClick={() => setCurrentTab("explorer")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === "explorer"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Explorer
            </button>

            <button
              id="nav-telemetry-tab"
              onClick={() => setCurrentTab("telemetry")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === "telemetry"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              Node Map
            </button>

            <button
              id="nav-zk-tab"
              onClick={() => setCurrentTab("zk_proof")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === "zk_proof"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              zk-SNARK
            </button>

            <button
              id="nav-redteam-tab"
              onClick={() => setCurrentTab("red_teaming")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === "red_teaming"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Red Team
            </button>

            <button
              id="nav-staking-tab"
              onClick={() => setCurrentTab("staking")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === "staking"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              BFT Staking
            </button>

            <button
              id="nav-compliance-tab"
              onClick={() => setCurrentTab("compliance")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === "compliance"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              EU AI Act
            </button>

            <button
              id="nav-api-tab"
              onClick={() => setCurrentTab("api")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === "api"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              API
            </button>
          </nav>

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
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-emerald-600/20"
                title="Release verified consensus payout to Pi Wallet"
              >
                <Coins className="w-3.5 h-3.5" />
                {isClaiming ? "Settling..." : `Claim ${pioneer.unpaidPiBalance.toFixed(1)} π`}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/60 no-scrollbar">
          <button
            onClick={() => setCurrentTab("pioneer")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              currentTab === "pioneer" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Earner App
          </button>
          <button
            onClick={() => setCurrentTab("company")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              currentTab === "company" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Company API
          </button>
          <button
            onClick={() => setCurrentTab("god_console")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              currentTab === "god_console" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            God Console
          </button>
          <button
            onClick={() => setCurrentTab("explorer")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              currentTab === "explorer" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Explorer
          </button>
          <button
            onClick={() => setCurrentTab("telemetry")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              currentTab === "telemetry" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            Node Map
          </button>
          <button
            onClick={() => setCurrentTab("zk_proof")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              currentTab === "zk_proof" ? "bg-purple-600 text-white" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            zk-SNARK
          </button>
          <button
            onClick={() => setCurrentTab("red_teaming")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              currentTab === "red_teaming" ? "bg-rose-600 text-white" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Red Team
          </button>
          <button
            onClick={() => setCurrentTab("staking")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              currentTab === "staking" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            BFT Staking
          </button>
          <button
            onClick={() => setCurrentTab("compliance")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              currentTab === "compliance" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            EU AI Act
          </button>
          <button
            onClick={() => setCurrentTab("api")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              currentTab === "api" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            API
          </button>
        </div>
      </div>
    </header>
  );
};
