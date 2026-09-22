import React from "react";
import { 
  X, 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Lock, 
  Globe2, 
  FileText,
  Award
} from "lucide-react";
import { ProofCertificate } from "../types";

interface HumanProofCertificateModalProps {
  certificate: ProofCertificate | null;
  onClose: () => void;
}

export const HumanProofCertificateModal: React.FC<HumanProofCertificateModalProps> = ({
  certificate,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!certificate) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(certificate.uniqueKycUidsHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(certificate, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${certificate.certificateId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Header Banner */}
        <div className="text-center pb-6 border-b border-slate-800 relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase block mb-1">
            Official Cryptographic Attestation
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Proof of Verified Humanity Certificate
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Issued by Pi Humanity Protocol • Anchor ID: {certificate.certificateId}
          </p>
        </div>

        {/* Certificate Content Grid */}
        <div className="py-6 space-y-4">
          
          {/* Target & Client */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Issued To Enterprise</span>
              <span className="text-sm font-bold text-white">{certificate.companyName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Task Type</span>
              <span className="text-sm font-semibold text-amber-400 uppercase font-mono">{certificate.taskType.replace("_", " ")}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Total Verified Humans</span>
              <span className="text-sm font-bold text-emerald-400">{certificate.totalVerifiedHumans} Unique KYC Pioneers</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Consensus Accuracy</span>
              <span className="text-sm font-bold text-white">{certificate.consensusAccuracy}% (3-Node Quorum)</span>
            </div>
          </div>

          {/* Cryptographic Proof Hash */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                SHA-256 KYC Fingerprint (Proof of Personhood)
              </span>
              <button
                onClick={handleCopyHash}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? "Copied" : "Copy Hash"}
              </button>
            </div>
            <p className="font-mono text-xs text-amber-300 break-all bg-slate-900/80 p-2.5 rounded border border-slate-800">
              {certificate.uniqueKycUidsHash}
            </p>
            <p className="text-[10px] text-slate-500 mt-2">
              Merkle tree root hashing 100% of sovereign government KYC IDs via Pi Network consensus. 0% synthetic bot contamination guarantee.
            </p>
          </div>

          {/* Legal Compliance & IPFS Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                EU AI Act Article 50 Compliance
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold block mt-0.5">
                {certificate.euAiActComplianceToken}
              </span>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                Decentralized IPFS Storage Hash
              </span>
              <span className="text-xs font-mono text-slate-300 truncate block mt-0.5" title={certificate.ipfsHash}>
                ipfs://{certificate.ipfsHash}
              </span>
            </div>
          </div>

          {/* Countries Represented */}
          <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
              <Globe2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Participating KYC Geographies (Anti-Bias Diversity):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {certificate.countriesRepresented.map((c) => (
                <span key={c} className="px-2 py-0.5 bg-slate-800 text-[11px] text-slate-300 rounded font-medium">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 font-mono">
            <div>Settlement Block #{certificate.piNetworkAnchorBlock} • {new Date(certificate.issuedAt).toLocaleDateString()}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Protocol Authority: <span className="text-amber-400 font-semibold">KOSASIH</span> (@Kosasih78) • Indonesia 🇮🇩
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJSON}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              Download Audit JSON
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
