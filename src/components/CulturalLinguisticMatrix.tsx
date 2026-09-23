import React, { useState } from "react";
import {
  Globe,
  Languages,
  CheckCircle2,
  ThumbsUp,
  Sparkles,
  BookOpen,
  Award,
  Filter,
  Check,
  Compass,
  Layers
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface CulturalLinguisticMatrixProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (piAmount: number) => void;
}

interface LinguisticBenchmarkItem {
  id: string;
  language: string;
  dialectOrRegion: string;
  flag: string;
  culturalContext: string;
  sourcePrompt: string;
  candidateA: {
    text: string;
    fluencyScore: number;
    notes: string;
  };
  candidateB: {
    text: string;
    fluencyScore: number;
    notes: string;
  };
  bountyPi: number;
  votesA: number;
  votesB: number;
}

export const CulturalLinguisticMatrix: React.FC<CulturalLinguisticMatrixProps> = ({
  pioneer,
  stats,
  onRewardClaim,
}) => {
  const [benchmarks, setBenchmarks] = useState<LinguisticBenchmarkItem[]>([
    {
      id: "ling_01",
      language: "Bahasa Indonesia",
      dialectOrRegion: "Jakarta Urban Colloquial (Bahasa Gaul)",
      flag: "🇮🇩",
      culturalContext: "Casual startup peer-to-peer code review discussion",
      sourcePrompt: "Ask your teammate politely if they have pushed their latest branch so you can test it before the sprint demo.",
      candidateA: {
        text: "Halo rekan kerja. Apakah Anda telah mendorong cabang kode terbaru ke repositori terpusat agar saya dapat memverifikasinya?",
        fluencyScore: 6.2,
        notes: "Excessively formal and literal. Sounds like robotic translation; nobody in Jakarta speaks like this casually.",
      },
      candidateB: {
        text: "Bro, branch yang tadi udah lu push ke git belum ya? Mau gue pull bentar buat test sebelum demo sore ini, biar aman.",
        fluencyScore: 9.8,
        notes: "Flawless authentic native phrasing with natural pronouns ('lu/gue') and modern tech slang.",
      },
      bountyPi: 2.4,
      votesA: 2,
      votesB: 48,
    },
    {
      id: "ling_02",
      language: "Tagalog",
      dialectOrRegion: "Metro Manila (Taglish)",
      flag: "🇵🇭",
      culturalContext: "Community neighborhood cooperative meeting",
      sourcePrompt: "Explain that the scheduled street maintenance was postponed to Saturday due to monsoon rain.",
      candidateA: {
        text: "Paunawa sa lahat: Na-move po yung road repair natin to Saturday kasi malakas ang ulan ngayon. Mag-ingat po tayong lahat!",
        fluencyScore: 9.7,
        notes: "Warm, respectful, uses natural Filipino Taglish with appropriate respect particle 'po'.",
      },
      candidateB: {
        text: "Ang pagpapabuti sa daan ay ipinagpaliban sapagkat ang bagyo ay bumabagsak sa kalupaan.",
        fluencyScore: 5.8,
        notes: "Overly archaic Tagalog; sounds like a 19th-century poem rather than everyday community notice.",
      },
      bountyPi: 2.2,
      votesA: 36,
      votesB: 3,
    },
    {
      id: "ling_03",
      language: "Yoruba",
      dialectOrRegion: "Southwestern Nigeria (Lagos Contemporary)",
      flag: "🇳🇬",
      culturalContext: "Greeting an elder artisan before requesting fabric dimensions",
      sourcePrompt: "Respectfully greet an elder tailor in Lagos before asking for the agbada measurements.",
      candidateA: {
        text: "Ẹ kú àárọ̀ mà/bàbá. Ẹ jọ̀ọ́, mo fẹ́ yẹ ìwọ̀n aṣọ agbádá tí ẹ dánwò yẹn wò tí kò bá nira.",
        fluencyScore: 9.9,
        notes: "Exceptional honorific markers (Ẹ kú, bàbá) properly maintaining Yoruba cultural respect for elders.",
      },
      candidateB: {
        text: "Bawo ni. Fun mi ni iwọn agbada mi ni kiakia.",
        fluencyScore: 3.4,
        notes: "Culturally disrespectful; omits essential honorific prefixes when addressing elders in Yoruba society.",
      },
      bountyPi: 3.0,
      votesA: 42,
      votesB: 1,
    },
  ]);

  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>("ling_01");
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>("ALL");
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  const selectedBenchmark =
    benchmarks.find((b) => b.id === selectedBenchmarkId) || benchmarks[0];

  const handleVoteCandidate = (candidate: "A" | "B") => {
    setBenchmarks((prev) =>
      prev.map((b) => {
        if (b.id === selectedBenchmark.id) {
          return {
            ...b,
            votesA: candidate === "A" ? b.votesA + 1 : b.votesA,
            votesB: candidate === "B" ? b.votesB + 1 : b.votesB,
          };
        }
        return b;
      })
    );

    setHasVoted(true);
    if (onRewardClaim) {
      onRewardClaim(selectedBenchmark.bountyPi);
    }

    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#10b981", "#3b82f6", "#f59e0b"],
    });

    setTimeout(() => setHasVoted(false), 3500);
  };

  const filteredBenchmarks =
    selectedLanguageFilter === "ALL"
      ? benchmarks
      : benchmarks.filter((b) => b.language === selectedLanguageFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/20 to-slate-900 border border-teal-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                <Languages className="w-3 h-3 text-teal-400" />
                GLOBAL DIALECT &amp; CULTURAL MATRIX
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                120+ Dialects &bull; 230 Countries
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Multilingual Cultural Alignment Swarm
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Foundation models are heavily biased toward Silicon Valley English. Pi Network's 60M pioneers
              across 230 regions benchmark and calibrate true native linguistic nuance, idioms, and local customs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Dialects Calibrated</span>
            <span className="text-2xl font-extrabold text-teal-400 font-mono">1,840</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Native Human Verified</span>
          </div>
        </div>
      </div>

      {hasVoted && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            Cultural fluency ballot cast! +{selectedBenchmark.bountyPi} π added to your sovereign balance.
          </span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Dialect Queue */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 block flex items-center justify-between">
              <span>Active Dialect Benchmarks</span>
              <span className="text-teal-400">Global Swarm</span>
            </span>

            <div className="space-y-2">
              {filteredBenchmarks.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBenchmarkId(b.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedBenchmarkId === b.id
                      ? "bg-teal-500/10 border-teal-500 text-white shadow-lg shadow-teal-500/10"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200 flex items-center gap-1.5">
                      <span>{b.flag}</span>
                      <span>{b.language}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">+{b.bountyPi} π</span>
                  </div>

                  <span className="text-xs font-bold block text-white line-clamp-1">{b.dialectOrRegion}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5 line-clamp-1">{b.culturalContext}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Inspection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-teal-400 flex items-center gap-1.5">
                  <span className="text-base">{selectedBenchmark.flag}</span>
                  <span>{selectedBenchmark.language} &bull; {selectedBenchmark.dialectOrRegion}</span>
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                  Context: {selectedBenchmark.culturalContext}
                </h2>
              </div>

              <span className="px-3 py-1 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono text-xs font-bold">
                Bounty: {selectedBenchmark.bountyPi} π
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Source Scenario Prompt</span>
              <p className="text-xs sm:text-sm text-slate-200 font-mono mt-1">"{selectedBenchmark.sourcePrompt}"</p>
            </div>

            {/* Candidate Pair */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Candidate A */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-xs font-bold text-white">Candidate Translation A</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Score: {selectedBenchmark.candidateA.fluencyScore}/10
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{selectedBenchmark.candidateA.text}</p>
                  <p className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                    {selectedBenchmark.candidateA.notes}
                  </p>
                </div>

                <button
                  onClick={() => handleVoteCandidate("A")}
                  className="w-full py-2.5 rounded-xl bg-teal-600/20 hover:bg-teal-600 border border-teal-500/40 text-teal-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-3"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Vote More Authentic ({selectedBenchmark.votesA} votes)
                </button>
              </div>

              {/* Candidate B */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-xs font-bold text-white">Candidate Translation B</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Score: {selectedBenchmark.candidateB.fluencyScore}/10
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{selectedBenchmark.candidateB.text}</p>
                  <p className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                    {selectedBenchmark.candidateB.notes}
                  </p>
                </div>

                <button
                  onClick={() => handleVoteCandidate("B")}
                  className="w-full py-2.5 rounded-xl bg-teal-600/20 hover:bg-teal-600 border border-teal-500/40 text-teal-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-3"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Vote More Authentic ({selectedBenchmark.votesB} votes)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
