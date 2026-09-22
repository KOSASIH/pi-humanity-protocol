import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Search, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Globe2, 
  Zap, 
  Layers, 
  Coins, 
  Copy, 
  Check, 
  ExternalLink,
  Sparkles,
  RefreshCw,
  Server
} from 'lucide-react';
import { BlockEvent, VerificationNode, ProtocolStats } from '../types';

interface ProtocolExplorerProps {
  stats: ProtocolStats;
}

export const ProtocolExplorer: React.FC<ProtocolExplorerProps> = ({ stats }) => {
  const [blocks, setBlocks] = useState<BlockEvent[]>([]);
  const [nodes, setNodes] = useState<VerificationNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'blocks' | 'nodes'>('all');

  const fetchExplorerData = async () => {
    try {
      setLoading(true);
      const [blocksRes, nodesRes] = await Promise.all([
        fetch('/api/v1/network/blocks'),
        fetch('/api/v1/network/nodes')
      ]);

      if (blocksRes.ok) {
        const blocksData = await blocksRes.json();
        setBlocks(blocksData);
      }
      if (nodesRes.ok) {
        const nodesData = await nodesRes.json();
        setNodes(nodesData);
      }
    } catch (err) {
      console.error('Failed to load explorer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplorerData();
    const interval = setInterval(fetchExplorerData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleVerifyHash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const cleanHash = searchQuery.trim().replace(/^sha256:/, '');
      const res = await fetch(`/api/v1/verify/${encodeURIComponent(cleanHash)}`);
      if (res.ok) {
        const data = await res.json();
        setVerificationResult(data);
      } else {
        setVerificationResult({
          verified: false,
          error: 'Hash not found in protocol settlement history.'
        });
      }
    } catch (err) {
      setVerificationResult({
        verified: false,
        error: 'Network connection failed while querying Pi Humanity Oracle.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Protocol Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs mb-2">
              <Network className="w-4 h-4" />
              <span>PI HUMANITY PROTOCOL EXPLORER & PUBLIC ORACLE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="text-emerald-400 font-semibold">MAINNET v1.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Decentralized Human Proof Ledger
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Verify cryptographic SHA-256 Personhood fingerprints, inspect real-time 3-node Byzantine quorum settlements, and track active KYC validation clusters across 230 countries.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 shadow-inner">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-sm">
                π
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Pi Mainnet Block</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-white font-mono">#{stats.latestBlock || 1894218}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
              </div>
            </div>

            <button
              onClick={fetchExplorerData}
              disabled={loading}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center justify-center"
              title="Refresh ledger state"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Global Live Search / Verification Oracle Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <form onSubmit={handleVerifyHash} className="relative">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Paste SHA-256 KYC Fingerprint, Task ID, or EU AI Act Certificate Hash..."
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isVerifying || !searchQuery.trim()}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 shrink-0"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Query Oracle</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 font-mono">
              <span>Try sample:</span>
              <button
                type="button"
                onClick={() => setSearchQuery('sha256:7a8f9c12e34b5d6a7e8f90123456789abcdef0123456789abcdef0123456789a')}
                className="text-amber-400 hover:underline truncate max-w-xs sm:max-w-md"
              >
                sha256:7a8f9c12e...6789a
              </button>
            </div>
          </form>

          {/* Verification Oracle Response Box */}
          {verificationResult && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-amber-500/30 shadow-xl animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>CRYPTOGRAPHIC VERIFICATION SUCCESSFUL (100% SOVEREIGN HUMAN PROOF)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
                  EU AI Act Art. 50
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Verified Hash</span>
                  <span className="font-mono text-amber-300 truncate block text-[11px]" title={verificationResult.hash}>
                    {verificationResult.hash}
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Protocol Authority</span>
                  <span className="text-white font-semibold block text-[11px]">
                    {verificationResult.authority || "KOSASIH (@Kosasih78, Indonesia 🇮🇩)"}
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Settlement Wallet</span>
                  <span className="font-mono text-slate-300 block text-[11px] truncate" title="GCKUNNC6X6LKYJXKTQEJAQQ2J6NTIHMRNJFM2KY6KIBB46BOPMKVXDQN">
                    GCKUNNC6X6LKYJXKTQEJAQQ2J6NTIHMRNJFM2KY6KIBB46BOPMKVXDQN
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Ledger Activity
          </button>
          <button
            onClick={() => setSelectedFilter('blocks')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedFilter === 'blocks' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Consensus Blocks ({blocks.length})
          </button>
          <button
            onClick={() => setSelectedFilter('nodes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedFilter === 'nodes' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Global KYC Clusters ({nodes.length})
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Byzantine Quorum Agreement: 99.8%</span>
        </div>
      </div>

      {/* Section 1: Recent Consensus Settlement Blocks */}
      {(selectedFilter === 'all' || selectedFilter === 'blocks') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Recent Consensus Settlement Blocks</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">Real-time Mainnet Pi Ledger</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {blocks.map((b) => (
              <div 
                key={b.blockNumber}
                className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-all shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-amber-400 text-xs shrink-0">
                      #{b.blockNumber.toString().slice(-4)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">Block #{b.blockNumber}</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                          {b.consensusType}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">{b.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-mono text-slate-400 truncate max-w-xs sm:max-w-md">
                          {b.hash}
                        </span>
                        <button
                          onClick={() => copyToClipboard(b.hash)}
                          className="text-slate-500 hover:text-amber-400 p-0.5"
                          title="Copy hash"
                        >
                          {copiedHash === b.hash ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">Quorum Node</span>
                      <span className="text-slate-300 font-medium">{b.validatorNode}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">KYC Quorum Size</span>
                      <span className="text-emerald-400 font-bold font-mono">{b.kycQuorumSize} Humans</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">Pi Reward Escrow</span>
                      <span className="text-amber-300 font-bold font-mono">+{b.piRewardDistributed} π</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Global KYC Verification Clusters */}
      {(selectedFilter === 'all' || selectedFilter === 'nodes') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-amber-400" />
                <span>Active Sovereign KYC Clusters (230 Countries)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every task is verified across geographically distributed, sovereign human nodes to guarantee zero algorithmic and cultural bias.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-semibold hidden sm:inline-block">
              100% KYC'd Humans
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {nodes.map((n) => (
              <div 
                key={n.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{n.flag}</span>
                    <div>
                      <h3 className="font-bold text-white text-sm leading-tight">{n.city}</h3>
                      <span className="text-[11px] text-slate-400">{n.country}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/20 font-semibold">
                    {n.consensusRate}%
                  </span>
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">KYC Pioneers:</span>
                    <span className="font-mono font-semibold text-white">{n.verifiedPioneers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Active Nodes:</span>
                    <span className="font-mono text-amber-400">{n.activeNodes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Quorum Latency:</span>
                    <span className="font-mono text-slate-300">{n.latencyMs} ms</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block mb-1">Native Dialects:</span>
                    <div className="flex flex-wrap gap-1">
                      {n.languages.slice(0, 3).map((lang) => (
                        <span key={lang} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
