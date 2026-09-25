import React, { useState, useEffect } from "react";
import { 
  Terminal, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Copy, 
  Check, 
  Key, 
  Server, 
  Activity, 
  Globe, 
  Sparkles, 
  Lock, 
  RefreshCw, 
  Sliders, 
  Layers,
  ArrowRight,
  Code2,
  Send,
  Eye,
  Coins
} from "lucide-react";
import { PioneerUser, ProtocolStats } from "../types";

interface DecentralizedApiGatewayProps {
  pioneer: PioneerUser;
  stats: ProtocolStats;
  onRewardClaim?: (amount: number) => void;
}

interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  created: string;
  rateLimit: string;
  totalCalls: number;
  piBilled: number;
  status: "Active" | "Paused";
}

const INITIAL_KEYS: ApiKeyItem[] = [
  {
    id: "key-1",
    name: "Production Agent Cluster",
    keyPrefix: "pi_live_sk_8f7b...4e12",
    created: "2026-09-18",
    rateLimit: "1,200 req/min",
    totalCalls: 184520,
    piBilled: 142.50,
    status: "Active"
  },
  {
    id: "key-2",
    name: "Staging Evaluation Engine",
    keyPrefix: "pi_live_sk_2c9a...91b0",
    created: "2026-09-21",
    rateLimit: "300 req/min",
    totalCalls: 24190,
    piBilled: 18.25,
    status: "Active"
  }
];

export const DecentralizedApiGateway: React.FC<DecentralizedApiGatewayProps> = ({
  pioneer,
  stats,
  onRewardClaim
}) => {
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(INITIAL_KEYS);
  const [selectedModel, setSelectedModel] = useState("pi-gemini-2.5-human-hybrid");
  const [selectedRegion, setSelectedRegion] = useState("Tokyo Edge #482 (60M Mesh)");
  const [humanIntercept, setHumanIntercept] = useState(true);
  const [promptInput, setPromptInput] = useState("Analyze biomedical contraindications for pediatric dosage of azithromycin.");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedOutput, setStreamedOutput] = useState("");
  const [tokenMetrics, setTokenMetrics] = useState({ promptTokens: 14, completionTokens: 0, costPi: 0, latencyMs: 0 });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"curl" | "python" | "typescript" | "go">("python");
  const [newKeyName, setNewKeyName] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) return;
    const randomHex = Math.random().toString(16).substring(2, 8);
    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      keyPrefix: `pi_live_sk_${randomHex}...${Math.random().toString(16).substring(2, 6)}`,
      created: new Date().toISOString().split("T")[0],
      rateLimit: "600 req/min",
      totalCalls: 0,
      piBilled: 0,
      status: "Active"
    };
    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName("");
    setShowKeyModal(false);
  };

  const handleTestInference = () => {
    if (!promptInput.trim() || isStreaming) return;
    setIsStreaming(true);
    setStreamedOutput("");
    
    const mockFullText = `[Pi Humanity Protocol Gateway: Routed via ${selectedRegion}]
[Human-in-the-Loop Intercept: ${humanIntercept ? "ACTIVE (Consensus Verified by 3 KYC Pioneers)" : "BYPASS"}]

CLINICAL DETERMINATION:
Pediatric administration of azithromycin requires weight-based titration (typically 10 mg/kg on Day 1, followed by 5 mg/kg on Days 2-5). Absolute contraindications include known hypersensitivity to macrolides, history of cholestatic jaundice or hepatic impairment associated with prior use. 

PIONEER CONSENSUS VERIFICATION NOTE:
All three independent validator nodes confirm no hallucinated dosing intervals found. Verified zero Sybil tampering. On-chain settlement hash: 0x9fbc...4412.`;

    let currentIndex = 0;
    const startTime = Date.now();

    const interval = setInterval(() => {
      currentIndex += 6;
      if (currentIndex >= mockFullText.length) {
        setStreamedOutput(mockFullText);
        setIsStreaming(false);
        clearInterval(interval);
        const elapsed = Date.now() - startTime;
        const completionTokens = Math.round(mockFullText.split(" ").length * 1.35);
        const cost = (14 * 0.000002) + (completionTokens * 0.000008);
        setTokenMetrics({
          promptTokens: 14,
          completionTokens,
          costPi: Number(cost.toFixed(5)),
          latencyMs: elapsed
        });
      } else {
        setStreamedOutput(mockFullText.substring(0, currentIndex));
      }
    }, 25);
  };

  const codeSnippets = {
    curl: `curl -X POST "https://gateway.humanity.pi/v1/chat/completions" \\
  -H "Authorization: Bearer pi_live_sk_8f7b...4e12" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${selectedModel}",
    "messages": [{"role": "user", "content": "${promptInput}"}],
    "human_in_the_loop": ${humanIntercept ? "true" : "false"},
    "max_pioneer_latency_ms": 250,
    "pi_micro_billing": true
  }'`,
    python: `from pi_humanity import PiGatewayClient

client = PiGatewayClient(
    api_key="pi_live_sk_8f7b...4e12",
    endpoint="https://gateway.humanity.pi/v1"
)

response = client.chat.create(
    model="${selectedModel}",
    messages=[{"role": "user", "content": "${promptInput}"}],
    human_in_the_loop=${humanIntercept ? "True" : "False"},
    routing_mesh="60m_pioneers"
)

print(response.choices[0].message.content)
print(f"Settled in Pi: {response.usage.pi_cost} π (Tx: {response.pi_receipt})")`,
    typescript: `import { PiHumanityGateway } from "@pi-network/humanity-ai";

const gateway = new PiHumanityGateway({
  apiKey: "pi_live_sk_8f7b...4e12",
  regionMesh: "auto-lowest-latency"
});

const response = await gateway.chat.completions.create({
  model: "${selectedModel}",
  messages: [{ role: "user", content: "${promptInput}" }],
  humanInTheLoop: ${humanIntercept ? "true" : "false"},
  stream: true
});

for await (const chunk of response) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}`,
    go: `package main

import (
    "fmt"
    "github.com/pi-humanity/gateway-sdk-go"
)

func main() {
    client := gateway.NewClient("pi_live_sk_8f7b...4e12")
    resp, err := client.CreateCompletion(gateway.Request{
        Model:       "${selectedModel}",
        Prompt:      "${promptInput}",
        HumanVerify: ${humanIntercept ? "true" : "false"},
    })
    if err != nil {
        panic(err)
    }
    fmt.Printf("Output: %s\\nPi Billed: %f π\\n", resp.Text, resp.PiCost)
}`
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" />
                Decentralized AI Gateway & Reverse-Proxy
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Activity className="w-3 h-3 animate-pulse" />
                342,109 Active Edge Nodes
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Enterprise AI Reverse-Proxy & Micro-Billing Gateway
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Route AI queries through 60 Million KYC-verified Pioneer edge nodes. Eliminate LLM hallucinations with real-time human verification fallback, paid instantly in micro-Pi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 shadow-inner text-right">
              <div className="text-xs text-slate-400 font-mono">24h Gateway Volume</div>
              <div className="text-xl font-bold text-indigo-400">4,821,900 reqs</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 shadow-inner text-right">
              <div className="text-xs text-slate-400 font-mono">Pi Micro-Settlement</div>
              <div className="text-xl font-bold text-amber-400">184,200.45 π</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Inference Gateway & Key Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Live Inference Simulator (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Live Edge Request Console</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Pioneer-Intercept Enabled
              </span>
            </div>

            {/* Model & Region Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">AI Model Endpoint</label>
                <select 
                  value={selectedModel} 
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="pi-gemini-2.5-human-hybrid">pi-gemini-2.5-human-hybrid (Ultra Safe)</option>
                  <option value="pi-claude-3.7-verified">pi-claude-3.7-verified (Code & Logic)</option>
                  <option value="pi-deepseek-r1-enclave">pi-deepseek-r1-enclave (Reasoning)</option>
                  <option value="pi-llama-3.3-70b-mesh">pi-llama-3.3-70b-mesh (Decentralized Open)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Edge Node Routing Region</label>
                <select 
                  value={selectedRegion} 
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="Tokyo Edge #482 (60M Mesh)">Tokyo Edge #482 (14ms)</option>
                  <option value="Frankfurt Edge #109 (60M Mesh)">Frankfurt Edge #109 (18ms)</option>
                  <option value="São Paulo Edge #73 (60M Mesh)">São Paulo Edge #73 (24ms)</option>
                  <option value="Lagos Edge #210 (60M Mesh)">Lagos Edge #210 (22ms)</option>
                  <option value="Singapore Edge #95 (60M Mesh)">Singapore Edge #95 (16ms)</option>
                </select>
              </div>
            </div>

            {/* Human Intercept Toggle */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className={`w-4 h-4 ${humanIntercept ? "text-emerald-400" : "text-slate-500"}`} />
                <div>
                  <div className="text-xs font-bold text-white">Human-in-the-Loop Consensus Fallback</div>
                  <div className="text-[11px] text-slate-400">Trigger 3-Pioneer verification when confidence falls below 95%</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={humanIntercept} 
                  onChange={(e) => setHumanIntercept(e.target.checked)} 
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Prompt Textarea */}
            <div className="mb-4">
              <label className="text-xs text-slate-400 mb-1.5 block">Test Inference Prompt</label>
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                rows={3}
                placeholder="Enter prompt for real-time gateway routing..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Send Button */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                Est. Cost: <strong className="text-amber-400">~0.00045 π</strong>
              </div>

              <button
                onClick={handleTestInference}
                disabled={isStreaming || !promptInput.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
              >
                {isStreaming ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Streaming via 60M Mesh...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send Edge Request
                  </>
                )}
              </button>
            </div>

            {/* Output Stream Box */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs">
              <div className="flex justify-between items-center text-[11px] text-slate-500 border-b border-slate-900 pb-2 mb-2">
                <span>GATEWAY RESPONSE STREAM</span>
                {tokenMetrics.latencyMs > 0 && (
                  <span className="text-emerald-400">
                    {tokenMetrics.latencyMs}ms | {tokenMetrics.completionTokens} tokens | {tokenMetrics.costPi} π
                  </span>
                )}
              </div>

              <div className="min-h-[140px] text-slate-200 whitespace-pre-wrap leading-relaxed">
                {streamedOutput ? streamedOutput : (
                  <span className="text-slate-600 italic">
                    Output from the 60M Pioneer edge mesh will stream here in real-time...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: API Keys & Multi-Language SDK Snippets (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Key Management Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Production Gateway Keys</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(true)}
                className="px-2.5 py-1 text-xs rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all"
              >
                + New Key
              </button>
            </div>

            {/* Key List */}
            <div className="space-y-2.5">
              {apiKeys.map((k) => (
                <div key={k.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white">{k.name}</span>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {k.status}
                    </span>
                  </div>
                  <div className="font-mono text-slate-400 text-[11px] flex items-center justify-between">
                    <span>{k.keyPrefix}</span>
                    <button 
                      onClick={() => handleCopy(k.keyPrefix, k.id)} 
                      className="text-slate-500 hover:text-white"
                    >
                      {copiedCode === k.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-900 flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>{k.totalCalls.toLocaleString()} calls</span>
                    <span className="text-amber-400 font-semibold">{k.piBilled.toFixed(2)} π billed</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal for new key */}
            {showKeyModal && (
              <div className="mt-3 p-3 bg-slate-950 border border-indigo-500/40 rounded-xl space-y-2">
                <label className="text-xs text-slate-300 font-semibold block">Key Description / Service Name</label>
                <input
                  type="text"
                  placeholder="e.g. Figure-02 Vision Policy"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowKeyModal(false)}
                    className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateKey}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Multi-Language SDK Snippets */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Integration SDK</h3>
              </div>
              
              <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(["python", "curl", "typescript", "go"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveCodeTab(lang)}
                    className={`px-2 py-0.5 text-[11px] rounded font-mono uppercase transition-colors ${
                      activeCodeTab === lang
                        ? "bg-indigo-600 text-white font-bold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-[11px]">
              <button
                onClick={() => handleCopy(codeSnippets[activeCodeTab], "sdk-snippet")}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy snippet"
              >
                {copiedCode === "sdk-snippet" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <pre className="text-slate-300 overflow-x-auto pr-8 max-h-64 leading-relaxed">
                {codeSnippets[activeCodeTab]}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
