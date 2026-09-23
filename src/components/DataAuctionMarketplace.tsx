import React, { useState } from "react";
import {
  Coins,
  Database,
  Tag,
  CheckCircle2,
  TrendingUp,
  FileCheck2,
  Lock,
  Layers,
  Sparkles,
  ArrowUpRight,
  Download,
  Users
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface DataAuctionMarketplaceProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

interface DatasetListing {
  id: string;
  title: string;
  domain: string;
  totalPairs: number;
  participatingPioneers: number;
  highestBidPi: number;
  highestBidUsd: number;
  leadingBidder: string;
  qualityScore: number; // 0 - 100
  pioneerDividendPoolPi: number;
  ipfsCid: string;
}

export const DataAuctionMarketplace: React.FC<DataAuctionMarketplaceProps> = ({
  pioneer,
  stats,
  onRewardClaim,
}) => {
  const [datasets, setDatasets] = useState<DatasetListing[]>([
    {
      id: "dataset_culture_180",
      title: "Global 180-Dialect Cultural Nuance RLHF",
      domain: "Linguistics & Regional Safety",
      totalPairs: 250000,
      participatingPioneers: 14200,
      highestBidPi: 12500,
      highestBidUsd: 25000,
      leadingBidder: "Mistral European AI Lab",
      qualityScore: 99.4,
      pioneerDividendPoolPi: 10625,
      ipfsCid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    },
    {
      id: "dataset_med_clinical",
      title: "Clinical Patient Triage DPO Preference Pairs",
      domain: "Healthcare & Pharmacology",
      totalPairs: 85000,
      participatingPioneers: 6800,
      highestBidPi: 18400,
      highestBidUsd: 36800,
      leadingBidder: "DeepMind Health Research",
      qualityScore: 99.8,
      pioneerDividendPoolPi: 15640,
      ipfsCid: "QmZtmD2qt8fJpq3CLDHcgDZ5nU12M8a26qN6LZA4a7x5cT",
    },
    {
      id: "dataset_legal_audit",
      title: "Cross-Jurisdictional EU AI Act Compliance Pairs",
      domain: "Legal & Regulatory Oversight",
      totalPairs: 110000,
      participatingPioneers: 8900,
      highestBidPi: 9800,
      highestBidUsd: 19600,
      leadingBidder: "Allianz Global Corporate",
      qualityScore: 98.9,
      pioneerDividendPoolPi: 8330,
      ipfsCid: "QmV8cfL7gD3kM9a21qZ4b7w8e6t5y4u3i2o1p0a9s8d7f",
    },
  ]);

  const [selectedDataset, setSelectedDataset] = useState<DatasetListing>(datasets[0]);
  const [isBidding, setIsBidding] = useState(false);
  const [bidNotice, setBidNotice] = useState<string | null>(null);

  const handlePlaceBid = async () => {
    setIsBidding(true);
    await new Promise((r) => setTimeout(r, 1100));

    const incrementPi = 500;
    setDatasets((prev) =>
      prev.map((d) => {
        if (d.id === selectedDataset.id) {
          return {
            ...d,
            highestBidPi: d.highestBidPi + incrementPi,
            highestBidUsd: (d.highestBidPi + incrementPi) * 2,
            leadingBidder: `@${pioneer.username} Syndicate`,
            pioneerDividendPoolPi: Math.round((d.highestBidPi + incrementPi) * 0.85),
          };
        }
        return d;
      })
    );

    setIsBidding(false);
    setBidNotice(
      `New high bid placed on "${selectedDataset.title}"! 85% dividend pool updated for participating Pioneers. +2.0 π dividend credit received.`
    );

    if (onRewardClaim) {
      onRewardClaim(2.0);
    }

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#10b981", "#6366f1"],
    });

    setTimeout(() => setBidNotice(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Database className="w-3 h-3 text-amber-400" />
                RLHF &bull; DPO DATASET AUCTION MARKETPLACE
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                85% Perpetual Royalties to Pioneers
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Human-Labeled Preference Data Auction &amp; Dividends
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Turn human labelers into perpetual equity holders. AI laboratories license verified preference
              datasets, and 85% of licensing fees stream automatically to Pioneers' Pi Wallets forever.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Dividends Distributed</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">34,595 π</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">29,900 Pioneers Benefiting</span>
          </div>
        </div>
      </div>

      {bidNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{bidNotice}</span>
        </div>
      )}

      {/* Main Grid: Listings & Auction Bid Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Dataset Cards */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              Active High-Value RLHF Data Auctions
            </span>
            <span className="text-xs text-slate-400 font-mono">Live Bidding</span>
          </div>

          <div className="space-y-3">
            {datasets.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedDataset(d)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedDataset.id === d.id
                    ? "bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">{d.title}</span>
                    <span className="text-[11px] text-amber-400 font-mono">{d.domain}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">
                      {d.highestBidPi.toLocaleString()} π
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">(${d.highestBidUsd.toLocaleString()} USD)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                  <span>{d.totalPairs.toLocaleString()} Pairs</span>
                  <span>{d.participatingPioneers.toLocaleString()} Pioneers</span>
                  <span className="text-emerald-400">Quality: {d.qualityScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Auction Bid & License Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5">
            <div className="pb-3 border-b border-slate-800">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                Leading Bidder: {selectedDataset.leadingBidder}
              </span>
              <h2 className="text-base font-bold text-white mt-1">{selectedDataset.title}</h2>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Current Top Bid:</span>
                <span className="text-amber-400 font-bold">{selectedDataset.highestBidPi.toLocaleString()} π</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Pioneer Royalty Pool (85%):</span>
                <span className="text-emerald-400 font-bold">{selectedDataset.pioneerDividendPoolPi.toLocaleString()} π</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase block">Decentralized Storage Hash</span>
                <span className="text-[11px] text-slate-300 break-all">{selectedDataset.ipfsCid}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceBid}
              disabled={isBidding}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              {isBidding
                ? "Submitting Bid & Updating Dividend..."
                : `Place Outbid (+500 π) & Claim +2.0 π Dividend`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
