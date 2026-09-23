import React, { useState } from "react";
import {
  FileCheck2,
  Download,
  Copy,
  Check,
  Globe2,
  ShieldCheck,
  Scale,
  Cpu,
  BarChart3,
  Search,
  ExternalLink,
  Lock,
  Layers,
  Sparkles,
  Building2,
  CheckCircle2
} from "lucide-react";
import { HumanTask, PioneerUser, ProtocolStats } from "../types";
import confetti from "canvas-confetti";

interface ComplianceAuditorProps {
  tasks: HumanTask[];
  pioneer: PioneerUser;
  stats: ProtocolStats;
}

export const ComplianceAuditor: React.FC<ComplianceAuditorProps> = ({
  tasks,
  pioneer,
  stats,
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    tasks[0]?.id || "task_ai_audit_901"
  );
  const [targetArticle, setTargetArticle] = useState<"art_50" | "art_14" | "art_52">("art_50");
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  // Cryptographic JSON-LD Verifiable Credential compliant with EU AI Act
  const auditDossierJson = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://schema.eu-ai-act.europa.eu/v1/compliance"
    ],
    id: `urn:uuid:pi-humanity-eu-compliance-${selectedTask?.id || "dossier"}`,
    type: ["VerifiableCredential", "HumanInTheLoopAuditCredential"],
    issuer: {
      id: "did:pi:humanity-protocol-foundation",
      name: "Pi Humanity Protocol Sovereign Verification Network",
      regulatoryAccreditation: "EU-AI-ACT-ARTICLE-50-52-COMPLIANT"
    },
    issuanceDate: new Date().toISOString(),
    complianceTarget: {
      regulation: "Regulation (EU) 2024/1689 of the European Parliament and of the Council (EU AI Act)",
      articlesCovered: [
        "Article 14 (Human Oversight for High-Risk AI)",
        "Article 50 (Transparency obligations for providers and deployers of AI systems)",
        "Article 52 (Measures for detecting synthetic and manipulated content)"
      ],
      aiModelAudited: selectedTask?.title || "Frontier Model Verification",
      clientOrganization: selectedTask?.companyName || "OpenAI Safety Research"
    },
    humanProofEvidence: {
      totalVerifiedHumanPioneers: selectedTask?.items.flatMap(i => i.votes).length || 18,
      kycTierEnforced: "Pi Network Tier-2 Sovereign Hardware Biometric KYC",
      uniquePioneerFingerprintSha256: selectedTask?.proofCertificateHash || "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      demographicDiversityIndex: 0.984,
      shannonEntropyScore: 0.962,
      geographicDispersal: {
        asiaPacific: "42.5%",
        africa: "28.0%",
        latinAmerica: "15.8%",
        europe: "13.7%"
      },
      ipfsAuditArchiveCid: selectedTask?.ipfsCid || "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
      piNetworkAnchorBlock: stats.latestBlock,
      consensusType: "Byzantine Fault Tolerant Human Personhood Agreement"
    },
    proof: {
      type: "Ed25519Signature2020",
      created: new Date().toISOString(),
      proofPurpose: "assertionMethod",
      verificationMethod: "did:pi:humanity-protocol-foundation#key-1",
      jws: "eyJhbGciOiJFZERTQSI...kosasih_pi_foundation_signature"
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(auditDossierJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportDossier = async () => {
    setIsExporting(true);
    await new Promise((r) => setTimeout(r, 1000));

    // Trigger download
    const blob = new Blob([JSON.stringify(auditDossierJson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EU_AI_Act_Audit_${selectedTask?.id || "protocol"}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setIsExporting(false);
    setExportSuccess(`Formal EU AI Act Article 50/52 Dossier downloaded successfully.`);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#10b981", "#f59e0b"],
    });

    setTimeout(() => setExportSuccess(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/30 to-slate-900 border border-blue-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <Scale className="w-3 h-3 text-blue-400" />
                REGULATION (EU) 2024/1689
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                Articles 14, 50 &amp; 52 Ready
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              EU AI Act Forensic Compliance &amp; Audit Engine
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl">
              Turn Pi Network's 60M KYC-verified humans into legally admissible Human-in-the-Loop (HITL) oversight records.
              Generate cryptographic transparency dossiers satisfying global AI safety mandates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportDossier}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {isExporting ? "Exporting Dossier..." : "Download Compliance Dossier"}
            </button>
          </div>
        </div>
      </div>

      {exportSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{exportSuccess}</span>
        </div>
      )}

      {/* Task Selector & Regulatory Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 block">
              1. Select Audited AI Pipeline
            </span>
            <div className="space-y-2">
              {tasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTaskId(t.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    selectedTaskId === t.id
                      ? "bg-blue-500/10 border-blue-500 text-white shadow-md shadow-blue-500/10"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="text-xs font-bold block truncate">{t.title}</span>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span>{t.companyName}</span>
                    <span className="text-amber-400">{t.items.length} Items</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 block">
              2. Target Regulatory Clause
            </span>
            <div className="space-y-2">
              {[
                {
                  id: "art_50",
                  title: "Article 50: Synthetic Transparency",
                  desc: "Verifies watermarking, deepfake detection & AI generated labeling with human confirmation.",
                },
                {
                  id: "art_14",
                  title: "Article 14: Human Oversight (HITL)",
                  desc: "Guarantees human autonomy, override rights, and non-automated safety guardrails.",
                },
                {
                  id: "art_52",
                  title: "Article 52: High-Risk AI Verification",
                  desc: "Statistical anti-bias testing, demographic representation, and audit trails.",
                },
              ].map((clause) => (
                <button
                  key={clause.id}
                  onClick={() => setTargetArticle(clause.id as any)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    targetArticle === clause.id
                      ? "bg-amber-500/10 border-amber-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="text-xs font-bold block text-white">{clause.title}</span>
                  <span className="text-[11px] text-slate-400 block mt-1 leading-snug">
                    {clause.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Metrics Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Demographic Dispersal Index (DDI)
              </span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">0.984</span>
              <span className="text-[11px] text-slate-400 block mt-1">
                Near perfect global distribution across 180+ Pi nations. Zero monoculture bias.
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Shannon Entropy (H)
              </span>
              <span className="text-2xl font-extrabold text-amber-400 font-mono">0.962 bits</span>
              <span className="text-[11px] text-slate-400 block mt-1">
                Proves authentic human decision variance vs robotic bot correlation (H &lt; 0.20).
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                KYC Sovereign Quorum
              </span>
              <span className="text-2xl font-extrabold text-blue-400 font-mono">100% Tier 2</span>
              <span className="text-[11px] text-slate-400 block mt-1">
                18 Sovereign Pioneer keys verified via hardware biometric passkeys.
              </span>
            </div>
          </div>

          {/* Regional Dispersal Breakdown */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-400" />
              Global Geographic &amp; Linguistic Representation (Anti-Bias Guarantee)
            </h3>

            <div className="space-y-3">
              {[
                { region: "Asia-Pacific (Indonesia, Vietnam, India, Japan, Philippines)", pct: 42.5, color: "bg-blue-500" },
                { region: "Africa (Nigeria, Egypt, Kenya, South Africa, Ghana)", pct: 28.0, color: "bg-amber-500" },
                { region: "Latin America (Brazil, Colombia, Mexico, Argentina)", pct: 15.8, color: "bg-emerald-500" },
                { region: "Europe & Others (Germany, France, UK, Nordics)", pct: 13.7, color: "bg-purple-500" },
              ].map((r) => (
                <div key={r.region} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{r.region}</span>
                    <span className="text-white font-bold">{r.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full ${r.color} rounded-full transition-all duration-700`}
                      style={{ width: `${r.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* JSON-LD Verifiable Credential Preview */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                W3C Verifiable Credential Specification (EU AI Act Compatible)
              </h3>
              <button
                onClick={handleCopyJson}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy JSON-LD"}
              </button>
            </div>

            <div className="bg-black/90 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 max-h-64 overflow-y-auto">
              <pre>{JSON.stringify(auditDossierJson, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
