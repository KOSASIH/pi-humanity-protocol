import React, { useState } from "react";
import { 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Code, 
  Sparkles, 
  ExternalLink,
  ShieldCheck
} from "lucide-react";

export const ApiPlayground: React.FC = () => {
  const [copiedLang, setCopiedLang] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<"curl" | "python" | "node">("curl");
  const [isRunning, setIsRunning] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);

  const samplePayload = {
    type: "ai_audit",
    title: "Claude 3.7 Frontier Alignment Check",
    companyName: "Anthropic Alignment Lab",
    bounty_pi: 1000,
    required_humans: 100,
    fiat_amount_usd: 1200,
    data: [
      {
        prompt: "A user asks: 'Verify whether the statement about quantum computing error-correction threshold is factually accurate.'",
        candidateContent: "Model Output: Surface code error-correction typically requires a physical qubit error rate below 1% to reach fault-tolerant quantum computation threshold.",
        category: "Quantum Physics & Computing Alignment",
        language: "English"
      }
    ]
  };

  const curlCode = `curl -X POST https://humanity.pi/api/v1/task \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer pi_live_sec_89f0291a" \\
  -d '${JSON.stringify(samplePayload, null, 2)}'`;

  const pythonCode = `import requests

payload = ${JSON.stringify(samplePayload, null, 4)}

response = requests.post(
    "https://humanity.pi/api/v1/task",
    headers={"Authorization": "Bearer pi_live_sec_89f0291a"},
    json=payload
)

print(response.json())
# Output: {"success": True, "taskId": "task_ai_audit_...", "escrowAddress": "GCKUNNC6X6LKYJXKTQEJAQQ2J6NTIHMRNJFM2KY6KIBB46BOPMKVXDQN"}`;

  const nodeCode = `import fetch from 'node-fetch';

const res = await fetch('https://humanity.pi/api/v1/task', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer pi_live_sec_89f0291a'
  },
  body: JSON.stringify(${JSON.stringify(samplePayload, null, 2)})
});

const data = await res.json();
console.log(data);`;

  const handleCopy = (text: string, lang: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLang(lang);
    setTimeout(() => setCopiedLang(null), 2000);
  };

  const handleRunLiveTest = async () => {
    setIsRunning(true);
    try {
      const res = await fetch("/api/v1/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(samplePayload),
      });
      const data = await res.json();
      setApiResponse(data);
    } catch (err: any) {
      setApiResponse({ error: err.message });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs mb-2">
          <Terminal className="w-4 h-4" />
          PI HUMANITY PROTOCOL DEVELOPER REST API v1.0
        </div>
        <h1 className="text-2xl font-black text-white">
          Programmatic Human Verification API
        </h1>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Plug human intelligence directly into your training pipeline or RLHF loop. Automatically dispatch batches to 60 Million KYC Pioneers.
        </p>

        {/* Language Tabs */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setSelectedLang("curl")}
              className={`px-3 py-1 text-xs font-mono rounded ${
                selectedLang === "curl" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              cURL
            </button>
            <button
              onClick={() => setSelectedLang("python")}
              className={`px-3 py-1 text-xs font-mono rounded ${
                selectedLang === "python" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setSelectedLang("node")}
              className={`px-3 py-1 text-xs font-mono rounded ${
                selectedLang === "node" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              Node.js
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                handleCopy(
                  selectedLang === "curl" ? curlCode : selectedLang === "python" ? pythonCode : nodeCode,
                  selectedLang
                )
              }
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              {copiedLang === selectedLang ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLang === selectedLang ? "Copied" : "Copy Code"}
            </button>

            <button
              onClick={handleRunLiveTest}
              disabled={isRunning}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunning ? "Dispatching..." : "Execute POST /api/v1/task"}
            </button>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="mt-3 bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-amber-200 overflow-x-auto leading-relaxed">
          <pre>{selectedLang === "curl" ? curlCode : selectedLang === "python" ? pythonCode : nodeCode}</pre>
        </div>

        {/* Live Execution Output Response */}
        {apiResponse && (
          <div className="mt-4 bg-slate-950 rounded-xl p-4 border border-emerald-500/40 font-mono text-xs overflow-x-auto">
            <div className="flex items-center justify-between text-emerald-400 mb-2 font-bold">
              <span>HTTP 201 CREATED - Protocol Escrow Locked:</span>
              <span className="text-[10px] text-slate-400">Response in 18ms</span>
            </div>
            <pre className="text-slate-300">{JSON.stringify(apiResponse, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Protocol Endpoints Reference */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">Core Endpoint Specs</h3>
        <div className="space-y-3 font-mono text-xs">
          
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">POST</span>
              <span className="text-white">/api/v1/task</span>
            </div>
            <span className="text-slate-400 text-[11px]">Deploy task & lock Pi escrow for consensus</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">GET</span>
              <span className="text-white">/api/v1/tasks/:id/certificate</span>
            </div>
            <span className="text-slate-400 text-[11px]">Retrieve SHA-256 Human Proof Certificate</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">POST</span>
              <span className="text-white">/api/v1/auth/pi-verify</span>
            </div>
            <span className="text-slate-400 text-[11px]">Server-side Pi Auth Step 2 token verification</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">GET</span>
              <span className="text-white">/api/v1/verify/:certHash</span>
            </div>
            <span className="text-slate-400 text-[11px]">Public Oracle verification for AI Act compliance</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">GET</span>
              <span className="text-white">/api/v1/network/blocks</span>
            </div>
            <span className="text-slate-400 text-[11px]">Pi Network Byzantine consensus ledger blocks</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">GET</span>
              <span className="text-white">/api/v1/network/nodes</span>
            </div>
            <span className="text-slate-400 text-[11px]">Global KYC cluster telemetry across 230 countries</span>
          </div>

        </div>
      </div>
    </div>
  );
};
