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
  Coins,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Radio
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
    name: "Production Agent Cluster (Kosasih Node)",
    keyPrefix: "pi_live_sk_prod_kosasih_78",
    created: "2026-09-18",
    rateLimit: "2,500 req/min",
    totalCalls: 184520,
    piBilled: 142.50,
    status: "Active"
  },
  {
    id: "key-2",
    name: "Sub-10ms Edge Inference Client",
    keyPrefix: "pi_live_sk_sub10ms_mesh_4e12",
    created: "2026-09-21",
    rateLimit: "1,200 req/min",
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
  const [selectedRegion, setSelectedRegion] = useState("Tokyo Edge #482 (4.2ms - Cloudflare + 5.2M Pi Nodes)");
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
      rateLimit: "1,000 req/min",
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
    
    const mockFullText = `[Pi Humanity Protocol Gateway: Routed via Cloudflare + Pi Sub-10ms Edge Mesh (${selectedRegion})]
[Human-in-the-Loop Intercept: ${humanIntercept ? "ACTIVE (zk-SNARK Consensus Verified by 3 KYC Pioneers)" : "BYPASS"}]
[zk-SNARK Proof: zk_snark_proof_0x8f9c2d1b7e4a5532c918ef04b901a]
[Latency: 4.2ms | Anti-Sybil Guarantee: 100% Unforgeable]

OUTPUT VERDICT:
Pediatric administration of azithromycin requires weight-based titration (typically 10 mg/kg on Day 1, followed by 5 mg/kg on Days 2-5). Absolute contraindications include known hypersensitivity to macrolides, history of cholestatic jaundice or hepatic impairment associated with prior use. 

PIONEER CONSENSUS VERIFICATION NOTE:
All three independent validator nodes (Jakarta #01 @Kosasih78, Tokyo #482, Frankfurt #109) confirm no hallucinated dosing intervals found. Verified zero Sybil tampering. On-chain settlement hash: pi_tx_KOSASIH_99_2480 (Anchor Block #1894218). EU AI Act Article 14/50 compliance receipt logged.`;

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

      {/* World Map with 60M Dots & Sub-10ms Edge Mesh (Requirement 3 & 5) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="font-extrabold text-white text-base tracking-tight">
                Global Sub-10ms Edge Mesh &bull; 60,000,000 Pioneer Dots
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                Cloudflare + Pi Validator Nodes
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Zero-latency Anycast edge routing. 60M biometric KYC-verified pioneers validating LLM completions across 230 countries.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Mesh Avg: 6.48ms</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>zk-SNARK Moat: 100% Active</span>
            </div>
          </div>
        </div>

        {/* SVG World Map with 60M Dots and Sub-10ms Edge Clusters */}
        <div className="relative w-full h-64 sm:h-80 bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
          {/* Subtle grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:2rem_2rem]" />
          
          <svg className="w-full h-full" viewBox="0 0 1000 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.15" />
              </linearGradient>
              <radialGradient id="meshGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Dotted Continental Representation (60M Pioneers Density) */}
            {/* North America */}
            {[
              [200, 140], [220, 130], [240, 150], [210, 170], [250, 180], [270, 160], [230, 200], [280, 190], [190, 180], [260, 210]
            ].map(([cx, cy], i) => (
              <circle key={`na-${i}`} cx={cx} cy={cy} r="3" fill="#64748b" opacity="0.6" />
            ))}
            {/* South America */}
            {[
              [320, 310], [340, 330], [350, 360], [330, 380], [360, 410], [340, 430]
            ].map(([cx, cy], i) => (
              <circle key={`sa-${i}`} cx={cx} cy={cy} r="3" fill="#64748b" opacity="0.6" />
            ))}
            {/* Europe */}
            {[
              [500, 140], [520, 130], [530, 150], [490, 160], [510, 170], [540, 160], [480, 180]
            ].map(([cx, cy], i) => (
              <circle key={`eu-${i}`} cx={cx} cy={cy} r="3" fill="#64748b" opacity="0.6" />
            ))}
            {/* Africa */}
            {[
              [520, 240], [510, 270], [540, 290], [530, 330], [550, 360], [560, 390], [490, 260]
            ].map(([cx, cy], i) => (
              <circle key={`af-${i}`} cx={cx} cy={cy} r="3" fill="#64748b" opacity="0.6" />
            ))}
            {/* Asia & Indonesia */}
            {[
              [680, 160], [720, 180], [750, 190], [710, 220], [740, 240], [780, 210], [800, 230], [760, 280], [770, 310], [790, 330], [810, 340], [820, 360]
            ].map(([cx, cy], i) => (
              <circle key={`as-${i}`} cx={cx} cy={cy} r="3.5" fill="#f59e0b" opacity="0.8" />
            ))}

            {/* Glowing Connection Vectors between Sub-10ms Gateways */}
            <path d="M 220 180 Q 520 80 520 150" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <path d="M 520 150 Q 640 180 760 280" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
            <path d="M 760 280 Q 780 250 820 180" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
            <path d="M 820 180 Q 520 280 220 180" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

            {/* 5 SUB-10MS CLUSTER HUBS */}
            {/* 1. Tokyo Edge (4.2ms) */}
            <g transform="translate(820, 180)">
              <circle r="16" fill="url(#meshGlow)" className="animate-ping" />
              <circle r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
              <text x="12" y="4" fill="#67e8f9" fontSize="11" fontFamily="monospace" fontWeight="bold">Tokyo (4.2ms)</text>
            </g>

            {/* 2. Singapore Edge (5.1ms) */}
            <g transform="translate(760, 280)">
              <circle r="14" fill="url(#meshGlow)" className="animate-ping" />
              <circle r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <text x="12" y="4" fill="#6ee7b7" fontSize="11" fontFamily="monospace" fontWeight="bold">Singapore (5.1ms)</text>
            </g>

            {/* 3. Frankfurt Edge (6.8ms) */}
            <g transform="translate(520, 150)">
              <circle r="14" fill="url(#meshGlow)" className="animate-ping" />
              <circle r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
              <text x="-120" y="4" fill="#93c5fd" fontSize="11" fontFamily="monospace" fontWeight="bold">Frankfurt (6.8ms)</text>
            </g>

            {/* 4. San Francisco Edge (7.4ms) */}
            <g transform="translate(220, 180)">
              <circle r="14" fill="url(#meshGlow)" className="animate-ping" />
              <circle r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
              <text x="-135" y="4" fill="#c4b5fd" fontSize="11" fontFamily="monospace" fontWeight="bold">San Francisco (7.4ms)</text>
            </g>

            {/* 5. Jakarta Authority Node (Kosasih 8.9ms) */}
            <g transform="translate(780, 320)">
              <circle r="18" fill="#f59e0b" fillOpacity="0.4" className="animate-pulse" />
              <circle r="7" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
              <text x="14" y="5" fill="#fde047" fontSize="12" fontFamily="monospace" fontWeight="bold">Jakarta &bull; Kosasih Node (8.9ms)</text>
            </g>
          </svg>

          {/* Map Overlay Badge */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300">All 5 Global Edge Cities &lt; 10ms Latency</span>
          </div>

          <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-amber-500/30 rounded-lg px-3 py-1.5 text-[11px] font-mono text-amber-300 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>zk-SNARK Anti-Sybil Consensus Engine</span>
          </div>
        </div>

        {/* ZK-KYC Cryptographic Moat Feature Strip (Requirement 3) */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-slate-950 to-amber-950/30 border border-indigo-500/30 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5">zk-SNARK KYC Proofs</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Every single human evaluation vote generates an on-chain zk-SNARK of Pi KYC + wallet signature. Zero bot farm forgery possible.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5">Unbeatable 60M Moat</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                OpenAI, Google, and Anthropic have 0 biometric KYC humans. Only Pi Network possesses 60M verified individuals across 230 countries.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5">2-Second Finality</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Escrow payouts execute in 2.0s via Pi Testnet/Mainnet ledger with automatic EU AI Act Article 14/50 audit compliance receipts.
              </p>
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
                  <option value="Tokyo Edge #482 (Cloudflare + 5.2M Pi Nodes)">Tokyo Edge #482 (4.2ms - Sub-10ms)</option>
                  <option value="Singapore Edge #95 (Cloudflare + 3.8M Pi Nodes)">Singapore Edge #95 (5.1ms - Sub-10ms)</option>
                  <option value="Frankfurt Edge #109 (Cloudflare + 4.1M Pi Nodes)">Frankfurt Edge #109 (6.8ms - Sub-10ms)</option>
                  <option value="San Francisco Edge #04 (Cloudflare + 6.3M Pi Nodes)">San Francisco Edge #04 (7.4ms - Sub-10ms)</option>
                  <option value="Jakarta Edge #01 (Cloudflare + 7.1M Pi Nodes)">Jakarta &bull; Kosasih Node (8.9ms - Sub-10ms)</option>
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
